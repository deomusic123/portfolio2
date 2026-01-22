"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Attachment } from "@/types/database";
import type { ActionResponse } from "@/types/api";
import { logActivity } from "./activity";

/**
 * Upload file to Supabase Storage and create attachment record
 * File validation happens on client side (Zod schema)
 * Storage path: {entity_type}/{entity_id}/{timestamp}-{filename}
 */
export async function uploadAttachment(
  formData: FormData
): Promise<ActionResponse<Attachment>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Extract form data
    const file = formData.get("file") as File;
    const entityType = formData.get("entity_type") as "lead" | "project";
    const entityId = formData.get("entity_id") as string;

    if (!file || !entityType || !entityId) {
      return { success: false, error: "Missing required fields" };
    }

    // Verify file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "File must be less than 10MB" };
    }

    // Verify user owns the entity
    const { data: entity, error: entityError } = await supabase
      .from(entityType === "lead" ? "leads" : "projects")
      .select("id, client_id")
      .eq("id", entityId)
      .single();

    if (entityError || !entity || entity.client_id !== user.id) {
      return {
        success: false,
        error: "Entity not found or you don't have permission",
      };
    }

    // Generate storage path: {entity_type}/{entity_id}/{timestamp}-{filename}
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${entityType}/${entityId}/${timestamp}-${sanitizedFilename}`;

    // Upload to Supabase Storage (attachments bucket)
    const { error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    // Create attachment record in database
    const { data: attachment, error: dbError } = await supabase
      .from("attachments")
      .insert({
        user_id: user.id,
        entity_type: entityType,
        entity_id: entityId,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_path: storagePath,
      })
      .select()
      .single();

    if (dbError) {
      // Rollback: delete uploaded file
      await supabase.storage.from("attachments").remove([storagePath]);
      return { success: false, error: `Database error: ${dbError.message}` };
    }

    // Log activity
    await logActivity({
      action: "create",
      entityType: entityType,
      entityId: entityId,
      entityName: file.name,
      details: {
        attachment_id: attachment.id,
        file_size: file.size,
        mime_type: file.type,
      },
    });

    revalidatePath(`/dashboard/${entityType}s/${entityId}`);
    return { success: true, data: attachment };
  } catch (error) {
    console.error("Upload attachment error:", error);
    return { success: false, error: "Failed to upload attachment" };
  }
}

/**
 * Get signed URL for downloading attachment
 * URL expires in 1 hour
 */
export async function getAttachmentUrl(
  attachmentId: string
): Promise<ActionResponse<string>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get attachment record
    const { data: attachment, error: attachmentError } = await supabase
      .from("attachments")
      .select("storage_path, entity_type, entity_id")
      .eq("id", attachmentId)
      .single();

    if (attachmentError || !attachment) {
      return { success: false, error: "Attachment not found" };
    }

    // Verify user owns the entity
    const { data: entity, error: entityError } = await supabase
      .from(attachment.entity_type === "lead" ? "leads" : "projects")
      .select("id, client_id")
      .eq("id", attachment.entity_id)
      .single();

    if (entityError || !entity || entity.client_id !== user.id) {
      return {
        success: false,
        error: "You don't have permission to download this file",
      };
    }

    // Generate signed URL (expires in 1 hour)
    const { data: urlData, error: urlError } = await supabase.storage
      .from("attachments")
      .createSignedUrl(attachment.storage_path, 3600);

    if (urlError || !urlData) {
      return { success: false, error: "Failed to generate download URL" };
    }

    return { success: true, data: urlData.signedUrl };
  } catch (error) {
    console.error("Get attachment URL error:", error);
    return { success: false, error: "Failed to get download URL" };
  }
}

/**
 * Delete attachment from storage and database
 */
export async function deleteAttachment(
  attachmentId: string
): Promise<ActionResponse<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get attachment record
    const { data: attachment, error: attachmentError } = await supabase
      .from("attachments")
      .select("*")
      .eq("id", attachmentId)
      .single();

    if (attachmentError || !attachment) {
      return { success: false, error: "Attachment not found" };
    }

    // Verify user owns the attachment
    if (attachment.user_id !== user.id) {
      return {
        success: false,
        error: "You can only delete your own attachments",
      };
    }

    // Delete from storage first
    const { error: storageError } = await supabase.storage
      .from("attachments")
      .remove([attachment.storage_path]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      return { success: false, error: "Failed to delete file from storage" };
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from("attachments")
      .delete()
      .eq("id", attachmentId);

    if (dbError) {
      return { success: false, error: `Database error: ${dbError.message}` };
    }

    // Log activity
    await logActivity({
      action: "delete",
      entityType: attachment.entity_type,
      entityId: attachment.entity_id,
      entityName: attachment.file_name,
      details: {
        attachment_id: attachmentId,
        file_size: attachment.file_size,
      },
    });

    revalidatePath(`/dashboard/${attachment.entity_type}s/${attachment.entity_id}`);
    return { success: true };
  } catch (error) {
    console.error("Delete attachment error:", error);
    return { success: false, error: "Failed to delete attachment" };
  }
}

/**
 * Get all attachments for an entity (lead or project)
 */
export async function getAttachments(
  entityType: "lead" | "project",
  entityId: string
): Promise<ActionResponse<Attachment[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify user owns the entity
    const { data: entity, error: entityError } = await supabase
      .from(entityType === "lead" ? "leads" : "projects")
      .select("id, client_id")
      .eq("id", entityId)
      .single();

    if (entityError || !entity || entity.client_id !== user.id) {
      return {
        success: false,
        error: "Entity not found or you don't have permission",
      };
    }

    // Get all attachments for this entity
    const { data: attachments, error: attachmentsError } = await supabase
      .from("attachments")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });

    if (attachmentsError) {
      return { success: false, error: attachmentsError.message };
    }

    return { success: true, data: attachments || [] };
  } catch (error) {
    console.error("Get attachments error:", error);
    return { success: false, error: "Failed to fetch attachments" };
  }
}

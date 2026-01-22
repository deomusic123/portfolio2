import { getAttachments, deleteAttachment } from "@/actions/attachments";
import { AttachmentItem } from "./AttachmentItem";

interface AttachmentsListProps {
  entityType: "lead" | "project";
  entityId: string;
}

export async function AttachmentsList({
  entityType,
  entityId,
}: AttachmentsListProps) {
  const result = await getAttachments(entityType, entityId);

  if (!result.success || !result.data) {
    return null;
  }

  const attachments = result.data;

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <svg
          className="mx-auto h-12 w-12 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm">No attachments yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <AttachmentItem
          key={attachment.id}
          attachment={attachment}
          onDelete={deleteAttachment}
        />
      ))}
    </div>
  );
}

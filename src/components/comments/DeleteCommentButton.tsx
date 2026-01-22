"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteComment } from "@/actions/comments";

export function DeleteCommentButton({ commentId }: { commentId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteComment(commentId);

    if (result.success) {
      setShowConfirm(false);
      router.refresh();
    } else {
      alert(result.message || "Failed to delete comment");
    }
    setIsDeleting(false);
  };

  return (
    <>
      <button
        className="text-xs text-red-400 hover:text-red-300 transition disabled:opacity-50"
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
      >
        Delete
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Delete Comment?
            </h3>
            <p className="text-neutral-400 mb-6">
              This action cannot be undone. Are you sure you want to delete this
              comment?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

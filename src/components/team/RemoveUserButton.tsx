"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeTeamMember } from "@/actions/team";

export function RemoveUserButton({ 
  userId, 
  userName 
}: { 
  userId: string; 
  userName: string;
}) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    const result = await removeTeamMember(userId);

    if (result.success) {
      setShowConfirm(false);
      router.refresh();
    } else {
      alert(result.message || "Failed to remove user");
    }
    setIsRemoving(false);
  };

  return (
    <>
      <button
        className="text-xs text-red-400 hover:text-red-300 transition disabled:opacity-50"
        onClick={() => setShowConfirm(true)}
        disabled={isRemoving}
      >
        Remove
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Remove Team Member?
            </h3>
            <p className="text-neutral-400 mb-6">
              Remove <span className="text-white font-medium">{userName}</span> from the team?
              This will delete their account and all associated data.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isRemoving}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
              >
                {isRemoving ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

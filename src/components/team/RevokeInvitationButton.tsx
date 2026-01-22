"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { revokeInvitation } from "@/actions/team";

export function RevokeInvitationButton({ invitationId }: { invitationId: string }) {
  const router = useRouter();
  const [isRevoking, setIsRevoking] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRevoke = async () => {
    setIsRevoking(true);
    const result = await revokeInvitation(invitationId);

    if (result.success) {
      setShowConfirm(false);
      router.refresh();
    } else {
      alert(result.message || "Failed to revoke invitation");
    }
    setIsRevoking(false);
  };

  return (
    <>
      <button
        className="text-xs text-red-400 hover:text-red-300 transition disabled:opacity-50"
        onClick={() => setShowConfirm(true)}
        disabled={isRevoking}
      >
        Revoke
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Revoke Invitation?
            </h3>
            <p className="text-neutral-400 mb-6">
              This will cancel the invitation and the link will no longer work. The user will need a new invitation to join.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isRevoking}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRevoke}
                disabled={isRevoking}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
              >
                {isRevoking ? "Revoking..." : "Revoke"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useState } from 'react';
import { NewLeadDialog } from './NewLeadDialog';

export function NewLeadButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition-all shadow-lg"
      >
        + New Lead
      </button>
      
      <NewLeadDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

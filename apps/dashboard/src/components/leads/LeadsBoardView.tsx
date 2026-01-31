'use client';

import { useEffect, useState } from 'react';
import { KanbanBoard } from './KanbanBoard';
import { LeadSheet } from './LeadSheet';
import { NewLeadDialog } from './NewLeadDialog';
import type { Lead } from '@/lib/leads/types';
import { KANBAN_COLUMNS, groupLeadsByStatus } from '@/lib/leads/utils';

interface LeadsBoardViewProps {
  leads: Lead[];
}

export function LeadsBoardView({ leads }: LeadsBoardViewProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [sheetViewOnly, setSheetViewOnly] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [mounted, setMounted] = useState(false);
  const groupedLeads = groupLeadsByStatus(leads);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid SSR/CSR id drift from DnD descriptors
  if (!mounted) {
    return null;
  }

  return (
    <>
      <KanbanBoard
        columns={KANBAN_COLUMNS}
        groupedLeads={groupedLeads}
        onSelectLead={(id) => {
          setSheetViewOnly(false);
          setSelectedLeadId(id);
        }}
        onViewLead={(id) => {
          setSheetViewOnly(true);
          setSelectedLeadId(id);
        }}
        onEditLead={(lead) => setEditingLead(lead)}
        onConverted={() => setSelectedLeadId(null)}
      />

      <LeadSheet
        leadId={selectedLeadId}
        open={Boolean(selectedLeadId)}
        viewOnly={sheetViewOnly}
        onClose={() => {
          setSelectedLeadId(null);
          setSheetViewOnly(false);
        }}
      />

      <NewLeadDialog
        open={Boolean(editingLead)}
        onOpenChange={(open) => {
          if (!open) setEditingLead(null);
        }}
        mode="edit"
        lead={editingLead}
        onSuccess={() => setEditingLead(null)}
      />
    </>
  );
}

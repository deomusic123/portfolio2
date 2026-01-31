'use client';

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { updateLeadStatus } from '@/actions/leads';
import type { Lead, LeadStatus } from '@/lib/leads/types';
import { LeadCard } from './LeadCard';

interface KanbanBoardProps {
  columns: Array<{
    id: LeadStatus;
    label: string;
    color: string;
    icon: string;
  }>;
  groupedLeads: Record<string, Lead[]>;
  onSelectLead?: (leadId: string) => void;
  onViewLead?: (leadId: string) => void;
  onEditLead?: (lead: Lead) => void;
  onConverted?: () => void;
}

export function KanbanBoard({ columns, groupedLeads, onSelectLead, onViewLead, onEditLead, onConverted }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [boardState, setBoardState] = useState<Record<string, Lead[]>>(groupedLeads);
  const [error, setError] = useState<string | null>(null);
  const [pendingRetry, setPendingRetry] = useState<{ leadId: string; status: LeadStatus; position: number } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Sync with server-provided grouping after revalidation
  useEffect(() => {
    setBoardState(groupedLeads);
  }, [groupedLeads]);

  const activeLead = activeId
    ? Object.values(boardState)
        .flat()
        .find((lead) => lead.id === activeId)
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;

    // Find current status
    const currentStatus = Object.entries(boardState).find(([_, leads]) =>
      leads.some((l) => l.id === leadId)
    )?.[0];

    if (currentStatus === newStatus) return;

    const targetLeads = boardState[newStatus] || [];
    const fromLeads = boardState[currentStatus || ''] || [];
    const sourceIndex = fromLeads.findIndex((l) => l.id === leadId);

    // If dropping onto an item, find its index; otherwise append
    const overIndex = targetLeads.findIndex((l) => l.id === over.id);
    const targetIndex = overIndex >= 0 ? overIndex : targetLeads.length;

    let nextState = structuredClone(boardState);

    if (currentStatus === newStatus && sourceIndex >= 0) {
      nextState[newStatus] = arrayMove(targetLeads, sourceIndex, targetIndex);
    } else {
      if (sourceIndex >= 0) {
        const [moved] = fromLeads.splice(sourceIndex, 1);
        nextState[currentStatus || ''] = fromLeads;
        const newTarget = [...targetLeads];
        newTarget.splice(targetIndex, 0, moved);
        nextState[newStatus] = newTarget;
      }
    }

    // Recalculate positions for target column based on index
    const updatedTarget = nextState[newStatus]?.map((lead, idx) => ({ ...lead, position: idx })) || [];
    nextState[newStatus] = updatedTarget;
    setBoardState(nextState);

    const position = updatedTarget.find((l) => l.id === leadId)?.position ?? targetLeads.length;

    setError(null);

    // Optimistic UI update happens via server action revalidation
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, newStatus, position);
      if (!result.success) {
        console.error('Failed to update lead status:', result.error);
        setError(result.error || 'Failed to update lead');
        setPendingRetry({ leadId, status: newStatus, position });
        // rollback
        setBoardState(groupedLeads);
      } else {
        setPendingRetry(null);
      }
    });
  }

  function handleRetry() {
    if (!pendingRetry) return;
    const { leadId, status, position } = pendingRetry;
    setError(null);
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, status, position);
      if (!result.success) {
        setError(result.error || 'Retry failed');
      } else {
        setPendingRetry(null);
      }
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {error && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          <span>{error}</span>
          {pendingRetry && (
            <button
              onClick={handleRetry}
              className="ml-auto rounded border border-red-400/40 px-2 py-1 text-[11px] text-red-100 hover:bg-red-500/20"
            >
              Retry
            </button>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 min-h-[600px] md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => (
          <DroppableColumn
            key={column.id}
            column={column}
            leads={boardState[column.id] || []}
            onSelectLead={onSelectLead}
            onViewLead={onViewLead}
            onEditLead={onEditLead}
            onConverted={onConverted}
          />
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeLead ? (
          <div className="opacity-80 rotate-3 cursor-grabbing">
            <LeadCard lead={activeLead} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

interface DroppableColumnProps {
  column: {
    id: LeadStatus;
    label: string;
    color: string;
    icon: string;
  };
  leads: Lead[];
  onSelectLead?: (leadId: string) => void;
  onViewLead?: (leadId: string) => void;
  onEditLead?: (lead: Lead) => void;
  onConverted?: () => void;
}

function DroppableColumn({ column, leads, onSelectLead, onViewLead, onEditLead, onConverted }: DroppableColumnProps) {
  const { useDroppable } = require('@dnd-kit/core');
  const { useSortable } = require('@dnd-kit/sortable');

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      data-column-id={column.id}
      className={`flex flex-col gap-3 transition-all ${
        isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
    >
      {/* Column Header */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-lg border transition-all"
        style={{
          backgroundColor: `${column.color}15`,
          borderColor: `${column.color}40`,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{column.icon}</span>
          <h3 className="text-sm font-semibold text-white">{column.label}</h3>
        </div>
        <span className="text-xs text-zinc-500">{leads.length}</span>
      </div>

      {/* Column Content */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[700px] pr-2">
        {leads.map((lead) => (
          <DraggableCard
            key={lead.id}
            lead={lead}
            onSelectLead={onSelectLead}
            onViewLead={onViewLead}
            onEditLead={onEditLead}
            onConverted={onConverted}
          />
        ))}

        {leads.length === 0 && (
          <div className="flex-1 rounded-lg border-2 border-dashed border-white/5 flex items-center justify-center py-8">
            <p className="text-zinc-600 text-xs">Empty</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface DraggableCardProps {
  lead: Lead;
  onSelectLead?: (leadId: string) => void;
  onViewLead?: (leadId: string) => void;
  onEditLead?: (lead: Lead) => void;
  onConverted?: () => void;
}

function DraggableCard({ lead, onSelectLead, onViewLead, onEditLead, onConverted }: DraggableCardProps) {
  const { useDraggable } = require('@dnd-kit/core');

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      data-lead-id={lead.id}
      data-lead-name={lead.name}
      tabIndex={0}
      onDoubleClick={() => onViewLead?.(lead.id)}
    >
      <LeadCard
        lead={lead}
        onConverted={onConverted}
        onSelectLead={onSelectLead}
        onEditLead={onEditLead}
        onViewLead={onViewLead}
      />
    </div>
  );
}

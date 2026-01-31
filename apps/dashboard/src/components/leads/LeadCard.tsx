"use client";

import { useMemo, useState, useTransition } from "react";
import type React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarClock, Building2, MoreHorizontal } from "lucide-react";
import { convertLeadToProject } from "@/actions/projects";
import { updateLeadStatus } from "@/actions/leads";
import { ROUTES } from "@/lib/constants";
import type { Lead, LeadStatus } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

interface LeadCardProps {
  lead: Lead;
  onConverted?: () => void;
  onSelectLead?: (id: string) => void;
  onEditLead?: (lead: Lead) => void;
  onViewLead?: (id: string) => void;
}

function scoreBarColor(score: number | null) {
  if (score === null || score === undefined) return "bg-zinc-600";
  if (score > 70) return "bg-emerald-500";
  if (score < 40) return "bg-red-500";
  return "bg-amber-500";
}

function statusStripe() {
  return "bg-zinc-700";
}

export function LeadCard({ lead, onConverted, onSelectLead, onEditLead, onViewLead }: LeadCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const company = lead.company_name || lead.name;
  const favicon = lead.website ? `https://www.google.com/s2/favicons?domain=${lead.website}&sz=128` : "";
  const stripeColor = statusStripe();
  const showStripe = lead.status !== "closed_won" && lead.status !== "closed_lost";
  const statusTint = lead.status === "closed_won"
    ? "bg-emerald-500/10 border-emerald-400/30"
    : lead.status === "closed_lost"
      ? "bg-red-500/10 border-red-400/30"
      : "bg-zinc-900/80 border-white/5";

  const techBadges = useMemo(() => {
    const badges: Array<{ label: string; className: string }> = [];
    if (lead.tech_stack?.cms === "WordPress") {
      badges.push({ label: "WP", className: "bg-[#21759b]/10 text-[#21759b] border-[#21759b]/20" });
    }
    if (lead.potential_value && lead.potential_value > 5000) {
      badges.push({ label: "High Value", className: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5" });
    }
    if (lead.ai_score !== null && lead.ai_score !== undefined) {
      badges.push({ label: `Score ${lead.ai_score}`, className: "text-zinc-400 border-zinc-800" });
    }
    return badges;
  }, [lead.ai_score, lead.potential_value, lead.tech_stack?.cms]);

  const stopEvent = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleConvert = () => {
    setMenuOpen(false);
    setMessage(null);
    startTransition(async () => {
      const res = await convertLeadToProject(lead.id);
      if (!res.success) {
        setMessage(typeof res.error === "string" ? res.error : "Failed to convert");
        return;
      }
      setMessage("Project created");
      onConverted?.();
      router.refresh();
      if (res.projectId) {
        router.push(`${ROUTES.PROJECTS}/${res.projectId}`);
      }
    });
  };

  const handleStatus = (status: LeadStatus) => {
    setMenuOpen(false);
    setMessage(null);
    startTransition(async () => {
      const res = await updateLeadStatus(lead.id, status);
      if (!res.success) {
        setMessage(res.error || "Failed to update status");
        return;
      }
      setMessage(status === "closed_won" ? "Marked as Won" : "Marked as Lost");
      onConverted?.();
      router.refresh();
    });
  };

  const handleEdit = () => {
    setMenuOpen(false);
    onEditLead?.(lead);
  };

  return (
    <div
      className={cn(
        "group relative mb-3 rounded-xl border p-4 transition-all hover:border-white/10 hover:shadow-lg hover:shadow-black/20",
        statusTint
      )}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onViewLead?.(lead.id);
      }}
    >
      {showStripe && <div className={cn("absolute left-0 top-0 h-full w-1", stripeColor)} />}

      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/10 bg-black">
            {favicon ? (
              <Image src={favicon} alt={company} fill sizes="40px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                {company?.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="leading-tight">
            <h4 className="text-sm font-bold text-zinc-100">{company}</h4>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
              <Building2 className="h-3 w-3" />
              {lead.website?.replace("https://", "") || "Sin web"}
            </p>
          </div>
          {lead.status === "closed_won" && (
            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-100">
              Won
            </span>
          )}
          {lead.status === "closed_lost" && (
            <span className="rounded-full border border-red-400/40 bg-red-500/15 px-2 py-0.5 text-[11px] text-red-100">
              Lost
            </span>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            onPointerDownCapture={stopEvent}
            onMouseDownCapture={stopEvent}
            onDoubleClick={(e) => {
              e.stopPropagation();
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white/5 hover:text-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-white/10 bg-black/90 text-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
              onPointerDownCapture={stopEvent}
              onMouseDownCapture={stopEvent}
            >
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-emerald-300 hover:bg-emerald-500/10"
                onClick={handleConvert}
                disabled={isPending}
              >
                Convertir a Proyecto
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-emerald-200 hover:bg-emerald-500/10"
                onClick={() => handleStatus("closed_won")}
                disabled={isPending}
              >
                Marcar como Won
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-red-300 hover:bg-red-500/10"
                onClick={() => handleStatus("closed_lost")}
                disabled={isPending}
              >
                Marcar como Lost
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-zinc-300 hover:bg-white/5"
                onClick={handleEdit}
              >
                Editar Lead
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-red-300 hover:bg-red-500/10"
                onClick={() => setMenuOpen(false)}
              >
                Archivar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 pl-2 text-[10px]">
        {techBadges.map((b) => (
          <span
            key={`${b.label}-${b.className}`}
            className={cn("rounded-full border px-2 py-0.5", b.className)}
          >
            {b.label}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[11px] text-zinc-500 pl-2">
        <span className="flex items-center gap-1">
          <CalendarClock className="h-3 w-3" />
          Activo hace 2d
        </span>
        {lead.potential_value ? (
          <span className="font-mono text-zinc-300">
            ${lead.potential_value.toLocaleString()}
          </span>
        ) : null}
      </div>

    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { EditLeadForm } from "@/components/leads/EditLeadForm";
import type { Lead } from "@/types/database";

interface LeadsTableClientProps {
  leads: Lead[];
}

export function LeadsTableClient({ leads }: LeadsTableClientProps) {
  const router = useRouter();
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const statusColors = {
    new: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    contacted: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    qualified: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    converted: "bg-green-500/10 border-green-500/20 text-green-400",
    rejected: "bg-red-500/10 border-red-500/20 text-red-400",
  };

  const sourceLabels = {
    contact_form: "Contact Form",
    email: "Email",
    referral: "Referral",
    other: "Other",
  };

  // Filter and search leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.phone && lead.phone.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

      // Source filter
      const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter]);

  const handleEditSuccess = () => {
    setIsRefreshing(true);
    setEditingLead(null);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExportCSV = () => {
    const csvHeaders = ["Name", "Email", "Phone", "Source", "Status", "Notes", "Created"];
    const csvRows = filteredLeads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone || "",
      lead.source,
      lead.status,
      (lead.notes || "").replace(/"/g, '""'), // Escape quotes
      new Date(lead.created_at).toLocaleDateString("es-ES"),
    ]);

    // Build CSV string
    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) =>
        row.map((cell) => `"${cell}"`).join(",")
      ),
    ].join("\n");

    // Create download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-400">No leads yet. Create your first lead!</p>
      </div>
    );
  }

  return (
    <>
      {/* Filters Section */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sources</option>
            <option value="contact_form">Contact Form</option>
            <option value="email">Email</option>
            <option value="referral">Referral</option>
            <option value="other">Other</option>
          </select>

          {/* Clear Filters */}
          {(searchQuery || statusFilter !== "all" || sourceFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setSourceFilter("all");
              }}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-sm rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}

          {/* Results Count */}
          <div className="ml-auto flex items-center text-sm text-neutral-400">
            Showing {filteredLeads.length} of {leads.length} leads
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            disabled={filteredLeads.length === 0}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Empty State After Filtering */}
      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-400">No leads match your filters</p>
        </div>
      )}

      {/* Table */}
      {filteredLeads.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800/50 transition"
                >
                  <td className="px-4 py-3 text-white font-medium">{lead.name}</td>
                  <td className="px-4 py-3 text-neutral-400">{lead.email}</td>
                  <td className="px-4 py-3 text-neutral-400">{lead.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-neutral-400">
                      {sourceLabels[lead.source as keyof typeof sourceLabels] ||
                        lead.source}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-block px-2 py-1 rounded text-xs font-medium border",
                        statusColors[lead.status as keyof typeof statusColors] ||
                          statusColors.new
                      )}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-400">
                    {new Date(lead.created_at).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingLead(lead)}
                        disabled={isRefreshing}
                        className="text-xs text-blue-400 hover:text-blue-300 transition disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <span className="text-neutral-700">|</span>
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="text-xs text-blue-400 hover:text-blue-300 transition"
                      >
                        View →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingLead && (
        <EditLeadForm
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}

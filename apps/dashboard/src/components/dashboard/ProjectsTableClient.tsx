"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { EditProjectForm } from "@/components/projects/EditProjectForm";
import type { Project } from "@/types/database";

interface ProjectsTableClientProps {
  projects: Project[];
}

export function ProjectsTableClient({ projects }: ProjectsTableClientProps) {
  const router = useRouter();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const statusColors = {
    planning: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    in_progress: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    completed: "bg-green-500/10 border-green-500/20 text-green-400",
    on_hold: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  };

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description &&
          project.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  const handleEditSuccess = () => {
    setIsRefreshing(true);
    setEditingProject(null);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExportCSV = () => {
    const csvHeaders = ["Name", "Description", "Status", "Budget", "Start Date", "End Date", "Created"];
    const csvRows = filteredProjects.map((project) => [
      project.name,
      (project.description || "").replace(/"/g, '""'), // Escape quotes
      project.status,
      project.budget ? project.budget.toFixed(2) : "",
      project.start_date || "",
      project.end_date || "",
      new Date(project.created_at).toLocaleDateString("es-ES"),
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
    link.download = `projects_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-400">
          No projects yet. Create your first project!
        </p>
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
            placeholder="Search by name or description..."
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
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>

          {/* Clear Filters */}
          {(searchQuery || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-sm rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}

          {/* Results Count */}
          <div className="ml-auto flex items-center text-sm text-neutral-400">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            disabled={filteredProjects.length === 0}
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
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-400">No projects match your filters</p>
        </div>
      )}

      {/* Table */}
      {filteredProjects.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">
                  Budget
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">
                  Dates
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800/50 transition"
                >
                  <td className="px-4 py-3 text-white font-medium">
                    {project.name}
                  </td>
                  <td className="px-4 py-3 text-neutral-400 max-w-xs truncate">
                    {project.description || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-block px-2 py-1 rounded text-xs font-medium border",
                        statusColors[
                          project.status as keyof typeof statusColors
                        ] || statusColors.planning
                      )}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {project.budget
                      ? `$${project.budget.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-400">
                    {project.start_date && project.end_date ? (
                      <>
                        {new Date(project.start_date).toLocaleDateString("es-ES")}
                        {" → "}
                        {new Date(project.end_date).toLocaleDateString("es-ES")}
                      </>
                    ) : project.start_date ? (
                      `From ${new Date(project.start_date).toLocaleDateString(
                        "es-ES"
                      )}`
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProject(project)}
                        disabled={isRefreshing}
                        className="text-xs text-blue-400 hover:text-blue-300 transition disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <span className="text-neutral-700">|</span>
                      <Link
                        href={`/dashboard/projects/${project.id}`}
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
      {editingProject && (
        <EditProjectForm
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}

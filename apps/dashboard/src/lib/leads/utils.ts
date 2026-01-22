/**
 * Utility functions for Lead Conversion Engine
 * Helpers para UI, scoring, formatting
 */

import { type LeadStatus, type Lead, LEAD_STATUSES } from './types';

// ============================================
// KANBAN COLUMN CONFIGURATION
// ============================================

export const KANBAN_COLUMNS = [
  {
    id: LEAD_STATUSES.NEW,
    title: 'New',
    color: 'blue',
    icon: '🆕',
    description: 'Fresh leads waiting for investigation',
  },
  {
    id: LEAD_STATUSES.INVESTIGATING,
    title: 'Investigating',
    color: 'purple',
    icon: '🔍',
    description: 'AI analyzing tech stack & opportunities',
  },
  {
    id: LEAD_STATUSES.CONTACTED,
    title: 'Contacted',
    color: 'cyan',
    icon: '📞',
    description: 'Initial contact made',
  },
  {
    id: LEAD_STATUSES.MEETING_BOOKED,
    title: 'Meeting',
    color: 'yellow',
    icon: '📅',
    description: 'Call or meeting scheduled',
  },
  {
    id: LEAD_STATUSES.PROPOSAL_SENT,
    title: 'Proposal',
    color: 'orange',
    icon: '📄',
    description: 'Proposal sent, awaiting decision',
  },
  {
    id: LEAD_STATUSES.CLOSED_WON,
    title: 'Won',
    color: 'green',
    icon: '🎉',
    description: 'Converted to client',
  },
  {
    id: LEAD_STATUSES.CLOSED_LOST,
    title: 'Lost',
    color: 'red',
    icon: '❌',
    description: 'Not converted',
  },
] as const;

// ============================================
// COLOR UTILITIES
// ============================================

export function getStatusColor(status: LeadStatus): string {
  const colorMap: Record<string, string> = {
    new: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    investigating: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    contacted: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
    meeting_booked: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    proposal_sent: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    closed_won: 'text-green-400 bg-green-500/20 border-green-500/30',
    closed_lost: 'text-red-400 bg-red-500/20 border-red-500/30',
    // Legacy
    qualified: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    proposal: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    won: 'text-green-400 bg-green-500/20 border-green-500/30',
    lost: 'text-red-400 bg-red-500/20 border-red-500/30',
  };
  return colorMap[status] || colorMap.new;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400 bg-green-500/20';
  if (score >= 60) return 'text-yellow-400 bg-yellow-500/20';
  if (score >= 40) return 'text-orange-400 bg-orange-500/20';
  return 'text-red-400 bg-red-500/20';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return '🔥 Hot Lead';
  if (score >= 60) return '⚡ Warm Lead';
  if (score >= 40) return '❄️ Cold Lead';
  return '🧊 Ice Cold';
}

export function getValueColor(value: number | null): string {
  if (!value) return 'text-zinc-500';
  if (value >= 10000) return 'text-green-400';
  if (value >= 5000) return 'text-yellow-400';
  if (value >= 1000) return 'text-orange-400';
  return 'text-zinc-400';
}

// ============================================
// FORMATTING UTILITIES
// ============================================

export function formatCurrency(value: number | null): string {
  if (!value) return 'No value set';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string | null): string {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

// ============================================
// LEAD SCORING HELPERS
// ============================================

export function getLeadPriority(lead: Lead): 'high' | 'medium' | 'low' {
  const score = lead.ai_score;
  const value = lead.potential_value || 0;

  if (score >= 70 || value >= 10000) return 'high';
  if (score >= 40 || value >= 5000) return 'medium';
  return 'low';
}

export function shouldHighlight(lead: Lead): boolean {
  return lead.ai_score >= 70 || (lead.potential_value ?? 0) >= 10000;
}

// ============================================
// GROUPING UTILITIES
// ============================================

export function groupLeadsByStatus(leads: Lead[]): Record<LeadStatus, Lead[]> {
  return {
    new: leads.filter(l => l.status === LEAD_STATUSES.NEW),
    contacted: leads.filter(l => l.status === LEAD_STATUSES.CONTACTED),
    qualified: leads.filter(l => l.status === LEAD_STATUSES.QUALIFIED),
    proposal: leads.filter(l => l.status === LEAD_STATUSES.PROPOSAL),
    won: leads.filter(l => l.status === LEAD_STATUSES.WON),
    lost: leads.filter(l => l.status === LEAD_STATUSES.LOST),
  };
}

export function filterHotLeads(leads: Lead[]): Lead[] {
  return leads.filter(l => l.ai_score >= 70);
}

export function filterByDateRange(
  leads: Lead[],
  range: 'today' | 'week' | 'month' | 'all'
): Lead[] {
  if (range === 'all') return leads;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const cutoff =
    range === 'today' ? startOfToday :
    range === 'week' ? startOfWeek :
    startOfMonth;

  return leads.filter(l => new Date(l.created_at) >= cutoff);
}

// ============================================
// VALIDATION
// ============================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function extractDomain(email: string): string | null {
  if (!isValidEmail(email)) return null;
  return email.split('@')[1];
}

// ============================================
// STATS CALCULATION
// ============================================

export function calculateConversionRate(leads: Lead[]): number {
  const total = leads.length;
  if (total === 0) return 0;
  
  const won = leads.filter(l => l.status === LEAD_STATUSES.WON).length;
  return Math.round((won / total) * 100);
}

export function calculateTotalValue(leads: Lead[]): number {
  return leads.reduce((sum, lead) => sum + (lead.potential_value || 0), 0);
}

// ============================================
// TECH INTELLIGENCE HELPERS (Agency Sniper)
// ============================================

export function getTechStackIcon(cms: string | undefined): string {
  const icons: Record<string, string> = {
    WordPress: '🔷',
    Shopify: '🛍️',
    Wix: '🎨',
    Webflow: '💎',
    Custom: '⚙️',
    Unknown: '❓',
  };
  return icons[cms || 'Unknown'] || '❓';
}

export function getEmailValidationIcon(valid: boolean | null): string {
  if (valid === null) return '⏳'; // Pending
  if (valid === true) return '✅'; // Valid
  return '⚠️'; // Invalid
}

export function detectOpportunities(lead: Lead): string[] {
  const opportunities: string[] = [];
  const tech = lead.tech_stack || {};
  
  // CMS migrations
  if (tech.cms === 'WordPress' || tech.cms === 'Wix') {
    opportunities.push('🚀 Migración a stack moderno (Next.js)');
  }
  
  // Analytics missing
  if (tech.analytics === false) {
    opportunities.push('📊 Implementar Google Analytics 4');
  }
  
  if (tech.tagManager === false) {
    opportunities.push('🏷️ Configurar Tag Manager');
  }
  
  if (tech.facebookPixel === false) {
    opportunities.push('📱 Instalar Facebook Pixel');
  }
  
  // Performance issues
  if (tech.speed === 'slow') {
    opportunities.push('⚡ Optimización de performance');
  }
  
  // SEO issues
  if (tech.seo?.hasMetaTags === false) {
    opportunities.push('🔍 Optimización SEO básica');
  }
  
  if (tech.seo?.hasStructuredData === false) {
    opportunities.push('📋 Implementar datos estructurados');
  }
  
  // Security
  if (tech.ssl === false) {
    opportunities.push('🔒 Instalar certificado SSL');
  }
  
  // Responsive
  if (tech.responsive === false) {
    opportunities.push('📱 Hacer sitio responsive');
  }
  
  return opportunities;
}

export function getOpportunityValue(opportunity: string): number {
  const valueMap: Record<string, number> = {
    'Migración': 8000,
    'Analytics': 1500,
    'Tag Manager': 1000,
    'Facebook Pixel': 800,
    'performance': 3000,
    'SEO': 2500,
    'SSL': 500,
    'responsive': 4000,
  };
  
  for (const [key, value] of Object.entries(valueMap)) {
    if (opportunity.includes(key)) return value;
  }
  
  return 1000; // Default
}

export function calculatePotentialRevenue(lead: Lead): number {
  const opportunities = detectOpportunities(lead);
  const estimatedValue = opportunities.reduce(
    (sum, opp) => sum + getOpportunityValue(opp),
    0
  );
  
  return estimatedValue;
}

export function getLeadHealthStatus(lead: Lead): 'healthy' | 'warning' | 'critical' {
  // Email inválido = crítico
  if (lead.email_valid === false) return 'critical';
  
  // Sin website ni info de tech = warning
  if (!lead.website && Object.keys(lead.tech_stack || {}).length === 0) {
    return 'warning';
  }
  
  // Todo bien
  return 'healthy';
}

export function formatTechStack(tech: Partial<TechStack>): string {
  const parts: string[] = [];
  
  if (tech.cms) parts.push(tech.cms);
  if (tech.framework) parts.push(tech.framework);
  if (tech.ecommerce && tech.ecommerce !== 'None') parts.push(tech.ecommerce);
  
  return parts.join(' + ') || 'Unknown stack';
}

export function shouldAutoContact(lead: Lead): boolean {
  // No contactar si email es inválido
  if (lead.email_valid === false) return false;
  
  // No contactar si no se completó la investigación
  if (!lead.investigation_completed_at) return false;
  
  // No contactar si no hay draft de email
  if (!lead.ai_email_draft) return false;
  
  // No contactar si score es muy bajo
  if (lead.ai_score < 30) return false;
  
  return true;
}

import type { TechStack } from './types';

export function calculateAverageScore(leads: Lead[]): number {
  if (leads.length === 0) return 0;
  const total = leads.reduce((sum, lead) => sum + lead.ai_score, 0);
  return Math.round(total / leads.length);
}

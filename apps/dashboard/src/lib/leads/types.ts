/**
 * TypeScript Types for Lead Conversion Engine
 * Mantiene consistencia con el schema de Supabase
 */

// ============================================
// ENUMS Y CONSTANTES
// ============================================

export const LEAD_STATUSES = {
  NEW: 'new',
  INVESTIGATING: 'investigating',
  CONTACTED: 'contacted',
  MEETING_BOOKED: 'meeting_booked',
  PROPOSAL_SENT: 'proposal_sent',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost',
  // Legacy values (mantener compatibilidad)
  QUALIFIED: 'qualified',
  PROPOSAL: 'proposal',
  WON: 'won',
  LOST: 'lost',
} as const;

export type LeadStatus = typeof LEAD_STATUSES[keyof typeof LEAD_STATUSES];

export const ENRICHMENT_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type EnrichmentStatus = typeof ENRICHMENT_STATUSES[keyof typeof ENRICHMENT_STATUSES];

export const ACTIVITY_TYPES = {
  CREATED: 'created',
  STATUS_CHANGED: 'status_changed',
  NOTE_ADDED: 'note_added',
  ENRICHMENT_COMPLETED: 'enrichment_completed',
  SCORE_UPDATED: 'score_updated',
  EMAIL_SENT: 'email_sent',
  VALUE_UPDATED: 'value_updated',
  TAG_ADDED: 'tag_added',
} as const;

export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];

// ============================================
// DATABASE TYPES (Supabase Row Types)
// ============================================

export interface Lead {
  id: string;
  client_id: string;
  created_at: string;
  updated_at: string;
  
  // Datos básicos
  name: string;
  email: string;
  phone: string | null;
  website: string | null; // NUEVO: crítico para espionaje
  notes: string | null;
  source: string | null;
  
  // Pipeline
  status: LeadStatus;
  potential_value: number | null;
  expected_close_date: string | null;
  
  // TECH INTELLIGENCE (El espía técnico) - NUEVO
  tech_stack: TechStack;
  email_valid: boolean | null;
  email_validation_details: EmailValidation;
  
  // Enriquecimiento legacy (mantener)
  company_name: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  company_size: string | null;
  company_industry: string | null;
  enrichment_status: EnrichmentStatus;
  enriched_at: string | null;
  
  // AI SALES INTELLIGENCE (El SDR automático) - NUEVO
  ai_score: number;
  ai_summary: string | null;
  suggested_action: string | null; // "Ofrécele migración - sitio lento detectado"
  ai_email_draft: string | null; // Email de venta listo para copiar
  pain_points: string[] | null; // ['No tiene Analytics', 'Sitio lento']
  
  // Operativo mejorado - NUEVO
  tags: string[] | null;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  investigation_completed_at: string | null;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  user_id: string | null;
  activity_type: ActivityType;
  old_value: string | null;
  new_value: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// ============================================
// UI TYPES (Frontend Helpers)
// ============================================

export interface GroupedLeads {
  new: Lead[];
  contacted: Lead[];
  qualified: Lead[];
  proposal: Lead[];
  won: Lead[];
  lost: Lead[];
}

export interface KanbanColumn {
  id: LeadStatus;
  title: string;
  leads: Lead[];
  color: string;
  icon: string;
}

export interface LeadWithActivities extends Lead {
  activities: LeadActivity[];
}

// ============================================
// FORM TYPES (Server Actions)
// ============================================

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  website?: string; // NUEVO: crítico para espionaje
  notes?: string;
  source?: string;
  potential_value?: number;
}

export interface UpdateLeadInput {
  name?: string;
  email?: string;
  phone?: string;
  website?: string; // NUEVO
  notes?: string;
  status?: LeadStatus;
  potential_value?: number;
  expected_close_date?: string;
  tags?: string[];
  suggested_action?: string; // NUEVO: IA
  next_follow_up_at?: string; // NUEVO
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface EnrichmentWebhookPayload {
  lead_id: string;
  email: string;
  website?: string;
  name: string;
  message?: string;
  phone?: string;
}

// ============================================
// TECH INTELLIGENCE TYPES (Agency Sniper)
// ============================================

export interface TechStack {
  cms?: 'WordPress' | 'Shopify' | 'Wix' | 'Webflow' | 'Custom' | 'Unknown';
  ecommerce?: 'WooCommerce' | 'Shopify' | 'Magento' | 'None';
  framework?: 'React' | 'Next.js' | 'Vue' | 'Angular' | 'jQuery' | 'Vanilla' | 'Unknown';
  analytics?: boolean;
  tagManager?: boolean;
  facebookPixel?: boolean;
  speed?: 'fast' | 'medium' | 'slow';
  ssl?: boolean;
  responsive?: boolean;
  seo?: {
    hasMetaTags?: boolean;
    hasStructuredData?: boolean;
    hasRobots?: boolean;
  };
}

export interface EmailValidation {
  hasMX?: boolean;
  disposable?: boolean;
  freeProvider?: boolean; // gmail, yahoo, hotmail
  validFormat?: boolean;
  provider?: string;
}

export interface LeadOpportunity {
  type: 'migration' | 'analytics' | 'performance' | 'seo' | 'security' | 'design';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedValue?: number;
}

export interface LeadInsights {
  opportunities: LeadOpportunity[];
  warnings: string[];
  readinessScore: number;
  recommendedAction: string;
}

export interface EnrichmentResult {
  company_name?: string;
  avatar_url?: string;
  linkedin_url?: string;
  company_size?: string;
  company_industry?: string;
  ai_score?: number;
  ai_summary?: string;
  enrichment_status: EnrichmentStatus;
}

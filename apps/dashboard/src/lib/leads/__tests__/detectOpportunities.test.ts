import { describe, it, expect } from 'vitest';
import { detectOpportunities } from '../utils';
import type { Lead, TechStack } from '../types';

const baseLead: Lead = {
  id: 'lead-1',
  client_id: 'client-1',
  created_at: new Date('2024-01-01').toISOString(),
  updated_at: new Date('2024-01-02').toISOString(),
  name: 'Acme',
  email: 'ceo@acme.com',
  phone: null,
  website: 'https://acme.com',
  notes: null,
  source: 'manual',
  status: 'new',
  potential_value: null,
  expected_close_date: null,
  tech_stack: {},
  email_valid: true,
  email_validation_details: {},
  company_name: null,
  avatar_url: null,
  linkedin_url: null,
  company_size: null,
  company_industry: null,
  enrichment_status: 'pending',
  enriched_at: null,
  ai_score: 50,
  ai_summary: null,
  suggested_action: null,
  ai_email_draft: null,
  pain_points: null,
  tags: null,
  last_contacted_at: null,
  next_follow_up_at: null,
  investigation_completed_at: null,
};

function buildLead(tech_stack: TechStack): Lead {
  return { ...baseLead, tech_stack };
}

describe('detectOpportunities', () => {
  it('returns empty when no issues detected', () => {
    const lead = buildLead({ cms: 'Webflow', analytics: true, ssl: true, responsive: true });
    const result = detectOpportunities(lead);
    expect(result).toHaveLength(0);
  });

  it('detects migrations, analytics, performance, seo, and security gaps', () => {
    const lead = buildLead({
      cms: 'WordPress',
      analytics: false,
      tagManager: false,
      facebookPixel: false,
      speed: 'slow',
      ssl: false,
      responsive: false,
      seo: { hasMetaTags: false, hasStructuredData: false },
    });

    const result = detectOpportunities(lead);

    const expected = [
      '🚀 Migración a stack moderno (Next.js)',
      '📊 Implementar Google Analytics 4',
      '🏷️ Configurar Tag Manager',
      '📱 Instalar Facebook Pixel',
      '⚡ Optimización de performance',
      '🔍 Optimización SEO básica',
      '📋 Implementar datos estructurados',
      '🔒 Instalar certificado SSL',
      '📱 Hacer sitio responsive',
    ];

    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  });

  it('ignores SEO prompts when metadata is present', () => {
    const lead = buildLead({
      cms: 'Shopify',
      analytics: true,
      seo: { hasMetaTags: true, hasStructuredData: true },
    });

    const result = detectOpportunities(lead);

    expect(result).not.toEqual(expect.arrayContaining(['🔍 Optimización SEO básica']));
    expect(result).not.toEqual(expect.arrayContaining(['📋 Implementar datos estructurados']));
  });
});

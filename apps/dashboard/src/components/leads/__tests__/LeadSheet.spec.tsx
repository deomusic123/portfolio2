import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LeadSheet } from '../LeadSheet';
import * as actions from '@/actions/leads';
import type { Lead, LeadActivity } from '@/lib/leads/types';

const lead: Lead = {
  id: '1',
  client_id: 'c1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  name: 'Acme',
  email: 'ceo@acme.com',
  phone: null,
  website: 'https://acme.com',
  notes: 'hello',
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
  suggested_action: 'Call tomorrow',
  ai_email_draft: 'Hello draft',
  pain_points: ['Slow site'],
  tags: null,
  last_contacted_at: null,
  next_follow_up_at: '2024-01-02T10:00:00Z',
  investigation_completed_at: null,
  position: 0,
};

const activities: LeadActivity[] = [
  { id: 'a1', lead_id: '1', user_id: null, activity_type: 'created', old_value: null, new_value: null, metadata: null, created_at: '2024-01-01T00:00:00Z' },
];

describe('LeadSheet', () => {
  beforeEach(() => {
    // Provide clipboard mock
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders data and saves edits', async () => {
    const getLeadWithActivitiesMock = vi.spyOn(actions, 'getLeadWithActivities').mockResolvedValue({ success: true, data: { lead, activities } });
    const updateLeadMock = vi.spyOn(actions, 'updateLead').mockResolvedValue({ success: true });

    render(<LeadSheet leadId="1" open onClose={() => {}} />);

    expect(await screen.findByText('Lead Details')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Call tomorrow')).toBeInTheDocument();
    expect(screen.getByText('Hello draft')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('e.g., Ofrecer migración por sitio lento'), { target: { value: 'Ping again' } });
    fireEvent.click(screen.getByText('Save changes'));

    await waitFor(() => {
      expect(updateLeadMock).toHaveBeenCalledWith('1', expect.objectContaining({ suggested_action: 'Ping again' }));
    });

    getLeadWithActivitiesMock.mockRestore();
    updateLeadMock.mockRestore();
  });
});

'use client';

import { Lead } from '@/lib/leads/types';
import { 
  getStatusColor, 
  getScoreColor, 
  getTechStackIcon,
  getEmailValidationIcon,
  detectOpportunities,
  formatTechStack,
  getLeadHealthStatus
} from '@/lib/leads/utils';
import { useState } from 'react';

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const [copied, setCopied] = useState(false);
  const opportunities = detectOpportunities(lead);
  const healthStatus = getLeadHealthStatus(lead);

  const handleCopyDraft = () => {
    if (lead.ai_email_draft) {
      navigator.clipboard.writeText(lead.ai_email_draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative p-4 rounded-lg bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all hover:shadow-lg hover:shadow-blue-500/5">
      {/* Health Indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${
          healthStatus === 'healthy' ? 'bg-green-500' :
          healthStatus === 'warning' ? 'bg-yellow-500' :
          'bg-red-500'
        }`} />
        
        {/* Email Validation Badge */}
        {lead.email_valid !== null && (
          <span className="text-xs">
            {getEmailValidationIcon(lead.email_valid)}
          </span>
        )}
      </div>

      {/* Lead Name & Score */}
      <div className="mb-3">
        <h4 className="text-white font-semibold text-sm mb-1 pr-8">
          {lead.name}
        </h4>
        <div className="flex items-center gap-2">
          {lead.ai_score !== null && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${getScoreColor(lead.ai_score)}`}>
              {lead.ai_score}
            </span>
          )}
          {lead.potential_value && (
            <span className="text-xs text-zinc-500">
              ${lead.potential_value.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Tech Stack */}
      {lead.tech_stack && Object.keys(lead.tech_stack).length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            {lead.tech_stack.cms && (
              <span className="text-lg" title={lead.tech_stack.cms}>
                {getTechStackIcon(lead.tech_stack.cms)}
              </span>
            )}
            {lead.tech_stack.speed && (
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                lead.tech_stack.speed === 'slow' ? 'bg-red-500/10 text-red-400' :
                lead.tech_stack.speed === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-green-500/10 text-green-400'
              }`}>
                {lead.tech_stack.speed === 'slow' ? '🐌' : 
                 lead.tech_stack.speed === 'medium' ? '⚡' : '🚀'}
              </span>
            )}
          </div>
          {formatTechStack(lead.tech_stack) && (
            <p className="text-xs text-zinc-500">
              {formatTechStack(lead.tech_stack)}
            </p>
          )}
        </div>
      )}

      {/* Opportunities Chips */}
      {opportunities.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {opportunities.slice(0, 2).map((opp, i) => (
            <span 
              key={i}
              className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
            >
              {opp.split(' ')[0]} {/* Solo el emoji */}
            </span>
          ))}
          {opportunities.length > 2 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
              +{opportunities.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Contact Info */}
      <div className="space-y-1 mb-3">
        <p className="text-xs text-zinc-500 truncate">
          {lead.email}
        </p>
        {lead.phone && (
          <p className="text-xs text-zinc-500">
            {lead.phone}
          </p>
        )}
      </div>

      {/* AI Email Draft Button */}
      {lead.ai_email_draft && (
        <button
          onClick={handleCopyDraft}
          className="w-full text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-300 hover:from-purple-600/30 hover:to-blue-600/30 transition-all"
        >
          {copied ? '✅ Copied!' : '📧 Copy AI Draft'}
        </button>
      )}

      {/* Investigation Status */}
      {lead.status === 'investigating' && !lead.investigation_completed_at && (
        <div className="mt-3 text-xs text-center text-purple-400 animate-pulse">
          🔍 AI analyzing...
        </div>
      )}

      {/* Suggested Action */}
      {lead.suggested_action && (
        <div className="mt-3 p-2 rounded bg-yellow-500/5 border border-yellow-500/20">
          <p className="text-xs text-yellow-300/80">
            💡 {lead.suggested_action}
          </p>
        </div>
      )}
    </div>
  );
}

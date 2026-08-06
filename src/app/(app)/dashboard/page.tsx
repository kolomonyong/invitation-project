// src/app/(app)/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

// ─── Types ───────────────────────────────────────────────────────────────────
type Template = {
  id: number;
  name: string;
  category: string;
  preview_image_url: string;
}

type Invitation = {
  id: string;
  created_at: string;
  templates: {
    name: string;
    preview_image_url: string;
    category?: string;
  } | null;
}

// ─── Shared icon prop type (className + style) ────────────────────────────────
type IconProps = { className?: string; style?: React.CSSProperties }

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const EnvelopeIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
)
const PlusIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)
const SparkleIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
)
const UsersIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
)
const LayoutIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
)
const ExternalLinkIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
)
const PencilIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
)
const TrashIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
)
const QrCodeIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
  </svg>
)
const CloseIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)
const CopyIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
  </svg>
)
const SearchIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
)
const SpinnerIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
)

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, accent, badge,
}: {
  icon: React.ComponentType<IconProps>;
  label: string;
  value: string | number;
  accent: string;
  badge?: string;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl border p-5 gap-3 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-2">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: accent + '1A' }}>
          <Icon className="w-6 h-6" style={{ color: accent }} />
        </div>
        <p className="font-medium text-sm" style={{ color: 'var(--secondary)' }}>{label}</p>
      </div>
      <div className="flex items-end gap-2">
        <p className="font-bold text-3xl leading-none" style={{ color: 'var(--foreground)' }}>{value}</p>
        {badge && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-md mb-0.5"
            style={{ background: 'var(--success-light)', color: 'var(--success)' }}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Invitation Card ──────────────────────────────────────────────────────────
function InvitationCard({
  invitation,
  siteUrl,
  onDelete,
  onShowQR,
}: {
  invitation: Invitation;
  siteUrl: string;
  onDelete: (id: string) => void;
  onShowQR: (url: string, name: string) => void;
}) {
  const invUrl = `${siteUrl}/invite/${invitation.id}`;
  const category = invitation.templates?.category || 'General';
  const name = invitation.templates?.name || 'Untitled Invitation';
  const imgSrc = invitation.templates?.preview_image_url || '';
  const dateStr = new Date(invitation.created_at).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const copyLink = () => {
    navigator.clipboard.writeText(invUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div
      className="flex flex-col rounded-2xl border bg-white overflow-hidden transition-all duration-300 group hover:shadow-lg animate-slide-up"
      style={{ borderColor: 'var(--border)' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
    >
      {/* Poster */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        {/* Fallback Background (always behind) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--primary-light), #F5F3FF)' }}
        >
          <EnvelopeIcon className="w-12 h-12" style={{ color: 'var(--primary)', opacity: 0.4 }} />
        </div>

        {/* Poster Image (covers fallback if loaded successfully) */}
        {imgSrc && (
          <img
            src={imgSrc}
            alt={name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = '0';
            }}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          />
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2.5 py-1 text-xs font-bold rounded-full shadow-sm capitalize"
            style={{ background: 'var(--primary)', color: 'white' }}
          >
            {category}
          </span>
        </div>
        {/* ID badge */}
        <div className="absolute bottom-3 right-3">
          <span
            className="px-2.5 py-1 text-xs font-medium rounded-lg backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.65)', color: 'white' }}
          >
            {invitation.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-bold text-base leading-snug line-clamp-2" style={{ color: 'var(--foreground)' }}>
            {name}
          </h3>
          <p className="text-xs mt-1 font-medium" style={{ color: 'var(--secondary)' }}>
            Created {dateStr}
          </p>
        </div>

        {/* Quick actions row */}
        <div className="flex items-center gap-2 pt-1">
          {/* View public link */}
          <a
            href={invUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200"
            style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--primary)';
              (e.currentTarget as HTMLElement).style.color = 'white';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--primary-light)';
              (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
            }}
          >
            <ExternalLinkIcon className="w-3.5 h-3.5" />
            <span>View Live</span>
          </a>

          {/* Guests */}
          <Link
            href={`/dashboard/invitations/${invitation.id}/guests`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)';
              (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.color = 'var(--foreground)';
            }}
          >
            <UsersIcon className="w-3.5 h-3.5" />
            <span>Guests</span>
          </Link>
        </div>

        {/* Icon buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyLink}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer"
            style={{ background: 'var(--muted)', color: 'var(--secondary)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--secondary)'}
            title="Copy link"
          >
            <CopyIcon className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>

          <button
            onClick={() => onShowQR(invUrl, name)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer shrink-0"
            style={{ background: 'var(--muted)', color: 'var(--secondary)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--secondary)'}
            title="Show QR Code"
          >
            <QrCodeIcon className="w-4 h-4" />
          </button>

          <Link
            href={`/dashboard/invitations/edit/${invitation.id}`}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 shrink-0"
            style={{ background: 'var(--muted)', color: 'var(--secondary)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--secondary)'}
            title="Edit invitation"
          >
            <PencilIcon className="w-4 h-4" />
          </Link>

          <button
            onClick={() => onDelete(invitation.id)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer shrink-0"
            style={{ background: 'var(--muted)', color: 'var(--secondary)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--error-light)';
              (e.currentTarget as HTMLElement).style.color = 'var(--error)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--muted)';
              (e.currentTarget as HTMLElement).style.color = 'var(--secondary)';
            }}
            title="Delete invitation"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Template Card ────────────────────────────────────────────────────────────
function TemplateCard({ template }: { template: Template }) {
  return (
    <Link href={`/editor/${template.id}`} className="group block">
      <div
        className="rounded-2xl border bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        style={{ borderColor: 'var(--border)' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
      >
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={template.preview_image_url}
            alt={template.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="px-4 py-2 bg-white rounded-full text-sm font-bold shadow-lg" style={{ color: 'var(--primary)' }}>
              Use Template →
            </span>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-bold text-sm truncate" style={{ color: 'var(--foreground)' }}>{template.name}</h3>
            <p className="text-xs capitalize mt-0.5" style={{ color: 'var(--secondary)' }}>{template.category}</p>
          </div>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
            style={{ background: 'var(--primary-light)' }}
          >
            <SparkleIcon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className}`}
      style={{ background: 'var(--border)' }}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      <Skeleton className="w-full aspect-video rounded-none" />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}

// ─── QR Modal ────────────────────────────────────────────────────────────────
function QRModal({
  url, name, onClose,
}: {
  url: string; name: string; onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>QR Code</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer" onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--muted)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
            <CloseIcon className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
          </button>
        </div>
        <div className="flex justify-center mb-4 p-4 rounded-2xl" style={{ background: 'var(--muted)' }}>
          <QRCodeSVG value={url} size={160} />
        </div>
        <p className="text-sm font-semibold mb-1 line-clamp-1" style={{ color: 'var(--foreground)' }}>{name}</p>
        <p className="text-xs mb-4 break-all" style={{ color: 'var(--secondary)' }}>{url}</p>
        <button
          onClick={() => { navigator.clipboard.writeText(url); toast.success('Link copied!'); }}
          className="w-full py-2.5 rounded-full text-sm font-bold text-white cursor-pointer transition-opacity hover:opacity-85"
          style={{ background: 'var(--primary)' }}
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({
  onConfirm, onCancel, isDeleting,
}: {
  onConfirm: () => void; onCancel: () => void; isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--error-light)' }}>
          <TrashIcon className="w-8 h-8" style={{ color: 'var(--error)' }} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Delete Invitation</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--secondary)' }}>
          This action is permanent. Your invitation and all guest data will be removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-3 rounded-full font-semibold cursor-pointer transition-all"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--muted)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 rounded-full font-bold text-white cursor-pointer flex items-center justify-center gap-2"
            style={{ background: 'var(--error)', opacity: isDeleting ? 0.7 : 1 }}
          >
            {isDeleting && <SpinnerIcon className="w-4 h-4 animate-spin-slow" />}
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────
export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [myInvitations, setMyInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // QR modal state
  const [qrData, setQrData] = useState<{ url: string; name: string } | null>(null);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://invitation-project-ten.vercel.app';

  // Auth check + data fetch
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const [{ data: tplData }, { data: invData, error: invError }] = await Promise.all([
        supabase.from('templates').select('*'),
        supabase
          .from('invitations')
          .select('id, created_at, templates ( name, preview_image_url, category )')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (tplData) setTemplates(tplData);
      if (invError) {
        console.error('Error fetching invitations:', invError);
      } else if (invData) {
        const normalized = invData.map(inv => ({
          ...inv,
          templates: Array.isArray(inv.templates) ? inv.templates[0] : inv.templates,
        }));
        setMyInvitations(normalized as Invitation[]);
      }
      setLoading(false);
    };
    getData();
  }, [supabase, router]);

  // Filtered invitations
  const filteredInvitations = myInvitations.filter(inv => {
    const name = inv.templates?.name?.toLowerCase() || '';
    const cat = inv.templates?.category?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || name.includes(q) || inv.id.includes(q);
    const matchesCategory = !filterCategory || cat === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Delete handler
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const { error } = await supabase.from('invitations').delete().eq('id', deleteId);
    if (error) {
      toast.error('Failed to delete invitation.');
    } else {
      toast.success('Invitation deleted successfully.');
      setMyInvitations(prev => prev.filter(inv => inv.id !== deleteId));
    }
    setIsDeleting(false);
    setDeleteId(null);
  }, [deleteId, supabase]);

  // Unique categories for filter
  const categories = [...new Set(myInvitations.map(inv => inv.templates?.category).filter(Boolean))];

  // Stats
  const stats = [
    { icon: EnvelopeIcon, label: 'Total Invitations', value: myInvitations.length, accent: '#6C63FF' },
    { icon: UsersIcon, label: 'Templates Available', value: templates.length, accent: '#10B981' },
    { icon: LayoutIcon, label: 'Filtered Results', value: filteredInvitations.length, accent: '#F59E0B' },
    { icon: SparkleIcon, label: 'Active Invitations', value: myInvitations.length, accent: '#8B5CF6', badge: myInvitations.length > 0 ? 'Live' : undefined },
  ];

  return (
    <div className="flex-1 p-5 md:p-8">

      {/* ─── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
            My Invitations
          </h1>
          <p className="text-sm" style={{ color: 'var(--secondary)' }}>
            Create, manage and share your digital invitations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="#templates"
            className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm text-white transition-all duration-300 cursor-pointer shadow-sm"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)',
              boxShadow: '0 4px 16px -4px rgba(108,99,255,0.45)',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            <PlusIcon className="w-4 h-4" />
            <span>New Invitation</span>
          </Link>
        </div>
      </div>

      {/* ─── Stats Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ─── Invitations Section ─────────────────────────────────────── */}
      <section className="mb-14" id="invitations">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
            Your Invitations
          </h2>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <SearchIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--secondary)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name or ID…"
                className="w-full h-11 pl-10 pr-4 rounded-2xl text-sm font-medium outline-none transition-all duration-200"
                style={{
                  border: '1px solid var(--border)',
                  background: 'white',
                  color: 'var(--foreground)',
                }}
                onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
                onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
              />
            </div>
            {/* Category filter */}
            {categories.length > 0 && (
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="h-11 px-4 pr-9 rounded-2xl text-sm font-medium outline-none transition-all duration-200 cursor-pointer appearance-none"
                style={{
                  border: '1px solid var(--border)',
                  background: 'white',
                  color: filterCategory ? 'var(--foreground)' : 'var(--secondary)',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  paddingRight: '36px',
                }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat!}>{cat}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filteredInvitations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredInvitations.map(inv => (
              <InvitationCard
                key={inv.id}
                invitation={inv}
                siteUrl={siteUrl}
                onDelete={setDeleteId}
                onShowQR={(url, name) => setQrData({ url, name })}
              />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed text-center"
            style={{ borderColor: 'var(--border)', background: 'white' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'var(--primary-light)' }}
            >
              <EnvelopeIcon className="w-8 h-8" style={{ color: 'var(--primary)' }} />
            </div>
            <h3 className="font-bold text-base mb-1" style={{ color: 'var(--foreground)' }}>
              {searchQuery || filterCategory ? 'No results found' : 'No invitations yet'}
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--secondary)' }}>
              {searchQuery || filterCategory
                ? 'Try adjusting your search or filters.'
                : 'Choose a template below to create your first invitation!'}
            </p>
            {!searchQuery && !filterCategory && (
              <a
                href="#templates"
                className="px-5 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ background: 'var(--primary)' }}
              >
                Browse Templates
              </a>
            )}
          </div>
        )}
      </section>

      {/* ─── Templates Section ───────────────────────────────────────── */}
      <section id="templates">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              Create a New Invitation
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--secondary)' }}>
              Pick a template to get started instantly.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : templates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {templates.map(t => <TemplateCard key={t.id} template={t} />)}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed"
            style={{ borderColor: 'var(--border)', background: 'white' }}
          >
            <p className="text-sm" style={{ color: 'var(--secondary)' }}>No templates available yet.</p>
          </div>
        )}
      </section>

      {/* ─── Modals ──────────────────────────────────────────────────── */}
      {qrData && (
        <QRModal
          url={qrData.url}
          name={qrData.name}
          onClose={() => setQrData(null)}
        />
      )}

      {deleteId && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
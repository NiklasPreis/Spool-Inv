import { Spool, MATERIAL_COLORS } from '../types/filament'

interface Props {
  spool: Spool
  onEdit: (spool: Spool) => void
  onDelete: (id: number) => void
}

function TempIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  )
}

function BedIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12.01" y2="12" />
    </svg>
  )
}

function WeightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="5" r="3" />
      <path d="M6.5 8a2 2 0 0 0-1.9 1.4L2 16h20l-2.6-6.6A2 2 0 0 0 17.5 8z" />
      <path d="M2 16l1 5h18l1-5" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

export default function SpoolCard({ spool, onEdit, onDelete }: Props) {
  const matColor = MATERIAL_COLORS[spool.material] ?? '#94a3b8'

  return (
    <div className="spool-card">
      <div className="card-swatch" style={{ background: spool.color_hex }} />

      <div className="card-body">
        <div className="card-badges">
          <span className="badge badge-material" style={{ borderLeft: `3px solid ${matColor}` }}>
            {spool.material}
          </span>
          {spool.storage_location && (
            <span className="badge badge-location">
              <LocationIcon />
              {spool.storage_location}
            </span>
          )}
        </div>

        <div className="card-title">{spool.manufacturer || <em style={{ opacity: .5 }}>Kein Hersteller</em>}</div>
        <div className="card-subtitle" style={{ color: spool.color_hex }}>
          &#9632; {spool.color || '—'}
        </div>

        <div className="card-meta">
          <span className="meta-item">
            <WeightIcon />
            {spool.weight_g >= 1000
              ? `${(spool.weight_g / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 })} kg`
              : `${spool.weight_g} g`}
          </span>
          <span className="quantity-badge">×{spool.quantity}</span>
        </div>

        <div className="card-meta">
          <span className="meta-item" title="Düsentemperatur">
            <TempIcon />
            {spool.nozzle_temp_min}–{spool.nozzle_temp_max}°C
          </span>
          <span className="meta-item" title="Betttemperatur">
            <BedIcon />
            {spool.bed_temp_min}–{spool.bed_temp_max}°C
          </span>
        </div>

        {spool.notes && (
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {spool.notes}
          </div>
        )}
      </div>

      <div className="card-footer">
        <button className="btn-icon" title="Bearbeiten" onClick={() => onEdit(spool)}>
          <EditIcon />
        </button>
        <button className="btn-icon danger" title="Löschen" onClick={() => onDelete(spool.id)}>
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

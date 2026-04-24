import { useState, useEffect, FormEvent } from 'react'
import { Spool, SpoolInput, MATERIALS, MATERIAL_DEFAULTS } from '../types/filament'

interface Props {
  spool: Spool | null
  onSave: (data: SpoolInput) => void
  onClose: () => void
}

const DEFAULT_FORM: SpoolInput = {
  manufacturer: '',
  material: 'PLA',
  color: '',
  color_hex: '#4ade80',
  weight_g: 1000,
  quantity: 1,
  nozzle_temp_min: 190,
  nozzle_temp_max: 220,
  bed_temp_min: 20,
  bed_temp_max: 60,
  storage_location: '',
  notes: ''
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function SpoolModal({ spool, onSave, onClose }: Props) {
  const [form, setForm] = useState<SpoolInput>(DEFAULT_FORM)

  useEffect(() => {
    if (spool) {
      const { id, created_at, updated_at, ...rest } = spool
      void id; void created_at; void updated_at
      setForm(rest)
    } else {
      setForm(DEFAULT_FORM)
    }
  }, [spool])

  function set<K extends keyof SpoolInput>(key: K, value: SpoolInput[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function handleMaterialChange(material: string) {
    const defaults = MATERIAL_DEFAULTS[material]
    setForm(f => ({
      ...f,
      material,
      ...(defaults && !spool ? {
        nozzle_temp_min: defaults.nozzleMin,
        nozzle_temp_max: defaults.nozzleMax,
        bed_temp_min: defaults.bedMin,
        bed_temp_max: defaults.bedMax
      } : {})
    }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{spool ? 'Spule bearbeiten' : 'Spule hinzufügen'}</h2>
          <button className="btn-icon" onClick={onClose}><XIcon /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Hersteller + Material */}
            <div className="form-row">
              <div className="form-group">
                <label>Hersteller</label>
                <input
                  type="text"
                  placeholder="z.B. Bambu Lab"
                  value={form.manufacturer}
                  onChange={e => set('manufacturer', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Material *</label>
                <select
                  required
                  value={form.material}
                  onChange={e => handleMaterialChange(e.target.value)}
                >
                  {MATERIALS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Farbe */}
            <div className="form-group">
              <label>Farbe</label>
              <div className="color-row">
                <div className="color-picker-wrap">
                  <input
                    type="color"
                    value={form.color_hex}
                    onChange={e => set('color_hex', e.target.value)}
                    title="Farbe wählen"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Farbname, z.B. Bambus-Grün"
                  value={form.color}
                  onChange={e => set('color', e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
              <div className="color-preview-strip" style={{ background: form.color_hex }} />
            </div>

            {/* Gewicht + Menge */}
            <div className="form-row">
              <div className="form-group">
                <label>Gewicht (g) *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={form.weight_g}
                  onChange={e => set('weight_g', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="form-group">
                <label>Anzahl Spulen *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={form.quantity}
                  onChange={e => set('quantity', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Düsentemperatur */}
            <div className="form-group">
              <label>Düsentemperatur (°C)</label>
              <div className="form-row" style={{ gap: 8 }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={form.nozzle_temp_min}
                  onChange={e => set('nozzle_temp_min', parseInt(e.target.value) || 0)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={form.nozzle_temp_max}
                  onChange={e => set('nozzle_temp_max', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Betttemperatur */}
            <div className="form-group">
              <label>Druckbetttemperatur (°C)</label>
              <div className="form-row" style={{ gap: 8 }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={form.bed_temp_min}
                  onChange={e => set('bed_temp_min', parseInt(e.target.value) || 0)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={form.bed_temp_max}
                  onChange={e => set('bed_temp_max', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Lagerort */}
            <div className="form-group">
              <label>Lagerort / Fach</label>
              <input
                type="text"
                placeholder="z.B. Regal A, Fach 3"
                value={form.storage_location}
                onChange={e => set('storage_location', e.target.value)}
              />
            </div>

            {/* Notizen */}
            <div className="form-group">
              <label>Notizen</label>
              <textarea
                placeholder="Optionale Anmerkungen…"
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Abbrechen
            </button>
            <button type="submit" className="btn btn-primary">
              {spool ? 'Speichern' : 'Hinzufügen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

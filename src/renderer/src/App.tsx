import { useState, useEffect, useMemo } from 'react'
import { Spool, SpoolInput, Stats, MATERIAL_COLORS } from './types/filament'
import SpoolCard from './components/SpoolCard'
import SpoolModal from './components/SpoolModal'
import { api } from './api'

function SpoolIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="9" />
      <line x1="12" y1="15" x2="12" y2="22" />
      <line x1="2" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="22" y2="12" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function EmptyBoxIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

export default function App() {
  const [spools, setSpools] = useState<Spool[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [search, setSearch] = useState('')
  const [filterMaterial, setFilterMaterial] = useState<string>('all')
  const [filterLocation, setFilterLocation] = useState<string>('all')
  const [filterManufacturer, setFilterManufacturer] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSpool, setEditingSpool] = useState<Spool | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadData() {
    const [allSpools, allStats] = await Promise.all([
      api.spools.getAll(),
      api.spools.getStats()
    ])
    setSpools(allSpools)
    setStats(allStats)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const filtered = useMemo(() => {
    return spools.filter(s => {
      if (filterMaterial !== 'all' && s.material !== filterMaterial) return false
      if (filterLocation !== 'all' && s.storage_location !== filterLocation) return false
      if (filterManufacturer !== 'all' && s.manufacturer !== filterManufacturer) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          s.manufacturer.toLowerCase().includes(q) ||
          s.color.toLowerCase().includes(q) ||
          s.material.toLowerCase().includes(q) ||
          s.storage_location.toLowerCase().includes(q) ||
          s.notes.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [spools, filterMaterial, filterLocation, filterManufacturer, search])

  async function handleSave(input: SpoolInput) {
    if (editingSpool) {
      await api.spools.update(editingSpool.id, input)
    } else {
      await api.spools.add(input)
    }
    setIsModalOpen(false)
    setEditingSpool(null)
    await loadData()
  }

  function handleEdit(spool: Spool) {
    setEditingSpool(spool)
    setIsModalOpen(true)
  }

  function handleDeleteRequest(id: number) {
    setDeleteTarget(id)
  }

  async function handleDeleteConfirm() {
    if (deleteTarget === null) return
    await api.spools.delete(deleteTarget)
    setDeleteTarget(null)
    await loadData()
  }

  function openAdd() {
    setEditingSpool(null)
    setIsModalOpen(true)
  }

  const totalQty = stats?.total_quantity ?? 0

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <SpoolIcon />
          SpoolInv
        </div>
        <div className="header-spacer" />
        <div className="search-wrap">
          <SearchIcon />
          <input
            className="search-input"
            type="text"
            placeholder="Suchen…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={openAdd} style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <PlusIcon /> Spule hinzufügen
        </button>
      </header>

      <div className="main">
        {/* Sidebar */}
        <nav className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Material</div>
            <div
              className={`sidebar-item ${filterMaterial === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMaterial('all')}
            >
              <span className="sidebar-item-left">
                <span className="sidebar-item-label">Alle</span>
              </span>
              <span className="sidebar-badge">{totalQty}</span>
            </div>
            {(stats?.by_material ?? []).map(({ material, count }) => (
              <div
                key={material}
                className={`sidebar-item ${filterMaterial === material ? 'active' : ''}`}
                onClick={() => setFilterMaterial(prev => prev === material ? 'all' : material)}
              >
                <span className="sidebar-item-left">
                  <span
                    className="mat-dot"
                    style={{ background: MATERIAL_COLORS[material] ?? '#94a3b8' }}
                  />
                  <span className="sidebar-item-label">{material}</span>
                </span>
                <span className="sidebar-badge">{count}</span>
              </div>
            ))}
          </div>

          {(stats?.by_manufacturer ?? []).length > 0 && (
            <div className="sidebar-section">
              <div className="sidebar-title">Hersteller</div>
              <div
                className={`sidebar-item ${filterManufacturer === 'all' ? 'active' : ''}`}
                onClick={() => setFilterManufacturer('all')}
              >
                <span className="sidebar-item-left">
                  <span className="sidebar-item-label">Alle</span>
                </span>
              </div>
              {(stats?.by_manufacturer ?? []).map(({ manufacturer, count }) => (
                <div
                  key={manufacturer}
                  className={`sidebar-item ${filterManufacturer === manufacturer ? 'active' : ''}`}
                  onClick={() => setFilterManufacturer(prev => prev === manufacturer ? 'all' : manufacturer)}
                >
                  <span className="sidebar-item-left">
                    <span className="sidebar-item-label">{manufacturer}</span>
                  </span>
                  <span className="sidebar-badge">{count}</span>
                </div>
              ))}
            </div>
          )}

          {(stats?.locations ?? []).length > 0 && (
            <div className="sidebar-section">
              <div className="sidebar-title">Lagerort</div>
              <div
                className={`sidebar-item ${filterLocation === 'all' ? 'active' : ''}`}
                onClick={() => setFilterLocation('all')}
              >
                <span className="sidebar-item-left">
                  <span className="sidebar-item-label">Alle</span>
                </span>
              </div>
              {(stats?.by_location ?? []).map(({ storage_location, count }) => (
                <div
                  key={storage_location}
                  className={`sidebar-item ${filterLocation === storage_location ? 'active' : ''}`}
                  onClick={() => setFilterLocation(prev => prev === storage_location ? 'all' : storage_location)}
                >
                  <span className="sidebar-item-left">
                    <span className="sidebar-item-label">{storage_location}</span>
                  </span>
                  <span className="sidebar-badge">{count}</span>
                </div>
              ))}
            </div>
          )}

          <div className="sidebar-footer">
            <div>{totalQty} Spule{totalQty !== 1 ? 'n' : ''} gesamt</div>
            <div>{stats?.total_types ?? 0} Filament{(stats?.total_types ?? 0) !== 1 ? 'sorten' : 'sorte'}</div>
          </div>
        </nav>

        {/* Main content */}
        <main className="content">
          <div className="toolbar">
            <span className="results-count">
              {filtered.length === spools.length
                ? `${filtered.length} Einträge`
                : `${filtered.length} von ${spools.length} Einträgen`}
            </span>
          </div>

          {loading ? null : filtered.length === 0 ? (
            <div className="empty">
              <EmptyBoxIcon />
              {spools.length === 0 ? (
                <>
                  <h3>Keine Spulen vorhanden</h3>
                  <p>Füge deine erste Filamentspule hinzu, um mit der Verwaltung zu beginnen.</p>
                  <button className="btn btn-primary" onClick={openAdd}>
                    <PlusIcon /> Erste Spule hinzufügen
                  </button>
                </>
              ) : (
                <>
                  <h3>Keine Treffer</h3>
                  <p>Keine Spulen gefunden, die dem Suchbegriff oder Filter entsprechen.</p>
                </>
              )}
            </div>
          ) : (
            <div className="spool-grid">
              {filtered.map(spool => (
                <SpoolCard
                  key={spool.id}
                  spool={spool}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit modal */}
      {isModalOpen && (
        <SpoolModal
          spool={editingSpool}
          onSave={handleSave}
          onClose={() => { setIsModalOpen(false); setEditingSpool(null) }}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget !== null && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Spule löschen?</h3>
            <p>
              Diese Spule wird dauerhaft aus der Datenbank entfernt.
              Dieser Vorgang kann nicht rückgängig gemacht werden.
            </p>
            <div className="confirm-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>
                Abbrechen
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'

interface Spool {
  id: number
  manufacturer: string
  material: string
  color: string
  color_hex: string
  weight_g: number
  quantity: number
  nozzle_temp_min: number
  nozzle_temp_max: number
  bed_temp_min: number
  bed_temp_max: number
  storage_location: string
  notes: string
  created_at: string
  updated_at: string
}

interface DbData {
  next_id: number
  spools: Spool[]
}

let dbPath: string | null = null
let cache: DbData | null = null

function getDbPath(): string {
  if (!dbPath) {
    dbPath = join(app.getPath('userData'), 'spoolinv.json')
  }
  return dbPath
}

function load(): DbData {
  if (cache) return cache
  const path = getDbPath()
  if (!existsSync(path)) {
    cache = { next_id: 1, spools: [] }
    return cache
  }
  try {
    cache = JSON.parse(readFileSync(path, 'utf-8')) as DbData
  } catch {
    cache = { next_id: 1, spools: [] }
  }
  return cache
}

function save(data: DbData): void {
  cache = data
  writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8')
}

export function getAllSpools(): Spool[] {
  const data = load()
  return [...data.spools].sort((a, b) => {
    if (a.material !== b.material) return a.material.localeCompare(b.material)
    if (a.manufacturer !== b.manufacturer) return a.manufacturer.localeCompare(b.manufacturer)
    return a.color.localeCompare(b.color)
  })
}

export function addSpool(input: Omit<Spool, 'id' | 'created_at' | 'updated_at'>): Spool {
  const data = load()
  const now = new Date().toISOString()
  const spool: Spool = { ...input, id: data.next_id++, created_at: now, updated_at: now }
  data.spools.push(spool)
  save(data)
  return spool
}

export function updateSpool(id: number, input: Omit<Spool, 'id' | 'created_at' | 'updated_at'>): Spool | null {
  const data = load()
  const idx = data.spools.findIndex(s => s.id === id)
  if (idx === -1) return null
  data.spools[idx] = { ...data.spools[idx], ...input, id, updated_at: new Date().toISOString() }
  save(data)
  return data.spools[idx]
}

export function deleteSpool(id: number): void {
  const data = load()
  data.spools = data.spools.filter(s => s.id !== id)
  save(data)
}

export function getStats() {
  const spools = load().spools

  const totalQuantity = spools.reduce((s, sp) => s + sp.quantity, 0)
  const totalTypes = spools.length

  const byMaterialMap = new Map<string, number>()
  const byLocationMap = new Map<string, number>()

  for (const sp of spools) {
    byMaterialMap.set(sp.material, (byMaterialMap.get(sp.material) ?? 0) + sp.quantity)
    if (sp.storage_location) {
      byLocationMap.set(sp.storage_location, (byLocationMap.get(sp.storage_location) ?? 0) + sp.quantity)
    }
  }

  const by_material = [...byMaterialMap.entries()]
    .map(([material, count]) => ({ material, count }))
    .sort((a, b) => b.count - a.count)

  const by_location = [...byLocationMap.entries()]
    .map(([storage_location, count]) => ({ storage_location, count }))
    .sort((a, b) => b.count - a.count)

  const byManufacturerMap = new Map<string, number>()
  for (const sp of spools) {
    if (sp.manufacturer) {
      byManufacturerMap.set(sp.manufacturer, (byManufacturerMap.get(sp.manufacturer) ?? 0) + sp.quantity)
    }
  }
  const by_manufacturer = [...byManufacturerMap.entries()]
    .map(([manufacturer, count]) => ({ manufacturer, count }))
    .sort((a, b) => a.manufacturer.localeCompare(b.manufacturer))

  const manufacturers = by_manufacturer.map(r => r.manufacturer)
  const locations = [...new Set(spools.map(s => s.storage_location).filter(Boolean))].sort()

  return { total_quantity: totalQuantity, total_types: totalTypes, by_material, by_location, by_manufacturer, manufacturers, locations }
}

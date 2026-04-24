export interface Spool {
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

export type SpoolInput = Omit<Spool, 'id' | 'created_at' | 'updated_at'>

export interface Stats {
  total_quantity: number
  total_types: number
  by_material: Array<{ material: string; count: number }>
  by_location: Array<{ storage_location: string; count: number }>
  by_manufacturer: Array<{ manufacturer: string; count: number }>
  manufacturers: string[]
  locations: string[]
}

export const MATERIALS = [
  'PLA', 'PLA+', 'ABS', 'ASA', 'PETG', 'TPU', 'FLEX',
  'Nylon (PA)', 'PC', 'HIPS', 'PVA', 'CF-PLA', 'Sonstige'
] as const

export const MATERIAL_COLORS: Record<string, string> = {
  'PLA':        '#4ade80',
  'PLA+':       '#22c55e',
  'ABS':        '#fb923c',
  'ASA':        '#f97316',
  'PETG':       '#60a5fa',
  'TPU':        '#a78bfa',
  'FLEX':       '#c084fc',
  'Nylon (PA)': '#f472b6',
  'PC':         '#22d3ee',
  'HIPS':       '#facc15',
  'PVA':        '#fb7185',
  'CF-PLA':     '#6b7280',
  'Sonstige':   '#94a3b8'
}

export const MATERIAL_DEFAULTS: Record<string, { nozzleMin: number; nozzleMax: number; bedMin: number; bedMax: number }> = {
  'PLA':        { nozzleMin: 190, nozzleMax: 220, bedMin: 20,  bedMax: 60  },
  'PLA+':       { nozzleMin: 200, nozzleMax: 230, bedMin: 20,  bedMax: 60  },
  'ABS':        { nozzleMin: 220, nozzleMax: 250, bedMin: 100, bedMax: 110 },
  'ASA':        { nozzleMin: 240, nozzleMax: 260, bedMin: 90,  bedMax: 110 },
  'PETG':       { nozzleMin: 230, nozzleMax: 250, bedMin: 70,  bedMax: 85  },
  'TPU':        { nozzleMin: 210, nozzleMax: 235, bedMin: 20,  bedMax: 60  },
  'FLEX':       { nozzleMin: 210, nozzleMax: 235, bedMin: 20,  bedMax: 60  },
  'Nylon (PA)': { nozzleMin: 245, nozzleMax: 270, bedMin: 70,  bedMax: 90  },
  'PC':         { nozzleMin: 270, nozzleMax: 310, bedMin: 100, bedMax: 130 },
  'HIPS':       { nozzleMin: 230, nozzleMax: 240, bedMin: 100, bedMax: 110 },
  'PVA':        { nozzleMin: 180, nozzleMax: 200, bedMin: 45,  bedMax: 60  },
  'CF-PLA':     { nozzleMin: 200, nozzleMax: 230, bedMin: 20,  bedMax: 60  },
  'Sonstige':   { nozzleMin: 200, nozzleMax: 240, bedMin: 50,  bedMax: 80  }
}

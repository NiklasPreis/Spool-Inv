import type { Spool, SpoolInput, Stats } from '../renderer/src/types/filament'

declare global {
  interface Window {
    api: {
      spools: {
        getAll: () => Promise<Spool[]>
        add: (spool: SpoolInput) => Promise<Spool>
        update: (id: number, spool: SpoolInput) => Promise<Spool>
        delete: (id: number) => Promise<void>
        getStats: () => Promise<Stats>
      }
    }
  }
}

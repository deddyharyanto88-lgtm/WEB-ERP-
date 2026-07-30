'use client'

import { useState } from 'react'
import Link from 'next/link'

const entities = [
  'Global Consolidation',
  'North Region Ops',
  'South Region Ops',
  'Logistics Entity',
]

export default function TopNav({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [entity, setEntity] = useState(entities[0])

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface border-b border-border px-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-xl hover:bg-surface-container-low transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[24px] text-on-surface-variant">menu</span>
        </button>

        <div className="relative w-full max-w-md hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Global Search (Entities, Projects, Invoices)..."
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <div className="hidden md:flex items-center gap-2 mr-2 border-r border-border pr-4">
          <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">
            Entity:
          </span>
          <select
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer py-1"
          >
            {entities.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <button className="p-2 rounded-xl hover:bg-surface-container-low transition-colors relative">
          <span className="material-symbols-outlined text-[22px] text-on-surface-variant">
            notifications
          </span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-surface" />
        </button>

        <button className="p-2 rounded-xl hover:bg-surface-container-low transition-colors hidden sm:flex">
          <span className="material-symbols-outlined text-[22px] text-on-surface-variant">
            history_edu
          </span>
        </button>

        <button className="p-2 rounded-xl hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined text-[22px] text-on-surface-variant">
            account_circle
          </span>
        </button>
      </div>
    </header>
  )
}

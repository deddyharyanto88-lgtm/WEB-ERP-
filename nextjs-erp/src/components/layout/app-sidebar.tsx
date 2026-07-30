'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/estimation', label: 'Estimation', icon: 'calculate' },
  { href: '/operation', label: 'Operation', icon: 'construction' },
  { href: '/procurement', label: 'Procurement', icon: 'shopping_cart' },
  { href: '/finance', label: 'Finance', icon: 'payments' },
  { href: '/hr', label: 'HR', icon: 'groups' },
  { href: '/qhse', label: 'QHSSE', icon: 'security' },
  { href: '/risk', label: 'Risk Management', icon: 'warning' },
]

export default function AppSidebar({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-lg font-bold text-primary tracking-tight">Mini-ERP Pro</h1>
          <p className="text-[11px] text-secondary font-semibold uppercase tracking-wider mt-0.5">
            Multi-Entity Manager
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-secondary hover:bg-surface-container-low'
                  }
                `}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 space-y-1 border-t border-border mt-auto">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-secondary hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </Link>
          <Link
            href="/support"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-secondary hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span>Support</span>
          </Link>

          <div className="mt-4 px-3 flex items-center gap-3 py-3 border-t border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              JD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-on-surface truncate">John Director</p>
              <p className="text-[11px] text-secondary truncate">Executive HQ</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

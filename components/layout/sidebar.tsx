'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useUser } from '@/lib/user-context'
import {
  LayoutDashboard,
  Briefcase,
  Heart,
  Sparkles,
  Settings,
  ChevronRight,
  ChevronDown,
  Zap,
  Target,
  BarChart3,
  Calendar,
  CheckSquare,
  TrendingUp,
  Smile,
  BookOpen,
  Dumbbell,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const bizboxChildren = [
  { title: 'Tasks', href: '/dashboard/bizbox/tasks', icon: CheckSquare },
  { title: 'Revenue', href: '/dashboard/bizbox/revenue', icon: TrendingUp },
  { title: 'Projects', href: '/dashboard/bizbox/projects', icon: Target },
  { title: 'Calendar', href: '/dashboard/bizbox/calendar', icon: Calendar },
  { title: 'Analytics', href: '/dashboard/bizbox/analytics', icon: BarChart3 },
]

const lifebudChildren = [
  { title: 'Habits', href: '/dashboard/lifebud/habits', icon: Zap },
  { title: 'Goals', href: '/dashboard/lifebud/goals', icon: Target },
  { title: 'Mood', href: '/dashboard/lifebud/mood', icon: Smile },
  { title: 'Journal', href: '/dashboard/lifebud/journal', icon: BookOpen },
  { title: 'Fitness', href: '/dashboard/lifebud/fitness', icon: Dumbbell },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()

  const isBizboxActive = pathname.startsWith('/dashboard/bizbox')
  const isLifebudActive = pathname.startsWith('/dashboard/lifebud')

  const [bizboxOpen, setBizboxOpen] = useState(isBizboxActive)
  const [lifebudOpen, setLifebudOpen] = useState(isLifebudActive)

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const handleBizboxClick = () => {
    if (!bizboxOpen) {
      setBizboxOpen(true)
      router.push('/dashboard/bizbox')
    } else {
      router.push('/dashboard/bizbox')
    }
  }

  const handleLifebudClick = () => {
    if (!lifebudOpen) {
      setLifebudOpen(true)
      router.push('/dashboard/lifebud')
    } else {
      router.push('/dashboard/lifebud')
    }
  }

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-thrive-purple to-thrive-blue flex items-center justify-center shadow-thrive">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gradient-purple">ThriveOS</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {/* Overview */}
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
            pathname === '/dashboard'
              ? 'bg-thrive-purple-soft text-thrive-purple'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <LayoutDashboard className={cn('w-4 h-4', pathname === '/dashboard' ? 'text-thrive-purple' : 'text-gray-400')} />
          Overview
        </Link>

        {/* Bizbox */}
        <div className="space-y-0.5">
          <div
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer select-none transition-all duration-150',
              isBizboxActive ? 'text-gray-900 bg-thrive-blue-soft' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            )}
          >
            {/* Clicking the label/icon navigates to Bizbox overview */}
            <button
              onClick={handleBizboxClick}
              className="flex items-center gap-3 flex-1 text-left"
            >
              <Briefcase className={cn('w-4 h-4', isBizboxActive ? 'text-thrive-blue' : 'text-gray-400')} />
              <span className="flex-1">Bizbox</span>
              <Badge variant="blue" className="text-[10px] px-1.5 py-0">Business</Badge>
            </button>
            {/* Arrow toggles the dropdown */}
            <button
              onClick={e => { e.stopPropagation(); setBizboxOpen(o => !o) }}
              className="p-0.5 rounded hover:bg-gray-200 transition-colors"
            >
              {bizboxOpen
                ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              }
            </button>
          </div>

          {bizboxOpen && (
            <div className="ml-4 pl-3 border-l border-gray-100 space-y-0.5">
              {bizboxChildren.map((child) => {
                const isActive = pathname === child.href
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                      isActive
                        ? 'bg-thrive-purple-soft text-thrive-purple font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    )}
                  >
                    <child.icon className={cn('w-3.5 h-3.5', isActive ? 'text-thrive-purple' : 'text-gray-400')} />
                    {child.title}
                    {isActive && <ChevronRight className="w-3 h-3 ml-auto text-thrive-purple" />}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Lifebud */}
        <div className="space-y-0.5">
          <div
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer select-none transition-all duration-150',
              isLifebudActive ? 'text-gray-900 bg-thrive-pink-soft' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            )}
          >
            <button
              onClick={handleLifebudClick}
              className="flex items-center gap-3 flex-1 text-left"
            >
              <Heart className={cn('w-4 h-4', isLifebudActive ? 'text-thrive-pink' : 'text-gray-400')} />
              <span className="flex-1">Lifebud</span>
              <Badge variant="pink" className="text-[10px] px-1.5 py-0">Life</Badge>
            </button>
            <button
              onClick={e => { e.stopPropagation(); setLifebudOpen(o => !o) }}
              className="p-0.5 rounded hover:bg-gray-200 transition-colors"
            >
              {lifebudOpen
                ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              }
            </button>
          </div>

          {lifebudOpen && (
            <div className="ml-4 pl-3 border-l border-gray-100 space-y-0.5">
              {lifebudChildren.map((child) => {
                const isActive = pathname === child.href
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                      isActive
                        ? 'bg-thrive-purple-soft text-thrive-purple font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    )}
                  >
                    <child.icon className={cn('w-3.5 h-3.5', isActive ? 'text-thrive-purple' : 'text-gray-400')} />
                    {child.title}
                    {isActive && <ChevronRight className="w-3 h-3 ml-auto text-thrive-purple" />}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-gradient-to-br from-thrive-purple to-thrive-blue text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">Free Plan</p>
          </div>
          <Settings className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </aside>
  )
}

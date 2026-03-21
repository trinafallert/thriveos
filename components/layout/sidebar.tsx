'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Briefcase,
  Heart,
  Sparkles,
  Settings,
  ChevronRight,
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

const navItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Bizbox',
    icon: Briefcase,
    badge: 'Business',
    color: 'text-thrive-blue',
    children: [
      { title: 'Tasks', href: '/dashboard/bizbox/tasks', icon: CheckSquare },
      { title: 'Revenue', href: '/dashboard/bizbox/revenue', icon: TrendingUp },
      { title: 'Projects', href: '/dashboard/bizbox/projects', icon: Target },
      { title: 'Calendar', href: '/dashboard/bizbox/calendar', icon: Calendar },
      { title: 'Analytics', href: '/dashboard/bizbox/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Lifebud',
    icon: Heart,
    badge: 'Life',
    color: 'text-thrive-pink',
    children: [
      { title: 'Habits', href: '/dashboard/lifebud/habits', icon: Zap },
      { title: 'Goals', href: '/dashboard/lifebud/goals', icon: Target },
      { title: 'Mood', href: '/dashboard/lifebud/mood', icon: Smile },
      { title: 'Journal', href: '/dashboard/lifebud/journal', icon: BookOpen },
      { title: 'Fitness', href: '/dashboard/lifebud/fitness', icon: Dumbbell },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

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
        {navItems.map((item) => {
          if (!item.children) {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-thrive-purple-soft text-thrive-purple'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className={cn('w-4 h-4', isActive ? 'text-thrive-purple' : 'text-gray-400')} />
                {item.title}
              </Link>
            )
          }

          const isGroupActive = item.children.some(c => pathname === c.href)

          return (
            <div key={item.title} className="space-y-0.5">
              <div className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold',
                isGroupActive ? 'text-gray-900' : 'text-gray-500'
              )}>
                <item.icon className={cn('w-4 h-4', item.color || 'text-gray-400')} />
                <span className="flex-1">{item.title}</span>
                <Badge variant={item.badge === 'Business' ? 'blue' : 'pink'} className="text-[10px] px-1.5 py-0">
                  {item.badge}
                </Badge>
              </div>
              <div className="ml-4 pl-3 border-l border-gray-100 space-y-0.5">
                {item.children.map((child) => {
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
            </div>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs">U</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">User</p>
            <p className="text-xs text-gray-500 truncate">Free Plan</p>
          </div>
          <Settings className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </aside>
  )
}

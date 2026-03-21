'use client'

import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Briefcase,
  CheckSquare,
  TrendingUp,
  Target,
  Calendar,
  BarChart3,
  ArrowUpRight,
  Plus,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@/lib/user-context'

const projects = [
  {
    name: 'Website Redesign',
    status: 'In Progress',
    progress: 68,
    tasks: 12,
    dueDate: 'Apr 15',
    color: 'bg-thrive-blue',
    badgeVariant: 'blue' as const,
  },
  {
    name: 'Product Launch',
    status: 'Planning',
    progress: 25,
    tasks: 8,
    dueDate: 'May 1',
    color: 'bg-thrive-purple',
    badgeVariant: 'purple' as const,
  },
  {
    name: 'Q2 Sales Campaign',
    status: 'In Progress',
    progress: 45,
    tasks: 6,
    dueDate: 'Mar 31',
    color: 'bg-thrive-teal',
    badgeVariant: 'teal' as const,
  },
  {
    name: 'Investor Deck',
    status: 'Review',
    progress: 90,
    tasks: 3,
    dueDate: 'Mar 25',
    color: 'bg-thrive-gold',
    badgeVariant: 'gold' as const,
  },
]

const quickStats = [
  { label: 'Open Tasks', value: '14', icon: CheckSquare, color: 'text-thrive-blue', bg: 'bg-thrive-blue-soft' },
  { label: 'Revenue MTD', value: '$38K', icon: TrendingUp, color: 'text-thrive-teal', bg: 'bg-thrive-teal-light' },
  { label: 'Active Projects', value: '4', icon: Target, color: 'text-thrive-purple', bg: 'bg-thrive-purple-soft' },
  { label: 'Upcoming Events', value: '3', icon: Calendar, color: 'text-thrive-gold', bg: 'bg-thrive-gold-light' },
]

const sections = [
  { label: 'Tasks', href: '/dashboard/bizbox/tasks', icon: CheckSquare, desc: 'Manage your daily work', color: 'text-thrive-blue', bg: 'bg-thrive-blue-soft' },
  { label: 'Revenue', href: '/dashboard/bizbox/revenue', icon: TrendingUp, desc: 'Track income & goals', color: 'text-thrive-teal', bg: 'bg-thrive-teal-light' },
  { label: 'Projects', href: '/dashboard/bizbox/projects', icon: Target, desc: 'All your projects', color: 'text-thrive-purple', bg: 'bg-thrive-purple-soft' },
  { label: 'Calendar', href: '/dashboard/bizbox/calendar', icon: Calendar, desc: 'Meetings & deadlines', color: 'text-thrive-pink', bg: 'bg-thrive-pink-soft' },
  { label: 'Analytics', href: '/dashboard/bizbox/analytics', icon: BarChart3, desc: 'Data & insights', color: 'text-thrive-gold', bg: 'bg-thrive-gold-light' },
]

export default function BizboxOverviewPage() {
  const { user } = useUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Header subtitle="Your business command center" />
      <main className="flex-1 p-8 space-y-8">

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map(stat => (
            <Card key={stat.label} hover>
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-thrive-blue" />
                    <CardTitle className="text-base">Your Projects</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/dashboard/bizbox/projects">
                      <Button variant="ghost" size="sm" className="text-xs h-7">View all</Button>
                    </Link>
                    <Button size="icon" variant="outline" className="w-7 h-7 rounded-lg">
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map(project => (
                  <div key={project.name} className="p-4 rounded-2xl border border-gray-100 hover:border-thrive-purple/20 hover:shadow-sm transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${project.color}`} />
                        <span className="text-sm font-semibold text-gray-800">{project.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={project.badgeVariant} className="text-[10px]">{project.status}</Badge>
                        <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-thrive-purple transition-colors" />
                      </div>
                    </div>
                    <Progress value={project.progress} className="h-1.5 mb-2" />
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{project.tasks} tasks remaining</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due {project.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map(section => (
                  <Link key={section.label} href={section.href}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className={`w-9 h-9 rounded-xl ${section.bg} flex items-center justify-center`}>
                        <section.icon className={`w-4 h-4 ${section.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">{section.label}</div>
                        <div className="text-xs text-gray-400">{section.desc}</div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-thrive-purple transition-colors" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Business Goals from onboarding */}
            {user.bizGoals?.some(g => g.trim()) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Your Business Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {user.bizGoals.filter(g => g.trim()).map((goal, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-thrive-blue-soft border border-thrive-blue/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-thrive-blue">{i + 1}</span>
                      </div>
                      <span className="text-sm text-gray-700 leading-relaxed">{goal}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

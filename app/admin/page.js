'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  MessageSquare,
  Building2,
  Activity,
  BookOpen,
  ExternalLink,
  Loader2,
  ChevronRight,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const RANGE_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'custom', label: 'Custom' }
]

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [range, setRange] = useState('today')
  const [customFrom, setCustomFrom] = useState(new Date().toISOString().split('T')[0])
  const [customTo, setCustomTo] = useState(new Date().toISOString().split('T')[0])
  const router = useRouter()

  const fetchStats = async (rangeToUse = range) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      let url = `${process.env.NEXT_PUBLIC_API_URL}/dashboard-stats.php?range=${rangeToUse}`
      if (rangeToUse === 'custom') {
        url += `&from=${customFrom}&to=${customTo}`
      }
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.status === 'success') {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    } else {
      setMounted(true)
      fetchStats()
    }
  }, [router])

  useEffect(() => {
    if (mounted) {
      fetchStats(range)
    }
  }, [range])

  const handleRangeChange = (newRange) => {
    setRange(newRange)
  }

  const handleApplyCustom = () => {
    fetchStats('custom')
  }

  if (!mounted) return null

  const statCards = [
    {
      label: "ENQUIRIES",
      value: stats?.enquiries?.total ?? "0",
      subtext: stats?.enquiries?.new > 0 ? `${stats.enquiries.new} new` : "Contact requests",
      icon: MessageSquare,
      iconBg: "bg-blue-600",
      href: "/admin/enquiries",
      badgeColor: "bg-blue-100 text-blue-600"
    },
    {
      label: "LEADS",
      value: stats?.leads?.total ?? "0",
      subtext: "Business quotes",
      icon: Building2,
      iconBg: "bg-purple-500",
      href: "/admin/business-enquiries",
      badgeColor: "bg-purple-100 text-purple-600"
    },
    {
      label: "VISITORS",
      value: stats?.visitors?.total ?? "0",
      subtext: "Site visits",
      icon: Activity,
      iconBg: "bg-orange-500",
      href: "/admin/footfall",
      badgeColor: "bg-orange-100 text-orange-600"
    },
    {
      label: "BLOGS",
      value: stats?.blogs?.count ?? "0",
      subtext: "Published posts",
      icon: BookOpen,
      iconBg: "bg-emerald-500",
      href: "/admin/blogs",
      badgeColor: "bg-emerald-100 text-emerald-600"
    }
  ]

  // Build chart data from visitor history
  const visitorHistory = stats?.visitors?.history ?? []
  let chartData = []
  if (range === 'today') {
    chartData = visitorHistory.length
      ? [{ 
          date: visitorHistory[0].visit_date || new Date().toISOString().split('T')[0], 
          count: parseInt(visitorHistory[0].count, 10), 
          label: 'Today' 
        }]
      : [{ date: new Date().toISOString().split('T')[0], count: 0, label: 'Today' }]
  } else if (range === 'week' || range === 'month' || range === 'custom') {
    const days = range === 'week' ? 7 : range === 'month' ? 30 : 
      Math.max(1, Math.ceil((new Date(customTo) - new Date(customFrom)) / (1000 * 60 * 60 * 24)) + 1)
    
    // Use UTC for date calculations to avoid timezone shifts during the loop
    const start = range === 'custom' ? new Date(customFrom + 'T00:00:00') : new Date()
    if (range !== 'custom') start.setDate(start.getDate() - (days - 1))
    
    for (let i = 0; i < Math.min(days, 31); i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      const dateStr = d.toISOString().split('T')[0]
      const found = visitorHistory.find(h => h.visit_date === dateStr)
      chartData.push({
        date: dateStr,
        count: found ? parseInt(found.count, 10) : 0,
        label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      })
    }
  }
  const maxCount = Math.max(...chartData.map(d => d.count), 1)

  const getRangeLabel = () => {
    if (range === 'today') return 'Today'
    if (range === 'week') return 'Last 7 Days'
    if (range === 'month') return 'Last 30 Days'
    return `${customFrom} to ${customTo}`
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500">Enquiries, leads, visitors and content at a glance.</p>
        </div>

        {/* Date Range Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleRangeChange(opt.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  range === opt.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {range === 'custom' && (
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium"
              />
              <button
                type="button"
                onClick={handleApplyCustom}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:brightness-110"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={stat.href}>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${stat.iconBg}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${stat.badgeColor}`}>
                    View
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                </div>
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs font-semibold text-gray-500">{stat.subtext}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Visitors Graph */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Visitors <span className="text-gray-400 font-normal text-sm ml-2">({getRangeLabel()})</span>
          </h3>
          <Link
            href="/admin/footfall"
            className="text-sm font-bold text-primary hover:underline"
          >
            Full Report
          </Link>
        </div>

        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="h-[200px] w-full flex items-end justify-between gap-1 overflow-x-auto">
            {chartData.map((day, idx) => (
              <div key={day.date || idx} className="flex-1 min-w-[32px] flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 min-h-[4px]"
                  style={{ height: `${Math.max(4, (day.count / maxCount) * 160)}px` }}
                />
                <span className="text-[10px] text-gray-400 font-medium mt-2 truncate w-full text-center">
                  {day.label}
                </span>
                <span className="text-[9px] text-gray-500">{day.count}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Blogs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Recent Blogs
          </h3>
          <Link
            href="/admin/blogs"
            className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
          >
            View All ({stats?.blogs?.count ?? 0})
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.blogs?.recent?.length > 0 ? (
          <div className="space-y-3">
            {stats.blogs.recent.map((blog) => (
              <Link
                key={blog.id}
                href={`/admin/blogs/edit/${blog.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
              >
                <span className="font-medium text-gray-800 group-hover:text-primary truncate pr-2">
                  {blog.title}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm py-4">No blogs yet. <Link href="/admin/blogs/new" className="text-primary font-bold hover:underline">Create your first blog</Link></p>
        )}
      </motion.div>
    </div>
  )
}

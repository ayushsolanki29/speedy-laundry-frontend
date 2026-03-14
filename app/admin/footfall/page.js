'use client'

import { useState, useEffect } from 'react'
import {
    Users,
    MousePointer2,
    Globe,
    Monitor,
    Calendar,
    Loader2,
    RefreshCcw,
    Layout,
    Activity,
    Smartphone
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function FootfallPage() {
    const [stats, setStats] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [range, setRange] = useState('today')
    const [customDates, setCustomDates] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    })

    const fetchStats = async (selectedRange = range) => {
        setIsLoading(true)
        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/footfall-stats.php?range=${selectedRange}`
            if (selectedRange === 'custom') {
                url += `&from=${customDates.from}&to=${customDates.to}`
            }
            const response = await fetch(url)
            const data = await response.json()
            if (data.status === 'success') {
                setStats(data.data)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to load footfall statistics')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStats(range)
    }, [range])

    // Re-fetch when custom dates change and range is custom
    useEffect(() => {
        if (range === 'custom') {
            fetchStats('custom')
        }
    }, [customDates, range]) // Added range to dependencies to ensure it re-fetches if range becomes 'custom' while customDates are already set.

    const getDeviceIcon = (ua) => {
        if (!ua) return <Monitor className="w-4 h-4" />
        if (/mobile/i.test(ua)) return <Smartphone className="w-4 h-4" />
        if (/tablet/i.test(ua)) return <Layout className="w-4 h-4" />
        return <Monitor className="w-4 h-4" />
    }

    const formatUA = (ua) => {
        if (!ua) return 'Unknown Device'
        if (ua.includes('Chrome')) return 'Google Chrome'
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Apple Safari'
        if (ua.includes('Firefox')) return 'Mozilla Firefox'
        if (ua.includes('Edg')) return 'Microsoft Edge'
        return 'Standard Browser'
    }

    if (isLoading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-medium text-sm">Analyzing footfall data...</p>
            </div>
        )
    }

    const filterOptions = [
        { id: 'today', label: 'Today' },
        { id: 'yesterday', label: 'Yesterday' },
        { id: 'week', label: '7 Days' },
        { id: 'month', label: '30 Days' },
        { id: 'custom', label: 'Custom' },
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Traffic Analysis</h1>
                    <p className="text-gray-500">Monitor your website's organic footfall and engagement metrics.</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 self-start md:self-auto border border-gray-200/50">
                        {filterOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setRange(option.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${range === option.id
                                    ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                                    : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                        <div className="w-px h-4 bg-gray-200 mx-1" />
                        <button
                            onClick={() => fetchStats(range)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-white rounded-lg active:scale-95"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {range === 'custom' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm"
                        >
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">From</span>
                                <input
                                    type="date"
                                    value={customDates.from}
                                    onChange={(e) => setCustomDates(prev => ({ ...prev, from: e.target.value }))}
                                    className="bg-transparent border-none p-0 text-xs font-bold text-gray-700 focus:ring-0 cursor-pointer"
                                />
                            </div>
                            <div className="w-2 h-px bg-gray-200" />
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">To</span>
                                <input
                                    type="date"
                                    value={customDates.to}
                                    onChange={(e) => setCustomDates(prev => ({ ...prev, to: e.target.value }))}
                                    className="bg-transparent border-none p-0 text-xs font-bold text-gray-700 focus:ring-0 cursor-pointer"
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        label: 'UNIQUE VISITORS',
                        value: stats?.total_visits || 0,
                        icon: Users,
                        iconBg: 'bg-blue-600',
                        subtext: 'Unique IP Addresses',
                        badge: 'LIVE',
                        badgeColor: 'bg-blue-100 text-blue-600'
                    },
                    {
                        label: 'TOTAL SESSIONS',
                        value: stats?.recent_logs?.length || 0,
                        icon: MousePointer2,
                        iconBg: 'bg-purple-500',
                        subtext: 'Recorded interactions',
                        badge: 'STREAMS',
                        badgeColor: 'bg-purple-100 text-purple-600'
                    },
                    {
                        label: 'ENGAGEMENT',
                        value: 'High',
                        icon: Activity,
                        iconBg: 'bg-green-500',
                        subtext: 'Based on density',
                        badge: 'PEAK',
                        badgeColor: 'bg-green-100 text-green-600'
                    },
                    {
                        label: 'GEOGRAPHY',
                        value: 'Local',
                        icon: Globe,
                        iconBg: 'bg-orange-500',
                        subtext: 'Traffic source origin',
                        badge: 'REACH',
                        badgeColor: 'bg-orange-100 text-orange-600'
                    },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${stat.iconBg}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${stat.badgeColor}`}>
                                {stat.badge}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stat.value.toLocaleString()}</h3>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50">
                            <p className="text-xs text-gray-400 font-medium">{stat.subtext}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="pt-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="font-bold text-lg text-gray-800">Recent Activity Stream</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-gray-400">Live Updates</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Visitor / Source</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Environment</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats?.recent_logs.length > 0 ? (
                                    stats.recent_logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50/30 transition-all duration-200 group">
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                        <Users className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{log.ip_address}</p>
                                                        <p className="text-[10px] text-gray-400 uppercase">Verified Endpoint</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-gray-400">
                                                        {getDeviceIcon(log.user_agent)}
                                                    </div>
                                                    <span className="text-xs text-gray-600 font-medium">{formatUA(log.user_agent)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <p className="text-sm font-bold text-gray-800">
                                                    {new Date(log.created_at_iso || log.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Europe/London' })}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">
                                                    {new Date(log.created_at_iso || log.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', timeZone: 'Europe/London' })}
                                                </p>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center">
                                            <p className="text-gray-400 italic text-sm">No activity recorded for this period.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

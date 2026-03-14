'use client'

import { useState, useEffect } from 'react'
import { 
    Mail, 
    Calendar, 
    RefreshCcw, 
    Loader2, 
    CheckCircle2, 
    AlertCircle, 
    Clock, 
    Send, 
    Trash2,
    Search,
    Filter,
    ChevronDown,
    ExternalLink
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Pagination from '@/components/ui/Pagination'
import { Suspense } from 'react'

function EmailQueueContent() {
    const [queue, setQueue] = useState([])
    const [stats, setStats] = useState({ pending: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isCleaning, setIsCleaning] = useState(false)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const searchTerm = searchParams.get('search') || ''
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = 20

    const fetchQueue = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-email-queue.php`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            })
            const data = await response.json()
            if (data.status === 'success') {
                setQueue(data.data.items)
                setStats(data.data.stats)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Fetch error:', error)
            toast.error('Failed to load email queue')
        } finally {
            setIsLoading(false)
        }
    }

    const processQueue = async () => {
        if (isProcessing) return
        setIsProcessing(true)
        const toastId = toast.loading('Processing pending emails...')
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-email-queue.php`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            if (data.status === 'success') {
                toast.success(data.message, { id: toastId })
                fetchQueue()
            } else {
                toast.error(data.message, { id: toastId })
            }
        } catch (error) {
            console.error('Processing error:', error)
            toast.error('Failed to process queue', { id: toastId })
        } finally {
            setIsProcessing(false)
        }
    }

    const cleanupQueue = async () => {
        if (!confirm('Are you sure you want to clear processed logs older than 30 days?')) return
        setIsCleaning(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-email-queue.php`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            })
            const data = await response.json()
            if (data.status === 'success') {
                toast.success(data.message)
                fetchQueue()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to cleanup queue')
        } finally {
            setIsCleaning(false)
        }
    }

    const deleteItem = async (id) => {
        if (!confirm('Are you sure you want to delete this email from the queue?')) return
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-email-queue.php?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            })
            const data = await response.json()
            if (data.status === 'success') {
                toast.success('Email deleted from queue')
                fetchQueue()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to delete email')
        }
    }

    useEffect(() => {
        fetchQueue()
    }, [])

    const filteredQueue = queue.filter(item => {
        return item.to_email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
               item.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.type?.toLowerCase().includes(searchTerm.toLowerCase())
    })

    const formatDate = (dateString) => {
        if (!dateString) return '-'
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Europe/London'
        });
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'sent': return 'bg-green-100 text-green-700 border-green-200'
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200'
            case 'failed': return 'bg-red-100 text-red-700 border-red-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">Email Queue</h1>
                    <p className="text-muted-foreground mt-1">Monitor and manage automated system notifications.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={cleanupQueue}
                        disabled={isCleaning}
                        className="bg-white border border-border px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        title="Clear logs older than 30 days"
                    >
                        <Trash2 className={`w-4 h-4 ${isCleaning ? 'animate-pulse' : ''}`} />
                        Cleanup
                    </button>
                    <button
                        onClick={fetchQueue}
                        disabled={isLoading}
                        className="bg-white border border-border px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-primary' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={processQueue}
                        disabled={isProcessing || stats.pending === 0}
                        className="bg-primary text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                        <Send className={`w-4 h-4 ${isProcessing ? 'animate-pulse' : ''}`} />
                        Send Pending ({stats.pending})
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-white p-6 md:p-10 rounded-[32px] border border-border shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[24px] bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                        <Clock className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] leading-none mb-2">Pending Notifications</p>
                        <h3 className="text-5xl font-display font-bold text-slate-800">{stats.pending}</h3>
                    </div>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-sm text-muted-foreground max-w-[200px]">These emails are currently queued and will be sent automatically by the system.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-border/50 flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search recipient or subject..."
                        value={searchTerm}
                        onChange={(e) => {
                            const val = e.target.value
                            const params = new URLSearchParams(searchParams.toString())
                            if (val) params.set('search', val)
                            else params.delete('search')
                            params.delete('page')
                            router.push(`${pathname}?${params.toString()}`)
                        }}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                    />
                </div>
            </div>

            {/* Queue Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-border">
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Recipient</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject & Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Created At</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center">
                                            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                                            <p className="text-muted-foreground font-bold">Loading queue items...</p>
                                        </td>
                                    </tr>
                                ) : filteredQueue.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Mail className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-muted-foreground font-bold text-lg">No matching emails found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredQueue.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, idx) => (
                                        <motion.tr 
                                            key={item.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50/50 transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground text-sm">{item.to_name || 'No Name'}</span>
                                                    <span className="text-xs text-muted-foreground font-medium">{item.to_email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col max-w-xs md:max-w-md">
                                                    <span className="font-bold text-foreground text-sm truncate">{item.subject}</span>
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary/70 mt-0.5">{item.type.replace('_', ' ')}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                                    {formatDate(item.created_at)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => deleteItem(item.id)}
                                                        className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                        title="Delete from queue"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note */}
            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-primary mb-1">Queue Automation</h4>
                    <p className="text-sm text-primary/70 leading-relaxed">
                        The email queue is automatically processed every 5 minutes on the server using a cron job. 
                        The manual "Send Pending" button above is only needed for immediate processing or if you suspect the server cron is disconnected.
                    </p>
                </div>
            </div>
            
            {!isLoading && filteredQueue.length > 0 && (
                <Pagination totalItems={filteredQueue.length} pageSize={pageSize} />
            )}
        </div>
    )
}

export default function EmailQueuePage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
            <EmailQueueContent />
        </Suspense>
    )
}

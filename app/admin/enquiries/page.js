'use client'

import { useState, useEffect, Suspense } from 'react'
import { Search, Filter, Mail, Phone, Calendar, ChevronRight, CheckCircle, Clock, Loader2, RefreshCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Pagination from '@/components/ui/Pagination'

function EnquiriesContent() {
    const [enquiries, setEnquiries] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const activeTab = searchParams.get('tab') || 'All'
    const searchTerm = searchParams.get('search') || ''
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = 20

    const fetchEnquiries = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiries.php`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            })
            const data = await response.json()
            if (data.status === 'success') {
                setEnquiries(data.data)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Fetch error:', error)
            toast.error('Failed to load enquiries')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEnquiries()
    }, [])

    const filteredEnquiries = enquiries.filter(enquiry => {
        const matchesSearch =
            enquiry.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.service?.toLowerCase().includes(searchTerm.toLowerCase())

        if (activeTab === 'All') return matchesSearch
        return matchesSearch && enquiry.status?.toLowerCase() === activeTab.toLowerCase()
    })

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-display text-foreground">Enquiries</h1>
                    <p className="text-muted-foreground">Manage incoming messages from customers.</p>
                </div>
                <button
                    onClick={fetchEnquiries}
                    className="bg-white border border-border px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-primary' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-border/50 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name, email or service..."
                        value={searchTerm}
                        onChange={(e) => {
                            const val = e.target.value
                            const params = new URLSearchParams(searchParams.toString())
                            if (val) params.set('search', val)
                            else params.delete('search')
                            params.delete('page')
                            router.push(`${pathname}?${params.toString()}`)
                        }}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['All', 'New', 'In_progress', 'Completed', 'Cancelled'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                const params = new URLSearchParams(searchParams.toString())
                                params.set('tab', tab)
                                params.delete('page')
                                router.push(`${pathname}?${params.toString()}`)
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'bg-gray-50 text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                                }`}
                        >
                            {tab.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Enquiries List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border/60">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                        <p className="text-muted-foreground font-medium">Loading enquiries...</p>
                    </div>
                ) : filteredEnquiries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border/60">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-muted-foreground font-bold text-lg">No enquiries found</p>
                        <p className="text-gray-400 text-sm">When customers contact you, they'll appear here.</p>
                    </div>
                ) : (
                    filteredEnquiries.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((enquiry, index) => (
                        <motion.div
                            key={enquiry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={`/admin/enquiries/${enquiry.id}`}
                                className="block bg-white p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all group cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                                            {enquiry.full_name?.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center flex-wrap gap-2 mb-1">
                                                <h3 className="font-bold text-foreground text-lg truncate">{enquiry.full_name}</h3>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${enquiry.status === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {enquiry.status}
                                                </span>
                                                {enquiry.service && (
                                                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                        {enquiry.service.replace('-', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                                                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {enquiry.email}</span>
                                                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {enquiry.phone}</span>
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(enquiry.created_at)}</span>
                                            </div>
                                            <p className="text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50 italic text-sm md:text-base">
                                                "{enquiry.message || 'No message provided'}"
                                            </p>
                                        </div>
                                    </div>
                                    <button className="hidden md:flex p-2 rounded-full hover:bg-gray-100 text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-50 flex flex-wrap justify-end gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors px-3">Archive</button>
                                    <div className="h-4 w-px bg-gray-100 self-center" />
                                    <button className="text-sm font-bold text-primary hover:text-primary/80 px-3">Mark as In-Progress</button>
                                    <button className="text-sm font-bold text-white bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/10 transition-all active:scale-95">Respond</button>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>
            
            {!isLoading && filteredEnquiries.length > 0 && (
                <Pagination totalItems={filteredEnquiries.length} pageSize={pageSize} />
            )}
        </div>
    )
}

export default function EnquiriesPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
            <EnquiriesContent />
        </Suspense>
    )
}

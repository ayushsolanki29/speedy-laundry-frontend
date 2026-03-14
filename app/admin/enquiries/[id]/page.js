'use client'

import { useState, useEffect, use } from 'react'
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Clock,
    MapPin,
    Tag,
    Trash2,
    CheckCircle,
    Loader2,
    ExternalLink,
    MessageSquare,
    User,
    ShieldCheck,
    Send,
    X
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { parseEnquiryMessage } from '@/lib/enquiryMeta'

export default function EnquiryDetailPage({ params: paramsPromise }) {
    const params = use(paramsPromise)
    const router = useRouter()
    const [enquiry, setEnquiry] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showEmailModal, setShowEmailModal] = useState(false)
    const [emailSubject, setEmailSubject] = useState('')
    const [emailMessage, setEmailMessage] = useState('')
    const [isSending, setIsSending] = useState(false)

    const fetchEnquiry = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry.php?id=${params.id}`)
            const data = await response.json()
            if (data.status === 'success') {
                setEnquiry(data.data)
                // Auto-read: Update status if it's currently 'new'
                if (data.data.status === 'new') {
                    updateStatus('in_progress')
                }
            } else {
                toast.error(data.message)
                router.push('/admin/enquiries')
            }
        } catch (error) {
            console.error('Fetch error:', error)
            toast.error('Failed to load enquiry details')
        } finally {
            setIsLoading(false)
        }
    }

    const openEmailModal = () => {
        setEmailSubject(`Re: Your enquiry – Speedy Laundry`)
        setEmailMessage('')
        setShowEmailModal(true)
    }

    const sendReplyEmail = async (e) => {
        e.preventDefault()
        if (!emailMessage.trim()) {
            toast.error('Please enter a message')
            return
        }
        setIsSending(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-admin-reply.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enquiry_id: params.id,
                    subject: emailSubject.trim(),
                    message: emailMessage.trim()
                })
            })
            const data = await response.json()
            if (data.status === 'success') {
                toast.success('Email sent successfully!')
                setShowEmailModal(false)
                setEmailMessage('')
            } else {
                toast.error(data.message || 'Failed to send email')
            }
        } catch (error) {
            toast.error('Failed to send email')
        } finally {
            setIsSending(false)
        }
    }

    const updateStatus = async (newStatus) => {
        setIsUpdating(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-enquiry-status.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: params.id,
                    status: newStatus
                })
            })
            const data = await response.json()
            if (data.status === 'success') {
                toast.success(`Status updated to ${newStatus.replace('_', ' ')}`)
                setEnquiry(prev => ({ ...prev, status: newStatus }))
                // Trigger global event for other components to refresh
                window.dispatchEvent(new Event('enquiryStatusUpdated'));
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to update status')
        } finally {
            setIsUpdating(false)
        }
    }

    const deleteEnquiry = async () => {
        const ok = window.confirm('Delete this enquiry permanently?')
        if (!ok) return

        setIsDeleting(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete-enquiry.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: params.id })
            })
            const data = await response.json()
            if (data.status === 'success') {
                toast.success('Enquiry deleted')
                router.push('/admin/enquiries')
            } else {
                toast.error(data.message || 'Failed to delete enquiry')
            }
        } catch (error) {
            toast.error('Failed to delete enquiry')
        } finally {
            setIsDeleting(false)
        }
    }

    useEffect(() => {
        fetchEnquiry()
    }, [params.id])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/London'
        });
    };

    const meta = parseEnquiryMessage(enquiry?.message);
    const displayPostcode = enquiry?.postcode && enquiry.postcode !== 'BUSINESS' ? enquiry.postcode : '';
    const displayMessage = meta.cleanedMessage || enquiry?.message || 'No specific message was provided with this inquiry.';
    const displayAddress = enquiry?.address || meta.address || '';

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-medium">Fetching details...</p>
            </div>
        )
    }

    if (!enquiry) return null

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/enquiries"
                        className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">View Enquiry</h1>
                        <p className="text-muted-foreground text-sm">Case #{enquiry.id.toString().padStart(5, '0')}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={enquiry.status}
                        onChange={(e) => updateStatus(e.target.value)}
                        disabled={isUpdating}
                        className="bg-white border border-border px-4 py-2 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer disabled:opacity-50"
                    >
                        <option value="new">Action: Mark as New</option>
                        <option value="in_progress">Action: Mark In Progress</option>
                        <option value="completed">Action: Mark Completed</option>
                        <option value="cancelled">Action: Cancel Request</option>
                    </select>

                    <button
                        type="button"
                        onClick={deleteEnquiry}
                        disabled={isDeleting}
                        className="p-2.5 rounded-xl bg-white border border-border text-red-500 hover:bg-red-50 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        title="Delete enquiry"
                    >
                        {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Message Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 shadow-sm border border-border/60"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">Customer Message</h2>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                            <p className="text-gray-700 text-lg leading-relaxed font-medium italic">
                                "{displayMessage}"
                            </p>
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-50">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Reply Tools</h3>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    type="button"
                                    onClick={openEmailModal}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-95"
                                >
                                    <Send className="w-4 h-4" />
                                    Send Email
                                </button>
                                <a
                                    href={`tel:${enquiry.phone}`}
                                    className="flex items-center gap-2 px-6 py-3 bg-white border border-border text-foreground rounded-2xl font-bold hover:bg-gray-50 transition-all"
                                >
                                    <Phone className="w-4 h-4" />
                                    Call Customer
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Timeline / Logs */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-border/60">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">Audit & Timeline</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-50 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-foreground">Enquiry Received</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(enquiry.created_at)}</p>
                                    <p className="mt-2 text-sm text-gray-600">Initial request submitted via website contact form.</p>
                                </div>
                            </div>
                            {enquiry.status !== 'new' && (
                                <div className="flex gap-4">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 ring-4 ring-orange-50 shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Status Changed: {enquiry.status}</p>
                                        <p className="text-xs text-muted-foreground">Admin Action</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/60">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Current Status</h3>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm ${enquiry.status === 'new' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                            enquiry.status === 'in_progress' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                                enquiry.status === 'completed' ? 'bg-green-50 border-green-100 text-green-600' :
                                    'bg-gray-50 border-gray-100 text-gray-600'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${enquiry.status === 'new' ? 'bg-blue-600 animate-pulse' :
                                enquiry.status === 'in_progress' ? 'bg-orange-500' :
                                    enquiry.status === 'completed' ? 'bg-green-600' :
                                        'bg-gray-500'
                                }`} />
                            {enquiry.status.toUpperCase().replace('_', ' ')}
                        </div>
                    </div>

                    {/* Customer Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-border/60 space-y-6"
                    >
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Details</h3>

                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground uppercase tracking-tighter">Full Name</p>
                                    <p className="font-bold text-foreground truncate">{enquiry.full_name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground uppercase tracking-tighter">Email</p>
                                    <p className="font-bold text-foreground truncate text-sm">{enquiry.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground uppercase tracking-tighter">Mobile</p>
                                    <p className="font-bold text-foreground">{enquiry.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground uppercase tracking-tighter">Address</p>
                                    <p className="font-bold text-foreground break-words">{displayAddress || 'Not provided'}</p>
                                </div>
                            </div>

                            {displayPostcode && (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground uppercase tracking-tighter">Postcode</p>
                                        <p className="font-bold text-foreground">{displayPostcode}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Service Info */}
                    <div className="bg-foreground rounded-3xl p-6 shadow-xl shadow-black/10 space-y-6">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Service Intent</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary">
                                <Tag className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-white/50 uppercase tracking-tighter">Category</p>
                                <p className="font-bold text-white truncate">{enquiry.service?.replace('-', ' ').toUpperCase() || 'GENERAL INQUIRY'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Send Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h3 className="text-lg font-bold text-foreground">Send Email to {enquiry.full_name}</h3>
                            <button
                                type="button"
                                onClick={() => setShowEmailModal(false)}
                                className="p-2 rounded-xl hover:bg-gray-100 text-muted-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={sendReplyEmail} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-foreground mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="Re: Your enquiry"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-foreground mb-2">Message <span className="text-red-500">*</span></label>
                                <textarea
                                    value={emailMessage}
                                    onChange={(e) => setEmailMessage(e.target.value)}
                                    rows={6}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                    placeholder="Write your reply to the customer..."
                                    disabled={isSending}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEmailModal(false)}
                                    className="flex-1 px-4 py-3 rounded-2xl font-bold border border-border text-foreground hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold bg-primary text-white hover:brightness-110 disabled:opacity-60"
                                >
                                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Send Email
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

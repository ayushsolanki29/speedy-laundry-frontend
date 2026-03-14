'use client'

import { useState, useEffect } from 'react'
import {
    ChevronLeft,
    Search,
    Loader2,
    MessageSquare,
    Trash2,
    CornerDownRight,
    Send,
    ExternalLink,
    Filter,
    Clock,
    User,
    Mail
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Pagination from '@/components/ui/Pagination'
import { Suspense } from 'react'

function CommentModerationContent() {
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const searchTerm = searchParams.get('search') || ''
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = 20
    
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyContent, setReplyContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchComments = async () => {
        setIsLoading(true)
        try {
            const token = localStorage.getItem('adminToken')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-comments.php`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (data.status === 'success') {
                // Group replies under parents
                const allComments = data.data
                const parents = allComments.filter(c => !c.is_admin_reply)
                const replies = allComments.filter(c => c.is_admin_reply)

                const structured = parents.map(p => ({
                    ...p,
                    replies: replies.filter(r => r.parent_id == p.id)
                }))

                setComments(structured)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to load comments')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [])

    const handleReply = async (e) => {
        e.preventDefault()
        if (!replyContent.trim()) return

        setIsSubmitting(true)
        try {
            const token = localStorage.getItem('adminToken')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-comments.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    blog_id: replyingTo.blog_id,
                    parent_id: replyingTo.id,
                    content: replyContent
                })
            })

            const data = await response.json()
            if (data.status === 'success') {
                toast.success('Reply posted')
                setReplyContent('')
                setReplyingTo(null)
                fetchComments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to post reply')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this comment and its replies?')) return

        try {
            const token = localStorage.getItem('adminToken')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-comments.php?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (data.status === 'success') {
                toast.success('Comment deleted')
                fetchComments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to delete comment')
        }
    }

    const filteredComments = comments.filter(c =>
        c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.blog_title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blogs"
                        className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">Comment Moderation</h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Manage and reply to blog discussions</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search comments..."
                            value={searchTerm}
                            onChange={(e) => {
                                const val = e.target.value
                                const params = new URLSearchParams(searchParams.toString())
                                if (val) params.set('search', val)
                                else params.delete('search')
                                params.delete('page')
                                router.push(`${pathname}?${params.toString()}`)
                            }}
                            className="pl-11 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-primary/5 transition-all w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh]">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading discussions...</p>
                </div>
            ) : filteredComments.length > 0 ? (
                <div className="grid gap-6">
                    {filteredComments.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                                            <MessageSquare className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-black text-slate-900">{comment.name}</h3>
                                                <span className="text-[10px] font-medium text-slate-400">•</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full">{new Date(comment.created_at_iso || comment.created_at).toLocaleDateString('en-GB', { timeZone: 'Europe/London' })}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{comment.email}</span>
                                                <span className="text-slate-200">|</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{new Date(comment.created_at_iso || comment.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Europe/London' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-primary/5 px-4 py-2 rounded-xl flex items-center justify-between gap-4 self-start">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest whitespace-nowrap">{comment.blog_title}</span>
                                        </div>
                                        <Link href={`/blog/${comment.blog_slug}`} target="_blank" className="text-slate-400 hover:text-primary transition-colors">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="pl-1 md:pl-16 mb-8">
                                    <p className="text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-6 rounded-3xl border border-slate-50">
                                        "{comment.content}"
                                    </p>
                                </div>

                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="md:ml-16 space-y-4 mb-8">
                                        {comment.replies.map(reply => (
                                            <div key={reply.id} className="flex gap-4 items-start bg-slate-50/80 p-5 rounded-2xl border border-slate-100/50">
                                                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Admin Reply</span>
                                                        <span className="text-[9px] font-bold text-slate-400">{new Date(reply.created_at_iso || reply.created_at).toLocaleDateString('en-GB', { timeZone: 'Europe/London' })}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{reply.content}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(reply.id)}
                                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50">
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete Entire Thread
                                    </button>
                                    {!replyingTo && comment.replies.length === 0 && (
                                        <button
                                            onClick={() => setReplyingTo(comment)}
                                            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            Admin Reply
                                        </button>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {replyingTo?.id === comment.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <form onSubmit={handleReply} className="mt-8 md:ml-16 bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CornerDownRight className="w-4 h-4 text-primary" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Replying as Admin</span>
                                                </div>
                                                <textarea
                                                    autoFocus
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    placeholder="Type your official reply here..."
                                                    className="w-full h-32 bg-white border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-primary/5 transition-all resize-none shadow-sm"
                                                />
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setReplyingTo(null)}
                                                        className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={isSubmitting || !replyContent.trim()}
                                                        type="submit"
                                                        className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                                    >
                                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                        Post Official Reply
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-20 rounded-[40px] border border-slate-100 shadow-sm text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No conversations yet</h3>
                    <p className="text-slate-400 text-sm font-medium">When users start commenting on your blogs, they'll appear here for moderation.</p>
                </div>
            )}
            
            {!isLoading && filteredComments.length > 0 && (
                <Pagination totalItems={filteredComments.length} pageSize={pageSize} />
            )}
        </div>
    )
}

export default function CommentModerationPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
            <CommentModerationContent />
        </Suspense>
    )
}


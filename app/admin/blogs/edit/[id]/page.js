'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import {
    ChevronLeft,
    Save,
    Loader2,
    Type,
    Link as LinkIcon,
    FileText,
    Tag,
    Globe,
    Lock,
    Heart,
    MessageSquare,
    Send,
    ExternalLink,
    CornerDownRight
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import ImageUploader from '@/components/ImageUploader'
import RichTextEditor from '@/components/RichTextEditor'
import CategoriesSelector from '@/components/CategoriesSelector'

export default function EditBlogPage({ params }) {
    const router = useRouter()
    const { id } = use(params)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState({
        id: id,
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        image_url: '',
        status: 'draft'
    })
    const [comments, setComments] = useState([])
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyContent, setReplyContent] = useState('')
    const [isReplySubmitting, setIsReplySubmitting] = useState(false)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const token = localStorage.getItem('adminToken')
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-blogs.php?id=${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const data = await response.json()
                if (data.status === 'success') {
                    setFormData(data.data)
                } else {
                    toast.error(data.message)
                    router.push('/admin/blogs')
                }
            } catch (error) {
                toast.error('Failed to load blog data')
            } finally {
                setIsLoading(false)
            }
        }
        fetchBlog()
    }, [id, router])

    const fetchComments = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-comments.php?blog_id=${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.status === 'success') {
                const all = data.data
                const parents = all.filter(c => !c.is_admin_reply)
                const replies = all.filter(c => c.is_admin_reply)
                setComments(parents.map(p => ({
                    ...p,
                    replies: replies.filter(r => r.parent_id == p.id)
                })))
            }
        } catch (error) {
            console.error('Failed to load comments', error)
        }
    }

    useEffect(() => {
        if (id) fetchComments()
    }, [id])

    const handleReply = async (e) => {
        e.preventDefault()
        if (!replyContent.trim()) return
        setIsReplySubmitting(true)
        try {
            const token = localStorage.getItem('adminToken')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-comments.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    blog_id: parseInt(id),
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
                if (formData.comments_count !== undefined) {
                    setFormData(p => ({ ...p, comments_count: (p.comments_count || 0) + 1 }))
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to post reply')
        } finally {
            setIsReplySubmitting(false)
        }
    }

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove non-word, non-space, non-hyphen chars
            .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
            .replace(/^-+|-+$/g, '')  // Trim hyphens from start and end
    }

    const handleTitleChange = (e) => {
        const title = e.target.value
        setFormData(prev => ({
            ...prev,
            title,
            slug: generateSlug(title)
        }))
    }

    const handleSlugChange = (e) => {
        const value = e.target.value
            .toLowerCase()
            .replace(/\s+/g, '-')      // Replace spaces with hyphens
            .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric chars except hyphen
            .replace(/-+/g, '-')       // Prevent multiple consecutive hyphens

        setFormData(prev => ({
            ...prev,
            slug: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.title || !formData.slug || !formData.content) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsSaving(true)
        try {
            const token = localStorage.getItem('adminToken')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-blogs.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            if (data.status === 'success') {
                toast.success('Blog post updated successfully')
                router.push('/admin/blogs')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to update blog post')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold">Fetching article details...</p>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blogs"
                        className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">Edit Article</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">ID: {id}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <Link
                        href={`/blog/${formData.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Post
                    </Link>
                    <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <Heart className="w-4 h-4 text-red-400" />
                            {formData.likes_count ?? 0} likes
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <MessageSquare className="w-4 h-4 text-blue-500" />
                            {formData.comments_count ?? 0} comments
                        </span>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                        <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, status: 'draft' }))}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'draft' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Lock className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
                            Draft
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, status: 'published' }))}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'published' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Globe className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
                            Publish
                        </button>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Update Article
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Type className="w-3 h-3" />
                                Article Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={handleTitleChange}
                                placeholder="Enter a catchy title..."
                                className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 text-xl font-black text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-primary/10 transition-all"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <LinkIcon className="w-3 h-3" />
                                URL Slug
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={handleSlugChange}
                                placeholder="article-url-slug"
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-primary/10 transition-all font-mono"
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <FileText className="w-3 h-3" />
                                Content body
                            </label>
                            <RichTextEditor
                                content={formData.content}
                                onChange={(content) => setFormData(p => ({ ...p, content }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-lg shadow-slate-200/40 space-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                Cover Image
                            </label>
                            <ImageUploader
                                onUploadSuccess={(url) => setFormData(p => ({ ...p, image_url: url }))}
                                currentImage={formData.image_url}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Tag className="w-3 h-3" />
                                Category
                            </label>
                            <CategoriesSelector
                                selectedCategory={formData.category}
                                onSelect={(category) => setFormData(p => ({ ...p, category }))}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                Excerpt
                            </label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData(p => ({ ...p, excerpt: e.target.value }))}
                                placeholder="Brief summary of the article..."
                                className="w-full h-32 bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-xs font-medium leading-normal text-slate-600 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div id="comments" className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-lg shadow-slate-200/40 space-y-6 scroll-mt-8">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                Comments ({comments.length})
                            </h4>
                            <Link
                                href="/admin/blogs/comments"
                                className="text-[10px] font-bold text-primary hover:underline"
                            >
                                Manage All
                            </Link>
                        </div>
                        {comments.length > 0 ? (
                            <div className="space-y-4 max-h-80 overflow-y-auto">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-slate-800 text-sm">{comment.name}</span>
                                            <span className="text-[9px] text-slate-400">{new Date(comment.created_at).toLocaleDateString('en-GB', { timeZone: 'Europe/London' })}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 mb-3">"{comment.content}"</p>
                                        {comment.replies?.map((reply) => (
                                            <div key={reply.id} className="ml-4 pl-4 border-l-2 border-primary/20 py-2">
                                                <span className="text-[9px] font-black text-primary uppercase">Admin</span>
                                                <p className="text-xs text-slate-700">{reply.content}</p>
                                            </div>
                                        ))}
                                        {replyingTo?.id === comment.id ? (
                                                    <form onSubmit={handleReply} className="mt-3 space-y-2">
                                                        <textarea
                                                            value={replyContent}
                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                            placeholder="Type your reply..."
                                                            className="w-full h-20 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 resize-none"
                                                            required
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => { setReplyingTo(null); setReplyContent('') }}
                                                                className="px-3 py-1.5 text-[10px] font-bold text-slate-500"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                disabled={isReplySubmitting || !replyContent.trim()}
                                                                className="flex items-center gap-1 px-4 py-1.5 bg-primary text-white rounded-xl text-[10px] font-bold disabled:opacity-50"
                                                            >
                                                                {isReplySubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                                                Reply
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setReplyingTo(comment)}
                                                        className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-primary hover:underline"
                                                    >
                                                        <CornerDownRight className="w-3 h-3" />
                                                        Reply as Admin
                                                    </button>
                                                )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-xs">No comments yet.</p>
                        )}
                    </div>

                    <div className="bg-primary/5 border border-primary/10 p-6 rounded-[32px] space-y-4">
                        <h4 className="text-sm font-black text-primary uppercase tracking-widest">Article Tips</h4>
                        <ul className="space-y-3">
                            {[
                                'Use a compelling header image',
                                'Slug should be SEO friendly',
                                'Excerpt appears in card previews',
                                'Content supports standard HTML'
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
                                    <span className="text-[10px] font-bold text-slate-600 tracking-tight">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

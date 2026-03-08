'use client'

import { useState, useEffect } from 'react'
import {
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Calendar,
    Tag,
    Loader2,
    BookOpen,
    AlertCircle,
    MessageSquare,
    Heart,
    MessageCircle,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Pagination from '@/components/ui/Pagination'
import { Suspense } from 'react'

function BlogsContent() {
    const [blogs, setBlogs] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const searchTerm = searchParams.get('search') || ''
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = 20

    const fetchBlogs = async () => {
        setIsLoading(true)
        try {
            const token = localStorage.getItem('adminToken')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-blogs.php`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (data.status === 'success') {
                setBlogs(data.data)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to load blogs')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return

        try {
            const token = localStorage.getItem('adminToken')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-blogs.php?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (data.status === 'success') {
                setBlogs(blogs.filter(blog => blog.id !== id))
                toast.success('Blog deleted successfully')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to delete blog')
        }
    }

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading && blogs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold">Loading blog posts...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
                    <p className="text-gray-500">Create, update and manage your website articles efficiently.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/blogs/comments"
                        className="flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-200 transition-all active:scale-95"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Manage Comments
                    </Link>
                    <Link
                        href="/admin/blogs/new"
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        New Article
                    </Link>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title or category..."
                        value={searchTerm}
                        onChange={(e) => {
                            const val = e.target.value
                            const params = new URLSearchParams(searchParams.toString())
                            if (val) params.set('search', val)
                            else params.delete('search')
                            params.delete('page')
                            router.push(`${pathname}?${params.toString()}`)
                        }}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total: {filteredBlogs.length}</span>
                </div>
            </div>

            {/* Blogs Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title & Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Likes</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Comments</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredBlogs.length > 0 ? (
                                filteredBlogs.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((blog) => (
                                    <tr key={blog.id} className="hover:bg-gray-50/30 transition-all duration-200 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                    {blog.image_url ? (
                                                        <img src={blog.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <BookOpen className="w-4 h-4 text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase">{blog.title}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{blog.category || 'Uncategorized'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-sm font-bold text-gray-600">
                                                <Heart className="w-4 h-4 text-red-400" />
                                                {blog.likes_count ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/blogs/edit/${blog.id}#comments`}
                                                className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-primary transition-colors"
                                            >
                                                <MessageCircle className="w-4 h-4 text-blue-500" />
                                                {blog.comments_count ?? 0}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${blog.status === 'published' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${blog.status === 'published' ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {blog.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-gray-500">{new Date(blog.created_at).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/blog/${blog.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/blogs/edit/${blog.id}`}
                                                    className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/blogs/comments`}
                                                    className="p-2 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                    title="Manage Comments"
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <p className="text-gray-400 italic text-sm">No articles found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {!isLoading && filteredBlogs.length > 0 && (
                <Pagination totalItems={filteredBlogs.length} pageSize={pageSize} />
            )}
        </div>
    )
}

export default function BlogsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
            <BlogsContent />
        </Suspense>
    )
}

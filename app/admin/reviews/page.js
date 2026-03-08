'use client'

import { useState, useEffect } from 'react'
import { Star, Plus, Pencil, Trash2, Pin, PinOff, Upload, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Pagination from '@/components/ui/Pagination'
import { Suspense } from 'react'

function AdminReviewsContent() {
    const [reviews, setReviews] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({ name: '', content: '', rating: 5, photo_url: '', display_order: 0, is_pinned: 0 })
    const [isSaving, setIsSaving] = useState(false)
    const [photoUploading, setPhotoUploading] = useState(false)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = 20

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews.php`)
            const data = await res.json()
            if (data.status === 'success' && data.data) setReviews(data.data)
        } catch (e) {
            toast.error('Failed to load reviews')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => { fetchReviews() }, [])

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file || !file.type.startsWith('image/')) {
            toast.error('Please select an image (JPG, PNG, WEBP)')
            return
        }
        setPhotoUploading(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-review-photo.php`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
                body: fd
            })
            const data = await res.json()
            if (data.status === 'success' && data.data?.url) {
                setForm(p => ({ ...p, photo_url: data.data.url }))
                toast.success('Photo uploaded')
            } else {
                toast.error(data.message || 'Upload failed')
            }
        } catch (e) {
            toast.error('Upload failed')
        } finally {
            setPhotoUploading(false)
        }
    }

    const resetForm = () => {
        setForm({ name: '', content: '', rating: 5, photo_url: '', display_order: 0, is_pinned: 0 })
        setEditingId(null)
        setShowForm(false)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        if (!form.name.trim() || !form.content.trim()) {
            toast.error('Name and content are required')
            return
        }
        setIsSaving(true)
        try {
            const token = localStorage.getItem('adminToken')
            const url = `${process.env.NEXT_PUBLIC_API_URL}/reviews.php`
            const method = editingId ? 'PUT' : 'POST'
            const body = editingId ? { ...form, id: editingId } : form
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            })
            const data = await res.json()
            if (data.status === 'success') {
                toast.success(editingId ? 'Review updated' : 'Review added')
                resetForm()
                fetchReviews()
            } else {
                toast.error(data.message || 'Failed to save')
            }
        } catch (e) {
            toast.error('Failed to save')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this review?')) return
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews.php?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            })
            const data = await res.json()
            if (data.status === 'success') {
                toast.success('Review deleted')
                fetchReviews()
            } else toast.error(data.message || 'Delete failed')
        } catch (e) {
            toast.error('Delete failed')
        }
    }

    const togglePin = async (r) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    id: r.id, name: r.name, content: r.content, rating: r.rating,
                    photo_url: r.photo_url, display_order: r.display_order,
                    is_pinned: r.is_pinned ? 0 : 1
                })
            })
            const data = await res.json()
            if (data.status === 'success') {
                toast.success(r.is_pinned ? 'Unpinned' : 'Pinned to top')
                fetchReviews()
            }
        } catch (e) {
            toast.error('Failed to update')
        }
    }

    const startEdit = (r) => {
        setForm({
            name: r.name,
            content: r.content,
            rating: r.rating,
            photo_url: r.photo_url || '',
            display_order: r.display_order,
            is_pinned: r.is_pinned
        })
        setEditingId(r.id)
        setShowForm(true)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading reviews...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-foreground">Reviews</h1>
                    <p className="text-muted-foreground">Manage customer testimonials. Pinned reviews show first.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true) }}
                    className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Review
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl shadow-sm border border-border/50 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold">{editingId ? 'Edit Review' : 'New Review'}</h3>
                        <button type="button" onClick={resetForm} className="text-slate-500 hover:text-slate-800"><X className="w-5 h-5" /></button>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Name</label>
                        <input
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200"
                            placeholder="Customer name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Review Content</label>
                        <textarea
                            value={form.content}
                            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none"
                            placeholder="Review text..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Rating (1-5)</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(n => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setForm(p => ({ ...p, rating: n }))}
                                    className={`p-2 rounded-lg ${form.rating >= n ? 'text-[#E7711B]' : 'text-gray-300'}`}
                                >
                                    <Star className={`w-6 h-6 ${form.rating >= n ? 'fill-current' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Profile Photo (optional)</label>
                        <div className="flex items-center gap-4">
                            {form.photo_url ? (
                                <div className="relative">
                                    <img src={form.photo_url} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
                                    <button type="button" onClick={() => setForm(p => ({ ...p, photo_url: '' }))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                                </div>
                            ) : null}
                            <label className="cursor-pointer">
                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={photoUploading} />
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">
                                    {photoUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    {photoUploading ? 'Uploading...' : 'Upload Photo'}
                                </span>
                            </label>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">No photo = letter avatar (e.g. &quot;J&quot; for Jane)</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={!!form.is_pinned} onChange={e => setForm(p => ({ ...p, is_pinned: e.target.checked ? 1 : 0 }))} className="rounded" />
                            <span className="text-sm font-medium">Pin to top (show first)</span>
                        </label>
                        <div>
                            <label className="block text-[10px] text-muted-foreground">Display order</label>
                            <input
                                type="number"
                                value={form.display_order}
                                onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                                className="w-20 px-2 py-1 rounded border border-gray-200 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl border border-gray-200">Cancel</button>
                        <button type="submit" disabled={isSaving} className="btn-primary px-6 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Save
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {reviews.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">No reviews yet. Add one to get started.</p>
                ) : (
                    reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(r => (
                        <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
                            <div className="shrink-0">
                                {r.photo_url ? (
                                    <img src={r.photo_url} alt={r.name} className="w-12 h-12 rounded-full object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                        {(r.name || '?')[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold">{r.name}</span>
                                    {r.is_pinned && <Pin className="w-4 h-4 text-primary fill-primary" />}
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-[#E7711B] fill-[#E7711B]' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm mt-1 line-clamp-2">&ldquo;{r.content}&rdquo;</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => togglePin(r)} className="p-2 rounded-lg hover:bg-gray-100" title={r.is_pinned ? 'Unpin' : 'Pin to top'}>
                                    {r.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                </button>
                                <button onClick={() => startEdit(r)} className="p-2 rounded-lg hover:bg-gray-100"><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!isLoading && reviews.length > 0 && (
                <Pagination totalItems={reviews.length} pageSize={pageSize} />
            )}
        </div>
    )
}

export default function AdminReviewsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
            <AdminReviewsContent />
        </Suspense>
    )
}


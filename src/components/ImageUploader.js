'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'http://localhost/speedy-laundry/cdn/'
const CDN_UPLOAD_URL = `${CDN_URL.replace(/\/+$/, '')}/api/upload.php`

export default function ImageUploader({ onUploadSuccess, currentImage }) {
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(currentImage || null)
    const fileInputRef = useRef(null)

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'image')

        setIsUploading(true)
        try {
            const response = await fetch(CDN_UPLOAD_URL, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer secure_cdn_token_123456'
                },
                body: formData
            })

            const data = await response.json()
            if (data.success) {
                setPreviewUrl(data.url)
                onUploadSuccess(data.url)
                toast.success('Image uploaded successfully')
            } else {
                toast.error(data.error || 'Upload failed')
            }
        } catch (error) {
            console.error('Upload Error:', error)
            toast.error('Failed to connect to CDN')
        } finally {
            setIsUploading(false)
        }
    }

    const removeImage = () => {
        setPreviewUrl(null)
        onUploadSuccess('')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <div className="space-y-4">
            <div
                className={`relative group h-64 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                    ${previewUrl ? 'border-primary/20 bg-primary/5' : 'border-slate-200 bg-slate-50 hover:border-primary/50 hover:bg-slate-100'}
                `}
            >
                {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Uploading to CDN...</span>
                    </div>
                ) : previewUrl ? (
                    <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                            >
                                Change Image
                            </button>
                            <button
                                onClick={removeImage}
                                className="bg-red-500 text-white p-2 rounded-xl hover:scale-105 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Uploaded</span>
                        </div>
                    </>
                ) : (
                    <div
                        className="flex flex-col items-center gap-4 cursor-pointer p-8 w-full h-full"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                            <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black text-slate-900 tracking-tight">Drop your cover image here</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                        </div>
                    </div>
                )}
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                />
            </div>
        </div>
    )
}

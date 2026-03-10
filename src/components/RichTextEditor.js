'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Link as LinkIcon,
    Image as ImageIcon,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Undo,
    Redo,
    ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'
import { useCallback } from 'react'

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'http://localhost/speedy-laundry/cdn/'
const CDN_UPLOAD_URL = `${CDN_URL.replace(/\/+$/, '')}/api/upload.php`

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null
    }

    const addImage = async () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = async (event) => {
            const file = event.target.files[0]
            if (file) {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('type', 'image')

                const toastId = toast.loading('Uploading image...')

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
                        editor.chain().focus().setImage({ src: data.url }).run()
                        toast.success('Image added', { id: toastId })
                    } else {
                        toast.error(data.error || 'Upload failed', { id: toastId })
                    }
                } catch (error) {
                    console.error(error)
                    toast.error('Failed to upload image', { id: toastId })
                }
            }
        }
        input.click()
    }

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    const setCtaButton = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL for CTA Button', previousUrl)

        if (url) {
            editor.chain().focus().setLink({ href: url, class: 'bg-primary !text-white px-6 py-3 rounded-full font-bold no-underline inline-block hover:brightness-110 shadow-lg transition-all cta-button' }).run()
        }
    }, [editor])

    return (
        <div className="border-b border-slate-100 p-3 flex flex-wrap gap-2 sticky top-0 bg-white z-10 rounded-t-[32px]">
            <div className="flex items-center gap-1 pr-3 border-r border-slate-100">
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Heading 3"
                >
                    <Heading3 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-1 pr-3 border-r border-slate-100">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive('bold') ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive('italic') ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive('underline') ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Underline"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-1 pr-3 border-r border-slate-100">
                <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Align Left"
                >
                    <AlignLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Align Center"
                >
                    <AlignCenter className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Align Right"
                >
                    <AlignRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-1 pr-3 border-r border-slate-100">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive('bulletList') ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive('orderedList') ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Ordered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive('blockquote') ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Quote"
                >
                    <Quote className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={setLink}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive('link') ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={setCtaButton}
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${editor.isActive('link', { class: 'cta-button' }) ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
                    title="Insert CTA Button"
                >
                    <ExternalLink className="w-4 h-4" />
                </button>
                <button
                    onClick={addImage}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
                    title="Image"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>
            </div>

            <div className="ml-auto flex items-center gap-1 pl-3 border-l border-slate-100">
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 disabled:opacity-30"
                    title="Undo"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 disabled:opacity-30"
                    title="Redo"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

const RichTextEditor = ({ content, onChange }) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: 'Write your story...',
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline decoration-primary/30 hover:decoration-primary transition-colors font-medium',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-2xl shadow-lg my-8 max-w-full h-auto',
                },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-6 prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:marker:text-primary prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:text-slate-700 prose-blockquote:italic prose-a:text-primary prose-img:rounded-3xl',
            },
        },
    })

    return (
        <div className="w-full bg-slate-50 rounded-[32px] border border-slate-100 overflow-hidden focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

export default RichTextEditor

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addPost } from '../../../lib/posts'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { isAdmin } from '../../../lib/auth'

export default function WritePage() {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    immediatelyRender: false,
  })

  // Check admin access
  useEffect(() => {
    async function checkAdmin() {
      const admin = await isAdmin()
      if (!admin) router.push('/') // redirect non-admins
      else setLoading(false)
    }
    checkAdmin()
  }, [router])

  async function handleSave() {
    if (!title.trim() || !editor) return alert('Add title and body')
    const body = editor.getHTML()
    const id = Math.random().toString(36).slice(2, 9)
    const post = {
      id,
      title: title.trim(),
      body,
      excerpt: body.replace(/<[^>]+>/g, '').slice(0, 180),
      date: new Date().toISOString(),
    }
    await addPost(post)
    router.push(`/post/${id}`)
  }

  if (loading || !editor) return <p>Checking admin...</p>

  

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h1>Write a new post</h1>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: 10, fontSize: 18, marginBottom: 10, width: '100%' }}
      />
      <div style={{ border: '1px solid #ccc', borderRadius: 5, minHeight: 200, padding: 10 }}>
        <EditorContent editor={editor} />
      </div>
      <div style={{ marginTop: 10 }}>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  )
}

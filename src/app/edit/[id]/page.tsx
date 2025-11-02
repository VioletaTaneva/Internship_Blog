'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { supabase } from '../../../../lib/supabase'

export default function EditPage() {
  const router = useRouter()
  const params = useParams()
  const postId = Array.isArray(params.id) ? params.id[0] : params.id // ensure string

  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    immediatelyRender: false,
  })

  // Fetch post from Supabase
  useEffect(() => {
    async function fetchPost() {
      if (!postId || !editor) return

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error || !data) {
        alert('Post not found')
        router.push('/')
        return
      }

      setTitle(data.title)
      editor.commands.setContent(data.body)
      setLoading(false)
    }

    fetchPost()
  }, [postId, editor, router])

  // Save edited post
  async function handleSave() {
    if (!postId || !title.trim() || !editor) {
      alert('Add title and body')
      return
    }

    const body = editor.getHTML()

    const { error } = await supabase
      .from('posts')
      .update({
        title: title.trim(),
        body,
        excerpt: body.replace(/<[^>]+>/g, '').slice(0, 180),
      })
      .eq('id', postId)

    if (error) {
      alert('Failed to update post')
      console.error(error)
    } else {
      router.push(`/post/${postId}`)
    }
  }

  if (loading || !editor) return <p>Loading...</p>

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h1>Edit Post</h1>

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
        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getPostById, Post, deletePost } from '../../../../lib/posts'
import { isAdmin } from '../../../../lib/auth'

export default function PostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = Array.isArray(params.id) ? params.id[0] : params.id // ensure string

  const [post, setPost] = useState<Post | null>(null)
  const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      if (!postId) return
      const p = await getPostById(postId)
      if (!p) {
        router.push('/') // post not found
        return
      }
      setPost(p)
      const adminStatus = await isAdmin()
      setAdmin(adminStatus)
      setLoading(false)
    }
    loadPost()
  }, [postId, router])

  async function handleDelete() {
    if (!postId) return
    if (!confirm('Are you sure you want to delete this post?')) return
    await deletePost(postId)
    router.push('/')
  }

  if (loading || !post) return <p>Loading...</p>

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <button
        style={{ marginBottom: 20, padding: '6px 12px', fontSize: 14 }}
        onClick={() => router.push('/')}
      >
        ← Back to Listing
      </button>

      <h1>{post.title}</h1>
      <div style={{ color: '#999', fontSize: 14, marginBottom: 20 }}>
        {new Date(post.date).toLocaleString()}
      </div>
      <div
        style={{ lineHeight: 1.6, fontSize: 18 }}
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      {admin && (
        <div style={{ marginTop: 40, display: 'flex', gap: 10 }}>
          <button
            style={{ padding: '10px 20px', fontSize: 16 }}
            onClick={() => router.push(`/edit/${post.id}`)}
          >
            Edit Post
          </button>
          <button
            style={{ padding: '10px 20px', fontSize: 16, backgroundColor: '#f44336', color: '#fff' }}
            onClick={handleDelete}
          >
            Delete Post
          </button>
        </div>
      )}
    </div>
  )
}

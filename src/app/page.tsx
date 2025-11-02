'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { isAdmin } from '../../lib/auth'

interface Post {
  id: string
  title: string
  body: string
  excerpt?: string
  date: string
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false) // track admin status

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        console.error(error)
        setPosts([])
      } else {
        setPosts(data as Post[] || [])
      }

      setLoading(false)
    }

    async function checkAdmin() {
      const status = await isAdmin()
      setAdmin(status)
    }

    fetchPosts()
    checkAdmin()
  }, [])

  if (loading) return <p style={{ maxWidth: 800, margin: '40px auto' }}>Loading posts...</p>

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Blog</h1>
        <nav>
          {admin && <Link href="/write">Write</Link>}
        </nav>
      </header>

      <main>
        {posts.length === 0 && <p>No posts yet.</p>}
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {posts.map((p) => (
            <li key={p.id} style={{ padding: '16px 0', borderBottom: '1px solid #eee' }}>
              <Link href={`/post/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h2 style={{ margin: '0 0 6px' }}>{p.title}</h2>
                <div style={{ color: '#666', fontSize: 14 }}>
                  {p.excerpt || p.body.slice(0, 150) + (p.body.length > 150 ? '...' : '')}
                </div>
                <div style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
                  {new Date(p.date).toLocaleString()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

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

      {/* Profile Section */}
      <section style={{ display: 'flex', alignItems: 'center', gap: 40, marginBottom: 30 }}>
        <img
          src="TOAK-VIOLETA.jpg"
          alt="Profile"
          style={{
            width: 240,
            height: 240,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 42, margin: '0 0 10px' }}>Violeta Taneva </h1>
          <p style={{ fontSize: 20, margin: '0 0 10px' }}>Company - Two Of A Kind </p>
          <Link
            href="https://www.twoofakind.agency"
            style={{
              display: 'inline-block',
              fontSize: 20,
              padding: '6px 12px',
              backgroundColor: '#0070f3',
              color: '#fff',
              borderRadius: 4,
              textDecoration: 'none',
            }}
          >
            Visit Website
          </Link>
        </div>
      </section>

      {/* Divider */}
      <hr style={{ border: '1px solid #eee', margin: '30px 0' }} />

      {/* Blog Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Blog</h1>
        <nav>{admin && <Link href="/write">Write</Link>}</nav>
      </header>

      {/* Blog Listings */}
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

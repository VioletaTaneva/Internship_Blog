'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

const ADMIN_EMAIL = 'etitaneva@gmail.com' // replace with your admin email

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleLogin() {
    setErrorMsg('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      return
    }

    if (data.user?.email === ADMIN_EMAIL) {
      router.push('/write') // redirect admin to write page
    } else {
      setErrorMsg('Not authorized')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      <button onClick={handleLogin} style={{ width: '100%', padding: 10 }}>
        Log In
      </button>
      {errorMsg && <p style={{ color: 'red', marginTop: 10 }}>{errorMsg}</p>}
    </div>
  )
}

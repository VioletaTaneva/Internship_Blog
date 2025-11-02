import { supabase } from './supabase'

export interface Post {
  id: string
  title: string
  body: string
  excerpt?: string
  date: string
}

// Fetch all posts
export async function loadPosts(): Promise<Post[]> {
  const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false })
  if (error) console.error(error)
  return data || []
}

// Fetch single post by id
export async function getPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
  if (error) console.error(error)
  return data || null
}

// Add a new post
export async function addPost(post: Post) {
  const { error } = await supabase.from('posts').insert([post])
  if (error) console.error(error)
}

// Update existing post
export async function updatePost(post: Post) {
  const { error } = await supabase.from('posts').update(post).eq('id', post.id)
  if (error) console.error(error)
}

// Delete existing post
export async function deletePost(id: string) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) console.error(error)
}
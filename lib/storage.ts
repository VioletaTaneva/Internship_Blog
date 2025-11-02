const KEY = 'minimal_blog_posts_v1'

export interface Post {
  id: string
  title: string
  body: string
  excerpt: string
  date: string
}

export function loadPosts(): Post[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('loadPosts error', e)
    return []
  }
}

export function savePosts(posts: Post[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(posts))
  } catch (e) {
    console.error('savePosts error', e)
  }
}

export function addPost(post: Post) {
  const posts = loadPosts()
  posts.unshift(post)
  savePosts(posts)
}

export function getPostById(id: string): Post | undefined {
  const posts = loadPosts()
  return posts.find(p => p.id === id)
}

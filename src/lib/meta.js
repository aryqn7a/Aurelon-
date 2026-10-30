import { useEffect } from 'react'
// Sets the page title and description for each route (good for search results and sharing).
export function usePageMeta(title, desc) {
  useEffect(() => {
    document.title = title
    if (!desc) return
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = desc
  }, [title, desc])
}

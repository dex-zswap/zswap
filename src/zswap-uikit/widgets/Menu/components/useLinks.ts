import { useState, useEffect, useMemo } from 'react'

const apiBase = process.env.REACT_APP_API_BASE

export default function useLinks() {
  const [links, setLinks] = useState([])

  const getLinks = async () => {
    const res = await fetch(`${apiBase}/information/queryList`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        infoType: 3,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      if (200 != data.code) {
        throw new Error(data.msg)
      } else {
        setLinks(await data.data)
      }
    } else {
      throw new Error(res.statusText)
    }
  }

  useEffect(() => {
    getLinks()
  }, [])

  return links
}

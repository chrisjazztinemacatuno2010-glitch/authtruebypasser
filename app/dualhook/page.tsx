"use client"

import Link from "next/link"

export default function DualhookPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Discord Invitation Card */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
          Dualhook Gen
        </h1>

        <p className="text-2xl text-cyan-400 font-light">is coming soon</p>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 shadow-2xl shadow-cyan-500/20">
          <p className="text-lg text-slate-300">We're working on something amazing. Stay tuned!</p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Bypasser
        </Link>
      </div>
    </main>
  )
}

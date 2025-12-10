
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, XCircle, ExternalLink } from "lucide-react"

// Sample PR data
const prData = [
  { id: 1, title: "fix: minor typo in readme", status: "Solved", decision: "TRIVIAL", time: "120ms", url: "#" },
  { id: 2, title: "feat: add user authentication", status: "Unsolved", decision: "COMPLEX", time: "2.5s", url: "#" },
  { id: 3, title: "chore: update dependencies", status: "Unsolved", decision: "COMPLEX", time: "145ms", url: "#" },
  { id: 4, title: "refactor: optimize image loading", status: "Failed", decision: "COMPLEX", time: "1.8s", url: "#" },
  { id: 5, title: "docs: add API documentation", status: "Solved", decision: "TRIVIAL", time: "200ms", url: "#" },
  { id: 6, title: "feat: dark mode support", status: "Unsolved", decision: "COMPLEX", time: "3.2s", url: "#" },
]

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("ALL")

  // Filter data based on active filter
  const filteredData = prData.filter((pr) => {
    if (activeFilter === "ALL") return true
    if (activeFilter === "AI_SOLVED") return pr.decision === "TRIVIAL" && pr.status === "Solved"
    if (activeFilter === "HUMAN_NEEDED") return pr.decision === "COMPLEX"
    if (activeFilter === "SOLVED") return pr.status === "Solved"
    if (activeFilter === "UNSOLVED") return pr.status === "Unsolved"
    return true
  })

  // Calculate metrics
  const totalPRs = prData.length
  const aiSolved = prData.filter((pr) => pr.decision === "TRIVIAL" && pr.status === "Solved").length
  const humanNeeded = prData.filter((pr) => pr.decision === "COMPLEX").length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Solved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "Unsolved":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "Failed":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getDecisionColor = (decision: string) => {
    return decision === "TRIVIAL" ? "text-blue-400" : "text-orange-400"
  }

  return (
    <>
      <div className="network-background" />

      <main 
  className="min-h-screen bg-background/70 text-foreground relative z-10 main-with-bg"
>
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {/* Header with title */}
          <div className="mb-8">
  {/* Main Title with gradient */}
  <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
    AI Agent Dispatcher
  </h1>
  
  {/* Subtitle */}
  <p className="text-gray-300 mt-2">Monitor and analyze Pull Request processing</p>
</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total PRs Analyzed Card */}
            <Card className="bg-blue-900/30 border border-blue-700/50 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group backdrop-blur-sm">
              <CardHeader>
                <CardDescription className="text-muted-foreground">Total PRs Analyzed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-primary group-hover:text-blue-300 transition-colors">
                  {totalPRs}
                </div>
              </CardContent>
            </Card>

            {/* AI Solved Card - Green */}
            <Card className="bg-emerald-900/30 border border-emerald-700/50 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group backdrop-blur-sm">
              <CardHeader>
                <CardDescription className="text-muted-foreground">AI Solved (TRIVIAL)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ai-solved-color-box"
                  >
                    <span className="text-2xl font-bold text-white">{aiSolved}</span>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Automated</div>
                    <div className="text-xs text-green-400">✓ Complete</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Human Needed Card - Orange */}
            <Card className="bg-amber-900/30 border border-amber-700/50 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group backdrop-blur-sm">
            
              <CardHeader>
                <CardDescription className="text-muted-foreground">Human Needed (COMPLEX)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform human-needed-color-box"
                  >
                    <span className="text-2xl font-bold text-white">{humanNeeded}</span>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Review Required</div>
                    <div className="text-xs text-orange-400">⚠ Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Indicator */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Vercel Deployment: <span className="text-green-400">Ready</span>
              </span>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { id: "ALL", label: `ALL (${totalPRs})` },
              { id: "AI_SOLVED", label: `AI Solved (${aiSolved})` },
              { id: "HUMAN_NEEDED", label: `Human Needed (${humanNeeded})` },
              { id: "SOLVED", label: "SOLVED" },
              { id: "UNSOLVED", label: "UNSOLVED" },
            ].map((filter) => (
              <Button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-full px-6 transition-all ${
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Data Table */}
       {/* Data Table - Dark Cyber Theme */}
<Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-cyan-700/30 overflow-hidden shadow-2xl shadow-cyan-500/20 backdrop-blur-sm">
  <CardHeader className="border-b border-cyan-500/20">
    <CardTitle className="text-xl font-bold">
      <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        Pull Request Analysis
      </span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-cyan-500/30 bg-gray-800/80">
            <th className="text-left py-4 px-4 font-semibold text-cyan-300 font-mono text-sm">
              PR Title
            </th>
            <th className="text-left py-4 px-4 font-semibold text-cyan-300 font-mono text-sm">
              Status
            </th>
            <th className="text-left py-4 px-4 font-semibold text-cyan-300 font-mono text-sm">
              Agent Decision
            </th>
            <th className="text-left py-4 px-4 font-semibold text-cyan-300 font-mono text-sm">
              Execution Time
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((pr) => (
            <tr
              key={pr.id}
              className="border-b border-gray-700/50 hover:bg-gray-800/60 transition-all duration-200 cursor-pointer group"
            >
              <td className="py-4 px-4">
                <a
                  href={pr.url}
                  className="text-gray-200 hover:text-cyan-300 flex items-center gap-2 group-hover:gap-3 transition-all font-mono text-sm"
                >
                  <span className="text-cyan-400/70 font-bold">[{pr.id}]</span>
                  {pr.title}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                </a>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(pr.status)}
                  <span className={`text-sm font-mono px-3 py-1 rounded ${
                    pr.status === "Solved" 
                      ? "text-emerald-300 bg-emerald-500/10 border border-emerald-500/20" 
                      : pr.status === "Failed" 
                      ? "text-red-300 bg-red-500/10 border border-red-500/20" 
                      : "text-amber-300 bg-amber-500/10 border border-amber-500/20"
                  }`}>
                    {pr.status}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className={`text-sm font-mono font-bold px-3 py-1.5 rounded-full ${
                  pr.decision === "TRIVIAL" 
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                    : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                }`}>
                  {pr.decision}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm font-mono text-gray-300 bg-gray-800/80 px-3 py-1.5 rounded border border-gray-700 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-all duration-300">
                  {pr.time}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>

{/* Results count */}
<div className="mt-4 text-sm font-mono text-cyan-300 text-right bg-gray-900/50 px-4 py-2 rounded inline-block border border-gray-700">
  Showing <span className="text-white font-bold">{filteredData.length}</span> of <span className="text-white font-bold">{prData.length}</span> pull requests
</div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground text-right">
            Showing {filteredData.length} of {prData.length} pull requests
          </div>
        </div>
      </main>
    </>
  )
}


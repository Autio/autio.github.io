#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"

const CHANGELOG = process.env.MWATER_CHANGELOG_FILE || "/tmp/mwater-changelog.csv"
const NEWS = process.env.MWATER_NEWS_FILE || "/tmp/mwater-news.json"
const OUTPUT = new URL("./queue.json", import.meta.url)
const PROFILE = "https://autio.github.io/"
const LINKEDIN = "https://www.linkedin.com/in/petriautio/"

function parseCsv(text) {
  const rows = []
  let row = [], cell = "", quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++ } else quoted = !quoted
    } else if (c === "," && !quoted) { row.push(cell.trim()); cell = "" }
    else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++
      row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = ""
    } else cell += c
  }
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row)
  return rows
}

function normalizeUrl(url) {
  if (!url) return "https://portal.mwater.co/#/resource_center/changelog"
  if (url.startsWith("/#/")) return `https://portal.mwater.co${url}`
  return url.split(/\s+/)[0]
}

function clean(text) {
  return String(text || "").replace(/\s+/g, " ").replace(/\s+([.,!?])/g, "$1").trim()
}

function shorten(text, max) {
  text = String(text || "").split("\n").map(clean).join("\n").replace(/\n{3,}/g, "\n\n").trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1).replace(/\s+\S*$/, "")
  return `${cut}…`
}

function nextWeekdays(start, count) {
  const dates = []
  const d = new Date(`${start}T09:00:00Z`)
  while (dates.length < count) {
    const day = d.getUTCDay()
    if (day !== 0 && day !== 6) dates.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return dates
}

const changelogRows = parseCsv(fs.readFileSync(CHANGELOG, "utf8")).slice(2)
const changes = changelogRows.map(r => ({
  source: "mWater changelog", date: r[1], type: r[2], component: r[3], area: r[4],
  description: clean(r[5]), url: normalizeUrl(r[6])
})).filter(x => /^20\d\d-\d\d-\d\d$/.test(x.date) && x.description.length > 25)
  .sort((a, b) => b.date.localeCompare(a.date))

const rawNews = JSON.parse(fs.readFileSync(NEWS, "utf8"))
const fields = {
  platforms: "6e2aa847b1b640479c571bca8be0fa57", date: "e323073c2c594975a3e1a2d96dd3e6e1",
  title: "f7b8cf6b98554e789ecbabd6191924d5", summary: "d9da320d7bb64e3dbca6fd2362181060",
  link: "fe097515b0ec4f999a72346fa88c39a9"
}
const news = rawNews.map(r => ({
  source: "mWater Portal news", date: r.data?.[fields.date]?.value || "",
  title: clean(r.data?.[fields.title]?.value), description: clean(r.data?.[fields.summary]?.value),
  url: normalizeUrl(r.data?.[fields.link]?.value), platforms: r.data?.[fields.platforms]?.value || []
})).filter(x => x.title && x.description && (x.platforms.length === 0 || x.platforms.includes("vfRpnx9")))
  .sort((a, b) => b.date.localeCompare(a.date))

const evergreen = [
  { title: "Why WASH technology must work offline", description: "A product is not inclusive if its core workflows disappear with the signal. Offline-first design is infrastructure, not a convenience.", url: `${PROFILE}#about` },
  { title: "AI strategy for WASH data", description: "The question is no longer whether AI agents will reach data platforms, but whether we give them a safe, structured way in.", url: `${PROFILE}blog/ai-strategy.html` },
  { title: "The agent boundary problem", description: "Responsible AI starts by asking which boundary contains the thing we are trying to align: a model, an agent, a team, or an institution.", url: `${PROFILE}blog/agent-boundary-uncertainty.html` },
  { title: "From assets to accounting", description: "Water utilities need operational data to connect: infrastructure, customers, meter readings, billing and finance belong in one working system.", url: `${PROFILE}blog/from-assets-to-accounting.html` },
  { title: "Mapping whole water systems", description: "Useful asset management begins when pipes, pumps, tanks and meters form a connected system rather than isolated points on a map.", url: `${PROFILE}blog/asset-systems.html` },
  { title: "Product leadership in public-interest technology", description: "Good product work translates frontline constraints into systems that remain usable at national scale.", url: PROFILE },
  { title: "Product lessons from interconnected systems", description: "The strongest platforms become more valuable as their features connect: collection, governance, analysis and action reinforcing one another.", url: "https://www.linkedin.com/pulse/mwater-backbone-wash-sector-petri-autio-2h2nf/" },
  { title: "What I am building and learning", description: "Product management, WASH data and responsible AI meet in the practical details of tools that people can trust.", url: PROFILE }
]

// Lead with useful releases and durable product lessons. Personal links are occasional supporting sources,
// never engagement bait or a request for attention.
const selected = []
let ci = 0, ni = 0, ei = 0
for (let i = 0; i < 90; i++) {
  if (i % 15 === 14) selected.push({ ...evergreen[ei++ % evergreen.length], source: "Petri Autio" })
  else if (i % 2 === 0 && ni < news.length) selected.push(news[ni++])
  else selected.push(changes[ci++ % changes.length])
}

const openings = [
  "A product lesson from mWater:", "A small feature can remove a large operational burden.",
  "Building public-interest software means sweating the practical details.", "From the mWater product desk:",
  "Good data systems turn field reality into decisions.", "One thing I keep learning in WASH technology:"
]
const implications = [
  "The value is not the feature alone; it is the time and uncertainty it removes.",
  "That is how digital infrastructure earns trust: useful improvements, shipped steadily.",
  "At scale, seemingly modest usability gains compound across thousands of people.",
  "The useful test is whether it helps practitioners act with better information.",
  "This is the unglamorous work that makes data systems dependable."
]
const start = process.argv.find(x => x.startsWith("--start="))?.split("=")[1] || "2026-09-11"
const dates = nextWeekdays(start, 90)
const queue = selected.map((item, i) => {
  let body
  if (item.source === "Petri Autio") {
    body = `${item.description}\n\n${item.url}`
  } else if (item.source === "mWater Portal news") {
    body = `${openings[i % openings.length]} ${item.title}. ${shorten(item.description, 118)}\n\n${item.url}`
  } else {
    const subject = [item.component, item.area].filter(Boolean).join(" · ")
    body = `${openings[i % openings.length]} ${shorten(item.description, 125)}\n\n${implications[i % implications.length]}\n${item.url}`
    if (subject && body.length < 270) body = `${subject}\n\n${body}`
  }
  body = String(body).split("\n").map(clean).join("\n").replace(/\n{3,}/g, "\n\n").trim()
  if (body.length > 300) {
    const withoutUrl = body.replace(item.url, "").trim()
    body = `${shorten(withoutUrl, 298 - item.url.length)}\n${item.url}`
  }
  return {
    id: `weekday-${String(i + 1).padStart(3, "0")}`,
    scheduledDate: dates[i], status: "ready", text: body,
    source: item.source, sourceDate: item.date || null, sourceUrl: item.url,
    campaign: item.source === "Petri Autio" ? "personal-perspective" : "mwater-product"
  }
})

fs.writeFileSync(OUTPUT, `${JSON.stringify(queue, null, 2)}\n`)
console.log(`Prepared ${queue.length} weekday posts from ${start} through ${dates.at(-1)}.`)

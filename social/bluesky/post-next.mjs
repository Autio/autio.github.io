#!/usr/bin/env node

import fs from "node:fs"

const queue = JSON.parse(fs.readFileSync(new URL("./queue.json", import.meta.url), "utf8"))
const date = process.env.POST_DATE || new Date().toISOString().slice(0, 10)
const item = queue.find(x => x.scheduledDate === date && x.status === "ready")
if (!item) { console.log(`No ready post scheduled for ${date}.`); process.exit(0) }

if ([0, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay())) {
  throw new Error("Refusing to publish on a weekend.")
}
if ([...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(item.text)].length > 300) {
  throw new Error(`${item.id} exceeds Bluesky's 300-grapheme limit.`)
}
if (!process.argv.includes("--publish")) {
  console.log(`[dry run] ${item.id}\n\n${item.text}`)
  process.exit(0)
}

const identifier = process.env.BLUESKY_HANDLE
const password = process.env.BLUESKY_APP_PASSWORD
if (!identifier || !password) throw new Error("BLUESKY_HANDLE and BLUESKY_APP_PASSWORD are required.")

async function xrpc(method, body, token) {
  const response = await fetch(`https://bsky.social/xrpc/${method}`, {
    method: body ? "POST" : "GET",
    headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {})
  })
  if (!response.ok) throw new Error(`${method} failed (${response.status}): ${await response.text()}`)
  return response.json()
}

function linkFacets(text) {
  const encoder = new TextEncoder()
  return [...text.matchAll(/https?:\/\/[^\s]+/g)].map(match => ({
    index: { byteStart: encoder.encode(text.slice(0, match.index)).length, byteEnd: encoder.encode(text.slice(0, match.index + match[0].length)).length },
    features: [{ $type: "app.bsky.richtext.facet#link", uri: match[0] }]
  }))
}

const session = await xrpc("com.atproto.server.createSession", { identifier, password })
const feedUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(session.did)}&limit=30`
const recent = await (await fetch(feedUrl)).json()
if (recent.feed?.some(x => x.post?.record?.text === item.text)) {
  console.log(`${item.id} was already published; no duplicate created.`)
  process.exit(0)
}
const result = await xrpc("com.atproto.repo.createRecord", {
  repo: session.did, collection: "app.bsky.feed.post",
  record: { $type: "app.bsky.feed.post", text: item.text, facets: linkFacets(item.text), langs: ["en"], createdAt: new Date().toISOString() }
}, session.accessJwt)
console.log(`Published ${item.id}: ${result.uri}`)


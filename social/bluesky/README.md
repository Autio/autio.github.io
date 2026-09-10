# Petri Autio — Bluesky publishing system

This is a review-first weekday campaign for Petri Mikael Autio in his capacity as Head of Product at mWater and Solstice. It promotes useful mWater/Solstice work first, while consistently connecting that work to Petri's product leadership, longer LinkedIn writing and portfolio.

## Account profile

- Suggested handle: `petriautio.bsky.social` (or use `autio.github.io` as a custom handle after the account is established)
- Display name: `Petri Mikael Autio`
- Bio: `Head of Product at mWater & Solstice. Building open data infrastructure for WASH, global development and responsible AI. Longer work: autio.github.io`
- Website: `https://autio.github.io/`
- Location: `Helsinki, Finland`

The account should be personal and clearly disclose the professional affiliation; it should not look like an official mWater corporate account. Confirm mWater communications policy before publishing confidential, partner-specific or unreleased material.

## Editorial mix

- 65% practical product releases and feature explanations
- 25% WASH/data/AI product-leadership lessons
- 8% mWater or Solstice articles and events
- 2% personal-site or LinkedIn discovery

Links to the personal site and LinkedIn are intentionally rare and used as supporting sources, not calls for attention. Regular posts contain no engagement-bait questions and no "read more" or "more of my work" language. A useful feed earns attention; repeated self-promotion spends it. Petri should personally respond when practitioners choose to engage.

## Prepared queue

`queue.json` contains 90 unique weekday posts. Each has a date, source provenance, campaign label and final Bluesky-ready text. The generator blends the public mWater changelog, public Portal news feed and Petri's site. Re-run it only when intentionally replacing the queue:

```sh
node social/bluesky/generate-queue.mjs --start=2026-09-11
```

Review changes to `queue.json` before publishing. Edit any post directly to preserve Petri's voice and account for new context.

## Safe publishing

Create a Bluesky app password; do not use the main account password. Keep these values in a local secret store or repository Actions secrets:

- `BLUESKY_HANDLE`
- `BLUESKY_APP_PASSWORD`

Preview today's post:

```sh
node social/bluesky/post-next.mjs
```

Publish it only after review:

```sh
node social/bluesky/post-next.mjs --publish
```

The publisher refuses weekends, checks the 300-grapheme limit, creates rich link facets and checks the recent feed before posting to avoid duplicates.

## Growth loop

Posting alone will not reliably grow a network. Budget 15 minutes after each post to reply thoughtfully to WASH, humanitarian data, digital public goods, GIS and responsible-AI conversations. Add the Bluesky link to the LinkedIn contact section and autio.github.io; periodically invite LinkedIn readers to follow the more frequent Bluesky product notes. Measure profile views, follows, link clicks and substantive conversations monthly—not raw impressions alone.

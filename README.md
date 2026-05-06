# Writepad

> A private, URL-first text editor for modern note-taking. Your entire document lives in the link — no account, no server, no telemetry.

### → Try it at **[writepad.org](https://writepad.org)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![Editor: BlockNote](https://img.shields.io/badge/Editor-BlockNote-2C7A7B)](https://www.blocknotejs.org/)

Writepad is a fast, beautiful, browser-only block editor that compresses your whole document into the URL hash. Open [writepad.org](https://writepad.org), write, copy the link, paste it anywhere — that *is* the share, the save, and the sync. No sign-in walls, no "we've updated our privacy policy" emails, no startup that quietly pivots away from your notes one Tuesday.

---

## Table of contents

- [What is Writepad?](#what-is-writepad)
- [Why this exists](#why-this-exists)
- [Features](#features)
- [Credits & dependencies](#credits--dependencies)
- [License](#license)

---

## What is Writepad?

Writepad is an **open-source, single-page block editor** built with [Astro](https://astro.build), [React](https://react.dev), and [BlockNote](https://www.blocknotejs.org/). It runs entirely in your browser at [writepad.org](https://writepad.org). There is no backend. There is no database. There is no analytics pixel watching you draft a grocery list.

What it gives you:

- A clean, distraction-free writing surface with a Notion-style block editor.
- Slash commands, Markdown shortcuts, formatting toolbar, headings, lists, checklists, tables, code blocks, images, and the rest of the modern-editor checklist.
- A built-in **TODO sidebar** for capturing tasks alongside your writing.
- Five hand-tuned themes — **Paper**, **Midnight**, **Ghibli**, **Forest**, **Sunset**.
- One-click export to **PDF, HTML, Markdown, or plain text**.
- A QR code share dialog so you can hand a document to your phone in two seconds.
- A URL-first persistence model that doubles as a portable file format — bookmark the link, you've saved the document.

What it intentionally does *not* have: accounts, comments, presence cursors, AI summarizers, "share to Slack" integrations, or a paid tier. It is a text editor.

---

## Why this exists

Most note-taking apps follow the same depressing arc: free at first, then a paywall, then an acquisition, then "we are sunsetting the product, please export your notes by Friday." Even the good ones quietly tie your data to an account so you can never quite leave.

Writepad was built around a stubborn idea: **your notes should belong to you, locally, in a format you can paste into a chat window.** That's it. The whole document lives in the URL hash, compressed and base64-encoded. To share, copy the URL. To back up, bookmark it. To migrate, paste it somewhere else. There is no lock-in because there is no _in_.

The other goals, in order of stubbornness:

1. **Privacy by architecture, not by promise.** Nothing leaves your device because there is nowhere for it to go. Open the network tab on [writepad.org](https://writepad.org) and check.
2. **No friction.** No login, no onboarding, no empty-state nag. The first interaction is typing.
3. **Pretty.** Writing tools should feel nice. Bad typography is a productivity bug.
4. **Built to outlast.** Just a static page on a CDN — the kind of thing that keeps working for years without anyone tending to it.

If you want collaboration, comments, and a server team paging at 3am, this is the wrong tool. If you want a fast notepad you can trust to still work in five years because it is just HTML and JavaScript — open [writepad.org](https://writepad.org) and start typing.

---

## Features

### Editor
- Block-based WYSIWYG built on **BlockNote** — headings, paragraphs, lists, checklists, toggle lists, quotes, code blocks, tables, dividers, images, video, audio, files, emoji.
- **Slash menu** (`/`) for inserting blocks.
- **Markdown shortcuts** at the start of a block (`#`, `##`, `-`, `1.`, `[]`, `>`, ` ``` `).
- **Inline shortcuts** — `**bold**`, `*italic*`, `~~strike~~`, `` `code` ``.
- Keyboard shortcuts for bold, italic, underline, strikethrough, link, undo, redo.
- **Edit / View** mode toggle for distraction-free reading.

### Persistence
- **URL-hash storage** — the document is serialized, compressed, and lives in `#…` after every edit (debounced).
- **localStorage backup** — last successful encode is saved as a crash-safe fallback.
- **Pre-paint theme** — the saved theme + mode apply before the first frame, so there is no flash of the wrong palette.

### Sidebar TODOs
- Add, complete, reorder via drag-and-drop, delete with a two-step confirm.
- Active vs completed split with relative timestamps that update in place.
- Resizable divider (20% – 60%), double-click to reset; collapsible on desktop, sliding overlay on mobile.

### Export & share
- **Plain text** — Markdown-aware stripping that preserves structure.
- **Markdown** — via BlockNote's lossy converter.
- **HTML** — clean, self-contained, print-friendly stylesheet baked in.
- **PDF** — client-side rendering, no upload step.
- **QR code** — instant scan-to-open for shorter documents.

---

## Credits & dependencies

Writepad stands on a lot of excellent shoulders. The libraries it depends on directly:

- **[BlockNote](https://www.blocknotejs.org/)** — the block editor that makes the whole thing feel modern.
- **[Astro](https://astro.build)** — the static site framework.
- **[React](https://react.dev)** — the UI library.
- **[Zustand](https://zustand-demo.pmnd.rs/)** — small, sane state management.
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling.
- **[@react-pdf/renderer](https://react-pdf.org/)** — declarative PDF rendering in the browser.
- **[qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator)** — pure JS QR codes.
- **[nanoid](https://github.com/ai/nanoid)** — short, collision-resistant IDs.

Fonts loaded by the layout: **[Inter](https://rsms.me/inter/)**, **[Fraunces](https://fonts.google.com/specimen/Fraunces)**, **[Lora](https://fonts.google.com/specimen/Lora)**, **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)**.

If you maintain something on this list and want a different attribution (or wish to be removed), open an issue and we'll fix it.

---

## License

Writepad is released under the **[MIT License](LICENSE)** © 2026 Arun Karnawat Jain.

In plain English: do whatever you want with it — fork it, study it, learn from it, build on top of it. Just keep the copyright notice and don't sue the author when it breaks. The full text is in [LICENSE](LICENSE).

The dependencies listed above are each governed by their own (mostly permissive) licenses; consult their respective repositories for terms.

---

<sub>Built because notes deserve to outlive the company that made the app. Live at [writepad.org](https://writepad.org).</sub>

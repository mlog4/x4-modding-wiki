---
title: About this prototype
---

## Purpose

This is a prototype site for the X4 Foundations Modding Wiki. The first attempt (`modding_site/`) had quality issues:

- Content was dense and unverified — concepts written from analysis artifacts without sample-grep verification.
- Pages were 15-20KB markdown each, hard to scan.
- No editorial review pass.
- Build velocity exceeded sustainable verification rate.

## New approach

- **Hierarchical abstractions** as primary navigation (general → specific).
- **Per-page schema** like Screeps API docs (description + properties + actions + libraries + events + examples + gotchas + related).
- **Verification protocol** for every claim (sample-grep vanilla source, working examples).
- **Small steps** — one abstraction at a time, reviewed before next.

## Status

This is **only a prototype** for evaluating structure. The [Station](/api/objects/station/) page is the most complete; everything else is placeholder. Once approved, content gets built incrementally with verification at each step.

## Old site

The old site (`modding_site/`) is preserved as an archive. Git history is intact. Useful content may be migrated into this structure after verification.

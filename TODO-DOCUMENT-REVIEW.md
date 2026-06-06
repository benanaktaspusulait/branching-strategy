# TODO: Document Review Follow-Up

Review date: 2026-06-06

Scope reviewed:
- `COMPLETE-DOCUMENT.md`
- `README.md`
- `docs/**/*.md`
- `TODO-TRANSFORMATION-PROGRAMME.md`

## Summary

The document set is coherent and decision-ready, but the consolidated `COMPLETE-DOCUMENT.md` has broken relative links after concatenation. The bigger content risk is status ambiguity: several decisions remain proposed or need confirmation while the transformation roadmap marks Phase 0 as done/active. Ownership, scope, hotfix, rollback and approval decisions should be closed before this is treated as an approved operating model.

## P0 - Fix Before Sharing The Complete Document

| # | Task | Evidence | Owner | Status |
| --- | --- | --- | --- | --- |
| 1 | Fix broken links in `COMPLETE-DOCUMENT.md`. Links copied from `docs/*` and `docs/reference/*` still use their original relative paths, which break from the repository root. Either rewrite them to `docs/...` paths or convert them to in-document anchors. | `COMPLETE-DOCUMENT.md:154`, `COMPLETE-DOCUMENT.md:436`, `COMPLETE-DOCUMENT.md:4513`, `COMPLETE-DOCUMENT.md:5679` | Docs owner | Open |
| 2 | Resolve the Phase 0 status contradiction. The roadmap says Phase 0 is "Decisions and ownership", but the Gantt marks it as `done` while key decisions and owners are still unresolved. | `COMPLETE-DOCUMENT.md:2728`, `COMPLETE-DOCUMENT.md:2746`, `COMPLETE-DOCUMENT.md:2810` | Release/programme owner | Open |
| 3 | Clarify whether the existing transformation TODO means "sections written" or "programme actions complete". It currently shows all sections complete, which can be confused with operational readiness. | `TODO-TRANSFORMATION-PROGRAMME.md:7`, `TODO-TRANSFORMATION-PROGRAMME.md:15` | Docs owner | Open |

## P1 - Close Decision And Ownership Gaps

| # | Task | Evidence | Owner | Status |
| --- | --- | --- | --- | --- |
| 4 | Centralise all open confirmations into one decision register with owner, approver, due date and status. | `COMPLETE-DOCUMENT.md:729`, `COMPLETE-DOCUMENT.md:1334`, `COMPLETE-DOCUMENT.md:1886`, `COMPLETE-DOCUMENT.md:2711` | Release owner | Open |
| 5 | Define the release scope for "all services" and mark each tracked change type as included, excluded or conditional. | `COMPLETE-DOCUMENT.md:2143`, `COMPLETE-DOCUMENT.md:2176`, `COMPLETE-DOCUMENT.md:2207` | Release owner + squad leads | Open |
| 6 | Replace `TBD` entries in the ownership and backup-owner matrix with named roles or named people before rollout expansion. | `COMPLETE-DOCUMENT.md:2207`, `COMPLETE-DOCUMENT.md:2313`, `COMPLETE-DOCUMENT.md:2324` | Engineering managers | Open |
| 7 | Approve the 15 rollout decisions or change their status from `Proposed` to a more precise lifecycle such as Proposed / Approved / Rejected / Deferred. | `COMPLETE-DOCUMENT.md:2363`, `COMPLETE-DOCUMENT.md:2379`, `COMPLETE-DOCUMENT.md:5323` | Decision group | Open |
| 8 | Finish the hotfix and rollback operating model: approver, tagging point, manifest update, forward merge, rollback-vs-fix-forward criteria, audit evidence and test cadence. | `COMPLETE-DOCUMENT.md:1981`, `COMPLETE-DOCUMENT.md:2039`, `COMPLETE-DOCUMENT.md:2120` | Release owner + incident lead | Open |
| 9 | Confirm strict validation rules for wrong tags, missing tags, invalid ticket state, `do not deploy` markers and `NA` tag entries. | `COMPLETE-DOCUMENT.md:1788`, `COMPLETE-DOCUMENT.md:1859`, `COMPLETE-DOCUMENT.md:1881` | Platform / DevOps | Open |

## P2 - Improve Readability And Maintainability

| # | Task | Evidence | Owner | Status |
| --- | --- | --- | --- | --- |
| 10 | Add a generated table of contents to `COMPLETE-DOCUMENT.md` or split it into an export bundle. At 5,682 lines, the complete document is hard to navigate without a TOC. | `COMPLETE-DOCUMENT.md` | Docs owner | Open |
| 11 | Add visible section separators or source markers between concatenated documents so readers know when a new source file begins. | `COMPLETE-DOCUMENT.md:148`, `COMPLETE-DOCUMENT.md:484`, `COMPLETE-DOCUMENT.md:4509` | Docs owner | Open |
| 12 | Consider reducing duplicate summaries in the complete document by keeping one executive summary and moving detailed rationales to appendices. | `COMPLETE-DOCUMENT.md:21`, `COMPLETE-DOCUMENT.md:222`, `COMPLETE-DOCUMENT.md:439` | Docs owner | Open |
| 13 | Add a simple markdown validation command to the repo for link checking before regenerating or sharing the complete document. | Broken links found only in `COMPLETE-DOCUMENT.md`; individual `README.md` and `docs/**/*.md` links resolve. | Docs owner | Open |

## Suggested Execution Order

1. Fix `COMPLETE-DOCUMENT.md` link rewriting.
2. Correct the Phase 0 and transformation TODO status language.
3. Create the central decision register.
4. Fill release scope and ownership matrix.
5. Approve or defer rollout decisions.
6. Finish hotfix/rollback and strict validation policy.
7. Improve complete-document navigation and add link validation.

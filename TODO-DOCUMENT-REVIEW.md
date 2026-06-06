# TODO: Document Review Follow-Up

Review date: 2026-06-06

Scope reviewed:
- `COMPLETE-DOCUMENT.md`
- `README.md`
- `docs/**/*.md`
- `TODO-TRANSFORMATION-PROGRAMME.md`

## Summary

The document set is now structurally coherent and decision-ready. The consolidated `COMPLETE-DOCUMENT.md` is generated from source documents, has a source-level contents table, visible source markers and validated local links. Operational approvals are intentionally still open: ownership, scope, validation, hotfix, rollback and branch cutover decisions must be closed in `docs/release-decision-register.md` before this is treated as an approved operating model.

## P0 - Fix Before Sharing The Complete Document

| # | Task | Evidence | Owner | Status |
| --- | --- | --- | --- | --- |
| 1 | Fix broken links in `COMPLETE-DOCUMENT.md`. Links copied from `docs/*` and `docs/reference/*` still use their original relative paths, which break from the repository root. Either rewrite them to `docs/...` paths or convert them to in-document anchors. | `COMPLETE-DOCUMENT.md`, `scripts/build-complete-document.js`, `scripts/validate-markdown-links.js` | Docs owner | Done |
| 2 | Resolve the Phase 0 status contradiction. The roadmap now states that Phase 0 remains active until decisions and owners are closed. | `docs/transformation-programme.md`, `COMPLETE-DOCUMENT.md` | Release/programme owner | Done |
| 3 | Clarify whether the existing transformation TODO means "sections written" or "programme actions complete". It currently shows all sections complete, which can be confused with operational readiness. | `TODO-TRANSFORMATION-PROGRAMME.md` | Docs owner | Done |

## P1 - Close Decision And Ownership Gaps

| # | Task | Evidence | Owner | Status |
| --- | --- | --- | --- | --- |
| 4 | Centralise all open confirmations into one decision register with owner, approver, due date and status. | `docs/release-decision-register.md` | Release owner | Done |
| 5 | Define the release scope for "all services" and mark each tracked change type as included, excluded or conditional. | `docs/scope-ownership-approvals.md`, `docs/release-decision-register.md` | Release owner + squad leads | Done - approval still required |
| 6 | Replace vague ownership placeholders with explicit backup-owner assignment requirements before rollout expansion. | `docs/scope-ownership-approvals.md`, `docs/release-decision-register.md` | Engineering managers | Done - named backups still required |
| 7 | Approve the 15 rollout decisions or change their status from `Proposed` to a more precise lifecycle such as Proposed / Approved / Rejected / Deferred. | `docs/rollout-decision-proposals.md`, `docs/reference/rollout-decision-proposals-detailed.md`, `docs/release-decision-register.md` | Decision group | Done - approvals still required |
| 8 | Finish the hotfix and rollback operating model: approver, tagging point, manifest update, forward merge, rollback-vs-fix-forward criteria, audit evidence and test cadence. | `docs/hotfix-and-rollback.md`, `docs/release-decision-register.md` | Release owner + incident lead | Done - approval still required |
| 9 | Confirm strict validation rules for wrong tags, missing tags, invalid ticket state, `do not deploy` markers and `NA` tag entries. | `docs/automation-and-validation.md`, `docs/release-decision-register.md` | Platform / DevOps | Done - approval still required |

## P2 - Improve Readability And Maintainability

| # | Task | Evidence | Owner | Status |
| --- | --- | --- | --- | --- |
| 10 | Add a generated table of contents to `COMPLETE-DOCUMENT.md` or split it into an export bundle. At 5,682 lines, the complete document is hard to navigate without a TOC. | `COMPLETE-DOCUMENT.md` | Docs owner | Done |
| 11 | Add visible section separators or source markers between concatenated documents so readers know when a new source file begins. | `COMPLETE-DOCUMENT.md` | Docs owner | Done |
| 12 | Consider reducing duplicate summaries in the complete document by keeping one executive summary and moving detailed rationales to appendices. | `COMPLETE-DOCUMENT.md`, `scripts/build-complete-document.js` | Docs owner | Resolved - keep source-preserving complete document |
| 13 | Add a simple markdown validation command to the repo for link checking before regenerating or sharing the complete document. | `scripts/validate-markdown-links.js`, `README.md` | Docs owner | Done |

## Suggested Execution Order

1. Use `docs/release-decision-register.md` as the active approval tracker.
2. Close D20 and D21 before rollout expansion.
3. Close D13, D14 and D15 before strict validation enforcement.
4. Close D16, D17 and D18 before production rollout.
5. Close D01, D02 and D05 before branch cutover.
6. Rebuild and validate `COMPLETE-DOCUMENT.md` before sharing:
   `node scripts/build-complete-document.js && node scripts/validate-markdown-links.js`.

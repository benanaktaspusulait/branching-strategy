# Cerberus Release Process Understanding And Improvement Notes

| Field | Value |
| --- | --- |
| Owner | Benan Aktas |
| Status | In Review |
| Created | 2026-06-09 |
| Last updated | 2026-06-09 |
| Last reviewed | 2026-06-09 |
| Labels | kt-notes, ci-cd, release-engineering, cerberus |

---

## Key Message

1. The release challenge is broader than branching.
2. Release state is fragmented across Git branches, tags, images, Helm charts, manifests, Jira, secrets, Liquibase, runbooks and approvals.
3. The safer path is to make the current release process visible, repeatable, validated, owned and auditable before simplifying the branch model.

---

## Current Status

- Automation pilot in progress (Gareth/Achilles, configuration service).
- Scripts work locally; Drone execution is the remaining step.
- Rollout may be possible within the next release or two, subject to team confirmation.
- Decision register open with 23 items needing confirmation.

---

## How to Read This Page Set

> **Do Not Read Everything First.** Start with this page for the summary, then follow the reading path for your role.

| If you are a... | Start here | Then read |
| --- | --- | --- |
| Delivery lead | This page | 04 (decisions), 06 (ownership), 07 (roadmap) |
| Platform engineer | This page | 01 (findings), 03 (automation), 06.3 (environment readiness) |
| Release manager | This page | 02 (current model), 03 (proposed), 04 (decisions), 05 (hotfix/rollback) |
| Architect | This page | 07 (improvement path), 02.1 (branching options), 08 (future topics) |
| Squad developer | This page | 02.3 (squad briefing), 03 (automation flow), 10 (glossary) |

Full page tree and detailed reading orders: see [09 — Page Coverage Index](09-page-coverage-index.md).

---

## Known Assumptions

- Based on KT sessions, discussions and available notes.
- Some platform controls may exist outside the reviewed material.
- Ownership names are not confirmed unless explicitly stated.
- Proposed automation behaviour needs confirmation from Gareth / Achilles / platform team.
- Future platform topics are not current delivery scope.

---

## Summary

This page summarises the current understanding of the Cerberus CI/CD, release and deployment process. The main finding is that the release challenge is broader than the branching model, and the safer approach is phased stabilisation before structural change.

The possible approach for discussion:

1. Stabilise the release operating model (validation, ownership, automation, rollback).
2. Move release automation into Drone.
3. Cut over to `main = production` only when the above is proven.
4. Keep longer-term platform visibility ideas separate from the immediate release-process work.

---

## Objectives

- Make the release process visible, repeatable, validated, owned and auditable.
- Reduce manual release preparation effort.
- Enforce strict tag/manifest validation.
- Document and test hotfix and rollback flows.
- Assign named owners for all release activities.
- Move release automation into Drone (centralised, auditable).
- Enable branch model simplification only after the above is stable.

---

## Approach

| Phase | Focus |
| --- | --- |
| Phase 0 | Confirm rollout decisions, assign named owners. |
| Phase 1 | Quick wins: strict validation dry-run, environment readiness, rollback docs. |
| Phase 2 | Drone automation pilot: auto branch/tag/chart, reporting, alerting. |
| Phase 3 | Branch cutover: `main = production`, branch protections. |
| Phase 4 | Scale: changed-chart deployment, shared dev, full RACI. |
| Phase 5+ | Separately evaluate feature flags, secrets, observability, platform ideas. |

---

## Review and Sign-Off

| Reviewer | Area | Feedback Required | Status | Date |
|----------|------|-------------------|--------|------|
| TBC | Release management | Current-state accuracy | TBC | TBC |
| TBC | Platform / DevOps | Automation feasibility | TBC | TBC |
| TBC | Architecture | Phased approach and scope | TBC | TBC |
| TBC | QAT | Validation and approval gates | TBC | TBC |
| TBC | Delivery lead | Roadmap and priorities | TBC | TBC |
| TBC | Squad lead(s) | Squad impact and readiness | TBC | TBC |

---

## Reader Guide

| If you want to understand... | Read this page |
| --- | --- |
| The overall summary and proposed approach | **This page** (00) |
| The main CI/CD findings and possible actions | [CI/CD Findings and Actions](01-cicd-findings-and-actions.md) |
| The current release operating model | [Current Release Operating Model](02-current-release-operating-model.md) |
| The proposed automation flow | [Proposed Release Automation Flow](03-proposed-release-automation-flow.md) |
| The decisions that need confirmation | [Rollout Decision Proposals](04-rollout-decision-proposals.md) |
| Hotfix and rollback handling | [Hotfix and Rollback](05-hotfix-and-rollback.md) |
| Ownership, RACI and approval gaps | [Ownership and Approvals](06-ownership-and-approvals.md) |
| Maturity observations, roadmap and metrics | [Improvement Path and Maturity Observations](07-transformation-programme.md) |
| Future platform topics (not in current scope) | [Future Platform Topics](08-platform-and-knowledge-graph.md) |
| Page coverage and content mapping | [Page Coverage Index](09-page-coverage-index.md) |
| Key terms and definitions | [Glossary](10-glossary.md) |

---

## References

- Detailed decision register: see [Rollout Decision Proposals](04-rollout-decision-proposals.md).

---

Feedback or questions? Contact the page owner or comment below.

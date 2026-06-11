# Ownership and Approvals

| Field | Value |
| --- | --- |
| Owner | Benan Aktas |
| Status | In Review |
| Created | 2026-06-09 |
| Last updated | 2026-06-09 |
| Labels | ownership, raci, governance, cerberus, release-engineering |

---

## Summary

Automation cannot replace accountability. Without named owners, decisions are delayed and escalation is unclear. This page identifies ownership gaps, defines the repositories and change types needing classification, provides an ownership matrix template, outlines the environment readiness checklist and maps the approval points in the release lifecycle.

Open scope and ownership decisions are tracked under D20 and D21 in [04 — Rollout Decision Proposals](04-rollout-decision-proposals.md).

---

## Ownership Gap Table

| Area | Accountable Owner Needed | Why |
|------|--------------------------|-----|
| Release readiness | Release owner | Confirms release can progress. |
| Manifest/tag validation | Release owner / platform owner | Prevents wrong artefacts. |
| Drone secrets/tokens | Platform owner | Prevents environment failures. |
| Hotfix decision | Release owner / incident lead | Avoids production drift. |
| Rollback decision | Release owner / incident lead | Ensures fast incident response. |
| Changed-chart exclusion | Release owner | Prevents hidden deployment gaps. |
| Environment readiness | Platform / environment owner | Confirms deployability. |
| Alert response | Named squad/platform owner | Ensures failed automation is handled. |

---

## Approval Points

| Point | Type | Approver |
|-------|------|----------|
| Merge to `development` | Process step | Squad lead / peer |
| Release branch cut | Automated | Release owner (oversight) |
| Tag creation | Automated | Release owner (oversight) |
| Manifest MR | Approval gate | Release owner |
| Promotion to SIT | Approval gate | Release owner |
| QAT approval | **Mandatory gate** | QAT lead |
| Production release | **Mandatory gate** | Release owner + QAT |
| Rollback/fix-forward decision | **Mandatory gate** | Release owner + incident lead |
| Post-release closure | Process step | Release owner |

---

## Escalation / Decision Ownership

| Scenario | Decision Owner | Escalation To | SLA |
|----------|---------------|---------------|-----|
| Failed validation (wrong tag / missing tag) | Release owner | Platform owner | Within release window |
| Failed automation step | Platform owner | Release owner | Within 1 hour |
| Chart exclusion request | Release owner | Delivery lead | Before release closure |
| Hotfix request (production) | Release owner + incident lead | Delivery lead | Within 1 working day |
| Rollback decision | Incident lead + release owner | Delivery lead | Within agreed time budget |
| Environment readiness failure | Platform owner | Release owner | Before deployment attempt |
| Secrets issue (exposure / rotation) | Platform owner + security | Security lead | Immediate |

All owners TBC — to be confirmed with team leads before rollout expansion.

---

## Child Pages

| Page | Content |
| --- | --- |
| [Release Scope And Repository Classification](06.1-release-scope-and-repository-classification.md) | Repository list, service scope questions, change type tracking |
| [RACI And Approval Matrix Detail](06.2-raci-and-approval-matrix-detail.md) | Full RACI, ownership matrix, approval points, governance controls |
| [Environment Readiness Checklist](06.3-environment-readiness-checklist.md) | Full readiness detail, setup considerations, token ownership |

---

## References

- Decision register (D20, D21): see [04 — Rollout Decision Proposals](04-rollout-decision-proposals.md)
- Hotfix approval flow: see [05 — Hotfix and Rollback](05-hotfix-and-rollback.md)
- RACI matrix detail: see [07 - Improvement Path And Maturity Observations](07-transformation-programme.md)

---

Feedback or questions? Contact the page owner or comment below.

---

## Related Pages

- [Current Release Operating Model](02-current-release-operating-model.md)
- [Proposed Release Automation Flow](03-proposed-release-automation-flow.md)
- [Rollout Decision Proposals](04-rollout-decision-proposals.md)
- [Hotfix And Rollback](05-hotfix-and-rollback.md)
- [Improvement Path And Maturity Observations](07-transformation-programme.md)

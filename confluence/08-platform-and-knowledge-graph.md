# Future Platform Topics - Not In Current Scope

| Field | Value |
| --- | --- |
| Owner | Benan Aktas |
| Status | In Review |
| Created | 2026-06-09 |
| Last updated | 2026-06-09 |
| Labels | future-topics, platform-engineering, cerberus, release-engineering |

This page is a short holding note for future platform topics. None of the items below are part of the current Phase 0-4 release-process improvement work.

---

## Summary

The immediate priority remains release operating model maturity: visible release state, strict validation, named ownership, Drone automation, rollback readiness, environment readiness and audit evidence.

After those foundations are proven, the team may separately review longer-term platform topics. These should not be treated as committed delivery scope or as prerequisites for the current release-process work.

---

## Future Topics To Review Separately

| Topic | Possible Value | Why It Is Not Current Scope |
| --- | --- | --- |
| Observability-linked release reports | Easier post-deploy health review and incident investigation. | Needs reliable release records and agreed service metrics first. |
| Read-only release visibility dashboard | One place to view Git, Drone, Helm, deployment-management, Jira and environment state. | Should start read-only and only after release metadata is trustworthy. |
| GitOps / ArgoCD evaluation | Drift detection and pull-based deployment model. | Production use would need separate source-of-truth, RBAC, audit and operating-model review. |
| Knowledge Graph / release intelligence | Faster impact analysis and audit traversal across release relationships. | Over-engineered until metadata quality, ownership and event sources are proven. |
| Unified control-plane workflow | Potential single interface for release visibility and workflow. | Any trigger or write capability could create separation-of-duties risk and needs separate review. |

---

## Guardrails

- Keep these topics out of the current rollout decision set.
- Start with read-only visibility before considering workflow or trigger capability.
- Do not introduce production GitOps, progressive delivery, automatic rollback or central trigger control without separate architecture, security and operational review.
- Do not use future platform ideas to delay near-term fixes to validation, ownership, rollback and release reporting.

---

## References

- Immediate priorities: see 07 - Improvement Path And Maturity Observations.
- Current automation proposal: see 03 - Proposed Release Automation Flow.
- Source architecture detail, if needed later: `docs/platform-engineering-strategy.md`, `docs/deployment-knowledge-graph-design.md`, `docs/advanced-architecture-sections.md`.

---

Feedback or questions? Contact the page owner or comment below.

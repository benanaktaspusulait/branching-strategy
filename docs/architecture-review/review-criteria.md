# Possible Review Criteria

Status: Optional review note / working reference.

## Review Lens

If the notes are later taken into a formal review, these two lenses may be useful:

1. Formal review readiness: can the proposal be understood, governed, funded, delivered and operated safely?
2. Border-security criticality: would the recommendation remain safe in a mission-critical, national-security-adjacent platform with strict audit, high availability and low tolerance for deployment mistakes?

## Decision Standards

| Standard | Question |
| --- | --- |
| Operational safety | Does the recommendation reduce production risk, or simply move risk into automation? |
| Blast radius control | If it fails, how many services, releases, environments or teams could be affected? |
| Recoverability | Is there a tested recovery path, not just a theoretical rollback option? |
| Auditability | Can the team prove who changed what, when, why and with whose approval? |
| Human operability | Can release managers, incident leads and squads understand the process during an incident? |
| Security and classification | Does the proposal protect sensitive topology, deployment metadata, user identities and operational evidence? |
| Data quality | Are decisions based on complete, fresh and trustworthy metadata? |
| Governance | Are owners, approvers, backups and escalation paths named? |
| Incremental delivery | Can the change be piloted, measured and rolled back without a big-bang shift? |
| Enterprise fit | Does it align with architecture, security, change management and platform strategy? |

## Scoring Scale

| Score | Meaning |
| --- | --- |
| 1 | Not acceptable for critical environment. |
| 2 | Weak; significant controls required before use. |
| 3 | Plausible with modification and clear guardrails. |
| 4 | Strong, provided owners and evidence are in place. |
| 5 | Strong and ready for controlled rollout. |

## Status Map

| Area | Current Status | Review Position |
| --- | --- | --- |
| Release operating model | Proposed / needs confirmation | Treat as assessment, not approved policy. |
| Branch cutover to `main = production` | Needs confirmation | Defer until validation, ownership, rollback and production baseline evidence are proven. |
| Drone release automation | Pilot / proposed | Support controlled pilot; require manual approvals and rerun controls. |
| Strict validation | Needs confirmation | Strongly support; dry-run first, then fail-fast after evidence. |
| Changed-chart deployment | Needs confirmation | Support with audited exclusion and manifest comparison controls. |
| Hotfix and rollback | Needs confirmation | Needs confirmation and testing before production rollout. |
| Release scope and ownership | Needs owner / needs confirmation | Blocker for scale-out. |
| GitOps / ArgoCD | Medium/long-term option | Defer production adoption; evaluate non-prod only after source-of-truth discipline is proven. |
| Progressive delivery / auto-rollback | Future option | Defer automated production decisions; start with observability and manual gates. |

## Review Constraints

- Do not mark any proposal as approved without explicit owner or formal approval evidence.
- Use the source files for detailed traceability if a question needs deeper evidence.
- Do not recommend faster deployment at the expense of traceability.
- Do not recommend automation that bypasses human approval for high-impact environments.

## Related Pages

- [Potential Architecture Review Notes](index.md)
- [Recommendation Inventory](recommendation-inventory.md)
- [Criticality Challenge Notes](criticality-challenge-review.md)

# Criticality Challenge Review

Status: Completed architecture review output.

## Suitability Assessment

| Recommendation | Suitable | Needs Modification | Not Recommended | Reason |
| --- | --- | --- | --- | --- |
| Stabilise release operating model first | Yes | No | No | Reduces systemic risk before structural change. |
| Branch strategy simplification | No | Yes | No | Good later, unsafe before validation and rollback are proven. |
| Release branch automation | Yes | Yes | No | Pilot only; scope and rerun controls required. |
| Drone migration for release scripts | Yes | Yes | No | Improves auditability but must not bypass approvals. |
| Strict validation framework | Yes | Yes | No | Strong control; dry-run first to avoid surprise release blocks. |
| Changed-chart deployment | No | Yes | No | Needs dependency analysis and audited exclusions. |
| Release reporting | Yes | Yes | No | Must define retention, classification and evidence ownership. |
| Release ownership model | Yes | Yes | No | Role model exists; named people/backups still required. |
| Unified deployment control plane | No | Yes | No | Read-only first; write actions deferred. |
| Knowledge Graph | No | Yes | No | Limited pilot only after metadata quality improves. |
| Engineering Copilot | No | Yes | No | Evidence retrieval only; no autonomous operational decisions. |
| Event-driven architecture | Yes | Yes | No | Useful, but needs replay, DLQ and reconciliation controls. |
| Rollback recommendations | Yes | Yes | No | Must distinguish rollback from fix-forward and data constraints. |
| Environment promotion model | Yes | Yes | No | Strong if approvals and readiness gates are explicit. |
| Progressive delivery | No | Yes | No | Defer broad use; service-by-service evaluation. |
| GitOps | No | Yes | No | Non-prod evaluation only until source-of-truth discipline is proven. |
| Approval workflow automation | No | Yes | No | Automate evidence, not authority, until SoD is proven. |

## Scale And Criticality Scores

Scores: 1 poor, 5 excellent.

| Recommendation | Operational Safety | Blast Radius | Recovery Complexity | Human Factors | Auditability | Security Impact | Platform Complexity |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Strict validation | 5 | 4 | 4 | 4 | 5 | 4 | 3 |
| Named ownership | 5 | 5 | 5 | 5 | 5 | 4 | 4 |
| Drone automation pilot | 4 | 3 | 3 | 3 | 4 | 3 | 3 |
| Branch cutover | 3 | 2 | 3 | 3 | 4 | 3 | 3 |
| Changed-chart deployment | 3 | 2 | 2 | 3 | 4 | 3 | 3 |
| Hotfix/rollback process | 5 | 4 | 3 | 4 | 5 | 4 | 3 |
| Knowledge Graph pilot | 3 | 3 | 3 | 4 | 5 | 3 | 2 |
| Unified control plane read-only | 3 | 3 | 3 | 4 | 5 | 3 | 2 |
| Control plane trigger capability | 2 | 2 | 2 | 3 | 3 | 2 | 1 |
| Engineering Copilot evidence retrieval | 3 | 4 | 4 | 3 | 4 | 3 | 2 |
| Engineering Copilot recommendations/actions | 1 | 1 | 1 | 2 | 2 | 1 | 1 |
| Production GitOps | 2 | 2 | 2 | 3 | 4 | 3 | 2 |
| Progressive delivery auto-rollback | 2 | 2 | 2 | 2 | 4 | 3 | 2 |

## Automation Assumption Challenge

| Assumption | Why It May Be Valid | Why It May Be Dangerous | Required Safeguards |
| --- | --- | --- | --- |
| More automation is always better. | Removes manual inconsistency. | Automates mistakes at scale. | Pilot, dry-run, approval gates, kill switch. |
| Fewer approvals are better. | Reduces waiting and handoffs. | Removes human accountability in high-impact releases. | Keep production approval, SoD and emergency process. |
| Faster deployment is better. | Shorter lead time and less batching. | Can reduce review time and amplify blast radius. | Risk-based gates, scope controls, rollback drill. |
| GitOps is always better. | Improves drift detection and audit. | Introduces new controllers and operational model. | Non-prod pilot, RBAC, drift alerts, manual sync policy. |
| Progressive delivery is always better. | Can limit traffic exposure. | Requires high-quality telemetry and service architecture readiness. | Service eligibility, SLOs, manual review before auto-rollback. |
| Centralisation is better. | Reduces tool switching and improves visibility. | Creates attractive target and potential single point of control. | Read-only first, least privilege, audit, no bypass. |

## Rollback Assumption Challenge

| Area | Challenge | Recommendation |
| --- | --- | --- |
| Data consistency | Application rollback can conflict with schema/data state. | Record rollback eligibility per release. |
| Liquibase | Changesets may be forward-only or destructive. | Require rollback block or documented fix-forward plan. |
| Cross-system dependencies | One service rollback can break downstream compatibility. | Maintain dependency map and compatibility checks. |
| Partial rollback | Mixed versions may be worse than failed release. | Define service grouping and rollback units. |
| Event replay | Kafka/event consumers may process incompatible events. | Include event schema compatibility and replay plan. |
| Downstream systems | External consumers may observe already-emitted effects. | Treat rollback as operational decision, not pure technical reversal. |

## Knowledge Graph Recommendation

Recommendation: Run limited read-only pilot, not immediate full build.

Justification:

- Metadata quality is currently a known weakness.
- Incorrect relationships could create false confidence during incidents.
- Security classification and access control need strong design.
- Cost and operational ownership need approval.
- A small pilot around ownership and deployment visibility can prove value with limited blast radius.

Entry criteria:

- Release metadata standardisation underway.
- Service ownership accuracy baseline measured.
- RBAC and query audit design approved.
- Source-of-truth principle accepted.
- Freshness and completeness metrics defined.

## Engineering Copilot Guardrails

Allowed initial capabilities:

- Explain release state with citations.
- Retrieve approved runbook links.
- Summarise graph evidence.
- Identify missing evidence or stale data.
- Draft investigation checklists for human review.

Prohibited capabilities:

- Approving releases.
- Triggering deployments.
- Triggering rollbacks.
- Recommending production rollback without explicit evidence and human decision.
- Bypassing RBAC.
- Querying or exposing secret values.
- Presenting low-confidence graph data as fact.
- Making change advisory decisions.

# Architecture Review Source Document List

Status: Completed architecture review source list.

Review purpose: define the document set used for the ARB / executive / border-security criticality assessment.

## Review Scope Note

The review scope is based on the document set below. `COMPLETE-DOCUMENT.md` is the focused approval reader copy for release-management stabilisation. Appendix and future-vision files remain available for traceability, but they are not part of the immediate approval ask.

## Primary Architecture Package

These files form the core package to review.

| File | Role In Review | Review Focus |
| --- | --- | --- |
| `README.md` | Entry point and navigation | Executive readability, structure, decision path. |
| `docs/system-state-problems-solutions.md` | Decision-ready synthesis | Current-state framing, risks, recommendations, go/no-go logic. |
| `docs/current-release-operating-model.md` | Current release model | Existing process accuracy, operational assumptions, branch/tag/deploy flow. |
| `docs/deployment-and-release-findings.md` | Deployment findings | Helm, manifest, secrets, validation and environment constraints. |
| `docs/cicd-deployment-findings-and-actions.md` | CI/CD problem/action summary | Root causes, prioritisation, follow-up actions. |
| `docs/proposed-release-automation-flow.md` | Target release automation | Automation assumptions, changed-chart deployment, failure handling. |
| `docs/automation-and-validation.md` | Validation model | Strict validation, auditability, override rules, alerting. |
| `docs/hotfix-and-rollback.md` | Hotfix and rollback model | Rollback realism, fix-forward criteria, branch/manifest reconciliation. |
| `docs/scope-ownership-approvals.md` | Scope and ownership | Release scope, service ownership, approvals, backup owners. |
| `docs/rollout-decision-proposals.md` | Decision summary | Proposed decisions and approval status. |
| `docs/release-decision-register.md` | Decision register | Active approval tracker, owners, required evidence. |

## Transformation And Operating Model Package

| File | Role In Review | Review Focus |
| --- | --- | --- |
| `docs/transformation-programme.md` | Transformation strategy and target state | Maturity, near-term target-state realism, sequencing. |
| `docs/transformation-programme-delivery.md` | Delivery plan | Roadmap, RACI, metrics, cost/benefit, top recommendations. |
| `docs/platform-engineering-strategy.md` | Platform strategy | Promotion model, deployment strategy, observability gates. |

## Appendix And Future Reference Package

| File | Role In Review | Review Focus |
| --- | --- | --- |
| `docs/branching-options.md` | Branching strategy options | Branch model alternatives after stabilisation. |
| `docs/squad-briefing-summary.md` | Squad-facing communication | Human factors, adoption readiness, clarity for engineering teams. |
| `docs/release-engineering-best-practices.md` | Supporting practice baseline | Whether best practices are suitable for Cerberus criticality. |
| `docs/platform-engineering-strategy-advanced.md` | Advanced platform strategy | GitOps, SBOM, supply chain security, control plane direction. |
| `docs/advanced-architecture-sections.md` | Future architecture sections | Control plane, event ingestion, data trust and platform product framing. |
| `docs/deployment-knowledge-graph-design.md` | Knowledge graph design | Domain model, entity relationships, graph schema. |
| `docs/deployment-knowledge-graph-implementation.md` | Implementation and workflows | Event ingestion, APIs, search, operational use cases. |
| `docs/deployment-knowledge-graph-operations.md` | Operations and technology | Security, retention, integrations, technology choices, roadmap. |
| `docs/deployment-knowledge-graph-business-case.md` | Business case and governance | Strategic value, ROI, governance, NFRs and ADR. |

## Detailed Reference Package

Use these files to validate evidence, rationale and detailed assumptions.

| File | Role In Review | Review Focus |
| --- | --- | --- |
| `docs/reference/system-state-problems-solutions-detailed.md` | Detailed current-state analysis | Supporting evidence and assumptions. |
| `docs/reference/detailed-problems.md` | Detailed problem analysis | P1-P12 problem detail, root cause and evidence. |
| `docs/reference/detailed-solutions.md` | Detailed solution analysis | S1-S7 solution options, risks and experience notes. |
| `docs/reference/rollout-decision-proposals-detailed.md` | Detailed rollout decision rationale | Decision logic, guardrails, operational consequences. |

## Explicitly Out Of Scope For Architecture Review

| File / Area | Reason |
| --- | --- |
| Git history and commit messages | Not part of the architecture package unless evidence is needed later. |
| Local editor/project metadata | Not relevant to ARB review. |
| Runtime implementation code | This repository is documentation-focused; no service code is present. |

## Coverage Check

The review scope covers:

- Release engineering assessment.
- Transformation programme.
- Platform engineering strategy for promotion, deployment and observability gates.
- Governance, ownership, NFR, business case and ARB readiness material.

Knowledge Graph and unified control-plane material is appendix-only future vision and excluded from the immediate approval reader copy.

## Related Pages

- [Architecture Review Package](index.md)
- [Architecture Review Criteria](review-criteria.md)
- [Cerberus Release Engineering Assessment](../../README.md)

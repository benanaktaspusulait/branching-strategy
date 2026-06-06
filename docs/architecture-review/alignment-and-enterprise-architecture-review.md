# Architecture Alignment And Enterprise Architecture Review

Status: Tasks 9, 10, 11, 12, 13, 14 and 15 output from `TODO-ARCHITECTURE-REVIEW-FROM-NOTES.md`

## Architecture Alignment Report

| Issue | Impact | Recommendation |
| --- | --- | --- |
| Transformation roadmap, platform strategy and Knowledge Graph roadmap use different phase language. | Readers may assume future capabilities are nearer than intended. | Normalize phases into Foundation, Controlled Automation, Scale, Intelligence Pilot, Platform Control. |
| Control plane and Knowledge Graph are sometimes described together. | Responsibilities blur between data intelligence and operational action. | Define Knowledge Graph as read-model; Control Plane as interface/orchestration layer. |
| Engineering Copilot is described as future capability but appears near operational use cases. | AI readiness could be mistaken for permission to automate decisions. | Mark copilot as Phase 5+ advisory only, with prohibited capabilities. |
| GitOps, progressive delivery and trunk-based development are listed as improvements but not always gated by criticality. | Commercial SaaS practices may be over-applied to border-security context. | Add critical-environment prerequisites and explicit defer status. |
| Release decision register tracks release decisions, but future architecture decisions need their own approval trail. | ARB decisions may be mixed with release-process decisions. | Add ADRs for Knowledge Graph, control plane, GitOps and copilot. |
| Business case benefits differ across documents. | ARB may challenge inconsistent KPI targets. | Create one benefits realisation table with baseline, target and measurement method. |
| Ownership is role-based in RACI but not named. | Operational handoff remains unresolved. | Add named owner capture step before rollout expansion. |
| Security and data classification are strong in Knowledge Graph proposal but less explicit in release automation. | Release metadata can also expose sensitive topology and operations. | Apply classification, RBAC and audit to release reports and dashboards. |

## Terminology Map

| Term | Definition | Should Not Mean |
| --- | --- | --- |
| Release operating model | The approved process for branch, tag, artefact, manifest, approval, deploy and reconciliation. | A branch naming convention only. |
| Deployment Knowledge Graph | Read-model that correlates metadata from source systems. | Source of truth or deployment controller. |
| Unified Control Plane | User interface and workflow layer over approved automation and source systems. | A bypass around Drone, Jira, approvals or change control. |
| Release Intelligence | Query and reporting capability over release/deployment relationships. | Automated operational decisioning. |
| Engineering Copilot | Future assistant that retrieves evidence and explains context. | Autonomous deployer, approver or incident commander. |
| GitOps | Pull-based reconciliation from Git source of truth. | Any deployment-management repo with pipeline deploys. |
| Progressive delivery | Controlled traffic or rollout management with telemetry. | Faster deployment by default. |

## Business Architecture Review

| Aspect | Current Maturity | Target Maturity | Gaps | Recommendations |
| --- | --- | --- | --- | --- |
| Capabilities | 2.5 / 5 | 4 / 5 | Release governance, audit reporting and rollback capability are incomplete. | Define capability map: release planning, validation, deployment, incident recovery, audit. |
| Value streams | 2 / 5 | 4 / 5 | Commit-to-production flow is fragmented. | Map value stream from Jira ticket to production evidence. |
| Ownership | 2 / 5 | 4.5 / 5 | Role-level RACI exists, named owners missing. | Assign named owner/backups and escalation. |
| Governance | 2.5 / 5 | 4.5 / 5 | Decision register exists but approvals are open. | Create ARB approval conditions and release governance board cadence. |

## Application Architecture Review

| Aspect | Current Maturity | Target Maturity | Gaps | Recommendations |
| --- | --- | --- | --- | --- |
| Systems involved | 3 / 5 | 4 / 5 | Source systems are identified but integration ownership varies. | Maintain source system catalogue with owner and event/API contract. |
| Integration patterns | 2.5 / 5 | 4 / 5 | Webhooks, batch and pipeline events proposed but not prioritised. | Start with low-risk event ingestion from Git, Drone, Jira and deployment-management. |
| APIs | 2 / 5 | 4 / 5 | GraphQL/REST ideas exist but API NFRs and auth model need approval. | Define API contracts, RBAC, throttling and audit before build. |
| Events | 2 / 5 | 4 / 5 | Event schema, idempotency and replay need formal design. | Publish canonical event envelope and reconciliation strategy. |

## Data Architecture Review

| Aspect | Current Maturity | Target Maturity | Gaps | Recommendations |
| --- | --- | --- | --- | --- |
| Canonical model | 2.5 / 5 | 4 / 5 | Entities exist but release/control-plane canonical model needs versioning. | Approve canonical entity and relationship model through architecture governance. |
| Lineage | 2 / 5 | 4.5 / 5 | Release provenance is manual. | Capture commit, build, artefact, manifest, approval and deploy lineage. |
| Data quality | 2 / 5 | 4 / 5 | Metadata may be incomplete or wrong. | Add completeness, freshness and correctness SLOs. |
| Retention | 2.5 / 5 | 4 / 5 | Retention targets vary. | Define retention by data class and audit need. |
| Classification | 2.5 / 5 | 4.5 / 5 | Knowledge Graph declares OFFICIAL-SENSITIVE, release reports need same discipline. | Classify topology, release, personnel and incident metadata. |

## Technology Architecture Review

| Aspect | Current Maturity | Target Maturity | Gaps | Recommendations |
| --- | --- | --- | --- | --- |
| Hosting | 2.5 / 5 | 4 / 5 | Future platforms need HA and operational model. | Define hosting pattern, environment separation and admin access. |
| Scalability | 2 / 5 | 4 / 5 | 5+ billion records/month assumption needs capacity model. | Add volume model before graph/control-plane build. |
| Resilience | 2 / 5 | 4.5 / 5 | DR and failover are under-specified. | Define RTO/RPO and rebuild-from-event-store targets. |
| Observability | 2.5 / 5 | 4 / 5 | Health metrics exist but not release-correlated. | Add release health dashboard and ingestion freshness alerts. |
| Security | 2.5 / 5 | 4.5 / 5 | Security strong in graph proposal, less complete for automation/control plane. | Apply RBAC, SoD, audit and privileged access controls across all tooling. |


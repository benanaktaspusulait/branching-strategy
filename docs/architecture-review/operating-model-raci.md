# Operating Model And RACI

Status: Tasks 23, 24 and 25 output from `TODO-ARCHITECTURE-REVIEW-FROM-NOTES.md`

## Ownership Model

| Domain | Accountable Owner | Responsibilities | Backup Required |
| --- | --- | --- | --- |
| Release governance | Release owner | Release scope, approvals, go/no-go, closure. | Yes |
| Platform automation | Platform / DevOps owner | Drone pipeline, validation scripts, alerting, rerun safety. | Yes |
| Service delivery | Squad lead | Service changes, feature readiness, test evidence. | Yes |
| Architecture | Principal / enterprise architect | Architecture guardrails, ARB submissions, ADRs. | Yes |
| Data model and quality | Data owner / platform data steward | Graph/control-plane data quality, freshness, classification. | Yes |
| Security | Security owner | RBAC, SoD, privileged access, classification, audit. | Yes |
| Operations | Operations / incident lead | Incident command, rollback/fix-forward decision process. | Yes |
| QAT | QAT lead | Functional approval and release validation evidence. | Yes |
| Change management | Change advisory owner | CAB alignment, emergency change process, evidence. | Yes |

## RACI Matrix

| Activity | Platform Team | Engineering Teams | Architects | Release Managers | Product Owners | Operations | Security |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Release scope definition | C | R | C | A | C | I | I |
| Service ownership mapping | C | R/A | I | C | C | I | I |
| Branch strategy approval | C | C | A | C | I | I | I |
| Release branch automation | R/A | C | C | C | I | I | C |
| Tag/manifest validation | R | C | C | A | I | I | C |
| Environment readiness gate | R | C | C | A | I | C | C |
| Higher-environment promotion | R | C | I | A | I | C | C |
| Production release approval | C | C | C | A | C | C | C |
| Hotfix decision | R | R | C | A | C | C | C |
| Rollback/fix-forward decision | R | C | C | C | I | A | C |
| Post-release reconciliation | R | C | I | A | I | C | I |
| Release report retention | R | I | C | A | I | I | C |
| Knowledge Graph data quality | R | C | C | C | I | C | A/C |
| Control plane product ownership | R | C | A/C | C | C | C | C |
| Copilot guardrails | C | C | A | I | I | C | R/A |
| ARB submission | C | I | A/R | C | C | C | C |

Legend: R = Responsible, A = Accountable, C = Consulted, I = Informed.

## Governance Controls

| Control | Requirement |
| --- | --- |
| Separation of duties | The same person should not unilaterally approve, deploy and close a production release. |
| Privileged access | Admin access to Drone, deployment-management, graph/control plane and secrets must be approved, logged and reviewed. |
| Change advisory | Production deployment and emergency hotfixes must map to approved normal or emergency change process. |
| Override control | Validation overrides, chart exclusions and rollback exceptions require named approver and reason. |
| Evidence retention | Release report, approval, pipeline, deployment and reconciliation evidence must be retained for audit. |
| Incident command | Rollback/fix-forward decisions must be owned by incident lead with release owner consultation. |
| Security review | Any graph, control plane or copilot pilot requires RBAC, audit logging and data classification review. |
| Quarterly review | RACI, owner list, access rights and release metrics should be reviewed quarterly. |


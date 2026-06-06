# Missing Enterprise Concerns

Status: Completed architecture review output.

## Disaster Recovery And Operational Resilience

| Concern | Gap | Recommendation |
| --- | --- | --- |
| Release evidence recovery | Evidence retention and recovery target not fully specified. | Define RTO/RPO for release reports, approval evidence and generated artefacts. |
| Release evidence recovery | Generated reports, approvals and pipeline evidence need recovery targets. | Require restore test for release evidence before production rollout. |
| Automation outage | Release automation could become operational dependency. | Keep manual break-glass path documented and approved. |
| Automation failure | Rerun guidance exists but needs incident-level playbook. | Add automation failure runbook with stop/continue criteria. |

## Multi-Region And Capacity Planning

| Concern | Gap | Recommendation |
| --- | --- | --- |
| Multi-region | Not enough discussion of deployment topology and regional resilience. | Document whether Cerberus requires active/active, active/passive or single-region controls. |
| Release evidence volume | Report, pipeline and audit evidence retention volume is not yet modelled. | Create volume model: releases/month, artefacts, retention window and audit exports. |
| Cost control | Storage and compute costs for retained release evidence could grow. | Add storage tiering, retention windows and cost guardrails. |

## Data Sovereignty, Security Accreditation And Compliance

| Concern | Gap | Recommendation |
| --- | --- | --- |
| Data sovereignty | Release evidence hosting location not specified. | Confirm UK hosting, approved regions and cross-border restrictions. |
| Security accreditation | ARB proposal mentions classification but not full accreditation path. | Define security accreditation and threat modelling steps. |
| Sensitive topology | Release metadata can expose platform topology and operational patterns. | Classify topology, deployment and incident metadata. |
| Personnel data | Deployer names, ownership and audit logs may contain personal data. | Define lawful basis, retention and subject access handling. |
| Privileged access | Admin access model needs stronger controls. | Add privileged access workflow, break-glass and quarterly review. |

## Incident Command, Change Advisory And Ownership At Scale

| Concern | Gap | Recommendation |
| --- | --- | --- |
| Incident command | Rollback/fix-forward decision owner exists conceptually but not operationally. | Define incident roles, decision authority and communication channels. |
| Change advisory | CAB/emergency change relationship not explicit. | Map normal release, emergency hotfix and rollback to change processes. |
| Service ownership at scale | Ownership map must remain current across hundreds of services. | Add owner attestation cadence and stale-owner alerts. |
| Separation of duties | Automation expansion could blur approver/operator roles. | Enforce SoD in workflow and audit. |
| Operational training | New automation and reports may confuse teams without rehearsal. | Run release simulation and rollback drills before production rollout. |

## Related Pages

- [Architecture Review Package](index.md)
- [Criticality Challenge Review](criticality-challenge-review.md)
- [Operating Model And RACI](operating-model-raci.md)
- [ARB Package](arb-package.md)

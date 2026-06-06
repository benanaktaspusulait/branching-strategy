# Improvement Area Inventory

Status: Optional review note / working reference.

This inventory lists major improvement areas that may need confirmation, challenge or deferral before any rollout expansion.

| ID | Improvement Area | Source Area | Current Status | Initial Review Position |
| --- | --- | --- | --- | --- |
| R01 | Stabilise release operating model before changing branch model. | Release assessment | Proposed | Strongly support. |
| R02 | Keep current GitFlow-style model temporarily. | Branching options | Proposed | Support as interim control. |
| R03 | Cut over to `main = production` after agreed release. | Rollout decisions | Needs confirmation | Modify: only after baseline evidence and rollback readiness. |
| R04 | Auto-create release branches from `main`. | Proposed automation | Needs confirmation | Support pilot with scope controls. |
| R05 | Create feature/hotfix branches from relevant release branch. | Proposed automation | Needs confirmation | Support with training and conflict rules. |
| R06 | Forward-merge fixes into later active releases. | Rollout decisions | Needs owner | Strongly support, but owner is blocker. |
| R07 | Move local release scripts into Drone. | CI/CD findings | Proposed / pilot | Support with idempotency and manual gates. |
| R08 | Make final Git/chart/reporting steps rerunnable. | Automation | Needs confirmation | Support with state locking and audit events. |
| R09 | Add alerts for failed automation. | Automation | Needs owner | Strongly support; production prerequisite. |
| R10 | Enforce strict tag, artefact and manifest validation. | Validation | Needs confirmation | Strongly support; dry-run before enforcement. |
| R11 | Fail on wrong tag, missing tag and manifest mismatch. | Validation | Needs confirmation | Strongly support with override workflow. |
| R12 | Validate Jira ticket status and release metadata. | Validation | Needs confirmation | Support after status taxonomy is confirmed. |
| R13 | Treat environment readiness as a gate. | Scope / platform | Needs confirmation | Strongly support. |
| R14 | Deploy changed charts by default. | Proposed automation | Needs confirmation | Modify: require dependency and exclusion controls. |
| R15 | Keep human approval before higher environment and production. | Rollout decisions | Needs confirmation | Strongly support. |
| R16 | Document and test hotfix flow. | Hotfix / rollback | Needs confirmation | Strongly support; production prerequisite. |
| R17 | Document rollback vs fix-forward guide. | Hotfix / rollback | Needs confirmation | Strongly support; rollback may be unrealistic for DB/data changes. |
| R18 | Require branch, manifest and Jira reconciliation after rollback. | Rollback | Needs confirmation | Strongly support. |
| R19 | Standardise release scope across code, config, secrets, Liquibase and runbooks. | Scope | Needs confirmation | Strongly support. |
| R20 | Assign named owners, approvers and backups. | Ownership | Needs owner | Strongly support; scale-out blocker. |
| R21 | Add release reporting with Jira cross-reference. | Reporting | Proposed | Support, but define retention and evidence ownership. |
| R22 | Add release metrics and DORA visibility. | Improvement notes | Proposed | Support after data model is reliable. |
| R23 | Add observability gates. | Platform strategy | Future / phased | Modify: alert-only first, then gated promotion. |
| R24 | Evaluate blue-green deployment for critical services. | Platform strategy | Future | Support selectively; requires service readiness. |
| R25 | Evaluate canary/progressive delivery. | Platform strategy | Future | Defer; high complexity in critical environment. |
| R26 | Generate SBOMs with existing tooling. | Platform advanced | Future / quick win | Strongly support. |
| R27 | Sign images and verify signatures. | Platform advanced | Medium-term | Support with rollout plan. |
| R28 | Adopt GitOps / ArgoCD. | Platform advanced | Future | Defer production adoption; non-prod pilot only. |
| R29 | Build Deployment Knowledge Graph. | Knowledge Graph | Proposed future option | Keep outside immediate discussion pack. |
| R30 | Build unified deployment control plane. | Future platform option | Long-term | Defer until release evidence and SoD are proven. |
| R31 | Allow control plane to trigger Drone jobs. | Control plane | Future decision | Defer until approval workflow and SoD are proven. |
| R32 | External Secrets Operator. | Future platform option | Future | Support after secret ownership and rotation model are agreed. |
| R33 | Runtime feature flags. | Future platform option | Future | Support as prerequisite for trunk-based maturity. |
| R34 | Reassess trunk-based development after maturity improvements. | Branching | Future | Support deferral. |

## Inventory Conclusion

The strongest immediate improvement areas appear to be release metadata standardisation, strict validation, ownership, environment readiness, hotfix/rollback process and controlled Drone automation. The most aggressive ideas are production GitOps, progressive delivery and unified control plane trigger capability. These should be deferred or limited to non-production pilots.

## Related Pages

- [Potential Architecture Review Notes](index.md)
- [Possible Review Criteria](review-criteria.md)
- [Criticality Challenge Review](criticality-challenge-review.md)
- [Summary Assessment And Open Risks](final-scorecard-and-verdict.md)

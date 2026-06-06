# Rollout Decision Proposals - Summary

These are the proposed decisions that still need release/process-owner approval.

This page is intentionally short. For rationale and detailed procedures, see [Rollout Decision Proposals - Detailed Rationale](reference/rollout-decision-proposals-detailed.md).

## Decision Summary

| No | Area | Proposed Decision | Status |
| --- | --- | --- | --- |
| 1 | Branch baseline | Move to `main` as the production/live baseline after an agreed cutover release. | Proposed |
| 2 | Production sync | No release is closed until the released state is reconciled back to `main`. | Proposed |
| 3 | Release branches | Auto-create release branches at the start of each sprint/release from `main`. | Proposed |
| 4 | Feature/hotfix branches | Create feature and release-phase hotfix branches from the relevant release branch. | Proposed |
| 5 | Multiple active releases | Forward-merge production/release fixes into later active release branches before closure. | Proposed |
| 6 | Changed-chart deployment | Deploy changed charts by default; require approved override to exclude one. | Proposed |
| 7 | Quality gates | Keep human approval before higher-environment promotion and production. | Proposed |
| 8 | Failure handling | Make final Git/chart/reporting steps idempotent and rerunnable. | Proposed |
| 9 | Alerting | Add Slack/email alerts for failed automation steps before production rollout. | Proposed |
| 10 | Shared dev | Roll out shared dev deployment in phases, starting with manual trigger. | Proposed |
| 11 | Ephemeral environments | Keep ephemeral branch environments out of scope for now. | Proposed |
| 12 | New environments | Treat new dev/test environments as ready only after values, Drone secrets/tokens and setup scripts are confirmed. | Proposed |
| 13 | Auto manifest validation | Fail on wrong tag, missing tag, manifest/tag mismatch and do-not-deploy markers unless explicitly overridden. | Proposed |
| 14 | Rollback reconciliation | After rollback, reconcile `main`, manifests, release records and JIRA tickets to match actual production state. | Proposed |
| 15 | Tag jump checker | Retire after the new validation is green for two consecutive releases. | Proposed |

## Highest-Risk Decisions

These decisions should be approved first because they control release safety:

1. `main` must start from confirmed production state, not from `development`.
2. Wrong tag, missing tag and manifest/tag mismatch should fail fast.
3. Changed chart exclusions need release-owner approval and an audit note.
4. Rollback must reconcile branch, manifest, release report and JIRA state.
5. Failed automation needs an alert owner and safe rerun procedure.

## Cutover Guardrails

Do not cut over to `main = production` until:

- production state is tied to a known branch/tag/manifest,
- Drone pilot is green,
- branch protections are ready,
- open work on `development` is inventoried,
- hotfix and rollback reconciliation are approved,
- release owner and backup owner are named.

## Approval Checklist

Before rollout, approve or amend:

- cutover release and `main` branch protection,
- release branch naming and source branch,
- repository scope for auto-created release branches,
- forward-merge ownership,
- changed-chart deployment override rule,
- quality gates and human approval points,
- rerun/manual intervention procedure,
- alerting channels and owners,
- shared dev rollout phase,
- new environment readiness checklist,
- manifest/tag validation strictness,
- rollback reconciliation procedure,
- tag jump checker retirement plan.

## Related Detail

- Full decision rationale: [detailed rollout decision proposals](reference/rollout-decision-proposals-detailed.md)
- Rollout execution practices: [release engineering best practices](release-engineering-best-practices.md)
- Ownership model: [release scope, ownership and approvals](scope-ownership-approvals.md)

---

<- [Release scope, ownership and approvals](scope-ownership-approvals.md) | -> [CI/CD deployment findings and actions](cicd-deployment-findings-and-actions.md)

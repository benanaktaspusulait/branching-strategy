# Release Decision Register

This page is the single register for decisions that must be approved, rejected or explicitly deferred before the release transformation is treated as an approved operating model.

The proposal documents describe recommended defaults. This register tracks whether those defaults have actually been agreed.

## Status Definitions

| Status | Meaning |
| --- | --- |
| Proposed | A recommended default exists, but the decision is not approved. |
| Needs approval | The decision must be approved before rollout expansion or branch cutover. |
| Needs owner | The decision cannot be executed until a named accountable owner and backup are assigned. |
| Approved | The relevant owner has approved the decision and evidence is recorded. |
| Deferred | The decision is intentionally out of scope for the current rollout. |
| Rejected | The proposal was not accepted; the replacement decision must be recorded. |

## Decision Register

| ID | Decision Area | Recommended Default | Current Status | Accountable Owner Needed | Approver Needed | Required Before | Evidence To Record |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D01 | Branch baseline | Move to `main` as the production/live baseline after an agreed cutover release. | Needs approval | Release owner | Release/process owner + repo owners | Branch cutover | Cutover release, source branch/tag, branch protection record |
| D02 | Production sync | Do not close a release until production state is reconciled back to `main`. | Needs approval | Release owner | Release/process owner | First production rollout under new model | Merge record, release report, manifest state |
| D03 | Release branch creation | Auto-create release branches from `main` for every in-scope repository that needs one. | Needs approval | Automation owner | Release owner | Drone rollout expansion | Pipeline job link, repository scope list |
| D04 | Feature and hotfix branch source | Create feature and release-phase hotfix branches from the relevant release branch. | Needs approval | Squad lead / release owner | Release owner | Pilot squad briefing | Branch naming rule, squad guidance |
| D05 | Multiple active releases | Forward-merge production/release fixes into later active release branches before closure. | Needs owner | Release owner | Engineering managers | Before multiple active release branches are used | Forward-merge checklist and owner |
| D06 | Changed-chart deployment | Deploy changed charts by default; require approved override to exclude one. | Needs approval | Release owner | Release owner + platform owner | Changed-chart deployment rollout | Override record with reason and approver |
| D07 | Quality gates | Keep human approval before higher-environment promotion and production. | Needs approval | Release owner | Release/process owner + QAT lead | Production rollout | Approval workflow and evidence location |
| D08 | Failure handling | Make final Git/chart/reporting steps idempotent and rerunnable after transient failures. | Needs approval | Automation owner | Platform owner | Drone rollout expansion | Rerun procedure, pipeline evidence |
| D09 | Alerting | Add Slack/email alerts for failed automation steps before production rollout. | Needs owner | Platform owner | Release owner | Production rollout | Alert channel, owner rota, sample alert |
| D10 | Shared dev rollout | Roll out shared dev deployment in phases, starting with manual trigger. | Proposed | Platform owner | Release/process owner | Shared dev automation rollout | Rollout phase plan |
| D11 | Ephemeral environments | Keep ephemeral branch environments out of scope for now. | Proposed | Platform owner | Engineering leadership | Current transformation scope approval | Scope note |
| D12 | New environment readiness | Treat environments as ready only after values, secrets/tokens and setup scripts are confirmed. | Needs approval | Platform/environment owner | Platform owner | Any new dev/test environment rollout | Completed readiness checklist |
| D13 | Manifest/tag validation | Fail on wrong tag, missing tag, manifest/tag mismatch and `do not deploy` markers unless explicitly overridden. | Needs approval | Platform / DevOps | Release owner + platform owner | Strict validation rollout | Validation rules, override record |
| D14 | `NA` tag entries | Do not let `NA` tag entries silently hide release-impacting changes; define when they are allowed. | Needs approval | Platform / DevOps | Release owner | Strict validation rollout | `NA` handling rule |
| D15 | Ticket status validation | Define which Jira statuses are valid, blocked or invalid for release. | Needs approval | Release owner | Release/process owner | Strict validation rollout | Status mapping |
| D16 | Rollback reconciliation | After rollback, reconcile `main`, manifests, release records and Jira tickets to actual production state. | Needs approval | Release owner + incident lead | Release/process owner | Production rollout | Rollback record, reconciliation checklist |
| D17 | Rollback vs fix-forward | Define when rollback is standard, when fix-forward is safer, and who decides. | Needs approval | Incident lead | Release owner + incident lead | Production rollout | Decision guide |
| D18 | Hotfix approval and tagging | Define hotfix approver, tag timing, manifest update and forward-merge route. | Needs approval | Release owner | Release/process owner | Production hotfix readiness | Hotfix runbook |
| D19 | Tag jump checker retirement | Retire the tag jump checker only after new validation is green for two consecutive releases. | Proposed | Platform / DevOps | Release owner + platform owner | Tool retirement | Two green release records |
| D20 | Release scope | Define what "all services" means and which repositories/change types are included. | Needs approval | Release owner | Engineering managers | Rollout expansion | Repository and change-type scope list |
| D21 | Ownership matrix | Replace placeholders with named owners, approvers and backups. | Needs owner | Engineering managers | Release/process owner | Rollout expansion | Signed ownership matrix |
| D22 | Release report location | Define where release reports are published, retained and linked from. | Needs approval | Release owner | Release/process owner | Drone rollout expansion | Retention rule, report location |
| D23 | First rollout candidate | Confirm the first release/repository set that will use the new process. | Needs approval | Release owner | Engineering managers | Pilot start | Pilot scope and go/no-go result |

## Immediate Closure Order

1. Close D20 and D21 so scope and ownership are known.
2. Close D13, D14 and D15 before strict validation moves from dry-run to enforcement.
3. Close D16, D17 and D18 before production rollout.
4. Close D01, D02 and D05 before branch cutover.
5. Close D08, D09 and D22 before automation is used as the normal release path.

## Related Documents

- [Rollout decision proposals](rollout-decision-proposals.md)
- [Release scope, ownership and approvals](scope-ownership-approvals.md)
- [Hotfix and rollback](hotfix-and-rollback.md)
- [Automation and validation](automation-and-validation.md)
- [Transformation programme](transformation-programme.md)

## Related Pages

- [Rollout Decision Proposals - Summary](rollout-decision-proposals.md)
- [Release Scope, Ownership And Approvals](scope-ownership-approvals.md)
- [Automation And Validation](automation-and-validation.md)
- [Hotfix And Rollback](hotfix-and-rollback.md)

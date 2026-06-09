# Rollout Decision Proposals

| Field | Value |
| --- | --- |
| Owner | Benan Aktas |
| Status | In Review |
| Created | 2026-06-09 |
| Last updated | 2026-06-09 |
| Labels | decisions, proposal, release-engineering, cerberus, governance |

---

## Summary

There are 23 open decisions that need release/process-owner confirmation before rollout behaviour changes. This page consolidates the decision summary, highlights the highest-risk items and defines the cutover guardrails and confirmation checklist.

No decision is confirmed until the accountable owner signs off. Confirmation status is tracked per decision.

---

## Decision Summary Table

| ID | Area | Proposed Default | Status |
|----|------|------------------|--------|
| D01 | Branch baseline | `main` = production baseline after agreed cutover release. | Needs confirmation |
| D02 | Production sync | No release closed until production state reconciled to `main`. | Needs confirmation |
| D03 | Release branch creation | Auto-create from `main` for every in-scope repo. | Needs confirmation |
| D04 | Feature/hotfix branch source | Branch from relevant release branch. | Needs confirmation |
| D05 | Multiple active releases | Forward-merge fixes into later release branches before closure. | Needs owner |
| D06 | Changed-chart deployment | Deploy changed charts by default; override requires release-owner confirmation. | Needs confirmation |
| D07 | Quality gates | Human approval before higher-environment promotion and production. | Needs confirmation |
| D08 | Failure handling | Final Git/chart/reporting steps idempotent and rerunnable. | Needs confirmation |
| D09 | Alerting | Slack/email alerts for failed automation steps before production rollout. | Needs owner |
| D10 | Shared dev | Phased rollout starting with manual trigger. | Proposed |
| D11 | Ephemeral environments | Out of scope for now. | Proposed |
| D12 | New environment readiness | Ready only after values, secrets/tokens and scripts confirmed. | Needs confirmation |
| D13 | Manifest/tag validation | Fail on wrong/missing tag, mismatch, `do not deploy` unless overridden. | Needs confirmation |
| D14 | `NA` tag entries | Define when `NA` entries are allowed; prevent them hiding changes. | Needs confirmation |
| D15 | Ticket status validation | Define valid, blocked and invalid Jira statuses for release. | Needs confirmation |
| D16 | Rollback reconciliation | Reconcile `main`, manifests, records and Jira to actual production state. | Needs confirmation |
| D17 | Rollback vs fix-forward | Define decision criteria and decision owner. | Needs confirmation |
| D18 | Hotfix approval route | Define confirmer, tag timing, manifest update and forward-merge route. | Needs confirmation |
| D19 | Tag jump checker retirement | Retire after new validation green for two consecutive releases. | Proposed |
| D20 | Release scope | Define "all services" and which repos/change types are in scope. | Needs confirmation |
| D21 | Ownership matrix | Replace placeholders with named owners, approvers and backups. | Needs owner |
| D22 | Release report location | Define where reports are published and retained. | Needs confirmation |
| D23 | First rollout candidate | Confirm first release/repo set for the new process. | Needs confirmation |

---

## Highest-Risk Decisions (Confirm First)

These control release safety and should be closed before any other decisions:

1. **D01** — `main` must start from confirmed production state, not from `development`.
2. **D13** — Wrong tag, missing tag and mismatch must fail fast.
3. **D06** — Chart exclusions need release-owner confirmation + audit note.
4. **D16** — Rollback must reconcile branch, manifest, report and Jira state.
5. **D09** — Failed automation needs an alert owner and safe rerun procedure.

---

## Immediate Closure Order

| Priority | Decisions | Rationale |
|----------|-----------|-----------|
| 1st | D20, D21 | Scope and ownership must be known first. |
| 2nd | D13, D14, D15 | Before strict validation moves from dry-run to enforcement. |
| 3rd | D16, D17, D18 | Before production rollout. |
| 4th | D01, D02, D05 | Before branch cutover. |
| 5th | D08, D09, D22 | Before automation becomes the normal release path. |

---

## Cutover Guardrails

Do not cut over to `main = production` until:

- [ ] Production state is tied to a known branch/tag/manifest.
- [ ] Drone pilot is green.
- [ ] Branch protections are ready.
- [ ] Open work on `development` is inventoried.
- [ ] Hotfix and rollback reconciliation are confirmed.
- [ ] Release owner and backup owner are named.

---

## Confirmation Checklist

Before rollout, confirm or amend:

- [ ] Cutover release and `main` branch protection.
- [ ] Release branch naming and source branch.
- [ ] Repository scope for auto-created release branches.
- [ ] Forward-merge ownership.
- [ ] Changed-chart deployment override rule.
- [ ] Quality gates and human approval points.
- [ ] Rerun/manual intervention procedure.
- [ ] Alerting channels and owners.
- [ ] Shared dev rollout phase.
- [ ] New environment readiness checklist.
- [ ] Manifest/tag validation strictness.
- [ ] Rollback reconciliation procedure.
- [ ] Tag jump checker retirement plan.

---

## References

- Full decision register with evidence requirements: source [Rollout Decision Proposals](04-rollout-decision-proposals.md)
- Detailed rationale: source [Rollout Decision Proposals](04-rollout-decision-proposals.md)
- Ownership model: see 06 — Ownership and Approvals
- Automation detail: see 03 — Proposed Release Automation Flow

---

Feedback or questions? Contact the page owner or comment below.

---

## Related Pages

- [Current Release Operating Model](02-current-release-operating-model.md)
- [Proposed Release Automation Flow](03-proposed-release-automation-flow.md)
- [Hotfix And Rollback](05-hotfix-and-rollback.md)
- [Ownership And Approvals](06-ownership-and-approvals.md)
- [Page Coverage Index](09-page-coverage-index.md)

---

## Detailed Supporting Material

This section keeps the detailed supporting content for readers who need more than the summary above.

### Rollout Decision Proposals - Summary

These are proposed discussion points that still need release/process-owner confirmation.

Confirmation status, accountable owner gaps and evidence requirements are tracked in the [release decision register](04-rollout-decision-proposals.md).

This page is intentionally short. For rationale and detailed procedures, see [Rollout Decision Proposals - Detailed Rationale](04-rollout-decision-proposals.md).

### Decision Summary

| No | Area | Proposed Discussion Point | Confirmation Status |
| --- | --- | --- | --- |
| 1 | Branch baseline | Move to `main` as the production/live baseline after an agreed cutover release. | Needs confirmation |
| 2 | Production sync | No release is closed until the released state is reconciled back to `main`. | Needs confirmation |
| 3 | Release branches | Auto-create release branches at the start of each sprint/release from `main`. | Needs confirmation |
| 4 | Feature/hotfix branches | Create feature and release-phase hotfix branches from the relevant release branch. | Needs confirmation |
| 5 | Multiple active releases | Forward-merge production/release fixes into later active release branches before closure. | Needs owner |
| 6 | Changed-chart deployment | Deploy changed charts by default; require confirmed override to exclude one. | Needs confirmation |
| 7 | Quality gates | Keep human approval before higher-environment promotion and production. | Needs confirmation |
| 8 | Failure handling | Make final Git/chart/reporting steps idempotent and rerunnable. | Needs confirmation |
| 9 | Alerting | Add Slack/email alerts for failed automation steps before production rollout. | Needs owner |
| 10 | Shared dev | Roll out shared dev deployment in phases, starting with manual trigger. | Proposed |
| 11 | Ephemeral environments | Keep ephemeral branch environments out of scope for now. | Proposed |
| 12 | New environments | Treat new dev/test environments as ready only after values, Drone secrets/tokens and setup scripts are confirmed. | Needs confirmation |
| 13 | Auto manifest validation | Fail on wrong tag, missing tag, manifest/tag mismatch and do-not-deploy markers unless explicitly overridden. | Needs confirmation |
| 14 | Rollback reconciliation | After rollback, reconcile `main`, manifests, release records and JIRA tickets to match actual production state. | Needs confirmation |
| 15 | Tag jump checker | Retire after the new validation is green for two consecutive releases. | Proposed |

### Highest-Risk Decisions

These decisions should be confirmed first because they control release safety:

1. `main` should start from confirmed production state, not from `development`.
2. Wrong tag, missing tag and manifest/tag mismatch should fail fast.
3. Changed chart exclusions need release-owner confirmation and an audit note.
4. Rollback should reconcile branch, manifest, release report and JIRA state.
5. Failed automation needs an alert owner and safe rerun procedure.

### Cutover Guardrails

Avoid cutting over to `main = production` until:

- production state is tied to a known branch/tag/manifest,
- Drone pilot is green,
- branch protections are ready,
- open work on `development` is inventoried,
- hotfix and rollback reconciliation are confirmed,
- release owner and backup owner are named.

### Confirmation Checklist

Before rollout, the team may want to confirm or amend:

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

### Related Detail

- Full decision rationale: [detailed rollout decision proposals](04-rollout-decision-proposals.md)
- Confirmation tracker: [release decision register](04-rollout-decision-proposals.md)
- Rollout execution practices: [release engineering best practices](07-transformation-programme.md)
- Ownership model: [release scope, ownership and approvals](06-ownership-and-approvals.md)

### Related Pages

- [Release Decision Register](04-rollout-decision-proposals.md)
- [Rollout Decision Proposals - Detailed Rationale](04-rollout-decision-proposals.md)
- [Release Scope, Ownership And Approvals](06-ownership-and-approvals.md)
- [Automation And Validation](03-proposed-release-automation-flow.md)

### Release Decision Register

This page is a working register for decisions that appear to need confirmation, rejection or explicit deferral before rollout behaviour changes.

The notes describe possible defaults. This register tracks whether those defaults have actually been discussed and agreed by the relevant owners.

### Status Definitions

| Status | Meaning |
| --- | --- |
| Proposed | A possible default exists, but the decision is not confirmed. |
| Needs confirmation | The decision needs confirmation before rollout expansion or branch cutover. |
| Needs owner | The decision cannot be executed until a named accountable owner and backup are assigned. |
| Confirmed | The relevant owner has confirmed the decision and evidence is recorded. |
| Deferred | The decision is intentionally out of scope for the current rollout. |
| Rejected | The proposal was not accepted; the replacement decision should be recorded. |

### Decision Register

| ID | Decision Area | Possible Default / Working Assumption | Current Status | Accountable Owner Needed | Confirmer Needed | Required Before | Evidence To Record |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D01 | Branch baseline | Move to `main` as the production/live baseline after an agreed cutover release. | Needs confirmation | Release owner | Release/process owner + repo owners | Branch cutover | Cutover release, source branch/tag, branch protection record |
| D02 | Production sync | Avoid closing a release until production state is reconciled back to `main`. | Needs confirmation | Release owner | Release/process owner | First production rollout under new model | Merge record, release report, manifest state |
| D03 | Release branch creation | Auto-create release branches from `main` for every in-scope repository that needs one. | Needs confirmation | Automation owner | Release owner | Drone rollout expansion | Pipeline job link, repository scope list |
| D04 | Feature and hotfix branch source | Create feature and release-phase hotfix branches from the relevant release branch. | Needs confirmation | Squad lead / release owner | Release owner | Pilot squad briefing | Branch naming rule, squad guidance |
| D05 | Multiple active releases | Forward-merge production/release fixes into later active release branches before closure. | Needs owner | Release owner | Engineering managers | Before multiple active release branches are used | Forward-merge checklist and owner |
| D06 | Changed-chart deployment | Deploy changed charts by default; require confirmed override to exclude one. | Needs confirmation | Release owner | Release owner + platform owner | Changed-chart deployment rollout | Override record with reason and approver |
| D07 | Quality gates | Keep human approval before higher-environment promotion and production. | Needs confirmation | Release owner | Release/process owner + QAT lead | Production rollout | Approval workflow and evidence location |
| D08 | Failure handling | Make final Git/chart/reporting steps idempotent and rerunnable after transient failures. | Needs confirmation | Automation owner | Platform owner | Drone rollout expansion | Rerun procedure, pipeline evidence |
| D09 | Alerting | Add Slack/email alerts for failed automation steps before production rollout. | Needs owner | Platform owner | Release owner | Production rollout | Alert channel, owner rota, sample alert |
| D10 | Shared dev rollout | Roll out shared dev deployment in phases, starting with manual trigger. | Proposed | Platform owner | Release/process owner | Shared dev automation rollout | Rollout phase plan |
| D11 | Ephemeral environments | Keep ephemeral branch environments out of scope for now. | Proposed | Platform owner | Engineering leadership | Current scope confirmation | Scope note |
| D12 | New environment readiness | Treat environments as ready only after values, secrets/tokens and setup scripts are confirmed. | Needs confirmation | Platform/environment owner | Platform owner | Any new dev/test environment rollout | Completed readiness checklist |
| D13 | Manifest/tag validation | Fail on wrong tag, missing tag, manifest/tag mismatch and `do not deploy` markers unless explicitly overridden. | Needs confirmation | Platform / DevOps | Release owner + platform owner | Strict validation rollout | Validation rules, override record |
| D14 | `NA` tag entries | Avoid letting `NA` tag entries silently hide release-impacting changes; define when they are allowed. | Needs confirmation | Platform / DevOps | Release owner | Strict validation rollout | `NA` handling rule |
| D15 | Ticket status validation | Define which Jira statuses are valid, blocked or invalid for release. | Needs confirmation | Release owner | Release/process owner | Strict validation rollout | Status mapping |
| D16 | Rollback reconciliation | After rollback, reconcile `main`, manifests, release records and Jira tickets to actual production state. | Needs confirmation | Release owner + incident lead | Release/process owner | Production rollout | Rollback record, reconciliation checklist |
| D17 | Rollback vs fix-forward | Define when rollback is standard, when fix-forward is safer, and who decides. | Needs confirmation | Incident lead | Release owner + incident lead | Production rollout | Decision guide |
| D18 | Hotfix confirmation, approval route and tagging | Define hotfix confirmer/approver, tag timing, manifest update and forward-merge route. | Needs confirmation | Release owner | Release/process owner | Production hotfix readiness | Hotfix runbook |
| D19 | Tag jump checker retirement | Retire the tag jump checker only after new validation is green for two consecutive releases. | Proposed | Platform / DevOps | Release owner + platform owner | Tool retirement | Two green release records |
| D20 | Release scope | Define what "all services" means and which repositories/change types are included. | Needs confirmation | Release owner | Engineering managers | Rollout expansion | Repository and change-type scope list |
| D21 | Ownership matrix | Replace placeholders with named owners, approvers and backups. | Needs owner | Engineering managers | Release/process owner | Rollout expansion | Signed ownership matrix |
| D22 | Release report location | Define where release reports are published, retained and linked from. | Needs confirmation | Release owner | Release/process owner | Drone rollout expansion | Retention rule, report location |
| D23 | First rollout candidate | Confirm the first release/repository set that will use the new process. | Needs confirmation | Release owner | Engineering managers | Pilot start | Pilot scope and go/no-go result |

### Immediate Closure Order

1. Confirm D20 and D21 so scope and ownership are known.
2. Confirm D13, D14 and D15 before strict validation moves from dry-run to enforcement.
3. Confirm D16, D17 and D18 before production rollout.
4. Confirm D01, D02 and D05 before branch cutover.
5. Confirm D08, D09 and D22 before automation is used as the normal release path.

### Related Documents

- [Rollout decision proposals](04-rollout-decision-proposals.md)
- [Release scope, ownership and approvals](06-ownership-and-approvals.md)
- [Hotfix and rollback](05-hotfix-and-rollback.md)
- [Automation and validation](03-proposed-release-automation-flow.md)
- [Improvement notes and maturity observations](07-transformation-programme.md)

### Related Pages

- [Rollout Decision Proposals - Summary](04-rollout-decision-proposals.md)
- [Release Scope, Ownership And Approvals](06-ownership-and-approvals.md)
- [Automation And Validation](03-proposed-release-automation-flow.md)
- [Hotfix And Rollback](05-hotfix-and-rollback.md)

### Rollout Decision Proposals - Detailed Rationale

These are proposed decisions for the remaining open items, with full rationale and detailed procedures.

They are written as defaults the team can confirm or amend. They should not be treated as formally agreed until the relevant release/process owners confirm them.

Confirmation status, accountable owner gaps and evidence requirements are tracked in the [release decision register](04-rollout-decision-proposals.md).

### Decision Summary

| Area | Proposed Decision | Decision Status |
| --- | --- | --- |
| Branch baseline | Move to `main` as the production/live baseline. | Needs confirmation |
| Production sync | Merge the released branch/state back into `main` after production validation. | Needs confirmation |
| Release branches | Auto-create release branches at the start of each sprint/release from `main`. | Needs confirmation |
| Feature/hotfix branches | Create feature and release-phase hotfix branches from the relevant release branch. | Needs confirmation |
| Multiple active releases | Forward-merge production/release fixes into later active release branches before closure. | Needs owner |
| Changed-chart deployment | Deploy changed charts by default; require confirmed override to exclude one. | Needs confirmation |
| Quality gates | Keep human approval before higher-environment promotion and production. | Needs confirmation |
| Failure handling | Make the final Git/chart/reporting step idempotent and rerunnable. | Needs confirmation |
| Alerting | Add Slack/email alerts for failed automation steps. | Needs owner |
| Shared dev | Roll out shared dev deployment in phases, starting with manual trigger. | Proposed |
| Ephemeral environments | Keep ephemeral branch environments out of scope for now. | Proposed |
| New environments | Treat new dev/test environments as ready only after values, Drone secrets/tokens and setup scripts are confirmed. | Needs confirmation |
| Auto manifest validation | Fail on wrong tag, missing tag, manifest/tag mismatch and do-not-deploy markers unless explicitly overridden. | Needs confirmation |
| Rollback reconciliation | After rollback, reconcile `main`, manifests, release records and JIRA tickets to match actual production state. | Needs confirmation |
| Tag jump checker | Retire after the new validation is confirmed green for two consecutive releases. | Proposed |

### 1. `development` To `main`

Proposed decision:

```text
Adopt `main` as the production/live baseline branch.
Treat the current `development` model as transitional until the release automation pilot is ready.
```

#### Technical Cutover Steps

The transition means:

1. `master` currently represents production/live (even if drift has occurred).
2. After the agreed cutover release, `master` is renamed to `main` (or a new `main` is created from the confirmed production state).
3. `development` is not renamed to `main`. Instead, `main` starts from the confirmed production release state.
4. `development` is frozen and eventually archived/deleted after confirming no open work depends on it.
5. Existing `master` is archived or deleted after `main` is confirmed.

This is not a rename of `development` to `main`. It is a fresh start where `main` represents the actual production release state at cutover time.

Suggested rollout:

1. Confirm the cutover release.
2. Freeze new process changes on `development`.
3. Create `main` from the confirmed production release state (or rename `master` to `main`).
4. Confirm branch protections on `main`.
5. Update automation, documentation and team guidance to use `main`.
6. Archive `development` and old `master` after transition is stable.

Minimum confirmation needed:

- Release/process owner confirmation.
- Repo owner confirmation.
- Automation owner confirmation that Drone jobs target the right branch.

### 2. Keeping `main` Aligned With Production

Proposed decision:

```text
`main` should represent production/live state.
No release is closed until the released state has been reconciled back to `main`.
```

Suggested rule:

1. Release branch is deployed to production.
2. Production smoke/technical validation passes.
3. QAT/release approval is recorded where required.
4. Release branch is merged into `main`.
5. Release report links are attached to the release record.
6. Any active future release branches receive required forward merges.

Closure checklist:

- `main` contains the production release state.
- Release tag/report is available.
- Manifest/chart state matches production.
- Required forward merges are complete or explicitly tracked.

### 3. Release Branch Creation

Proposed decision:

```text
Create release branches automatically at the start of each sprint/release for every in-scope repository that needs one.
Default source branch is `main`.
```

Suggested naming:

```text
release/<major.minor>
```

Example:

```text
release/5.14
```

Exception:

```text
If releases need to be chained, explicitly configure the release branch source instead of silently using another branch.
```

### 4. Multiple Active Release Branches

Proposed decision:

```text
Any fix merged into an earlier active release should be assessed for forward-merge into later active release branches.
```

Suggested rule:

- If a hotfix goes into `release/5.14`, check whether `release/5.15` also needs it.
- If a delayed feature branch continues across releases, the feature owner should regularly merge in the relevant active release branch.
- Before opening or updating an MR, the feature owner should merge the current target release branch into the feature branch to expose conflicts early.
- Release closure should include a forward-merge check.

Suggested owner:

- Feature owner for feature branches.
- Release owner for release-to-release forward-merge tracking.

### 5. Changed-Chart Deployment Override

Proposed decision:

```text
Deploy all changed charts by default.
Allow exclusions only with explicit release owner confirmation and an audit note.
```

Override should record:

- Chart/service excluded.
- Reason for exclusion.
- Approver.
- Impact/risk.
- Follow-up action or release where it will be included.

Suggested default:

```text
If the chart changed and there is no confirmed exclusion, deploy it.
```

### 6. Quality Gates And Human Approval

Proposed decision:

```text
Automation can prepare release artefacts and reports, but higher-environment promotion and production release still require human approval.
```

Suggested gates:

| Stage | Gate |
| --- | --- |
| Branch commit | Build/test/scan succeeds before chart update. |
| Chart update | Image and Helm chart are built/uploaded before Cerberus chart update runs. |
| Shared dev deploy | Pipeline green, chart update complete, report generated. |
| SIT / higher environment | Release owner reviews report and changed charts. |
| Production | QAT/release approval, rollback/fix-forward plan, final report check. |

Suggested fail-fast items:

- Image build failure.
- Helm chart upload failure.
- Tag generation failure.
- Cerberus chart update failure.
- Missing or invalid release report.
- Manifest/tag mismatch.

### 7. Failure Handling And Rerun Procedure

Proposed decision:

```text
The final Git/chart/reporting step should be idempotent and safe to rerun after transient failures.
```

Suggested rerun procedure:

1. Identify the failed step.
2. Confirm image and Helm artefact were built/uploaded successfully.
3. Confirm no manual conflicting chart update was made.
4. Rerun the failed automation step.
5. Confirm tags, build numbers, chart branch updates and report output.
6. Record the rerun in the release notes or pipeline audit trail.

Manual intervention rule:

```text
Manual chart edits should be avoided.
If required, they must be recorded in the release report or release notes.
```

### 8. Alerting

Proposed decision:

```text
Add Slack/email alerting for failed automation steps before the process is treated as production-ready.
```

Alert should include:

- Repository/service.
- Branch.
- Release version.
- Failed step.
- Whether rerun is safe.
- Link to failed Drone job.
- Suggested owner/action.

Suggested channels:

- Release channel for release branch failures.
- Squad/team channel for feature branch failures.
- Email only for production or higher-environment release failures, if required by the wider process.

### 9. Shared Dev Environment Rollout

Proposed decision:

```text
Roll out shared dev deployment in phases.
Keep squad dev test environments separate.
```

Suggested phases:

1. Manual trigger: deploy active release branch to shared dev on demand.
2. Scheduled trigger: deploy active release branch to shared dev on a regular cadence.
3. Event trigger: deploy to shared dev after successful merge into the active release branch.
4. Metrics/reporting: add automated integration, performance and health reporting when available.

Out of scope for now:

```text
Ephemeral branch environments.
```

Reason:

```text
ACP support for ephemeral branch environments is uncertain, and the current direction is to use squad dev test environments plus a shared dev integration environment.
```

### 10. Release Report Location And Retention

Proposed decision:

```text
Store release reports as pipeline artefacts and attach/link them from the release record.
```

Suggested retention:

- Keep reports at least through production release, post-release validation and any incident review window.
- Prefer keeping release reports with the release record permanently if storage is cheap and access-controlled.

### 11. Rollback Reconciliation

Proposed decision:

```text
Rollback is an operational path that must leave source control, manifests and release records in a consistent state.
```

#### After A Rollback

| Item | Action |
| --- | --- |
| `main` | Should still reflect production state. If rollback reverts production to an earlier release, `main` should be updated to match that state (revert commit or reset to earlier release tag). |
| Manifest | Revert manifest to the version that matches the rolled-back production state. |
| Failed release branch | Keep open for investigation. Close only after the fix-forward or abandonment decision is made. |
| Active future release branches | Forward-merge the rollback state if they depended on the failed release. |
| Release report/notes | Record the rollback event, reason, who decided and what was rolled back. |
| JIRA tickets | Update ticket status to reflect that the release was rolled back. |

#### Rollback vs Fix-Forward Decision Guide

| Factor | Prefer Rollback | Prefer Fix-Forward |
| --- | --- | --- |
| User impact severity | High / data risk | Low / cosmetic |
| Fix complexity | Unknown or high | Simple and well-understood |
| Time to fix | Hours or unknown | Minutes |
| Database changes involved | No / reversible | Irreversible DB changes already applied |
| Confidence in rollback | High (tested, no data impact) | Low (untested, data risk) |

#### Database/Liquibase Rollback

```text
Database rollback requires special handling because Liquibase changes may be forward-only.
```

Rules:

- If the release included Liquibase changes that have already been applied, assess whether a rollback script exists.
- If no rollback script exists and the DB change is not destructive, fix-forward may be the only safe option.
- If the DB change is destructive or causes data corruption, the incident process takes over.
- Liquibase rollback scripts should be written proactively for any release that includes schema changes to production.

Suggested practice:

```text
Every production Liquibase changeset should have a corresponding rollback block or a documented reason why rollback is not possible.
```

### 12. Tag Jump Checker Future

Proposed decision:

```text
Retire the tag jump checker in its current form once the new release branch model is active.
Replace its validation responsibilities with the new manifest/tag validation rules built into the release automation pipeline.
```

Rationale:

- The tag jump checker assumes linear version/tag ordering, which does not hold in the proposed non-linear release branch model.
- Its core responsibilities (detecting missing tags, wrong tags, blocked tickets, do-not-deploy cases) are being absorbed into the new automation validation rules.
- Rollback version comparisons in the old script are awkward because it prefers higher versions.

Suggested transition:

1. Keep the tag jump checker active during the transition period alongside the new validation.
2. Once the new automation validation is confirmed green for two consecutive releases, retire the tag jump checker.
3. Archive the script for reference but avoid maintaining it.
4. Ensure the new validation covers: wrong tag, missing tag, manifest/tag mismatch, invalid ticket status, do-not-deploy markers and `NA` entries.

### Confirmation Checklist

Before rollout, confirm or amend:

1. `main` creation from confirmed production baseline.
2. `main` branch protection and production reconciliation rule.
3. Release branch naming.
4. Repository scope for auto-created release branches.
5. Multiple active release branch forward-merge rule.
6. Changed-chart deployment override rule.
7. Quality gates and human approval points.
8. Rerun/manual intervention procedure.
9. Alerting channels and owners.
10. Shared dev rollout phase.
11. New environment readiness checklist.
12. Auto manifest/tag validation strictness.
13. Rollback reconciliation procedure.
14. Tag jump checker retirement plan.

### Related Best Practices

Incremental rollout, success metrics, rollout rollback and resistance/edge-case handling are summarised in [release engineering best practices](07-transformation-programme.md).

Decision confirmation status is tracked in the [release decision register](04-rollout-decision-proposals.md).

### Related Pages

- [Rollout Decision Proposals - Summary](04-rollout-decision-proposals.md)
- [Release Decision Register](04-rollout-decision-proposals.md)
- [Branching Strategy Options](02-current-release-operating-model.md)
- [Detailed Solution Options And Experience Notes (S1–S7)](07-transformation-programme.md)

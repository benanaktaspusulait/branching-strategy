# KT Session Todo List

This todo list is based on the KT session notes in [notes.txt](../notes.txt).

The transcript appears to be incomplete in the middle, so this list only captures actions that can be reasonably inferred from the available notes.

## Status Key

| Status | Meaning |
| --- | --- |
| Done | Completed in this documentation set. |
| Proposed | Draft guidance has been added, but the team still needs to confirm it. |
| In progress | Work is already happening outside this documentation repo. |
| Blocked | Needs named owner, access, team decision or external execution. |

## Completed In Documentation

| Status | Todo | Where |
| --- | --- | --- |
| Done | Capture the KT decision summary in the documentation. | [Current release operating model](current-release-operating-model.md#kt-session-updates) |
| Done | Prepare a short summary for squad leads. | [Squad briefing summary](squad-briefing-summary.md) |
| Done | Capture the proposed release automation flow. | [Proposed release automation flow](proposed-release-automation-flow.md) |
| Done | Include application, secrets and Liquibase/database changes in release scope analysis. | [Scope, ownership and approvals](scope-ownership-approvals.md#change-types-to-track) |
| Done | Document the temporary manual work still needed for server charts. | [Current release operating model](current-release-operating-model.md#deployment-repository-and-helm-scripts) |
| Done | Document an expected branch naming convention as a proposal. | [Branching strategy options](branching-options.md#branch-and-commit-hygiene-to-confirm) |
| Done | Document commit metadata expectations as a proposal. | [Automation and validation](automation-and-validation.md#commit-metadata) |
| Done | Document release reporting expectations and retention guidance as a proposal. | [Automation and validation](automation-and-validation.md#release-reporting) |
| Done | Document failure handling and alerting gaps. | [Automation and validation](automation-and-validation.md#failure-handling-and-alerting) |
| Done | Document changed-chart deployment expectation. | [Proposed release automation flow](proposed-release-automation-flow.md#changed-chart-deployment) |
| Done | Document CVE/Renovate handling expectation. | [Proposed release automation flow](proposed-release-automation-flow.md#cve-and-renovate-flow) |
| Done | Draft proposed decisions for the remaining rollout questions. | [Rollout decision proposals](rollout-decision-proposals.md) |
| Done | Capture consolidated KT findings for deployment scripts, secrets and auto manifest tooling. | [KT session findings](kt-session-findings.md) |
| Done | Add new environment readiness checks. | [Scope, ownership and approvals](scope-ownership-approvals.md#new-environment-readiness) |
| Done | Add auto manifest/tag validation follow-up. | [Automation and validation](automation-and-validation.md#auto-manifest-and-tag-jump-follow-up) |

## Ready For Team Approval

| Status | Todo | Proposed Answer |
| --- | --- | --- |
| Proposed | Confirm the target branching change and rollout timing. | Move to `main` after an agreed cutover release. |
| Proposed | Confirm whether release branches can start from the next release. | Start only after the config-service automation pilot runs successfully in Drone. |
| Proposed | Confirm when `development` becomes `main`. | Use the agreed cutover release; keep `development` transitional until then. |
| Proposed | Confirm how `main` is kept aligned with production/live. | Do not close a release until the released state is merged back to `main`. |
| Proposed | Confirm the exact release branch naming convention. | Use `release/<major.minor>`, for example `release/5.14`. |
| Proposed | Decide which release will be the first to use the new release branch process. | Pick the first release after the Drone pilot is green and branch protections are ready. |
| Proposed | Decide which repositories get auto-created release branches. | Auto-create for every in-scope service, chart, config, secret, Liquibase and runbook repo that participates in the release. |
| Proposed | Decide what remains manual until Drone pipeline work is complete. | Manual chart edits only for cross-ticket dependency exceptions, and only when recorded. |
| Proposed | Decide where release reports are published and retained. | Store as pipeline artefacts and link from the release record. |
| Proposed | Decide the weekly report cadence and target branches/releases. | Generate on demand plus scheduled weekly for active/long-running branches. |
| Proposed | Define how multiple active release branches are kept aligned. | Forward-merge fixes from earlier active releases into later active release branches before closure. |
| Proposed | Define human approval gates before deployment/promotion. | Keep human approval before higher-environment promotion and production. |
| Proposed | Define alerting expectations for failed automation steps. | Send Slack/email alert with repo, branch, release, failed step, job link and rerun guidance. |
| Proposed | Confirm who can override changed-chart deployment. | Release owner can approve exclusions; reason must be recorded. |
| Proposed | Confirm shared dev environment rollout. | Phase rollout: manual trigger, scheduled trigger, event trigger, then metrics/reporting. |
| Proposed | Confirm whether ephemeral branch environments are out of scope. | Out of scope for now; use squad dev test plus shared dev integration environment. |
| Proposed | Confirm new environment readiness criteria. | Require values files, setup script entries, Drone secrets/tokens and ACU/token ownership before release use. |
| Proposed | Confirm auto manifest/tag validation strictness. | Fail on wrong tag, missing tag, manifest/tag mismatch and do-not-deploy markers unless explicitly overridden. |
| Proposed | Confirm how `NA` GitLab tag entries appear in reports. | Show them explicitly as no-version-update entries rather than omitting them silently. |
| Proposed | Confirm whether tag jump logic is retired, replaced or adapted. | Reassess the existing tag jump checker against the new non-linear branch model, then explicitly keep, adapt or replace it. |

## Automation Rollout

| Status | Todo | Owner |
| --- | --- | --- |
| In progress | Finish testing the automation on the new configuration service. | Gareth / Achilles |
| In progress | Build or adopt a Git pre-commit hook to prevent commits without MMA ticket references. | TBD |
| Blocked | Get the release automation running in Drone. | Gareth / Achilles |
| Blocked | Validate generation of service chart changes, versions and tags from the automation. | Gareth / Achilles |
| Blocked | Generate release reporting from the pipeline. | Gareth / Achilles |
| Blocked | Cross-reference release content with JIRA. | Gareth / Achilles |
| Blocked | Update the relevant Drone pipelines for server chart automation. | TBD |
| Blocked | Implement changed-chart detection in Cerberus deployment logic. | Gareth / Achilles |
| Blocked | Validate that only changed charts are deployed by default. | Gareth / Achilles |
| Proposed | Add alerting for failed automation steps. | TBD |
| Proposed | Define rerun procedure for failed final Git/chart/reporting steps. | TBD |
| Blocked | Ensure CVE/Renovate MRs target the active release branch. | TBD |
| Blocked | Confirm required Drone secrets/tokens for new environments. | TBD / ACU |
| Blocked | Confirm setup script changes for new dev/test environments. | TBD |
| Blocked | Confirm secrets maintainer/GPG onboarding process. | TBD |
| Blocked | Schedule auto-tag KT/follow-up if still relevant. | TBD |

## Communication And Community

| Status | Todo | Owner |
| --- | --- | --- |
| Blocked | Share the KT recording or source material with squads that need context. | Squad reps |
| Blocked | Collect squad questions or concerns before rollout. | Squad reps |
| Blocked | Schedule the community of practice sessions. | Rose / TBD |
| Blocked | Confirm who owns rollout communication to each squad. | TBD |

## Implementation Follow-Up Checklist

1. Approve or amend [rollout decision proposals](rollout-decision-proposals.md).
2. Confirm the `development -> main` cutover release.
3. Confirm first release candidate after the Drone pilot is green.
4. Confirm repository scope for auto-created release branches.
5. Confirm named release owner for forward-merge tracking.
6. Confirm alerting channel and owner.
7. Confirm release report location.
8. Confirm new environment readiness checklist.
9. Confirm auto manifest/tag strictness and tag jump future.
10. Assign named owners to remaining blocked implementation work.

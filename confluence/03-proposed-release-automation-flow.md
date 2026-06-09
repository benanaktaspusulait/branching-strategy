# Proposed Release Automation Flow

| Field | Value |
| --- | --- |
| Owner | Benan Aktas |
| Status | In Review |
| Created | 2026-06-09 |
| Last updated | 2026-06-09 |
| Labels | proposal, automation, release-engineering, cerberus, ci-cd |

---

## Summary

This page describes the proposed release automation flow. It replaces manual release preparation (currently taking days per sprint) with automated branch creation, tagging, chart updates, reporting and alerting — all running through Drone.

This remains a proposal until the team confirms rollout timing, branch naming, quality gates and ownership.

---

## Possible Branch Model

| Element | Possible Behaviour |
|---------|-------------------|
| `main` | Represents confirmed production/live state. Created from known production baseline. |
| `development` | Transitional. Retired after automation pilot and branch protections are ready. |
| Release branches | Auto-created from `main` at start of each sprint/release. |
| Feature/hotfix branches | Created from the relevant release branch. |
| Multiple active releases | Supported. Forward-merge from earlier to later releases. |
| Chained releases | A release branch may be based on another release branch if required. |

---

## Feature and Hotfix Branch Flow

| Step | Action |
|------|--------|
| 1 | Release branch exists (auto-created from `main`). |
| 2 | Feature/hotfix branch created from release branch. |
| 3 | Commit (builds from latest commit on branch). |
| 4 | Temporary tag generated (includes previous version + ticket reference). |
| 5 | Image/artefact built. |
| 6 | Cerberus chart branch auto-updated. |
| 7 | Branch name/ticket becomes deployment handle. |

**Key points:**
- Feature and hotfix branches are treated identically by automation.
- Temporary branch tag is stable per branch (not per commit).
- Chart branch update is automatic on successful build.

---

## Multi-Repo Change Aggregation

If multiple repositories use the same ticket/branch name, their changes feed into the same Cerberus chart branch. One ticket can collect:

- Service changes
- Secrets/config changes
- Liquibase/database changes
- Runbook changes
- Cross-service changes requiring joint testing

This removes most manual chart updates for multi-service changes.

---

## Release Branch Flow

| Step | Action |
|------|--------|
| 1 | `main` → auto-created release branch. |
| 2 | Feature/hotfix branches merged in. |
| 3 | Full release tag/version assigned on merge. |
| 4 | Cerberus chart branch updated automatically. |
| 5 | Auto-deploy to shared dev for integration testing. |
| 6 | Promote to SIT and above (human approval). |

**Key points:**
- Temporary branch tag replaced by full release version on merge to release branch.
- Shared dev is separate from squad dev/test environments.
- Ephemeral branch environments not currently assumed (ACP may not support them).

---

## Changed-Chart Deployment

| Rule | Detail |
|------|--------|
| Default | Deploy all changed charts in the release. |
| Override | Only release owners can exclude a chart; reason should be recorded. |
| Detection | Based on release report comparing two tags/versions. |

---

## CVE and Renovate Flow

CVE and Renovate updates follow the same automation pattern as normal changes:

| Item | Owner | SLA |
|------|-------|-----|
| CVE hotfix branch creation | Owning squad or release owner | Within 1 working day (critical) |
| CVE MR review and merge | Owning squad lead | Within 2 working days (critical); sprint boundary (others) |
| Renovate MR review | Owning squad | Within sprint, before release branch closure |
| Priority conflict resolution | Release owner | On demand |

---

## Merge Commit Expectations

| Rule | Rationale |
|------|-----------|
| Merge commit into release branch should include ticket number + meaningful message. | Release branch history becomes the changelog. |
| Squash-style pattern preferred. | Reduces noisy release branch history. |
| Feature branch commits should also follow ticket/message pattern. | Reports may be generated from long-running branches before merge. |

---

## Failure Handling

| Scenario | Behaviour |
|----------|-----------|
| Chart update runs after image + Helm built/uploaded | Sequenced for safety. |
| Connectivity failure (Git/services) | Step is rerunnable. |
| Push failed after local completion | Rerun pushes generated tags/build numbers/chart changes. |
| Production rollout | Slack/email notification before. |
| Higher-environment promotion | Human approval required. |

---

## Items Needing Confirmation

1. When exactly is `main` created from the production baseline?
2. Final branch naming convention?
3. Which release is the first rollout candidate?
4. Which repos get auto-created release branches?
5. Named release owner for forward-merge tracking?
6. Where are release reports published and retained?
7. Which channels receive automation failure alerts?

---

## References

- Current state: see 02 — Current Release Operating Model
- Decisions to confirm: see 04 — Rollout Decision Proposals
- Hotfix detail: see 05 — Hotfix and Rollback

---

Feedback or questions? Contact the page owner or comment below.

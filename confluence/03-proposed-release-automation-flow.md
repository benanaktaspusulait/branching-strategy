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

---

## Changed-Chart Deployment

| Rule | Detail |
|------|--------|
| Default | Deploy all changed charts in the release. |
| Override | Only release owners can exclude a chart; reason should be recorded. |
| Detection | Based on release report comparing two tags/versions. |

---

## Pilot Scope

The current automation pilot covers the new configuration service (Gareth/Achilles). The pilot proves:

- Automated branch creation, tagging and chart updates work correctly.
- Release reports can be generated from pipeline output.
- Changed-chart detection identifies expected services.

The pilot does **not** yet prove Drone execution (scripts work locally; Drone is the remaining step). Broader rollout should wait until the pilot completes end-to-end in Drone and failure/rerun/alerting behaviour is confirmed.

Scope that should not scale until the pilot is proven: multi-squad rollout, automatic shared-dev deployment, strict validation enforcement (dry-run first).

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

## Child Pages

Detailed supporting material has been split into focused child pages:

| Page | Content |
| --- | --- |
| [Automation And Validation Detail](03.1-automation-and-validation-detail.md) | Validation rules, Drone checklist, commit metadata, merge strategy, strict policy |
| [Release Reporting And Changed-Chart Deployment](03.2-release-reporting-and-changed-chart-deployment.md) | Release reporting requirements, changed-chart detection, deployment default rules |
| [CVE, Renovate And Failure Handling](03.3-cve-renovate-and-failure-handling.md) | CVE/Renovate flow, failure handling, rerun procedure, alerting |

---

## References

- Current state: see [02 — Current Release Operating Model](02-current-release-operating-model.md)
- Decisions to confirm: see [04 — Rollout Decision Proposals](04-rollout-decision-proposals.md)
- Hotfix detail: see [05 — Hotfix and Rollback](05-hotfix-and-rollback.md)

---

Feedback or questions? Contact the page owner or comment below.

---

## Related Pages

- [CI/CD Findings And Actions](01-cicd-findings-and-actions.md)
- [Current Release Operating Model](02-current-release-operating-model.md)
- [Rollout Decision Proposals](04-rollout-decision-proposals.md)
- [Hotfix And Rollback](05-hotfix-and-rollback.md)
- [Ownership And Approvals](06-ownership-and-approvals.md)

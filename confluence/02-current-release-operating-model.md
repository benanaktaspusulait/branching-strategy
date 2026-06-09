# Current Release Operating Model

```
Owner: Benan Aktas
Status: In Review
Created: 2026-06-09
Last updated: 2026-06-09
Labels: release-model, current-state, cerberus, ci-cd
```

---

## Executive Summary

The current release process follows a GitFlow-style model. It is manual-heavy, with release preparation taking days per sprint. The target direction is to centralise repeatable release work through Drone, auto-update Cerberus charts and produce cross-referenced release reports.

This page captures the current state — not the target. The key principle is: changing the branch model alone does not make the release safe. Safety comes from tag, artefact, chart, manifest, config, validation and reconciliation all agreeing.

---

## Current Branching Model

```text
feature branch → development → release branch → master / production
```

| Element | Current Behaviour |
|---------|-------------------|
| Feature branches | Created for individual changes (ticket-based). |
| `development` | Ongoing work and candidate state for upcoming releases. |
| Release branches | Created from `development` at sprint boundary. |
| `master` | Intended to reflect production/live state. |
| Tags | Created on release branch to trigger artefact creation. |
| Reconciliation | Release branch merged back to `master` and `development` after release. |
| Hotfixes | Possible from production state; back-merge not fully standardised. |

**Important:** The proposed target is not "rename `development` to `main`". The target is "`main` represents the confirmed production state". `development` may contain unreleased work.

---

## End-to-End Flow (Compact)

| Phase | Activities |
|-------|------------|
| Source Control | Feature → development → release → tag |
| Artefact Creation | Build / test / scan → image + Helm package |
| Deployment State | Manifest + Cerberus charts + values / config / secrets |
| Promotion | Deploy → tech validation → QAT → production |
| Reconciliation | `main` reflects production; active releases updated |

---

## Deployment and Helm Summary

- Individual service charts have had Drone pipelines for dev-environment deployment.
- Current approach deploys through the service repo.
- MMA Helm repo contains scripts for packaging, linting, templating, diffing, uploading and deployment tasks.
- Helm charts deploy as packaged artefacts with environment-specific values files.
- Tag creation triggers packaging/upload; deployment is promoted or manually triggered.
- Chart names may still need explicit listing until changed-chart detection is reliable.

**Manual areas still needing confirmation:** Which server chart updates remain manual; which Drone pipeline changes are needed; how manual chart changes are reconciled with release reports.

---

## Tagging and Artefact Creation

Creating a tag on the release branch triggers:

1. Repository clone
2. Docker/test dependency setup
3. Artifactory login
4. Service build (Maven/tests for Spring Boot)
5. Vulnerability scanning (Trivy)
6. Code quality scanning (Sonar)
7. Helm package + dependency build + artefact upload

**Risk:** If the tag points to the wrong commit, the entire downstream process deploys the wrong artefact while appearing correct.

---

## Feature Flags and Activation

| Principle | Detail |
|-----------|--------|
| Code deployed ≠ feature enabled | Activation controlled by feature flags and environment-specific values. |
| Flag control | Some flags appear controlled through chart values/config. |
| Implication | If flags are baked into Helm values, enabling/disabling requires redeployment. |

---

## Testing and Validation

| Layer | What It Confirms |
|-------|------------------|
| Technical validation | Deployment completed; pods started; health checks passed. |
| Functional validation | Playwright/Cypress tests; QAT approval for SIT and above. |
| Key principle | Deployment success ≠ functional validation complete. |

---

## Environment and Operational Constraints

| Constraint | Detail |
|------------|--------|
| Release day | Thursday (standard). |
| Higher environments | May require PNR room/location access. |
| Tools pod | Some commands require tools pod access. |
| Secrets exposure | Screen sharing while viewing decoded secrets is a security risk; rotation required if exposed. |
| Lower vs higher | Lower environments deployed ad hoc; higher use server chart releases. |

---

## Confirmation Needed Before Branching Change

1. When release branches are cut.
2. When tags are created.
3. Which repositories are in scope.
4. Which steps are manual vs automated.
5. How hotfixes and rollback are handled.
6. How `main` is kept aligned with production.
7. Who owns release readiness, execution, validation and reconciliation.
8. How feature flag state is recorded in the release report.
9. Which environment readiness checks are mandatory.

---

## References

- Proposed target flow: see [03 — Proposed Release Automation Flow](03-proposed-release-automation-flow.md)
- Hotfix and rollback: see [05 — Hotfix and Rollback](05-hotfix-and-rollback.md)
- Decisions to confirm: see [04 — Rollout Decision Proposals](04-rollout-decision-proposals.md)

---

Feedback or questions? Contact the page owner or comment below.

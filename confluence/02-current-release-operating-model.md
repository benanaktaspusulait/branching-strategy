# Current Release Operating Model

| Field | Value |
| --- | --- |
| Owner | Benan Aktas |
| Status | In Review |
| Created | 2026-06-09 |
| Last updated | 2026-06-09 |
| Labels | release-model, current-state, cerberus, ci-cd |

---

## Summary

The current release process follows a GitFlow-style model. It is manual-heavy, with release preparation taking days per sprint. A possible improvement direction is to centralise repeatable release work through Drone, auto-update Cerberus charts and produce cross-referenced release reports.

This page captures the current state, not an agreed target model. The key principle is: changing the branch model alone does not make the release safe. Safety comes from tag, artefact, chart, manifest, config, validation and reconciliation all agreeing.

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

**Important:** The possible target is not "rename `development` to `main`". The safer direction may be that "`main` represents the confirmed production state". `development` may contain unreleased work.

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

## Child Pages

Detailed supporting material has been split into focused child pages:

| Page | Content |
| --- | --- |
| [Branching Strategy Options](02.1-branching-strategy-options.md) | GitFlow, simplified, trunk-based comparison and readiness criteria |
| [Tagging, Artefacts And Manifest Flow](02.2-tagging-artefacts-and-manifest-flow.md) | Tag flow, artefact creation, manifest/ticket validation, auto-manifest scripts |
| [Testing, Validation And Environment Constraints](02.3-testing-validation-and-environment-constraints.md) | Testing layers, feature flags, environment constraints, squad briefing |

---

## References

- Possible target flow: see [03 - Proposed Release Automation Flow](03-proposed-release-automation-flow.md)
- Hotfix and rollback: see [05 — Hotfix and Rollback](05-hotfix-and-rollback.md)
- Decisions to confirm: see [04 — Rollout Decision Proposals](04-rollout-decision-proposals.md)

---

Feedback or questions? Contact the page owner or comment below.

---

## Related Pages

- [Main Assessment And Reading Order](00-parent-release-engineering-assessment.md)
- [CI/CD Findings And Actions](01-cicd-findings-and-actions.md)
- [Proposed Release Automation Flow](03-proposed-release-automation-flow.md)
- [Rollout Decision Proposals](04-rollout-decision-proposals.md)
- [Ownership And Approvals](06-ownership-and-approvals.md)
- [Page Coverage Index](09-page-coverage-index.md)

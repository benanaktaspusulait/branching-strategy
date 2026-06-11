# CI/CD Findings and Actions

| Field | Value |
| --- | --- |
| Owner | Benan Aktas |
| Status | In Review |
| Created | 2026-06-09 |
| Last updated | 2026-06-09 |
| Labels | ci-cd, findings, release-engineering, cerberus, proposal |

---

## Summary

The release challenge is broader than the branching model. CI/CD and deployment depend on service tags, Helm artefacts, manifests, configuration, secrets, feature flags, environment access and ownership. This page identifies eight problem areas, proposes ten actions and prioritises them by effort and impact.

The approach is: stabilise the release operating model before changing the branching model.

---

## Problem Areas

| # | Area | Current Problem | Why It Matters |
|---|------|-----------------|----------------|
| P1 | Manual release work | Release creation, chart updates, tag handling and deployment triggers involve manual or locally run steps. | Increases release time, inconsistency and audit gaps. |
| P2 | Branch/tag timing | Release branches, temporary tags and full release tags need clearer rules. | Wrong timing creates wrong artefacts or unclear release state. |
| P3 | Release scope | "All services" and cross-repo scope are not explicit. | Automation may include too much, too little or miss secrets/config/Liquibase changes. |
| P4 | Manifest validation | Missing tags, wrong tags, invalid ticket status and `do not deploy` cases need strict policy. | Weak validation allows wrong versions into production. |
| P5 | Changed-chart deployment | Deploying all charts manually or listing names explicitly is inefficient. | Should default to changed charts with audited override. |
| P6 | Environment readiness | New environments need values files, setup entries and Drone secrets/tokens confirmed. | An environment can look available but fail deployment. |
| P7 | Hotfix and rollback | Hotfix source, back-merge and rollback reconciliation are not standardised. | Production fixes can drift from `main`, manifests and active releases. |
| P8 | Alerting and rerun | Failed automation alerting and safe rerun rules are not defined. | Failed steps leave release state unclear. |

---

## Action Register

| ID | Finding | Proposed Action | Owner | Priority | Status | Evidence |
|----|---------|-----------------|-------|----------|--------|----------|
| A01 | Manual release work | Keep the current-state flow as the baseline view. | TBC | P2 | Proposed | Current operating model documented |
| A02 | Local script dependency | Move local/manual release automation into Drone once pilot is green. | TBC | P1 | Proposed | Pilot in progress |
| A03 | Weak validation | Define strict validation (wrong tag, missing tag, manifest/tag mismatch = fail). | TBC | P1 | Proposed | Validation rules documented |
| A04 | Unclear scope | Confirm repository scope for all change types. | TBC | P1 | Proposed | — |
| A05 | Manual chart deployment | Confirm changed-chart deployment behaviour and override path. | TBC | P2 | Proposed | — |
| A06 | No rollback runbook | Document hotfix and rollback flows including reconciliation. | TBC | P1 | Proposed | — |
| A07 | No alerting model | Define alerting and rerun rules for failed steps. | TBC | P2 | Proposed | — |
| A08 | Environment not gated | Confirm environment readiness criteria. | TBC | P2 | Proposed | — |
| A09 | Decisions unconfirmed | Use rollout decision proposals as the decision record until confirmed. | TBC | P1 | Proposed | Decision register open |
| A10 | Tribal knowledge | Document deployment parameters to remove tribal knowledge. | TBC | P2 | Proposed | — |

---

## Execution Order

| Order | Action | Indicative Timing |
|-------|--------|-------------------|
| 1 | Quick wins (A03, A10) | This sprint / next sprint |
| 2 | Move automation to Drone (A02) | Current pilot |
| 3 | Auto release branch + chart updates (A05) | After pilot green |
| 4 | Alerting and strict validation (A07, A03) | Alongside #3 |
| 5 | Rollback runbook (A06) | Before next production incident |
| 6 | Ownership sign-off (A04, A09) | Before expanding beyond pilot squads |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Automation pilot fails due to token/proxy issues | Medium | High | Narrow pilot scope; test failure paths |
| Strict validation causes early release failures | Medium | Medium | Run dry-run for one release first |
| Ownership not assigned before expansion | High | Medium | Close Phase 0 decisions before Phase 2 |

---

## Child Pages

| Page | Content |
| --- | --- |
| [Deployment And Release Findings](01.1-deployment-and-release-findings.md) | Helm flow, secrets, umbrella charts, tag jump checker, environment setup |
| [CI/CD Detailed Supporting Material](01.2-cicd-detailed-supporting-material.md) | Detailed analysis and prioritisation |

---

## References

- Current release operating model: see [02 — Current Release Operating Model](02-current-release-operating-model.md)
- Proposed automation: see [03 — Proposed Release Automation Flow](03-proposed-release-automation-flow.md)
- Rollout decisions: see [04 — Rollout Decision Proposals](04-rollout-decision-proposals.md)
- Ownership: see [06 — Ownership and Approvals](06-ownership-and-approvals.md)

---

Feedback or questions? Contact the page owner or comment below.

---

## Related Pages

- [Main Assessment And Reading Order](00-parent-release-engineering-assessment.md)
- [Current Release Operating Model](02-current-release-operating-model.md)
- [Proposed Release Automation Flow](03-proposed-release-automation-flow.md)
- [Hotfix And Rollback](05-hotfix-and-rollback.md)
- [Page Coverage Index](09-page-coverage-index.md)

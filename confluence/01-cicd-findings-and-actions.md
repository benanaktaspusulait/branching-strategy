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

## Proposed Actions

1. Keep the current-state flow as the baseline view.
2. Move local/manual release automation into Drone once pilot is green.
3. Define strict validation (wrong tag, missing tag, manifest/tag mismatch = fail).
4. Confirm repository scope for all change types.
5. Confirm changed-chart deployment behaviour and override path.
6. Document hotfix and rollback flows including reconciliation.
7. Define alerting and rerun rules for failed steps.
8. Confirm environment readiness criteria.
9. Use rollout decision proposals as the decision record until confirmed.
10. Document deployment parameters to remove tribal knowledge.

---

## Prioritisation

### Quick Wins (High Impact, Low Effort)

| Action | Rationale |
|--------|-----------|
| Pre-commit hook for ticket references | Prevents garbage commits in release history. |
| Strict validation: fail on missing/wrong tag | Script change only. Prevents wrong artefacts reaching production. |
| Document deployment parameters | Write-up only. Removes tribal knowledge dependency. |
| Changed-chart detection in release report | Reporting change. Shows what should deploy. |

### Medium Effort (High Impact)

| Action | Rationale |
|--------|-----------|
| Move release automation to Drone | Central, auditable, repeatable. Removes local-script dependency. |
| Auto release branch creation | Removes start-of-sprint manual work. |
| Auto Cerberus chart branch updates | Removes biggest manual time sink. |
| Alerting for failed steps | Makes failures visible. |

### High Effort (High Impact)

| Action | Rationale |
|--------|-----------|
| Full rollback runbook and testing | Requires cross-team agreement and testing time. |
| Environment parity documentation | Requires production access/knowledge few people have. |
| Ownership matrix sign-off | Requires management decisions and role assignment. |
| Feature flag runtime control | Requires new tooling or infrastructure. |

---

## Execution Order

| Order | Action | Indicative Timing |
|-------|--------|-------------------|
| 1 | Quick wins | This sprint / next sprint |
| 2 | Move automation to Drone | Current pilot |
| 3 | Auto release branch + chart updates | After pilot green |
| 4 | Alerting and strict validation | Alongside #3 |
| 5 | Rollback runbook | Before next production incident |
| 6 | Ownership sign-off | Before expanding beyond pilot squads |
| 7 | Feature flags and environment parity | Medium-term roadmap |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Automation pilot fails due to token/proxy issues | Medium | High | Narrow pilot scope; test failure paths |
| Strict validation causes early release failures | Medium | Medium | Run dry-run for one release first |
| Ownership not assigned before expansion | High | Medium | Close Phase 0 decisions before Phase 2 |

---

## References

- Current release operating model: see 02 — Current Release Operating Model
- Proposed automation: see 03 — Proposed Release Automation Flow
- Rollout decisions: see 04 — Rollout Decision Proposals
- Ownership: see 06 — Ownership and Approvals

---

Feedback or questions? Contact the page owner or comment below.

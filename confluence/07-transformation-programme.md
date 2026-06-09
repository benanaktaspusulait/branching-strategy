# Transformation Programme

```
Owner: Benan Aktas
Status: In Review
Created: 2026-06-09
Last updated: 2026-06-09
Labels: transformation, roadmap, maturity, cerberus, release-engineering, proposal
```

---

## Executive Summary

The release process currently scores 2.3/5 across ten maturity areas. The target is 4.3/5. This page provides the root cause analysis, risk assessment, maturity scorecard, eight working principles, current vs target state, phased roadmap (Phase 0–5), RACI matrix, success metrics, cost/benefit analysis and the top 10 improvement recommendations.

The approach is: invest in release governance, environment standardisation and deployment automation rather than immediate branching model replacement.

---

## Root Cause Analysis

| Problem | Root Cause | Evidence |
|---------|-----------|----------|
| Failed/wrong release | Environment mismatch; tag/manifest validation not enforced. | Multiple tag versions for same release (e.g. 581–584). |
| Delayed release | Manual coordination across people, scripts and repos. | Preparation takes days per sprint. |
| Rollback uncertainty | No tested operational rollback; Liquibase may be forward-only. | Practical behaviour leans fix-forward. |
| Testing inconsistencies | Environment drift; lower envs ad hoc, higher envs use chart releases. | Pre-prod may contain more data than production. |
| Unclear release content | Release metadata spread across Jira, Git, manifests and scripts. | Tag jump checker sometimes passes incorrectly. |
| Ownership confusion | RACI not assigned; "release management" is a function, not a named person. | Ownership matrix has no confirmed backups. |

---

## Risk Assessment

| # | Risk | Likelihood | Impact | Priority | Mitigation |
|---|------|------------|--------|----------|------------|
| R1 | Production outage from wrong artefact | Medium | Critical | P1 | Strict tag/manifest validation; fail on mismatch. |
| R2 | Extended incident — no rollback process | Medium | Critical | P1 | Document and test rollback; define time budget. |
| R3 | Release delays from manual coordination | High | Medium | P2 | Automation pilot; Drone as release path. |
| R4 | Partial release (missing secrets/config/DB) | High | High | P1 | Explicit release scope checklist per release. |
| R5 | Audit failure from weak release trail | Medium | High | P2 | Pipeline-generated reports; immutable artefacts. |
| R6 | Environment failure at deploy time | Medium | Medium | P3 | Explicit environment readiness gate. |
| R7 | Escalation confusion during incident | High | Medium | P2 | Named owners per RACI. |
| R8 | Trunk-based instability | Low | High | P3 | Defer trunk-based until feature flags mature. |

---

## Maturity Scorecard

| Area | Current | Target | Gap Summary |
|------|---------|--------|-------------|
| Source control and branching | 3.0 | 4.5 | Reconciliation and automation incomplete. |
| CI/CD pipeline | 3.0 | 4.5 | Release steps still local/manual. |
| Release validation | 2.0 | 4.5 | Fail/warn policy not enforced. |
| Deployment automation | 2.5 | 4.0 | Manual chart updates and triggers remain. |
| Observability and monitoring | 2.0 | 4.0 | No release-correlated observability gates. |
| Release governance and ownership | 2.0 | 4.5 | Named owners and approval map unconfirmed. |
| Hotfix and rollback | 1.5 | 4.0 | No tested operational process. |
| Environment management | 2.5 | 4.0 | Readiness not gated. |
| Secrets and config management | 2.5 | 4.0 | Onboarding and rotation are heavy. |
| Release reporting and audit | 2.0 | 4.5 | Not pipeline-driven or mandatory. |

**Overall: 2.3 → 4.3**

---

## Transformation Principles

1. Stabilise the release operating model before changing branches.
2. Standardise release metadata (commit → production traceability).
3. Automate before reorganising — prove automation with current model first.
4. Improve visibility before restructuring (reports, dashboards, alerting).
5. Reduce manual steps where safe — each is a consistency risk.
6. Make ownership explicit — unnamed = unowned.
7. Test rollback before you need it.
8. Treat environment readiness as a gate, not an assumption.

---

## Target State (Current vs Target)

| Current State | Target State |
|---------------|--------------|
| Manual branch/tag/chart coordination | Automated release branch + tag + chart |
| Local script execution | Drone pipeline as single release path |
| Permissive validation | Strict fail-fast validation |
| Unnamed ownership | Named RACI per release activity |
| No tested rollback | Tested rollback with decision guide |

---

## Roadmap

| Phase | Timeframe | Focus | Key Deliverables |
|-------|-----------|-------|------------------|
| 0 | Week 1–2 | Decisions and ownership | Confirm rollout decisions; assign named owners; publish exit criteria. |
| 1 | Month 1 | Quick wins | Pre-commit hook; strict validation dry-run; environment readiness checklist; rollback documentation. |
| 2 | Month 2–3 | Release automation | Drone pilot green; auto branch/tag/chart; release reporting; alerting. |
| 3 | Month 3–4 | Branch cutover | `main = production` cutover; branch protections; forward-merge rules active. |
| 4 | Month 4–6 | Scale and harden | Changed-chart deployment; shared dev auto-deploy; rerun safety; full RACI enforcement. |
| 5 | Month 6–12 | Modernise | Runtime feature flags; External Secrets Operator; SBOM generation; observability gates evaluation. |

---

## RACI Matrix

| Activity | Dev/Squad | Tech Lead | Architect | Platform/DevOps | Release Owner | QAT | Incident Lead |
|----------|-----------|-----------|-----------|-----------------|---------------|-----|---------------|
| Feature development | R | A | C | I | I | I | I |
| Merge to release branch | R | A | I | I | I | I | I |
| Release branch creation | I | I | I | R | A | I | I |
| Tag and artefact build | I | I | I | R | A | I | I |
| Manifest validation | I | C | C | R | A | I | I |
| Deploy to lower envs | R | A | I | C | I | I | I |
| Deploy to SIT+ | I | C | I | R | A | C | I |
| Functional validation | C | I | I | I | I | R/A | I |
| Production release | I | C | C | C | A | R | I |
| Hotfix decision | R | C | C | R | A | I | C |
| Rollback decision | I | C | C | R | A | I | R |
| Post-release reconciliation | I | I | I | R | A | I | I |

R = Responsible, A = Accountable, C = Consulted, I = Informed. Named individuals TBC.

---

## Success Metrics

| Metric | Current (Est.) | Phase 2 Target | Phase 4 Target |
|--------|----------------|----------------|----------------|
| Deployment frequency | Monthly | Fortnightly | Weekly |
| Lead time (commit → prod) | 10–15 days | 5–7 days | 2–3 days |
| Change failure rate | ~10–15% | < 5% | < 2% |
| MTTR | ~4–8h | < 2h | < 1h |
| Release prep effort | Days/sprint | < 1 day | < 2 hours |
| Manual steps per release | 10+ | < 5 | < 2 |

---

## Cost/Benefit Summary

| Improvement | Cost | Benefit | Payback |
|-------------|------|---------|---------|
| Strict validation (fail-fast) | Low | Prevents wrong artefacts reaching production. | Immediate |
| Named ownership (RACI) | Low | Faster decisions during incidents/releases. | Immediate |
| Rollback documentation | Low–Medium | Confidence for production incidents. | First incident avoided |
| Drone release automation | Medium | Days saved per sprint; consistent execution. | 2–3 releases |
| Release reporting dashboard | Medium | Visibility; audit trail. | Ongoing |
| Environment readiness gate | Low | Eliminates late release failures. | First prevented failure |
| External Secrets Operator | Medium | Simpler rotation; better audit. | 6 months |
| Trunk-based development | Very High | Uncertain until flags/validation mature. | Unknown |

---

## Top 10 Recommendations

| # | Improvement | Phase |
|---|-------------|-------|
| 1 | Standardise release metadata (tags, manifests, Jira fields, commit format). | 0–1 |
| 2 | Establish release governance (named owners, approval map, RACI). | 0 |
| 3 | Enforce strict release validation (wrong/missing tag = fail). | 1 |
| 4 | Complete Drone release automation pilot. | 2 |
| 5 | Document and test rollback process. | 1 |
| 6 | Formalise environment readiness as a deployment gate. | 1 |
| 7 | Create release reporting dashboard. | 2 |
| 8 | Introduce release KPIs (DORA metrics + custom). | 2 |
| 9 | Strengthen audit trail (pipeline artefacts, immutable reports). | 2–3 |
| 10 | Re-evaluate branching strategy after maturity improvements. | 4+ |

---

## References

- Findings and actions: see [01 — CI/CD Findings and Actions](01-cicd-findings-and-actions.md)
- Decisions: see [04 — Rollout Decision Proposals](04-rollout-decision-proposals.md)
- Ownership: see [06 — Ownership and Approvals](06-ownership-and-approvals.md)
- Future platform vision: see [08 — Platform and Knowledge Graph](08-platform-and-knowledge-graph.md)

---

Feedback or questions? Contact the page owner or comment below.

# Cerberus Release Process Understanding And Improvement Notes

| Field | Value |
| --- | --- |
| Owner | Benan Aktas |
| Status | In Review |
| Created | 2026-06-09 |
| Last updated | 2026-06-09 |
| Last reviewed | 2026-06-09 |
| Labels | kt-notes, ci-cd, release-engineering, cerberus |

---

## 1. Summary

This page summarises my current understanding of the Cerberus CI/CD, release and deployment process based on KT sessions, discussions and follow-up analysis. It captures what appears to exist today, which areas look manual or risky, and which improvement areas may be useful for team discussion.

The main finding is:

> The release challenge is broader than the branching model. Release state is fragmented across Git branches, tags, images, Helm charts, deployment-management, manifests, Jira, secrets, Liquibase, runbooks and approvals. Changing the branch model alone does not make releases safer. The safer approach is to make the current release process visible, repeatable, validated, owned and auditable first; then simplify the branch model after the automation and controls are proven.

The possible approach for discussion is:

1. Stabilise the release operating model (validation, ownership, automation, rollback).
2. Move release automation into Drone.
3. Cut over to `main = production` only when the above is proven.
4. Keep longer-term platform visibility ideas separate from the immediate release-process work.

Some assumptions may be incomplete and should be validated with Gareth, Achilles, release management, the platform team and squad leads before any rollout behaviour changes.

---

## 2. Context / Problem Statement

The current release process is manual-heavy and produces several operational risks:

- Release preparation takes days per sprint.
- Tag, artefact and manifest validation is not strict enough — wrong artefacts can reach production.
- Release scope is not explicit — secrets, config, Liquibase or runbook changes can be missed.
- Hotfix and rollback are not operationally standardised.
- Ownership and approval responsibilities are not fully named in the current notes.
- No alerting exists for failed automation steps.
- Environment readiness is not a formal gate.

Detailed problem analysis is in the child page: [CI/CD Findings and Actions](01-cicd-findings-and-actions.md).

---

## 3. Objectives

The objectives are to:

- Make the release process visible, repeatable, validated, owned and auditable.
- Reduce manual release preparation effort.
- Enforce strict tag/manifest validation.
- Document and test hotfix and rollback flows.
- Assign named owners for all release activities.
- Move release automation into Drone (centralised, auditable).
- Enable branch model simplification only after the above is stable.

---

## 4. Scope

### In Scope

- Current-state release operating model assessment.
- Problem identification (P1–P12).
- Release automation proposal (Drone pilot).
- Branching model options (GitFlow, simplified, trunk-based).
- Validation framework.
- Hotfix and rollback operating model.
- Ownership and approval model (RACI).
- Possible phased improvement path (Phase 0–5).

### Out of Scope

- Immediate trunk-based development adoption.
- Immediate Knowledge Graph or control-plane implementation.
- Production application performance optimisation.
- Rewriting existing services.
- Future platform visibility ideas (captured separately in [Future Platform Topics](08-platform-and-knowledge-graph.md) for later evaluation only).

---

## 5. Approach

The approach is phased and incremental:

- **Phase 0** — Confirm rollout decisions, assign named owners.
- **Phase 1** — Quick wins: strict validation dry-run, environment readiness checklist, rollback documentation.
- **Phase 2** — Drone automation pilot: auto branch/tag/chart, release reporting, alerting.
- **Phase 3** — Branch cutover: `main = production`, branch protections.
- **Phase 4** — Scale: changed-chart deployment, shared dev, full RACI enforcement.
- **Phase 5+** — Separately evaluate feature flags, secrets operator, observability gates and dashboard feasibility if the release foundation is stable.

---

## 6. Proposal Overview Matrix

| Proposal | Value | Risk | Complexity | Effort | MoSCoW | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Strict tag/manifest validation | High | Low | Low | Low | Must | Script change only |
| Named ownership (RACI) | High | Low | Low | Low | Must | Management decision |
| Environment readiness gate | High | Low | Low | Low | Must | Checklist + pre-deploy check |
| Rollback documentation and testing | High | Medium | Medium | Medium | Must | Before next production incident |
| Drone release automation pilot | High | Medium | Medium | Medium | Must | Current pilot in progress |
| Release reporting dashboard | High | Medium | Medium | Medium | Should | After pilot green |
| Changed-chart deployment | High | Medium | Medium | Medium | Should | After detection validated |
| Alerting for failed automation | Medium | Low | Low | Low | Should | Slack/email notification |
| Branch cutover (main = production) | Medium | Medium | Medium | Medium | Should | After Phase 2 green |
| External Secrets Operator | Medium | Medium | Medium | Medium | Could | Medium-term |
| Runtime feature flags | Medium | Medium | High | High | Could | After automation stable |
| Read-only platform visibility | Medium | Medium | High | High | Could | Future evaluation only |
| ArgoCD / GitOps | Medium | High | High | High | Won't (now) | Defer unless separately reviewed |
| Trunk-based development | Medium | High | High | High | Won't (now) | Defer until flags mature |

---

## 7. Potential Success Measures

- Release preparation effort reduced from days to hours.
- Wrong tag / missing tag / manifest mismatch fails the pipeline (strict validation).
- Named owner assigned for every release activity.
- Hotfix and rollback flow documented and tested at least once.
- Drone automation pilot succeeds for configuration service.
- Release report auto-generated and matches actual release content.
- Environment readiness gated before deployment.
- Alerting fires on failed automation steps.

---

## 8. Risks and Mitigations

| Risk | Impact | Mitigation | Owner |
| --- | --- | --- | --- |
| Pilot fails in Drone due to token/proxy differences | Delays rollout | Narrow pilot scope; test happy and failure paths | Gareth / Achilles |
| Ownership not assigned before expansion | Decisions delayed during incidents | Close Phase 0 decisions before Phase 2 | Release owner (TBC) |
| Metadata quality too poor for strict validation | Early failures on every release | Start with dry-run for one release first | Platform / DevOps |
| Rollback not tested before next incident | Extended incident duration | Document and test before production incident | Release owner + incident lead |
| Trunk-based adopted too early | Instability if feature flags immature | Keep GitFlow baseline; reassess after Phase 4 | Architecture |

---

## 9. DACI / Decision Areas

| Decision Area | Why DACI May Be Needed | Suggested Participants | Status |
| --- | --- | --- | --- |
| Branch cutover (`main = production`) | Affects all repos, all squads | Release owner, squad leads, platform | Proposed |
| Strict validation enforcement | May fail releases initially | Release owner, platform, QAT | Proposed |
| Rollback operating model | Production safety | Release owner, incident lead, platform | Proposed |
| Future platform visibility evaluation | Long-term investment, not immediate scope | Architecture, platform, delivery | Future |

---

## 10. What Feedback I Need

Please review and comment on:

1. Whether the problem framing is accurate based on your experience.
2. Whether the proposed phased sequencing is sensible.
3. Whether the immediate scope (Phase 0–4) is correct and complete.
4. Whether any risks or manual steps are missing from the assessment.
5. Which decisions need named owners first.
6. Which items should become Epic / Story / Task work.
7. Whether any proposals should be split into separate DACI records.
8. Whether any assumptions are wrong — I have noted "TBC" and "current understanding" where I am uncertain.

---

## 11. Proposed Next Step

Validate the current-state assumptions and proposed sequencing with Gareth, Achilles, release management, the platform team and one or more squad leads. After that, agree which items should become delivery work and which decisions need named owners or DACI records.

---

## 12. Reader Guide

| If you want to understand... | Read this page |
| --- | --- |
| The overall summary and proposed approach | **This page** (00) |
| The main CI/CD findings and possible actions | [CI/CD Findings and Actions](01-cicd-findings-and-actions.md) |
| The current release operating model | [Current Release Operating Model](02-current-release-operating-model.md) |
| The proposed automation flow | [Proposed Release Automation Flow](03-proposed-release-automation-flow.md) |
| The decisions that need confirmation | [Rollout Decision Proposals](04-rollout-decision-proposals.md) |
| Hotfix and rollback handling | [Hotfix and Rollback](05-hotfix-and-rollback.md) |
| Ownership, RACI and approval gaps | [Ownership and Approvals](06-ownership-and-approvals.md) |
| Maturity observations, roadmap and metrics | [Improvement Path and Maturity Observations](07-transformation-programme.md) |
| Future platform topics (not in current scope) | [Future Platform Topics](08-platform-and-knowledge-graph.md) |
| Page coverage and content mapping | [Page Coverage Index](09-page-coverage-index.md) |

---

## 13. References

- Detailed decision register: see [Rollout Decision Proposals](04-rollout-decision-proposals.md).
- Source material: `branching-strategy` repository (requires GitLab access).

---

Feedback or questions? Contact the page owner or comment below.

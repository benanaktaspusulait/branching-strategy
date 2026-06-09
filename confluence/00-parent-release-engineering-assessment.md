# Cerberus Release Engineering Assessment

```
Owner: Benan Aktas
Status: In Review
Created: 2026-06-09
Last updated: 2026-06-09
Last reviewed: 2026-06-09
Source: branching-strategy repository (GitLab)
Labels: proposal, ci-cd, release-engineering, cerberus
```

---

## 1. Executive Summary

This page summarises the assessment of the Cerberus CI/CD, release and deployment process. It covers what exists today, what is broken, what should change and how the transformation should be phased.

The main finding is that the release challenge is broader than the branching model. Release state is fragmented across Git, tags, images, Helm charts, deployment-management, manifests, Jira, secrets, Liquibase and runbooks. Changing the branch model alone does not fix this.

The proposed approach is:

1. Stabilise the release operating model (validation, ownership, automation, rollback).
2. Move release automation into Drone.
3. Cut over to `main = production` only when the above is proven.
4. Evaluate unified deployment platform and knowledge graph capabilities later.

A decision is required from the release owner, platform lead and architecture team to approve the rollout decisions before Phase 1 begins.

---

## 2. Context / Problem Statement

The current release process is manual-heavy and produces several operational risks:

- Release preparation takes days per sprint.
- Tag, artefact and manifest validation is not strict enough — wrong artefacts can reach production.
- Release scope is not explicit — secrets, config, Liquibase or runbook changes can be missed.
- Hotfix and rollback are not operationally standardised.
- Ownership and approval responsibilities are not fully named.
- No alerting exists for failed automation steps.
- Environment readiness is not a formal gate.

These problems are documented in detail in: [CI/CD Findings and Actions](01-cicd-findings-and-actions.md)

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
- Transformation roadmap (Phase 0–7).
- Long-term platform vision (Knowledge Graph, Control Plane, Engineering Copilot).

### Out of Scope

- Immediate trunk-based development adoption.
- Immediate Knowledge Graph or Control Plane implementation.
- AI/copilot capability (future option only).
- Production application performance optimisation.
- Rewriting existing services.

---

## 5. Approach

The approach is phased and incremental:

- **Phase 0** — Approve rollout decisions, assign named owners.
- **Phase 1** — Quick wins: strict validation dry-run, environment readiness checklist, rollback documentation.
- **Phase 2** — Drone automation pilot: auto branch/tag/chart, release reporting, alerting.
- **Phase 3** — Branch cutover: `main = production`, branch protections.
- **Phase 4** — Scale: changed-chart deployment, shared dev, full RACI enforcement.
- **Phase 5+** — Modernise: feature flags, secrets operator, observability gates, dashboard feasibility.
- **Phase 6+** — Optimise: Knowledge Graph, GitOps, progressive delivery evaluation.
- **Future** — Engineering Copilot, AI-assisted intelligence (long-term option only).

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
| Knowledge Graph MVP | Medium | Medium | High | High | Could | Phase 6+ evaluation |
| ArgoCD / GitOps | Medium | High | High | High | Won't (now) | Defer to Phase 6+ |
| Trunk-based development | Medium | High | High | High | Won't (now) | Defer until flags mature |
| Engineering Copilot | Medium | High | High | High | Won't (now) | Long-term future option |

---

## 7. Success Criteria

- Release preparation effort reduced from days to hours.
- Wrong tag / missing tag / manifest mismatch fails the pipeline (strict validation).
- Named owner assigned for every release activity.
- Hotfix and rollback flow documented and tested at least once.
- Drone automation pilot succeeds for configuration service.
- Release report auto-generated and matches actual release content.
- Environment readiness gated before deployment.
- Alerting fires on failed automation steps.

---

## 8. Child Pages

| Child Page | Purpose |
| --- | --- |
| [CI/CD Findings and Actions](01-cicd-findings-and-actions.md) | Problem summary, root causes, recommended actions, prioritisation |
| [Current Release Operating Model](02-current-release-operating-model.md) | End-to-end flow, Helm, tags, manifests, environments |
| [Proposed Release Automation Flow](03-proposed-release-automation-flow.md) | Target automation, branch model, chart updates, reporting |
| [Rollout Decision Proposals](04-rollout-decision-proposals.md) | 23 decisions with status, approval tracker |
| [Hotfix and Rollback](05-hotfix-and-rollback.md) | Hotfix flow, rollback process, Liquibase strategy |
| [Ownership and Approvals](06-ownership-and-approvals.md) | RACI, ownership gap, environment readiness |
| [Transformation Programme](07-transformation-programme.md) | Root cause, maturity, roadmap, cost/benefit, top 10 |
| [Platform and Knowledge Graph (Future)](08-platform-and-knowledge-graph.md) | Long-term: control plane, knowledge graph, copilot, ingestion model |

---

## 9. Risks and Mitigations

| Risk | Impact | Mitigation | Owner |
| --- | --- | --- | --- |
| Pilot fails in Drone due to token/proxy differences | Delays rollout | Narrow pilot scope; test happy and failure paths | Gareth / Achilles |
| Ownership not assigned before expansion | Decisions delayed during incidents | Close Phase 0 decisions before Phase 2 | Release owner (TBC) |
| Metadata quality too poor for strict validation | Early failures on every release | Start with dry-run for one release first | Platform / DevOps |
| Rollback not tested before next incident | Extended incident duration | Document and test before production incident | Release owner + incident lead |
| Trunk-based adopted too early | Instability if feature flags immature | Keep GitFlow baseline; reassess after Phase 4 | Architecture |

---

## 10. DACI / Decision Areas

| Decision Area | Why DACI May Be Needed | Suggested Participants | Status |
| --- | --- | --- | --- |
| Branch cutover (`main = production`) | Affects all repos, all squads | Release owner, squad leads, platform | Proposed |
| Strict validation enforcement | May fail releases initially | Release owner, platform, QAT | Proposed |
| Rollback operating model | Production safety | Release owner, incident lead, platform | Proposed |
| Knowledge Graph evaluation | Long-term investment | Architecture, platform, delivery | Future |

---

## 11. References

- Source repository: `branching-strategy` (GitLab) (requires GitLab access)
- Release decision register: see child page [Rollout Decision Proposals](04-rollout-decision-proposals.md)
- Build script: `scripts/build-complete-document.js`
- Validation script: `scripts/validate-markdown-links.js`

---

## 12. Feedback

Feedback or questions? Contact the page owner or comment below.

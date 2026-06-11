# Page Coverage Index

| Field | Value |
| --- | --- |
| Owner | Benan Aktas |
| Status | In Review |
| Created | 2026-06-09 |
| Last updated | 2026-06-09 |
| Labels | confluence, page-coverage, release-engineering, cerberus |

---

## Summary

This page shows the full page tree for the Cerberus release engineering assessment, including all parent and child pages with purpose, audience and status.

---

## Full Page Tree

| Page | Purpose | Audience | Status | Parent |
| --- | --- | --- | --- | --- |
| [00 — Main Assessment And Reading Order](00-parent-release-engineering-assessment.md) | Entry point, summary, reader guide | All | In Review | — |
| [01 — CI/CD Findings And Actions](01-cicd-findings-and-actions.md) | Problem areas, action register, priorities | Platform, release owners | In Review | 00 |
| [01.1 — Deployment And Release Findings](01.1-deployment-and-release-findings.md) | Helm flow, secrets, umbrella charts, environment setup | Platform engineers | In Review | 01 |
| [01.2 — CI/CD Detailed Supporting Material](01.2-cicd-detailed-supporting-material.md) | Detailed analysis and prioritisation | Platform engineers | In Review | 01 |
| [02 — Current Release Operating Model](02-current-release-operating-model.md) | Current-state branching, flow, confirmation needs | All | In Review | 00 |
| [02.1 — Branching Strategy Options](02.1-branching-strategy-options.md) | GitFlow, simplified, trunk-based comparison | Architects, tech leads | In Review | 02 |
| [02.2 — Tagging, Artefacts And Manifest Flow](02.2-tagging-artefacts-and-manifest-flow.md) | Tag flow, artefact creation, manifest validation | Platform, release owners | In Review | 02 |
| [02.3 — Testing, Validation And Environment Constraints](02.3-testing-validation-and-environment-constraints.md) | Testing layers, feature flags, squad briefing | Squad developers, QAT | In Review | 02 |
| [03 — Proposed Release Automation Flow](03-proposed-release-automation-flow.md) | Proposed automation, branch model, pilot scope | All | In Review | 00 |
| [03.1 — Automation And Validation Detail](03.1-automation-and-validation-detail.md) | Validation rules, Drone checklist, strict policy | Platform, release owners | In Review | 03 |
| [03.2 — Release Reporting And Changed-Chart Deployment](03.2-release-reporting-and-changed-chart-deployment.md) | Reporting requirements, changed-chart rules | Release owners, squads | In Review | 03 |
| [03.3 — CVE, Renovate And Failure Handling](03.3-cve-renovate-and-failure-handling.md) | CVE/Renovate flow, failure handling, alerting | Platform, squads | In Review | 03 |
| [04 — Rollout Decision Proposals](04-rollout-decision-proposals.md) | 23 open decisions, closure order, guardrails | Delivery leads, release owners | In Review | 00 |
| [04.1 — Decision Register Detailed Rationale](04.1-decision-register-detailed-rationale.md) | Per-decision rationale (TBC) | All | In Review | 04 |
| [05 — Hotfix And Rollback](05-hotfix-and-rollback.md) | Hotfix scenarios, rollback guide, pre-rollback checklist | Release owners, incident leads | In Review | 00 |
| [05.1 — Hotfix Operating Model Detail](05.1-hotfix-operating-model-detail.md) | Detailed hotfix scenarios, approval routes | Release owners, platform | In Review | 05 |
| [05.2 — Rollback, Fix-Forward And Reconciliation Detail](05.2-rollback-fix-forward-and-reconciliation-detail.md) | Rollback detail, reconciliation checklist | Incident leads, platform | In Review | 05 |
| [05.3 — Liquibase Rollback Considerations](05.3-liquibase-rollback-considerations.md) | Database rollback rules, expand/migrate/contract | Platform, squad developers | In Review | 05 |
| [06 — Ownership And Approvals](06-ownership-and-approvals.md) | Ownership gaps, approval points, escalation table | Delivery leads, release owners | In Review | 00 |
| [06.1 — Release Scope And Repository Classification](06.1-release-scope-and-repository-classification.md) | Repository list, service scope, change types | Release owners, platform | In Review | 06 |
| [06.2 — RACI And Approval Matrix Detail](06.2-raci-and-approval-matrix-detail.md) | Full RACI, ownership matrix, governance controls | All leads | In Review | 06 |
| [06.3 — Environment Readiness Checklist](06.3-environment-readiness-checklist.md) | Readiness detail, token ownership, access | Platform engineers | In Review | 06 |
| [07 — Improvement Path And Maturity Observations](07-transformation-programme.md) | Principles, target shape, discussion sequence | All | In Review | 00 |
| [07.1 — Maturity Scorecard And Metrics](07.1-maturity-scorecard-and-metrics.md) | Maturity scores, DORA metrics, cost/benefit | Delivery leads, architects | In Review | 07 |
| [07.2 — Risk Register And Root Cause Analysis](07.2-risk-register-and-root-cause-analysis.md) | Root causes, risks, P1–P12, S1–S7 | All | In Review | 07 |
| [07.3 — Phased Improvement Roadmap](07.3-phased-improvement-roadmap.md) | Roadmap, Gantt, RACI, go/no-go criteria | Delivery leads, architects | In Review | 07 |
| [08 — Future Platform Topics](08-platform-and-knowledge-graph.md) | Summary, guardrails, roadmap positioning | Architects, platform leads | In Review | 00 |
| [08.1 — Environment Promotion And Deployment Strategy](08.1-environment-promotion-and-deployment-strategy.md) | Promotion model, deployment strategy options | Platform engineers | In Review | 08 |
| [08.2 — Observability, SBOM And Supply Chain Security](08.2-observability-sbom-and-supply-chain-security.md) | Observability gates, SLSA, SBOM | Platform, security | In Review | 08 |
| [08.3 — GitOps Readiness](08.3-gitops-readiness.md) | Push vs pull, ArgoCD vs Flux, prerequisites | Platform engineers, architects | In Review | 08 |
| [08.4 — Knowledge Graph And Release Intelligence](08.4-knowledge-graph-release-intelligence.md) | Design, domain model, implementation, business case | Architects, platform leads | In Review | 08 |
| [08.5 — Unified Control Plane And Architecture Review](08.5-unified-control-plane-future-concept.md) | Control plane, architecture mapping, review notes | Architects, directors | In Review | 08 |
| [09 — Page Coverage Index](09-page-coverage-index.md) | This page — full page tree and reading orders | All | In Review | 00 |
| [10 — Glossary](10-glossary.md) | Key terms and definitions | All | In Review | 00 |

---

## Reading Orders By Audience

### Delivery Leads

1. [00 — Main Assessment](00-parent-release-engineering-assessment.md)
2. [04 — Rollout Decision Proposals](04-rollout-decision-proposals.md)
3. [06 — Ownership And Approvals](06-ownership-and-approvals.md)
4. [07 — Improvement Path](07-transformation-programme.md)
5. [07.3 — Phased Roadmap](07.3-phased-improvement-roadmap.md)
6. [07.1 — Maturity Scorecard](07.1-maturity-scorecard-and-metrics.md)

### Platform Engineers

1. [00 — Main Assessment](00-parent-release-engineering-assessment.md)
2. [01 — CI/CD Findings](01-cicd-findings-and-actions.md)
3. [01.1 — Deployment Findings](01.1-deployment-and-release-findings.md)
4. [03 — Proposed Automation](03-proposed-release-automation-flow.md)
5. [03.1 — Automation Detail](03.1-automation-and-validation-detail.md)
6. [06.3 — Environment Readiness](06.3-environment-readiness-checklist.md)
7. [08.1 — Promotion And Deployment](08.1-environment-promotion-and-deployment-strategy.md)

### Release Managers

1. [00 — Main Assessment](00-parent-release-engineering-assessment.md)
2. [02 — Current Operating Model](02-current-release-operating-model.md)
3. [03 — Proposed Automation](03-proposed-release-automation-flow.md)
4. [04 — Rollout Decisions](04-rollout-decision-proposals.md)
5. [05 — Hotfix And Rollback](05-hotfix-and-rollback.md)
6. [06 — Ownership And Approvals](06-ownership-and-approvals.md)

### Architects

1. [00 — Main Assessment](00-parent-release-engineering-assessment.md)
2. [07 — Improvement Path](07-transformation-programme.md)
3. [07.2 — Risk Register](07.2-risk-register-and-root-cause-analysis.md)
4. [02.1 — Branching Options](02.1-branching-strategy-options.md)
5. [08 — Future Platform Topics](08-platform-and-knowledge-graph.md)
6. [08.4 — Knowledge Graph](08.4-knowledge-graph-release-intelligence.md)
7. [08.5 — Control Plane](08.5-unified-control-plane-future-concept.md)

### Squad Developers

1. [00 — Main Assessment](00-parent-release-engineering-assessment.md) (summary only)
2. [02.3 — Testing And Environment Constraints](02.3-testing-validation-and-environment-constraints.md) (squad briefing)
3. [03 — Proposed Automation](03-proposed-release-automation-flow.md) (branch/tag model)
4. [05 — Hotfix And Rollback](05-hotfix-and-rollback.md) (what to do when things go wrong)
5. [10 — Glossary](10-glossary.md)

---

## Related Pages

- [Main Assessment And Reading Order](00-parent-release-engineering-assessment.md)
- [Glossary](10-glossary.md)

---

Feedback or questions? Contact the page owner or comment below.

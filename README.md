# Cerberus Release Process Understanding, Gaps And Improvement Ideas

**KT Notes, Current Understanding, Observations And Discussion Points**

This document captures my current understanding of the Cerberus CI/CD, release and deployment process based on KT sessions, discussions and follow-up analysis. It highlights areas that appear manual, unclear or risky, and proposes possible questions or improvement ideas for team discussion.

Some assumptions may be incomplete or wrong and should be validated with Gareth, Achilles, release management, the platform team and squad leads. This is not an approved operating model, a replacement for existing team decisions or a formal architecture proposal.

**Author positioning:** This is a working note from a developer currently onboarding into the Cerberus release process. It is intended to support discussion and shared understanding, not to override existing team decisions or established release management practices.

## Summary

```text
Avoid changing the branching model first.
First make the current release process visible, repeatable and auditable.
Then discuss whether the branch model should be kept, simplified or replaced.
```

## Structure

The notes are organised as a focused discussion pack plus appendix material. The main discussion pack stays on the Cerberus release-management problem: safer release flow, validation, ownership, hotfix/rollback and areas that may need confirmation.

### Main Discussion Pack

| Page | What It Covers |
| --- | --- |
| [System state, problems, solution options and risks](docs/system-state-problems-solutions.md) | Current-state summary, observed problems, possible solution options, risks and experience-based notes. |
| [Current release operating model](docs/current-release-operating-model.md) | End-to-end release flow: branches -> tags -> artefacts -> deploy -> reconciliation. |
| [Deployment and release findings](docs/deployment-and-release-findings.md) | How Helm scripts, secrets, manifests, umbrella charts and validation scripts actually work. |
| [CI/CD deployment findings and actions](docs/cicd-deployment-findings-and-actions.md) | Problem summary table, root causes, and recommended follow-up actions. |
| [Proposed release automation flow](docs/proposed-release-automation-flow.md) | Target automation: auto release branches, auto chart updates, reporting, changed-chart deploy. |
| [Automation and validation](docs/automation-and-validation.md) | Validation rules, release reporting, commit metadata, merge strategy. |
| [Hotfix and rollback](docs/hotfix-and-rollback.md) | Production hotfix flow, release-phase hotfix, rollback process, Liquibase rollback. |
| [Release scope, ownership and approvals](docs/scope-ownership-approvals.md) | Repository scope, service ownership, approval matrix. |
| [Rollout decision proposals](docs/rollout-decision-proposals.md) | Proposed discussion points for rollout behaviour. |
| [Release decision register](docs/release-decision-register.md) | Open decisions, owner gaps, required evidence and possible closure order. |
| [Improvement notes and maturity observations](docs/transformation-programme.md) | Root cause notes, risk observations, maturity scorecard and possible near-term target state. |
| [Possible improvement path and delivery notes](docs/transformation-programme-delivery.md) | Indicative phases, prioritisation, RACI, metrics to baseline, cost/benefit and improvement areas. |
| [Platform engineering strategy](docs/platform-engineering-strategy.md) | Environment promotion model, deployment strategies, observability gates. |
| [Potential architecture review notes](docs/architecture-review/index.md) | Optional later-stage review considerations, criticality challenge notes and open risks. |

Key problems at a glance:

| Problem | Impact |
| --- | --- |
| Release creation is manual-heavy | Days of effort per sprint, inconsistency, audit gaps. |
| Branch/tag timing rules unclear | Wrong artefacts, wrong manifests, unclear release state. |
| Release scope not explicit | Automation misses secrets, config, Liquibase or runbook changes. |
| Manifest validation too permissive | Wrong version or blocked work can reach production. |
| Chart deployment is manual | Every chart listed by hand; no changed-chart detection. |
| Hotfix/rollback not standardised | Drift between production, `main`, manifests and active releases. |
| No alerting for failed automation | Failed steps leave release state unclear. |
| Ownership not assigned | Nobody named for key decisions and approvals. |

### Appendix And Reference Material

| Page | What It Covers |
| --- | --- |
| [Branching strategy options](docs/branching-options.md) | Branch model comparison after the operating model is understood. |
| [Release engineering best practices](docs/release-engineering-best-practices.md) | Supporting industry guidance for branching, validation, Helm, rollback, ownership and rollout. |
| [Squad briefing summary](docs/squad-briefing-summary.md) | Squad-facing communication material. |
| [Detailed system analysis](docs/reference/system-state-problems-solutions-detailed.md) | Full current state detail. |
| [Detailed problems (P1–P12)](docs/reference/detailed-problems.md) | Full problem analysis with root cause and evidence. |
| [Detailed solutions (S1–S7)](docs/reference/detailed-solutions.md) | Full solution options with risks and experience notes. |
| [Detailed rollout decisions](docs/reference/rollout-decision-proposals-detailed.md) | Full rationale behind the short rollout decision proposal page. |
| [Platform engineering strategy — advanced](docs/platform-engineering-strategy-advanced.md) | Future GitOps, SBOM, supply chain security and control-plane considerations. |
| [Deployment knowledge graph — design](docs/deployment-knowledge-graph-design.md) | Future option: domain model, entity relationships, graph schema. |
| [Deployment knowledge graph — implementation](docs/deployment-knowledge-graph-implementation.md) | Future option: event architecture, ingestion, API, search, workflows. |
| [Deployment knowledge graph — operations](docs/deployment-knowledge-graph-operations.md) | Future option: security, retention, integrations, technology options, roadmap. |
| [Deployment knowledge graph — business case](docs/deployment-knowledge-graph-business-case.md) | Future option: strategic value, governance model, risks, NFRs and decision record. |
| [Advanced architecture sections](docs/advanced-architecture-sections.md) | Future option: architecture mapping, event-driven ingestion, data trust and platform framing. |

## Suggested Reading Order

1. This page.
2. [System state, problems, solution options and risks](docs/system-state-problems-solutions.md) - current understanding and discussion summary.
3. [Current release operating model](docs/current-release-operating-model.md) - how it works today.
4. [CI/CD deployment findings and actions](docs/cicd-deployment-findings-and-actions.md) - what is broken.
5. [Proposed release automation flow](docs/proposed-release-automation-flow.md) - what the solution looks like.
6. [Deployment and release findings](docs/deployment-and-release-findings.md) - technical details.
7. [Automation and validation](docs/automation-and-validation.md) - validation, reporting, metadata and failure handling.
8. [Hotfix and rollback](docs/hotfix-and-rollback.md) - production recovery and reconciliation.
9. [Release scope, ownership and approvals](docs/scope-ownership-approvals.md) - scope, owners and approval points.
10. [Rollout decision proposals](docs/rollout-decision-proposals.md) - proposed discussion points to confirm or amend.
11. [Release decision register](docs/release-decision-register.md) - open decision tracker and possible closure order.
12. [Improvement notes and maturity observations](docs/transformation-programme.md) - root cause, maturity and possible target release state.
13. [Possible improvement path and delivery notes](docs/transformation-programme-delivery.md) - indicative phases, RACI, metrics and investment notes.
14. [Platform engineering strategy](docs/platform-engineering-strategy.md) - promotion model, deployment strategy and observability gates.
15. [Potential architecture review notes](docs/architecture-review/index.md) - optional later-stage review considerations and open risks.

## Visual Overview

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#4a90d9', 'primaryTextColor': '#fff', 'primaryBorderColor': '#2c6fad', 'secondaryColor': '#f0f4f8', 'tertiaryColor': '#e8f5e9'}}}%%

flowchart TD
  %% Layer 1
  A["📋 Current Release Operating Model"]:::current
  B["🔧 Deployment & Release Findings"]:::current

  %% Layer 2
  C["⚠️ CI/CD Findings & Actions"]:::problem
  D["🎯 System State, Problems & Solutions"]:::problem

  %% Layer 3
  E["🚀 Proposed Release Automation Flow"]:::solution
  G["✅ Automation & Validation"]:::solution
  H["🔄 Hotfix & Rollback"]:::solution
  J["👥 Scope, Ownership & Approvals"]:::decision

  %% Layer 4
  I["📝 Rollout Decision Proposals"]:::decision
  M["📌 Release Decision Register"]:::decision

  %% Layer 5
  L["🗺️ Improvement Notes"]:::transform
  N["🏛️ Review Considerations"]:::transform

  %% Relationships
  A & B --> C --> D
  D --> E
  E --> G & H
  G & H & J --> I
  J --> M
  H --> M
  I --> M
  M --> L
  L --> N

  classDef current fill:#1a73e8,stroke:#1557b0,color:#fff,font-weight:bold
  classDef problem fill:#e8710a,stroke:#c45d08,color:#fff,font-weight:bold
  classDef solution fill:#0d652d,stroke:#094d22,color:#fff,font-weight:bold
  classDef decision fill:#7b1fa2,stroke:#5c1680,color:#fff,font-weight:bold
  classDef transform fill:#795548,stroke:#5d4037,color:#fff,font-weight:bold
```

**Colour key:**
🔵 Current state · 🟠 Problems · 🟢 Solutions · 🟣 Decisions · 🟤 Transformation

## Related Pages

- [System State, Problems, Solution Options And Risks](docs/system-state-problems-solutions.md)
- [Release Decision Register](docs/release-decision-register.md)
- [Improvement Notes And Maturity Observations](docs/transformation-programme.md)
- [Potential Architecture Review Notes](docs/architecture-review/index.md)

# Cerberus Release Engineering Assessment

**Current State, Problems, Risks And Improvement Roadmap**

This folder contains the assessment of the Cerberus CI/CD, release and deployment process: what exists today, what is broken, and what should change.

This is an assessment and proposal, not an approved operating model. Items marked "Proposed" or "Needs confirmation" require team sign-off before implementation.

## Summary

```text
Do not change the branching model first.
First make the current release process visible, repeatable and auditable.
Then decide whether the branch model should be kept, simplified or replaced.
```

## Structure

The documentation is organised as a decision-ready synthesis plus three supporting layers:

### Decision-Ready Synthesis

| Page | What It Covers |
| --- | --- |
| [System state, problems, solution options and risks](docs/system-state-problems-solutions.md) | Clear current-state summary, problem analysis, solution options, risks and experience-based recommendations. |
| [Release decision register](docs/release-decision-register.md) | Single register for open rollout, ownership, validation, hotfix and rollback decisions. |

### Layer 1: Current State (What Exists Today)

| Page | What It Covers |
| --- | --- |
| [Current release operating model](docs/current-release-operating-model.md) | End-to-end release flow: branches -> tags -> artefacts -> deploy -> reconciliation. |
| [Deployment and release findings](docs/deployment-and-release-findings.md) | How Helm scripts, secrets, manifests, umbrella charts and validation scripts actually work. |

### Layer 2: Problems (What Is Broken Or Missing)

| Page | What It Covers |
| --- | --- |
| [CI/CD deployment findings and actions](docs/cicd-deployment-findings-and-actions.md) | Problem summary table, root causes, and recommended follow-up actions. |

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

### Layer 3: Proposed Solutions

| Page | What It Covers |
| --- | --- |
| [Proposed release automation flow](docs/proposed-release-automation-flow.md) | Target automation: auto release branches, auto chart updates, reporting, changed-chart deploy. |
| [Branching strategy options](docs/branching-options.md) | Three branch model options compared: GitFlow, simplified, trunk-based. |
| [Automation and validation](docs/automation-and-validation.md) | Validation rules, release reporting, commit metadata, merge strategy. |
| [Hotfix and rollback](docs/hotfix-and-rollback.md) | Production hotfix flow, release-phase hotfix, rollback process, Liquibase rollback. |
| [Release scope, ownership and approvals](docs/scope-ownership-approvals.md) | Repository scope, service ownership, approval matrix. |
| [Rollout decision proposals](docs/rollout-decision-proposals.md) | 15 proposed decisions ready for team approval. |
| [Release decision register](docs/release-decision-register.md) | Approval status, owner gaps, required evidence and closure order for open decisions. |
| [Transformation programme](docs/transformation-programme.md) | Root cause, risk, maturity scorecard, target state, control plane future. |
| [Transformation programme — delivery](docs/transformation-programme-delivery.md) | Roadmap, RACI, metrics, cost/benefit, top 10 recommendations. |
| [Squad briefing summary](docs/squad-briefing-summary.md) | Short update for squad leads: what changes, what to expect. |

### Transformation Programme

| Page | What It Covers |
| --- | --- |
| [Transformation programme](docs/transformation-programme.md) | Executable transformation programme: strategy, roadmap (Phase 0–7), RACI, metrics, prioritisation, Go/No-Go criteria, target operating model, executive investment view and top 10 recommendations. |

### Reference

| Page | What It Covers |
| --- | --- |
| [Release engineering best practices](docs/release-engineering-best-practices.md) | Supporting industry guidance for branching, validation, Helm, rollback, ownership and rollout. |
| [Platform engineering strategy](docs/platform-engineering-strategy.md) | Environment promotion model, deployment strategies, observability gates. |
| [Platform engineering strategy — advanced](docs/platform-engineering-strategy-advanced.md) | GitOps readiness, SBOM, supply chain security, unified control plane. |
| [Deployment knowledge graph — design](docs/deployment-knowledge-graph-design.md) | Domain model, entity relationships, graph schema. |
| [Deployment knowledge graph — implementation](docs/deployment-knowledge-graph-implementation.md) | Event architecture, ingestion, API, search, workflows. |
| [Deployment knowledge graph — operations](docs/deployment-knowledge-graph-operations.md) | Security, retention, integrations, technology options, roadmap. |
| [Deployment knowledge graph — business case](docs/deployment-knowledge-graph-business-case.md) | Strategic value, ROI, governance model, risks, NFRs, AI enablement, decision record. |
| [Detailed system analysis](docs/reference/system-state-problems-solutions-detailed.md) | Full detailed version of the system state, problems, solutions and risks. |
| [Detailed rollout decisions](docs/reference/rollout-decision-proposals-detailed.md) | Full rationale behind the short rollout decision proposal page. |

## Suggested Reading Order

**Quick overview (10 min):**
1. This page.
2. [System state, problems, solution options and risks](docs/system-state-problems-solutions.md) - decision-ready synthesis.
3. [Current release operating model](docs/current-release-operating-model.md) - how it works today.
4. [CI/CD deployment findings and actions](docs/cicd-deployment-findings-and-actions.md) - what is broken.
5. [Proposed release automation flow](docs/proposed-release-automation-flow.md) - what the solution looks like.

**Full picture:**
6. [Deployment and release findings](docs/deployment-and-release-findings.md) - technical details.
7. [Branching strategy options](docs/branching-options.md) - branch model comparison.
8. [Rollout decision proposals](docs/rollout-decision-proposals.md) - decisions to approve.
9. [Release decision register](docs/release-decision-register.md) - approval tracker and closure order.

**For approvers:**
10. [Hotfix and rollback](docs/hotfix-and-rollback.md)
11. [Release scope, ownership and approvals](docs/scope-ownership-approvals.md)
12. [Automation and validation](docs/automation-and-validation.md)
13. [Release engineering best practices](docs/release-engineering-best-practices.md)
14. [Platform engineering strategy](docs/platform-engineering-strategy.md)

## Maintenance Checks

Before sharing a regenerated complete document, run:

```bash
node scripts/build-complete-document.js
node scripts/validate-markdown-links.js
```

The build step rewrites local links for `COMPLETE-DOCUMENT.md`. The validation step checks local Markdown links and heading anchors across the repository.

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
  F["🌿 Branching Strategy Options"]:::solution
  G["✅ Automation & Validation"]:::solution
  H["🔄 Hotfix & Rollback"]:::solution

  %% Layer 4
  I["📝 Rollout Decision Proposals"]:::decision
  J["👥 Scope, Ownership & Approvals"]:::decision
  K["📢 Squad Briefing Summary"]:::decision
  M["📌 Release Decision Register"]:::decision

  %% Layer 5
  L["🗺️ Transformation Programme"]:::transform

  %% Relationships
  A & B --> C --> D
  D --> E & F
  E --> G & H
  F & G & H --> I
  I --> M
  J --> M
  H --> M
  M --> K
  K --> L

  classDef current fill:#1a73e8,stroke:#1557b0,color:#fff,font-weight:bold
  classDef problem fill:#e8710a,stroke:#c45d08,color:#fff,font-weight:bold
  classDef solution fill:#0d652d,stroke:#094d22,color:#fff,font-weight:bold
  classDef decision fill:#7b1fa2,stroke:#5c1680,color:#fff,font-weight:bold
  classDef transform fill:#00695c,stroke:#004d40,color:#fff,font-weight:bold
```

**Colour key:**
🔵 Current state · 🟠 Problems · 🟢 Solutions · 🟣 Decisions · 🟤 Transformation

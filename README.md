# CI/CD Deployment And Branching Strategy

This folder documents the current Cerberus CI/CD, release and deployment process: what exists today, what is broken, and what should change.

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

### Layer 1: Current State (What Exists Today)

| Page | What It Covers |
| --- | --- |
| [Current release operating model](docs/current-release-operating-model.md) | End-to-end release flow: branches → tags → artefacts → deploy → reconciliation. |
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
| [Rollout decision proposals](docs/rollout-decision-proposals.md) | 14 proposed decisions ready for team approval. |
| [Squad briefing summary](docs/squad-briefing-summary.md) | Short update for squad leads: what changes, what to expect. |

## Suggested Reading Order

**Quick overview (10 min):**
1. This page.
2. [System state, problems, solution options and risks](docs/system-state-problems-solutions.md) — decision-ready synthesis.
3. [Current release operating model](docs/current-release-operating-model.md) — how it works today.
4. [CI/CD deployment findings and actions](docs/cicd-deployment-findings-and-actions.md) — what is broken.
5. [Proposed release automation flow](docs/proposed-release-automation-flow.md) — what the solution looks like.

**Full picture:**
6. [Deployment and release findings](docs/deployment-and-release-findings.md) — technical details.
7. [Branching strategy options](docs/branching-options.md) — branch model comparison.
8. [Rollout decision proposals](docs/rollout-decision-proposals.md) — decisions to approve.

**For approvers:**
9. [Hotfix and rollback](docs/hotfix-and-rollback.md)
10. [Release scope, ownership and approvals](docs/scope-ownership-approvals.md)
11. [Automation and validation](docs/automation-and-validation.md)

## Visual Overview

```mermaid
flowchart TD
  subgraph CURRENT["Layer 1: Current State"]
    A["Release operating model"]
    B["Deployment and release findings"]
  end

  subgraph PROBLEMS["Layer 2: Problems"]
    C["CI/CD findings and actions"]
  end

  subgraph SOLUTIONS["Layer 3: Solutions"]
    D["Release automation flow"]
    E["Branching options"]
    F["Validation and reporting"]
    G["Hotfix and rollback"]
    H["Scope and ownership"]
    I["Rollout decisions"]
  end

  CURRENT --> PROBLEMS
  PROBLEMS --> SOLUTIONS
```

# Cerberus Release Engineering Assessment

**Current State, Problems, Risks And Improvement Roadmap**

This document is a consolidated assessment of the Cerberus CI/CD, release and deployment process: what exists today, what is broken, and what should change.

This is an assessment and proposal, not an approved operating model. Items marked "Proposed" or "Needs confirmation" require team sign-off before implementation.

## Table Of Contents

| # | Section | Purpose |
| --- | --- | --- |
| 1 | [Executive Assessment](#executive-assessment) | One-paragraph situation, top findings, main message. |
| 2 | [Release State Is Fragmented](#release-state-is-fragmented) | Why branching alone is not enough. |
| 3 | [Business And Delivery Impact](#business-and-delivery-impact) | Operational risk table. |
| 4 | [System State, Problems, Solutions And Risks](#system-state-problems-solution-options-and-risks) | Decision-ready synthesis. |
| 5 | [Current Release Operating Model](#current-release-operating-model) | End-to-end flow as it works today. |
| 6 | [Deployment And Release Findings](#deployment-and-release-findings) | Helm, secrets, manifests, validation scripts. |
| 7 | [CI/CD Deployment Findings And Actions](#cicd-deployment-findings-and-actions) | Problem areas and recommended actions. |
| 8 | [Proposed Release Automation Flow](#proposed-release-automation-flow) | Target automation. |
| 9 | [Branching Strategy Options](#branching-strategy-options) | GitFlow, simplified, trunk-based comparison. |
| 10 | [Automation And Validation](#automation-and-validation) | Validation rules, reporting, quality gates. |
| 11 | [Hotfix And Rollback](#hotfix-and-rollback) | Hotfix flow, rollback, Liquibase strategy. |
| 12 | [Release Scope, Ownership And Approvals](#release-scope-ownership-and-approvals) | Who owns what. Ownership gap analysis. |
| 13 | [Rollout Decision Proposals](#rollout-decision-proposals) | Proposed decisions ready for approval. |
| 14 | [Squad Briefing Summary](#squad-briefing-summary) | Short update for squad leads. |
| 15 | [Release Engineering Best Practices](#release-engineering-best-practices) | Industry reference guidance. |
| 16 | [Platform Engineering Strategy](#platform-engineering-strategy) | Future maturity: GitOps, observability, SBOM (not immediate). |
| 17 | [One-Page Summary](#one-page-summary) | Risks, recommendations, go/no-go, next step. |
| A1 | [Detailed System Analysis (Appendix)](#system-state-problems-solution-options-and-risks---detailed-analysis) | Full P1-P12 problem analysis. |
| A2 | [Detailed Rollout Decisions (Appendix)](#rollout-decision-proposals-1) | Full rationale behind decisions. |

## Summary

```text
Do not change the branching model first.
First make the current release process visible, repeatable and auditable.
Then decide whether the branch model should be kept, simplified or replaced.
```

## Executive Assessment

### Current Situation In One Paragraph

Cerberus currently operates a GitFlow-like branching model, but the real release state is not contained within Git alone. It is fragmented across branches, tags, Docker images, Helm artefacts, the Cerberus deployment-management repository, manifests, environment-specific values files, Jira ticket metadata, secrets (managed through Git-crypt and Drone), Liquibase database scripts and runbooks. A branch rename or branching model simplification does not address this fragmentation. The release process is manual-heavy, validation is not strict enough, ownership is not fully assigned and operational procedures (hotfix, rollback, environment readiness) are not standardised. The automation pilot (Gareth/Achilles on the configuration service) is a strong first step, but it covers only part of the problem.

### Top Findings

| # | Finding | Impact | Recommended Action |
| --- | --- | --- | --- |
| 1 | The issue is broader than branching. | Changing the branch model alone does not fix the release process. | Stabilise the operating model before simplifying branches. |
| 2 | Release state is fragmented across multiple systems. | No single view of what constitutes a release. | Map all release state areas; validate consistency through automation. |
| 3 | Release preparation is manual-heavy. | Days of effort per sprint; inconsistency and audit gaps. | Move local scripts into Drone; automate branch/tag/chart creation. |
| 4 | Tag, artefact and manifest validation is not strict enough. | Wrong artefact or blocked work may reach production. | Fail fast on wrong tag, missing tag, manifest/tag mismatch. |
| 5 | Release scope is not fully explicit. | Automation may miss secrets, config, Liquibase or runbook changes. | Define and enforce a release scope checklist per release. |
| 6 | Hotfix and rollback are not operationally standardised. | Production fixes may drift from main, manifests and active releases. | Document and test both hotfix and rollback flows before next production incident. |
| 7 | Environment readiness is not a formal gate. | Deployment may fail due to incomplete setup (missing values, secrets, tokens). | Treat environment readiness as a mandatory pre-deployment gate. |
| 8 | Ownership and approval responsibilities are not fully named. | Decisions are delayed; escalation is unclear. | Assign named owners for every release activity (see Ownership Gap section). |
| 9 | Failed automation alerting and rerun rules are incomplete. | A failed step can leave release state unclear and unresolved. | Define alerting channels, rerun safety rules and manual-intervention triggers. |
| 10 | Trunk-based development would be risky without stronger feature flags, validation and rollback maturity. | Premature simplification may create instability. | Keep GitFlow-style baseline; reassess branch model after automation matures. |

### Main Message

> **Changing the branch model alone will not make releases safer.**
>
> The safer path is to make the current release state visible, repeatable, validated, owned and auditable first; then simplify the branch model after the automation proves what is actually being released.

## Release State Is Fragmented

The release process depends on multiple disconnected state areas. A problem in any one of them can invalidate the release.

| Release State Area | Current Location / Mechanism | Risk |
| --- | --- | --- |
| Source state | Git branches | Branch may not equal deployed state. |
| Release identity | Git tags / release versions | Wrong tag can create wrong artefact. |
| Build output | Docker images / Helm packages | Artefact may not match intended commit. |
| Deployment intent | Cerberus deployment-management / charts | Chart may not match release scope. |
| Environment config | Values files / feature flags | Deployed code may not be active. |
| Secrets | Git-crypt / managed secrets scripts / Drone secrets | Environment may not be ready. |
| Database changes | Liquibase | Rollback may be unsafe or impossible. |
| Release metadata | Jira labels / ticket fields | Release report may be incomplete. |
| Manual actions | Runbooks / release management | Audit trail may be weak. |
| Approval state | QAT / release owner decisions | Ownership may be unclear. |

**This is why a branch rename or branch-model change is not enough. Release safety depends on all of these states agreeing.**

## Business And Delivery Impact

| Problem | Delivery Impact | Operational Risk |
| --- | --- | --- |
| Manual release work | Release preparation takes days per sprint. | Human error and weak audit trail. |
| Weak validation | Wrong artefact may be released. | Production incident risk. |
| Unclear release scope | Config/secrets/DB changes may be missed. | Partial or broken release. |
| Weak rollback process | Recovery may be slow. | Longer incident duration. |
| Ownership gaps | Decisions are delayed. | Escalation confusion. |
| Environment readiness gaps | Late release failure. | Wasted release window. |
| Fragmented release state | Hard to prove what was deployed. | Audit and incident investigation risk. |


## Structure

The documentation is organised as a decision-ready synthesis plus three supporting layers:

### Decision-Ready Synthesis

| Page | What It Covers |
| --- | --- |
| [System state, problems, solution options and risks](docs/system-state-problems-solutions.md) | Clear current-state summary, problem analysis, solution options, risks and experience-based recommendations. |

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
| [Rollout decision proposals](docs/rollout-decision-proposals.md) | 14 proposed decisions ready for team approval. |
| [Squad briefing summary](docs/squad-briefing-summary.md) | Short update for squad leads: what changes, what to expect. |

### Reference

| Page | What It Covers |
| --- | --- |
| [Release engineering best practices](docs/release-engineering-best-practices.md) | Supporting industry guidance for branching, validation, Helm, rollback, ownership and rollout. |
| [Platform engineering strategy](docs/platform-engineering-strategy.md) | Environment promotion model, deployment strategies, observability gates, GitOps readiness, SBOM and supply chain security. |
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

**For approvers:**
9. [Hotfix and rollback](docs/hotfix-and-rollback.md)
10. [Release scope, ownership and approvals](docs/scope-ownership-approvals.md)
11. [Automation and validation](docs/automation-and-validation.md)
12. [Release engineering best practices](docs/release-engineering-best-practices.md)
13. [Platform engineering strategy](docs/platform-engineering-strategy.md)

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

  %% Relationships
  A & B --> C --> D
  D --> E & F
  E --> G & H
  F & G & H --> I
  I --> J --> K

  classDef current fill:#1a73e8,stroke:#1557b0,color:#fff,font-weight:bold
  classDef problem fill:#e8710a,stroke:#c45d08,color:#fff,font-weight:bold
  classDef solution fill:#0d652d,stroke:#094d22,color:#fff,font-weight:bold
  classDef decision fill:#7b1fa2,stroke:#5c1680,color:#fff,font-weight:bold
```

**Color key:**
🔵 Current state · 🟠 Problems · 🟢 Solutions · 🟣 Decisions

---

# System State, Problems, Solution Options And Risks

This is the decision-ready summary of the CI/CD, branching, release and deployment documentation.

For the full detailed analysis, see [system state detailed analysis](reference/system-state-problems-solutions-detailed.md).

## Executive Summary

```text
Do not change the branching model first.
First make the release process visible, repeatable, validated and owned.
Then move to the target main = production model through a controlled cutover.
```

(See Executive Assessment above for the full rationale.)

The current problem is broader than branching. The release state is spread across branches, tags, images, Helm packages, Cerberus charts, manifests, values, secrets, Liquibase changes, JIRA metadata, QAT approval and post-release reconciliation.

The proposed direction is good, but it should be treated as a phased operating-model change, not only a branch rename.

## Current System State

| Area | Current State | Confidence |
| --- | --- | --- |
| Branch model | GitFlow-like: feature -> `development` -> release branch -> `master` / production. | Medium |
| Target branch model | `main` represents production; release branches auto-created from `main`. | Proposed |
| Automation | Scripts work locally; Drone execution is the next step. | Medium |
| Pilot | Gareth/Achilles are testing on the new configuration service. | Medium |
| Artefact creation | Release tag triggers build, tests, scans and Helm artefact creation. | High |
| Deployment | Helm/package and Cerberus chart flow still has manual areas. | Medium |
| Release reporting | Expected to cross-reference JIRA, tags, services and chart changes. | Proposed |
| Validation | Existing scripts check some metadata, but strict fail/warn policy is not fully agreed. | Low/Medium |
| Hotfix/rollback | Concepts exist; operational runbook and reconciliation rules need approval. | Low/Medium |
| Environment readiness | Values, secrets, tokens and parity checks need clearer gates. | Low |
| Ownership | Templates exist; named owners and approvers are still incomplete. | Low |

## Main Problems

| # | Problem | Impact | Root Cause | Recommended Action |
| --- | --- | --- | --- | --- |
| P1 | The issue can be misframed as "branching only". | A branch change may move risk rather than reduce it. | Release state is distributed across many systems. | Stabilise the operating model before changing the branch model. |
| P2 | Release work is too manual and locally executed. | Slow releases, inconsistent execution, weak audit trail. | Automation is not yet the mandatory central path. | Complete Drone pilot; make pipeline the only release path. |
| P3 | Branch, tag and artefact timing rules are not strict enough. | Wrong artefacts or manifests can be produced. | Branch lifecycle and artefact lifecycle are different. | Enforce strict validation: wrong/missing tag = fail. |
| P4 | Release scope is unclear. | Secrets, config, Liquibase or runbook changes can be missed. | "All services" is not yet defined as a repo/change-type scope. | Define explicit release scope per repo and change type. |
| P5 | Manifest and ticket validation can be too permissive. | Blocked or wrong work can reach release. | Fail vs warning policy is still proposed. | Switch from warning to fail-fast after one dry-run release. |
| P6 | Changed-chart deployment is not yet a proven default. | Changed charts may be missed or unnecessary charts deployed. | Umbrella chart and service mapping need reliable detection. | Validate detection in pilot; deploy changed charts by default. |
| P7 | Hotfix and rollback are not operationally standardised. | Production can drift from branch, manifest and release records. | Rollback is treated as technical capability, not full process. | Document and test both flows before next production incident. |
| P8 | Environment readiness and parity are not explicit gates. | Release day failures can appear late. | Values, secrets, data, access and tokens are not centrally confirmed. | Formalise environment readiness as a mandatory gate. |
| P9 | Secrets/config management will get harder at scale. | Onboarding, rotation and audit risk increase. | Git-crypt/GPG is workable but operationally heavy. | Evaluate External Secrets Operator for medium-term. |
| P10 | Trunk-based development is risky without stronger feature flags. | Incomplete work may need branch or config workarounds. | Feature flags appear deploy-time rather than dynamic runtime. | Keep current model; add runtime flags before reconsidering. |
| P11 | Ownership and approval gaps can break the rollout. | Failures, overrides and rollback decisions become slow. | RACI is not yet fully named. | Assign named owners before expanding beyond pilot. |
| P12 | Alerting and rerun rules are incomplete. | Failed automation can leave state half-updated. | Failure modes are not yet production-readiness gates. | Define alerting channels and safe-rerun criteria. |

For detailed analysis of each problem (current state, risk and full recommendation), see the Detailed System Analysis appendix.

## Recommended Solution Path

### 1. Stabilise The Current Operating Model

Keep the current GitFlow-style model temporarily while the release process is made explicit.

Do now:

- Approve or amend the rollout decisions.
- Define release scope across repos and change types.
- Decide fail vs warning validation rules.
- Name release, hotfix, rollback, environment and alert owners.
- Keep the current process visible until automation is proven.

Risk:

- This can look like "no branching progress" unless time-boxed.

Mitigation:

- Treat it as a one-sprint decision cleanup and publish the exit criteria.

### 2. Move Release Automation Into Drone

Make Drone the central path for release branch, tag, chart update and report generation.

Do next:

- Complete the configuration-service pilot.
- Test reruns and partial-failure recovery.
- Store release reports as pipeline artefacts or release records.
- Alert failures to the right squad/release channel.

Risk:

- Local scripts may fail in Drone because of token, proxy, secret or permission differences.

Mitigation:

- Keep pilot scope narrow and test both happy-path and failure-path cases.

### 3. Add Strict Release Validation

Recommended default:

```text
Wrong tag -> fail
Missing tag -> fail
Manifest/tag mismatch -> fail
Do-not-deploy marker -> fail unless explicitly overridden
Invalid ticket status -> fail or release-owner override
Unknown ownership -> fail or release-owner override
```

Risk:

- Early rollout may fail often because metadata quality is inconsistent.

Mitigation:

- Start with dry-run/report-only for one release, then switch to enforced fail-fast.

### 4. Cut Over To `main = Production`

Only cut over after the pilot and validation rules are green.

Correct cutover:

```text
Create or rename `main` from the confirmed production state.
Do not rename `development` to `main`.
```

Risk:

- `development` may contain work that has not reached production.

Mitigation:

- Freeze `development`, inventory open work and set branch protections before cutover.

### 5. Scale Changed-Chart Deployment

Default to deploying all changed charts, with exclusions requiring release-owner approval and an audit note.

Risk:

- Detection can miss a chart, especially with umbrella charts or cross-repo changes.

Mitigation:

- Keep mass diff and human review mandatory in the first rollout phases.

### 6. Make Hotfix And Rollback A Production Gate

Production release should not proceed without:

- hotfix flow,
- rollback vs fix-forward decision guide,
- manifest reconciliation checklist,
- branch reconciliation checklist,
- Liquibase rollback/fix-forward policy,
- named decision owner.

Risk:

- Rollback may be unsafe when DB/data changes are involved.

Mitigation:

- Require rollback blocks or explicit no-rollback justification for production Liquibase changes.

### 7. Modernise Later, Not First

Runtime feature flags, external secret management, canary rollout and progressive delivery are valuable future improvements.

They should come after the release pipeline, validation and ownership model are stable.

## Go / No-Go Criteria

### Go For Automation Rollout

- Drone pilot succeeds for the configuration service.
- Generated tags, versions, chart changes and release report match expectations.
- Rerun is tested and safe.
- Failure alerting is defined.
- Manual chart edits are exception-only and audited.
- Release owner and backup are named.

### No-Go For Automation Rollout

- Scripts only work locally.
- Pipeline failure can be silent.
- Rerun can create duplicate or conflicting state.
- Release report does not match actual chart/manifest state.
- Drone secrets/tokens are not owned.

### Go For Branch Cutover

- Confirmed production state is known.
- `main` branch protection is ready.
- Automation targets the correct branch.
- Open work on `development` is inventoried.
- Hotfix and rollback reconciliation are approved.
- Strict validation has passed at least the pilot.

### No-Go For Branch Cutover

- Production state cannot be tied to branch/tag/manifest.
- Drone pilot is not green.
- `development` contains unknown open work.
- Rollback reconciliation is unclear.
- Forward-merge ownership is missing.

## Final Recommendation

```text
Phase 0: approve decisions and ownership.
Phase 1: quick wins and strict validation dry-run.
Phase 2: Drone pilot.
Phase 3: controlled `main = production` cutover.
Phase 4: expand changed-chart deployment and shared dev.
Phase 5: optimise feature flags, secrets and progressive delivery.
```

The strongest recommendation is to avoid a big-bang branch change. The safer path is to make the release state auditable first, then simplify the branch model once the automation can prove what is actually being released.



---

# Current Release Operating Model

This page captures the current understanding of how branching, release and deployment fit together.

It is a current-state summary, not the final process definition. Keep this page short; use the linked detail pages for deeper implementation notes.

## Current Direction

The release process is still too manual-heavy. The target direction is to run the repeatable release work centrally through Drone, update Cerberus charts automatically and produce a release report that can be checked against JIRA.

Current status:

- Gareth/Achilles are testing the automation on the new configuration service.
- The scripts work locally; the remaining step is to run them through Drone.
- The automation is expected to generate service chart changes, versions, tags and release reports.
- Some manual server chart work may remain until the relevant Drone pipelines are updated.
- Lower environments are more ad hoc; higher-environment releases rely more heavily on server chart updates and release management.
- Changes may include service code, secrets, config, Liquibase/database changes and runbook work.
- The proposed target has `main` representing production/live state, with release branches auto-created at the start of each sprint/release.

For the proposed target flow, see [proposed release automation flow](proposed-release-automation-flow.md).

For Helm, manifest, secrets and validation detail, see [deployment and release findings](deployment-and-release-findings.md).

## Current Branching Model

The current approach is close to a GitFlow-style model:

```text
feature branch -> development -> release branch -> master / production
```

Current understanding:

- Feature or ticket branches are created for individual changes.
- Completed work is merged into `development`.
- `development` represents ongoing work and the candidate state for upcoming releases.
- Release branches are created from `development`.
- `master` is intended to reflect production/live state.
- Release branches are tagged to trigger releasable artefact creation.
- After release, the release branch should be reconciled back into `master` and `development`.
- Hotfixes should be possible from production state, but the exact back-merge and forward-merge process still needs confirmation.

Important transition note:

```text
The proposed target is not "rename development to main".
The target is "main represents the confirmed production state".
```

That distinction matters because `development` may contain work that has not reached production.

## End-To-End Flow

The release flow currently spans source control, artefact creation, deployment state, environment promotion and post-release reconciliation.

Compact current-state view:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1a73e8', 'primaryTextColor': '#fff', 'primaryBorderColor': '#1557b0', 'lineColor': '#5f6368'}}}%%

flowchart LR
  A["📂 Source Control\n─────────────\nfeature → development\n→ release → tag"]:::phase
  B["🔨 Artefact Creation\n─────────────\nbuild / test / scan\nimage + Helm package"]:::phase
  C["📦 Deployment State\n─────────────\nmanifest + Cerberus charts\nvalues / config / secrets"]:::phase
  D["🚀 Promotion\n─────────────\ndeploy → tech validation\nQAT → production"]:::phase
  E["🔄 Reconciliation\n─────────────\nmain reflects production\nactive releases updated"]:::phase

  A --> B --> C --> D --> E

  classDef phase fill:#1a73e8,stroke:#1557b0,color:#fff,font-weight:bold
```

Why this matters:

```text
Changing the branch model alone does not make the release safe.
The release is only safe when tag, artefact, chart, manifest, config, validation and reconciliation all agree.
```

## Deployment And Helm Summary

The current deployment path focuses on the service repo and the MMA Helm repo.

Key points:

- Individual service charts have had their own Drone pipelines around dev-environment Helm chart deployment.
- The current approach appears to deploy through the service repo instead.
- The MMA Helm repo contains scripts for Helm packaging, linting, templating, diffing, uploading and deployment-related tasks.
- Helm charts are deployed as packaged artefacts with environment-specific values files.
- Tag creation runs packaging/upload steps; deployment itself is promoted or manually triggered.
- Deployment parameters include target environment, deployment scope, release version/tag and chart names.
- Chart names may still need to be listed explicitly until changed-chart detection is reliable.

Temporary manual areas still needing confirmation:

- Which server chart updates remain manual.
- Which Drone pipeline changes are needed before server chart work is automated.
- Who performs manual chart updates during rollout.
- How manual chart changes are reviewed and reconciled with release reports.
- How cross-ticket dependencies are handled when a manual chart edit is still required.

## Tagging And Artefact Creation

A release branch alone does not produce a releasable service artefact. A tag is created on the release branch when it is ready.

Creating a tag appears to trigger:

- repository clone,
- Docker/test dependency setup,
- Artifactory login,
- service build,
- Maven install/tests for Spring Boot services,
- vulnerability scanning such as Trivy,
- code quality scanning such as Sonar,
- Helm package, Helm dependency build and Helm artefact upload.

Compact tag flow:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#0d652d', 'primaryTextColor': '#fff', 'primaryBorderColor': '#094d22', 'lineColor': '#5f6368'}}}%%

flowchart LR
  REL["🌿 Release branch"]:::node
  TAG["🏷️ Service tag"]:::node
  PIPE["⚙️ Tag pipeline\nbuild / test / scan"]:::node
  ART["📦 Image + Helm artefact"]:::node
  MAN["📋 Manifest / chart update"]:::node
  DEPLOY["🚀 Deploy candidate"]:::node

  REL --> TAG --> PIPE --> ART --> MAN --> DEPLOY

  classDef node fill:#0d652d,stroke:#094d22,color:#fff,font-weight:bold
```

Risk:

```text
If the tag points to the wrong commit, the rest of the process can look correct while deploying the wrong artefact.
```

## Manifest, Ticket And Release Metadata

Existing scripts appear to analyse release content using tickets, tags and manifest versions.

Observed responsibilities:

- Compare start tag and end tag.
- Identify tickets included in a release.
- Add or update release labels.
- Update changelog entries.
- Check ticket status.
- Check whether the correct tag version has been entered.
- Compare update versions with current manifest versions.
- Detect incorrect tags, missing tags, blocked tickets or invalid ticket statuses.

Open policy:

```text
Wrong tag, missing tag, manifest/tag mismatch and do-not-deploy markers should fail fast unless an explicit release-owner override is recorded.
```

See [automation and validation](automation-and-validation.md).

## Configuration, Feature Flags And Activation

Deployment does not always mean activation.

Current understanding:

- A new feature or rule can be deployed without being active.
- Activation is controlled by feature flags and environment-specific values.
- Development teams decide which features need to be enabled in each environment.
- Some flag values appear to be controlled through chart values/config.

Operational implication:

```text
Code deployed != feature enabled
```

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#7b1fa2', 'primaryTextColor': '#fff', 'primaryBorderColor': '#5c1680', 'lineColor': '#5f6368'}}}%%

flowchart LR
  CODE["📦 Code deployed"]:::node --> FLAG{"🚦 Feature enabled?"}:::decision
  FLAG -->|No| DORMANT["💤 Inactive code path"]:::off
  FLAG -->|Yes| ACTIVE["✅ Active feature"]:::on
  CONFIG["⚙️ Values / config / flags"]:::node --> FLAG

  classDef node fill:#7b1fa2,stroke:#5c1680,color:#fff,font-weight:bold
  classDef decision fill:#f9a825,stroke:#f57f17,color:#000,font-weight:bold
  classDef off fill:#616161,stroke:#424242,color:#fff
  classDef on fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
```

If feature flags are baked into Helm values, enabling or disabling a feature may require redeployment. That means trunk-based development would move some complexity from branching into configuration and deployment.

## Testing, Validation And Approval

Deployment success and functional release confidence are different things.

Technical validation generally confirms:

- deployment completed,
- pods started successfully,
- health checks or monitoring passed.

Functional validation is separate:

- development teams may use Playwright or Cypress,
- QAT approval is required for SIT and above,
- a green deployment pipeline does not prove functional readiness.

Key principle:

```text
Deployment success != functional validation complete
```

## Environment And Operational Constraints

Environment differences are not fully documented yet.

Areas to confirm:

- data volume and data shape,
- configuration differences,
- feature flag defaults,
- secrets and credentials,
- external integrations,
- network/access constraints,
- operational permissions,
- required values files, Drone secrets and kube/robot tokens,
- whether lower environments are deployed ad hoc while higher environments use server chart releases.

Operational constraints also include:

- Thursday appears to be the regular release day.
- Some higher-environment actions may require PNR room/location access.
- Some commands may require tools pod access.
- Runbook steps may need to run alongside release activity.
- Screen sharing or recording while viewing decoded secrets is a security risk.
- If secrets are exposed, rotation may be required.

## Confirmation Needed

Before changing the branching model, confirm:

1. When release branches are cut.
2. When tags are created.
3. Which repositories are in scope.
4. Which steps are manual vs automated.
5. How hotfixes and rollback are handled.
6. How `master` / `main` is kept aligned with production.
7. Who owns release readiness, execution, validation and reconciliation.
8. How feature flag state is recorded in the release report.
9. Which environment readiness checks are mandatory before rollout.

## Related Detail

- Feature flag and environment management best practices are in [release engineering best practices](release-engineering-best-practices.md).
- Proposed automation is in [proposed release automation flow](proposed-release-automation-flow.md).
- Open rollout decisions are in [rollout decision proposals](rollout-decision-proposals.md).



---

# Deployment And Release Findings

This page covers the current deployment, secrets, manifest and validation mechanisms that the proposed solution must either reuse, automate or replace.

Read this page together with:

- [Current release operating model](current-release-operating-model.md) for the current end-to-end flow.
- [Proposed release automation flow](proposed-release-automation-flow.md) for the target solution.
- [Rollout decision proposals](rollout-decision-proposals.md) for decisions that still need team sign-off.

## 1. Deployment Scripts And Helm Flow

The current deployment path focuses on the service repo and the MMA Helm repo.

Key points:

- Individual service chart Drone pipelines have existed around dev-environment Helm chart deployment.
- The MMA Helm repo contains the deployment scripts for Helm packaging, linting, templating, mass diff, uploading and deployment.
- The MMA Helm repo is different from the MMA Helm library repo, which contains Helm templates/library content.
- Future Drone pipeline deployment changes are likely to touch the MMA Helm repo and possibly service repo environment setup scripts.

Current Helm flow:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  BRANCH["🌿 Branch pushed"]:::start
  BASIC["⚙️ Package / lint\ntemplate / mass diff"]:::auto
  TAG["🏷️ Release tag created"]:::tag
  UPLOAD["📤 Helm package upload"]:::auto
  PROMOTE["👤 Manual promote /\ndeploy trigger"]:::manual
  DEPLOY["🚀 Helm upgrade to\ntarget environment"]:::deploy

  BRANCH --> BASIC --> TAG --> UPLOAD --> PROMOTE --> DEPLOY

  classDef start fill:#455a64,stroke:#37474f,color:#fff,font-weight:bold
  classDef auto fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef tag fill:#7b1fa2,stroke:#4a148c,color:#fff,font-weight:bold
  classDef manual fill:#e8710a,stroke:#c45d08,color:#fff,font-weight:bold
  classDef deploy fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
```

Important details:

- Helm charts are deployed as packages, not directly from local repo files.
- Environment-specific values files are included at deploy time.
- Linting and templating validate Helm/YAML rendering, but Kubernetes may still reject something Helm accepted.
- Mass diff compares rendered templates against the target/default branch to show what changes will be made.
- Tagging kicks off upload/deploy-related pipeline steps.
- Deployment itself is manually promoted/triggered.
- Deployment parameters include target environment, deployment scope, release version and chart names.
- Deployment scope can distinguish live, historical or both.
- To deploy all charts today, chart names may need to be listed explicitly.

## 2. Environment And Release Responsibilities

Current split of responsibilities:

- Developers/squads handle lower/squad environments.
- Release management handles SIT and higher environments.
- QAT approval is required before progressing beyond SIT.
- Production-like environments include B.Val/pre-production/production.
- From a technical deployment point of view, environment differences are mainly in values files, but operational process and access differ.
- B.Val may contain more data than production.
- Runbook repositories may contain environment-specific actions that must be executed alongside release activity.

Important distinction:

```text
Deployment success does not prove functional readiness.
```

Deployment checks mainly show that Helm/pods/deployment worked. Functional validation is handled by development teams and QAT, using tools such as Playwright or Cypress where available.

## 3. Feature Flags And Activation

Deployment does not always mean activation.

Feature activation may depend on values files or feature flags. Development teams decide what needs to be enabled in each environment.

Implication:

```text
The release process must track both deployed version and activation/config state.
```

## 4. Rollback Current State

Current rollback status:

- Automatic rollback is not built into the deployment scripts.
- If deployment fails, the pipeline does not automatically rollback.
- Monitoring failure does not automatically trigger rollback.
- Helm rollback is technically possible through Helm history/rollback commands.
- Recent practical behaviour has leaned towards fix-forward.

Implication:

```text
Rollback needs a documented operational process, not just Helm capability.
```

## 5. New Environment Setup Considerations

For new dev/test environments, several setup points must be addressed:

- Environment lists or setup scripts may need updating.
- Values files for new environments need to exist and match naming expectations.
- Drone secrets/tokens may need to be added for new environments.
- There is uncertainty around whether kube/robot tokens come from ACU or existing Drone/namespace secrets.
- This needs confirmation before new environments can be treated as ready.

Open items:

- Confirm which repos/scripts must be updated for each new environment.
- Confirm who owns Drone secret/token creation.
- Confirm whether ACU provides the required robot/kube tokens.
- Confirm minimum required secrets per environment.

## 6. Secrets Management

Current direction for managing secrets:

- Secrets are being extracted into the Cerberus/deployment-management structure.
- Managed secrets scripts can extract and encrypt secrets for an environment.
- Secret values are base64 encoded and encrypted.
- Secret keys should remain consistent between environments; values differ by environment.
- Access requires Git maintainer or Git-crypt maintainer setup, including GPG keys.
- The managed secrets script supports rotation and restore.
- Lower-level helper scripts such as export/encrypt secrets exist, but the managed secrets script is the main entry point.
- MSK secrets may have a separate area.

Implication:

```text
Secrets/config changes should be part of release scope and release readiness checks.
```

## 7. Release Artefact Creation

Service artefact creation flow:

- A release branch may not have a tag until it is ready.
- Creating a tag kicks off a tag creation pipeline.
- For Spring Boot services, the pipeline builds the service and runs Maven install/tests.
- Trivy vulnerability scanning and Sonar code-quality scanning run before deployable artefact creation.
- Helm package, Helm dependency build and Helm artefact upload are part of releasable artefact creation.
- Slack notification may be sent once the service artefact is created.

## 8. Umbrella Charts

The deployment-management repository packages services into umbrella charts.

Key points:

- There are around two dozen umbrella charts.
- Some umbrella charts contain one service; others contain many services.
- Release chart version updates currently happen by updating chart YAML/service versions.
- Umbrella charts allow related services to be deployed together or in isolation.

This matters for changed-chart deployment because the automation needs to reason at chart level as well as service level.

## 9. Auto Manifest And Tag Jump Scripts

Supporting scripts that still matter for release metadata, manifest generation and validation decisions.

Auto manifest has two main stages:

1. Create the release Jira ticket.
2. Create the manifest.

Supporting details:

- Scripts use Python plus tools such as `yq` and `jq`.
- Local/workspace runs may need proxy configuration to access Jira.
- Drone runs may not need the same proxy setup.
- Release version and ticket number are key inputs.
- The script gets release tickets from Jira by release label.
- The GitLab tag field on tickets is used to determine service versions/tags.
- `NA` can be used for changes that do not require a tag/version update.
- DB Liquibase has special handling because one Liquibase update may affect multiple projects.
- The script updates chart versions, writes changelog entries, creates a branch, pushes changes and raises an MR.
- Helper scripts exist for branch creation, commits, pushes and MRs.

## 10. Tag Jump Checker

The tag jump checker may be less central in the proposed non-linear release branch model, but it explains an important release risk.

It was used when the team could not safely release only a selected ticket because other merged changes might be pulled in as well.

The script:

- Compares base and release versions.
- Checks Git commit logs for ticket numbers.
- Compares discovered tickets against release tickets/labels.
- Uses labels such as tag jump and full release.
- Checks ticket status and GitLab tag fields.
- Warns or fails for missing/incorrect tag metadata.
- Flags `do not deploy` cases.
- Has dry-run support.

Known caveats:

- It may be less relevant with the proposed branching structure because version/tag order is not always linear.
- Rollback comparisons can be awkward because the script tends to prefer the higher/current version.
- Incorrect ticket numbers in commits can produce false positives.
- Some validation may currently be looser than expected, such as incorrect tags or no tags found passing when they should fail.

Implication:

```text
The new release automation must explicitly define strict validation rules for ticket status, missing tags, incorrect tags and do-not-deploy markers.
```

## Follow-Up Items

1. Confirm which scripts/repos must be updated for new dev/test environments.
2. Confirm Drone secret/token ownership for new environments.
3. Confirm whether deployment parameter validation is strict enough.
4. Confirm whether auto manifest/tag validation should fail on wrong tag, missing tag or invalid ticket status.
5. Confirm how `NA` tag entries should be represented in release reports.
6. Confirm whether tag jump logic is retired, replaced or adapted for the new branching model.
7. Confirm secrets access/onboarding process for maintainers.

## Related Best Practices

Helm versioning, values-file structure, umbrella chart dependency handling, mass diff usage and secrets-management options are summarised in [release engineering best practices](release-engineering-best-practices.md).



---

# CI/CD Deployment Findings And Actions

This page summarises the CI/CD and deployment findings.

Its purpose is to show:

1. How the current process works.
2. Which parts look manual, unclear, risky or inconsistent.
3. What should be standardised, automated or explicitly decided next.

## Analysis Frame

```text
The release challenge is broader than the branch model itself.

Branching is one part of the process, but CI/CD and deployment also depend on service tags, Helm artefacts, manifests, configuration and feature flags, runbooks, environment access, QAT approval, rollback and ownership.

The current process should be made visible, repeatable and auditable before the branching model is treated as the main fix.
```

## Process Areas Covered

- Release branch creation and merge strategy.
- Service tag creation and artefact generation.
- Image build, test, scan and Helm package upload.
- Cerberus chart and manifest updates.
- Deployment through service repo and MMA Helm scripts.
- Environment-specific values, secrets and runbooks.
- QAT approval and higher-environment promotion.
- Hotfix, rollback and post-release reconciliation.

## Problem Areas Identified

| Area | Current Problem | Why It Matters |
| --- | --- | --- |
| Manual release work | Release creation, chart updates, tag handling and deployment triggers still involve manual or locally run steps. | Manual work increases release time, inconsistency and audit gaps. |
| Branch/tag timing | Release branches, temporary tags and full release tags need clearer rules. | Wrong timing can create wrong artefacts, wrong manifests or unclear release state. |
| Release scope | "All services" and cross-repo release scope are not fully explicit. | Automation may include too much, too little or miss secrets/config/Liquibase/runbook changes. |
| Manifest validation | Missing tags, wrong tags, invalid ticket status and `do not deploy` cases need strict policy. | Weak validation can allow the wrong version or blocked work into a release. |
| Changed-chart deployment | Deploying all charts manually or listing chart names explicitly is inefficient. | The deployment should default to changed charts, with audited override. |
| Environment readiness | New dev/test environments need values files, setup entries and Drone secrets/tokens confirmed. | An environment can look available but fail deployment because setup is incomplete. |
| Hotfix and rollback | Hotfix source branch, back-merge and rollback reconciliation are not fully standardised. | Production fixes can drift from `main`/`development`, manifests and active release branches. |
| Alerting and rerun | Failed automation alerting and safe rerun rules are not fully defined. | A failed final Git/chart/reporting step can leave release state unclear. |

## Findings Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  CURRENT["🔍 Current State Analysis"]:::input
  PROBLEMS["⚠️ Problems Identified\n─────────────\n• Manual work\n• Unclear scope\n• Validation gaps\n• Operational constraints"]:::problem
  ACTIONS["✅ Recommended Actions\n─────────────\n• Drone automation\n• Strict validation\n• Changed-chart deploy\n• Clear ownership"]:::solution

  CURRENT --> PROBLEMS --> ACTIONS

  classDef input fill:#455a64,stroke:#37474f,color:#fff,font-weight:bold
  classDef problem fill:#e8710a,stroke:#c45d08,color:#fff,font-weight:bold
  classDef solution fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
```

## Recommended Actions

1. Keep the current-state flow in [current release operating model](current-release-operating-model.md) as the baseline view.
2. Use [deployment and release findings](deployment-and-release-findings.md) as the detailed source for deployment scripts, secrets, manifests and tag validation.
3. Move local/manual release automation into Drone once the configuration-service pilot is green.
4. Define strict validation for wrong tags, missing tags, manifest/tag mismatch, invalid ticket status and `do not deploy` markers.
5. Confirm repository scope for service code, Helm charts, deployment management, secrets/config, Liquibase and runbooks.
6. Confirm changed-chart deployment behaviour and the override approval path.
7. Document hotfix and rollback flows including branch, manifest and release report reconciliation.
8. Define alerting and rerun rules for failed automation steps.
9. Confirm new environment readiness criteria before treating any dev/test environment as release-ready.
10. Use [rollout decision proposals](rollout-decision-proposals.md) as the decision record until owners approve or amend them.

## Short-Term Recommendation

As stated in the Executive Assessment: stabilise the release operating model before changing the branching model. The priority actions are documented in the Recommended Actions section above.

## Prioritisation: Effort vs Impact

Not all problems are equally important. Prioritise by impact and effort:

### Quick Wins (High Impact, Low Effort)

| Action | Why Quick Win |
| --- | --- |
| Pre-commit hook for ticket references | Already in progress. Prevents garbage commits entering release history. |
| Strict validation: fail on missing/wrong tag | Script change only. Prevents wrong artefacts reaching production. |
| Document deployment parameters | Write-up only. Removes tribal knowledge dependency. |
| Changed-chart detection in release report | Reporting change. Shows what should deploy without manual listing. |

### High Impact, Medium Effort

| Action | Why Important |
| --- | --- |
| Move release automation to Drone | Central, auditable, repeatable. Removes local-script dependency. |
| Auto release branch creation | Removes start-of-sprint manual work entirely. |
| Auto Cerberus chart branch updates | Removes most manual chart editing - the biggest time sink. |
| Alerting for failed steps | Makes failures visible instead of silent. |

### High Impact, High Effort

| Action | Why Harder |
| --- | --- |
| Full rollback runbook and testing | Requires cross-team agreement, environment access, testing time. |
| Environment parity documentation | Requires production access/knowledge that few people have. |
| Ownership matrix sign-off | Requires management decisions and role assignment. |
| Feature flag runtime control | Requires new tooling or infrastructure. |

### Recommended Execution Order

```text
1. Quick wins (this sprint / next sprint)
2. Move automation to Drone (current pilot)
3. Auto release branch + chart updates (immediately after pilot green)
4. Alerting and strict validation (alongside #3)
5. Rollback runbook (before next production incident)
6. Ownership sign-off (before expanding beyond pilot squads)
7. Feature flags and environment parity (medium-term roadmap)
```



---

# Proposed Release Automation Flow

This page summarises the proposed release automation flow.

It is still a proposal until the team confirms rollout timing, branch naming, quality gates and ownership.

For proposed answers to the open rollout decisions, see [rollout decision proposals](rollout-decision-proposals.md).

## Current Pain

The current process is manual-heavy:

- Lower environments are deployed more ad hoc.
- Higher-environment releases rely on server chart updates.
- A feature deployment can require a manual tag, manual Cerberus chart branch/update and manual deployment trigger.
- Release branches need repeated tags and chart image updates as fixes, CVEs and last-minute changes are added.
- End-of-sprint release preparation can take several days and consume developer/senior time.

## Target Branch Model

The target direction is:

- `development` effectively becomes `main`.
- `main` should represent what is live/production.
- When something is deployed to production, it should be merged into `main`.
- At the start of each sprint/release, release branches are automatically created from `main` for every repository that needs one.
- Feature and hotfix branches are taken from the relevant release branch.
- Multiple release branches may exist at the same time.
- If releases need to be chained, the automation should allow a release branch to be based on another release branch instead of `main`.

Proposed decision:

```text
Move to `main` as the production/live baseline after an agreed cutover release.
Keep `development` as transitional until the automation pilot and branch protections are ready.
```

## Feature And Hotfix Branch Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  REL["📋 Release branch"]:::rel
  FH["🌱 Feature / hotfix branch"]:::feat
  COMMIT["💾 Commit"]:::action
  TAG["🏷️ Temporary tag"]:::tag
  BUILD["🔨 Build image / artefact"]:::build
  CHART["📦 Update Cerberus chart branch"]:::chart
  DEPLOY["🚀 Deploy by branch or ticket"]:::deploy

  REL --> FH --> COMMIT --> TAG --> BUILD --> CHART --> DEPLOY

  classDef rel fill:#f57c00,stroke:#e65100,color:#fff,font-weight:bold
  classDef feat fill:#43a047,stroke:#2e7d32,color:#fff,font-weight:bold
  classDef action fill:#455a64,stroke:#37474f,color:#fff,font-weight:bold
  classDef tag fill:#7b1fa2,stroke:#4a148c,color:#fff,font-weight:bold
  classDef build fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef chart fill:#00838f,stroke:#006064,color:#fff,font-weight:bold
  classDef deploy fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
```

Important details:

- Feature and hotfix branches are treated similarly by the automation.
- Each commit should build from the latest commit on the branch.
- The temporary branch tag should be stable for the branch, rather than generating a large number of images for every commit.
- The tag is expected to include the previous application version and the MMA/JIRA ticket reference.
- When the image is built successfully, the corresponding Cerberus chart branch should be updated automatically.
- The branch name/ticket becomes the deployment handle for dev test or other environments.

## Multi-Repo Change Aggregation

If multiple repositories use the same ticket/branch name, their changes should feed into the same Cerberus chart branch.

This means one ticket can collect:

- Service changes.
- Secrets/config changes.
- Liquibase/database changes.
- Runbook changes.
- Changes across multiple services that need to be tested together.

This is intended to remove most manual chart updates for multi-service changes.

## Release Branch Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  MAIN["🏁 main"]:::prod
  REL["📋 Auto-created\nrelease branch"]:::rel
  FEATURE["🌱 Feature / hotfix\nbranches"]:::feat
  MR["🔀 Merge into\nrelease branch"]:::merge
  RTAG["🏷️ Full release\ntag / version"]:::tag
  RCHART["📦 Update Cerberus\nchart branch"]:::chart
  DEV["🧪 Auto-deploy to\nshared dev"]:::deploy
  SIT["🚀 Promote to\nSIT and above"]:::promote

  MAIN --> REL --> FEATURE --> MR --> RTAG --> RCHART --> DEV --> SIT

  classDef prod fill:#6a1b9a,stroke:#4a148c,color:#fff,font-weight:bold
  classDef rel fill:#f57c00,stroke:#e65100,color:#fff,font-weight:bold
  classDef feat fill:#43a047,stroke:#2e7d32,color:#fff,font-weight:bold
  classDef merge fill:#455a64,stroke:#37474f,color:#fff,font-weight:bold
  classDef tag fill:#7b1fa2,stroke:#4a148c,color:#fff,font-weight:bold
  classDef chart fill:#00838f,stroke:#006064,color:#fff,font-weight:bold
  classDef deploy fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef promote fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
```

Important details:

- The release branch is what should be deployed to environments.
- Once a feature branch is merged into the release branch, the temporary branch tag is replaced by the full/incremented release version.
- The matching release branch on Cerberus charts should be updated automatically.
- The active release branch is intended to be deployed regularly, potentially automatically, to a shared dev environment for cross-team integration testing.
- Squad dev test environments remain separate from the shared dev environment.
- Ephemeral branch environments are not currently assumed, as ACP may not support them.

## Long-Running Or Delayed Features

A feature branch may start from one release branch but not be ready for that release.

In that case:

- The branch can continue to exist alongside later release branches.
- It does not have to be merged back into the source release branch.
- The team working on it should merge in the previous release and the next release as needed.
- The aim is to detect conflicts before opening or updating the merge request.

Proposed decision:

```text
Feature owners keep long-running branches current by merging in the relevant active release branch before MR updates.
Release owners track forward merges from earlier active releases into later active release branches.
```

## Release Reporting

The report should be generated from Cerberus chart changes between two tags or versions.

It should identify:

- Which charts changed.
- Which images changed on those charts.
- Which services changed.
- Which merged commits are included.
- Ticket number.
- Merge commit message.
- Team.
- Primary contact or assignee.
- Ticket status.

The report can be generated at any time by providing two tags. If no relevant changes exist between those tags, the report should be empty.

## Changed-Chart Deployment

The proposed deployment enhancement should:

- Detect which charts changed in the release.
- Deploy only the changed charts by default.
- Keep an override option to avoid a chart if there is a specific reason.
- Prefer deploying all updated charts in a release branch unless explicitly excluded.

Proposed decision:

```text
Deploy all changed charts by default.
Only release owners can approve exclusions, and the reason must be recorded in the release report or release notes.
```

## CVE And Renovate Flow

CVE and Renovate-style updates should follow the same pattern as normal team changes:

- CVE scanning should raise work against the release branch.
- CVE fixes should use a hotfix branch.
- Renovate MRs should target the active release branch.
- These MRs should look similar to team-raised MRs.
- Teams/release owners must watch, review and merge them as part of release work.

### Ownership And SLA

| Item | Owner | SLA |
| --- | --- | --- |
| CVE scanning tool output | Security/DevOps tooling (automated) | Continuous |
| CVE hotfix branch creation | Owning squad or release owner | Within 1 working day of critical CVE |
| CVE MR review and merge | Owning squad lead | Within 2 working days for critical, sprint boundary for others |
| Renovate MR review | Owning squad | Within sprint, before release branch closure |
| Priority conflict resolution | Release owner | On demand |

If a CVE fix conflicts with release timing, the release owner decides whether to include it in the current release or defer to the next.

## Failure Handling And Quality Gates

The automation is expected to run defensively:

- The chart update step should run after the image and Helm chart are successfully built/uploaded.
- Most automation is Git commands, Git diffs/tags/logs and JIRA/reporting calls.
- If connectivity to Git or related services fails, the step should be rerunnable.
- If local commands completed but push failed, rerunning should push the generated tags/build numbers/chart changes.

Proposed policy:

- Add Slack/email notification before production rollout of the automation.
- Treat image build, Helm chart upload, tag generation, chart update and report generation failures as fail-fast.
- Allow rerun of the final Git/chart/reporting step after transient failures when artefacts were built successfully.
- Keep human approval before higher-environment promotion and production.

## Merge Commit Expectations

The preferred approach is a squash-style pattern to reduce noisy release branch history.

The key requirement is:

```text
The merge commit into the release branch must include the ticket number and a meaningful message.
```

Reason:

```text
The release branch commit history becomes the changelog.
```

Individual feature branch commits should ideally also follow the ticket/message pattern, because reports may be generated from long-running feature branches before they are merged and deleted.

## Items Still Needing Formal Approval

1. When exactly does `development` become `main`?
2. What is the final branch naming convention?
3. Which release is the first rollout candidate?
4. Which repos get auto-created release branches?
5. Who is the named release owner for forward-merge tracking?
6. Where are release reports published and retained?
7. Which Slack/email channels receive automation failure alerts?

## Related Best Practices

GitOps alignment, tag/version guidance, multi-repo orchestration and progressive delivery considerations are summarised in [release engineering best practices](release-engineering-best-practices.md).



---

# Branching Strategy Options

This page compares the branching options discussed so far.

The key point: the branching model should be chosen based on what the release operating model can safely support.

Terminology note:

```text
In this documentation set:
- `master` refers to the current production baseline branch (existing state).
- `main` refers to the proposed production baseline branch (target state after cutover).
Where both are mentioned together, the context should make clear whether the current or target state is being discussed.
```

## Decision Lens

Before choosing a model, confirm whether the team has:

- Clear release scope across repositories and services.
- Reliable tag, artefact and manifest validation.
- A documented hotfix path.
- A documented rollback path.
- Clear service ownership and approvals.
- Strong enough test automation.
- Feature flags and configuration that can safely control incomplete work.

## Branch And Commit Hygiene To Confirm

Several branch hygiene points should be agreed before rollout.

Proposed branch naming examples:

| Branch Type | Purpose | Example |
| --- | --- | --- |
| `feature/*` | Individual ticket or feature work. | `feature/MMA-1234-login-validation` |
| `release/*` | Release candidate branch for a planned release. | `release/2026.06.1` |
| `hotfix/*` | Urgent fix from production state. | `hotfix/MMA-5678-prod-timeout` |
| `main` or `master` | Production/live baseline. | `main` |
| `development` | Integration branch, if retained. | `development` |

Proposed cleanup rule:

```text
Feature branches should be deleted after merge, once any required release report has been generated.
```

Proposed target model:

```text
main represents production/live.
release branches are auto-created from main at the start of each sprint/release.
feature and hotfix branches are created from the relevant release branch.
```

Transition note:

```text
Until the agreed cutover release, the current model remains active:
  feature branches -> development -> release branch -> master.
After cutover:
  feature branches -> release branch -> main.
Both models should not run simultaneously. The cutover date marks the switch.
```

For more detail, see [proposed release automation flow](proposed-release-automation-flow.md).

Proposed decision:

```text
Move to `main` as the production/live baseline after an agreed cutover release.
Keep `development` transitional only until the automation pilot and branch protections are ready.
```

For the full proposal, see [rollout decision proposals](rollout-decision-proposals.md).

## Multiple Active Release Branches

An important branch maintenance point: more than one release branch may exist at the same time.

If a feature starts from one release branch but is not ready for that release, it can continue alongside later releases. The team working on the feature should merge in the relevant release branches to detect conflicts before opening or updating the merge request.

Proposed rule:

```text
Forward-merge fixes from earlier active releases into later active release branches before release closure.
Feature owners keep long-running branches current by merging in the relevant active release branch before MR updates.
```

## Option 1: Continue With The Current GitFlow-Style Model

```text
feature branch -> development -> release branch -> master
```

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1565c0', 'primaryTextColor': '#fff', 'lineColor': '#5f6368'}}}%%

flowchart LR
  F1["🌱 Feature branch"]:::feat --> D1["🔀 development"]:::dev
  D1 --> R1["📋 release branch"]:::rel
  R1 --> M1["🏁 master / production"]:::prod
  R1 -.->|back-merge| D1
  M1 -.->|hotfix| H1["🚨 hotfix branch"]:::hotfix
  H1 -.->|back-merge| D1

  classDef feat fill:#43a047,stroke:#2e7d32,color:#fff,font-weight:bold
  classDef dev fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef rel fill:#f57c00,stroke:#e65100,color:#fff,font-weight:bold
  classDef prod fill:#6a1b9a,stroke:#4a148c,color:#fff,font-weight:bold
  classDef hotfix fill:#c62828,stroke:#b71c1c,color:#fff,font-weight:bold
```

Benefits:

- Keeps a familiar model.
- Separates active development from production.
- Allows release branch stabilisation.
- Supports production-based hotfixing if `master` is reliable.
- Provides a controlled release candidate branch.
- May be safer in the short term while automation and documentation improve.

Risks:

- More branches to manage.
- Requires disciplined reconciliation after release.
- Can create overhead across many services.
- Still depends on tag, manifest and configuration coordination.
- If reconciliation is missed, `master` may stop representing production accurately.

Best fit:

```text
Short-term baseline while the process is standardised and automated.
```

## Option 2: Reduce Reliance On `development`

Possible direction:

```text
feature branches -> release branches tracking live/main
```

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  M2["🏁 main / production"]:::prod --> F2A["🌱 Feature A"]:::feat
  M2 --> F2B["🌱 Feature B"]:::feat
  F2A --> R2["📋 release branch"]:::rel
  F2B --> R2
  R2 --> PROD2["🚀 production"]:::deploy
  PROD2 -.->|reconcile| M2

  classDef prod fill:#6a1b9a,stroke:#4a148c,color:#fff,font-weight:bold
  classDef feat fill:#43a047,stroke:#2e7d32,color:#fff,font-weight:bold
  classDef rel fill:#f57c00,stroke:#e65100,color:#fff,font-weight:bold
  classDef deploy fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
```

Benefits:

- Fewer long-lived branches.
- Closer alignment to production state.
- Potentially easier to reason about changes against live.
- May reduce branch management overhead if releases are frequent.

Risks:

- Less separation between active development and release preparation.
- Incomplete or risky work may be harder to isolate.
- Does not automatically solve manifest, config, feature flag or rollback complexity.
- Needs very clear release scope and ownership to avoid drift.

Best fit:

```text
Possible future simplification if release controls are already clear and reliable.
```

## Option 3: Move Towards Trunk-Based Development

Possible direction:

```text
short-lived branches -> trunk/main
release control -> feature flags/config
```

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  S3A["🌱 Short-lived branch"]:::feat --> T3["🏁 trunk / main"]:::trunk
  S3B["🌱 Short-lived branch"]:::feat --> T3
  T3 --> DEP3["📦 Deployable build"]:::build
  DEP3 --> CFG3{"🚦 Feature flag"}:::flag
  CFG3 -->|Disabled| SAFE3["💤 Inactive"]:::off
  CFG3 -->|Enabled| LIVE3["✅ Released"]:::on

  classDef feat fill:#43a047,stroke:#2e7d32,color:#fff,font-weight:bold
  classDef trunk fill:#6a1b9a,stroke:#4a148c,color:#fff,font-weight:bold
  classDef build fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef flag fill:#f9a825,stroke:#f57f17,color:#000,font-weight:bold
  classDef off fill:#616161,stroke:#424242,color:#fff
  classDef on fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
```

Benefits:

- Reduces long-running branches.
- Improves continuous integration.
- Reduces late merge conflict risk.
- Can support faster release cycles if operational controls are mature.

Risks:

- Requires strong runtime feature flag control.
- Requires configuration to be changeable without full redeployment, or with very low friction.
- Requires strong automated testing and monitoring.
- Instability may be harder to isolate if many changes are merged quickly.
- If feature flags are baked into charts or values files, the complexity may move into deployment/configuration.

Best fit:

```text
Longer-term target if release control can be separated from code integration.
```

## Trunk-Based Readiness Criteria

Before moving towards trunk-based development, confirm that:

- Runtime feature flags are available and reliable.
- Feature activation is independent of deployment.
- Configuration can be changed centrally or without full redeployment.
- Automated tests detect regressions quickly.
- Rollback or feature disablement is fast and well understood.
- Feature flag lifecycle is managed to avoid long-lived inactive code paths.
- Environment parity is well understood.
- Release ownership and approvals are clear.

## Suggested Short-Term Position

```text
Keep the current GitFlow-style model as the short-term baseline.
Improve automation, validation, hotfix handling, rollback handling and ownership.
Use those improvements to decide later whether to simplify the model or move towards trunk-based development.
```

## Practical Recommendation

Do not make the branching model carry all the process risk.

First standardise:

- Release branch timing.
- Tag timing.
- Manifest validation.
- Changed-service detection.
- Hotfix flow.
- Rollback flow.
- Post-release reconciliation.
- Ownership and approvals.

Then reassess whether the branch model is still the main constraint.

## Related Best Practices

Branching model selection, staged GitFlow-to-trunk transition guidance and common rollout mistakes are summarised in [release engineering best practices](release-engineering-best-practices.md).



---

# Automation And Validation

This page captures the automation work in progress and the validation rules that should be made explicit.

## Why Automation Matters

The safest short-term improvement appears to be moving manual or locally run release scripts into centrally executed pipelines.

This would improve:

- Auditability.
- Central ownership of the release flow.
- Visibility of what has been run.
- Repeatability.
- Detection of which services actually have changes.
- Consistency around tags, manifests and release metadata.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  LOCAL["🖥️ Local / manual scripts"]:::before --> PIPE["⚙️ Audited release pipeline"]:::after
  PIPE --> OUT["📊 Audit trail\n🔁 Repeatable execution\n🔍 Changed-service detection\n✅ Consistent validation"]:::benefit

  classDef before fill:#c62828,stroke:#b71c1c,color:#fff,font-weight:bold
  classDef after fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef benefit fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
```

## Automation Work Mentioned

Existing scripts or automation steps appear to cover parts of the release process, including:

- Merging release branches into `master`.
- Cleaning up inactive release branches.
- Creating new release branches from `development`.
- Tagging release branches.
- Updating manifest merge requests with tags.
- Raising manifest merge requests in Cerberus deployment management.
- Comparing commits or services to identify what is in or out of a release branch.

Some of these steps currently require tweaking or are not fully automated yet.

## Current Automation Status

The current automation status is:

- Automation is being tested on the new configuration service.
- The scripts work locally.
- The remaining step is to get the automation and reporting running in Drone.
- The automation is expected to generate service chart changes, versions and tags.
- Release reports should help show what changed and what needs to be deployed.
- JIRA cross-reference is expected so the team can confirm that the release content matches the intended tickets.
- Changed-chart detection is being explored so the deployment logic can deploy only charts changed in the release.
- A Git pre-commit hook is in progress to reduce commits without MMA ticket references.
- Rollout may be possible within the next release or two, subject to confirmation.

For the end-to-end proposed flow, see [proposed release automation flow](proposed-release-automation-flow.md).

For detailed findings around current Helm scripts and auto manifest tooling, see [deployment and release findings](deployment-and-release-findings.md).

## Intended Direction

The proposed direction is:

- Move local scripts into pipelines.
- Reduce manual service chart management.
- Automatically identify what is in or out of a branch/release.
- Automate start-of-sprint and end-of-sprint release tasks.
- Reduce release work to one or two standard pipeline runs where practical.
- Roll the improved process out iteratively after review and sign-off.

## Proposed Drone Rollout Checklist

Before the automation is treated as ready, confirm:

1. The pipeline runs successfully in Drone for the new configuration service.
2. Generated service chart changes are correct.
3. Generated versions are correct.
4. Generated tags are correct.
5. The release report is produced by the pipeline.
6. The release report includes the expected JIRA/ticket cross-reference.
7. Changed-chart detection identifies the expected charts.
8. Changed-chart deployment has an audited override path.
9. The report is stored somewhere durable enough to survive feature branch deletion.
10. Remaining manual server chart work is documented.
11. Rollout communication has been sent to squads.

## Release Reporting

The release report should answer:

- Which charts changed?
- Which images changed?
- Which services changed?
- Which tickets are included?
- Which tags were generated or expected?
- Which service chart changes were generated?
- Which manifest changes are needed?
- Which items are ready to deploy?
- Which items are blocked or need manual review?
- Which team owns the change?
- Who the primary contact/assignee is.
- What the ticket status is at report generation time.

Suggested retention policy to confirm:

```text
Generate the report before feature branch cleanup.
Store the report as a pipeline artefact and/or in the release management location.
Keep the report long enough for release validation, audit and incident investigation.
```

## Commit Metadata

Reporting and JIRA cross-reference depend on consistent commit metadata.

Suggested rule to confirm:

```text
Every commit that is intended to appear in release reporting should reference the relevant MMA/JIRA ticket.
```

Examples:

```text
MMA-1234 Add customer eligibility validation
MMA-5678 Fix manifest version comparison
```

The pre-commit hook should prevent obvious missing ticket references, but it should not be the only control. Merge request validation or pipeline validation may still be needed.

## Merge Strategy

The preferred approach is a squash-style pattern to keep release branch history readable.

The important requirement is not the exact Git button by itself. The important requirement is that the merge commit into the release branch contains:

- Ticket number.
- Meaningful message.
- Enough context to act as changelog history.

Individual feature branch commits should ideally follow the same pattern because long-running feature branches may also be used for reporting before they are merged and deleted.

## Failure Handling And Alerting

The automation is expected to run after image build and Helm chart upload have succeeded.

If the final Git/chart/reporting step fails because of a transient system issue, it should be rerunnable. There is a known gap:

```text
There is not currently an alerting model for failed automation steps.
```

Recommended policy:

- Send Slack/email alert for failed automation steps before production rollout.
- Include repository, branch, release version, failed step, Drone job link and rerun guidance.
- Treat the final Git/chart/reporting step as safe to rerun after transient failure if image and Helm artefact creation already succeeded.
- Require manual intervention when rerun would conflict with a manual chart edit or unknown repository state.
- Keep human approval before higher-environment promotion and production.

For the full proposed policy, see [rollout decision proposals](rollout-decision-proposals.md).

## Tag And Artefact Validation

Tags are critical because they trigger releasable artefact creation.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  START["📋 Release request"]:::start
  DIFF["🔍 Detect changed\nservices"]:::check
  TAG["🏷️ Check expected\ntags"]:::check
  MAN["📦 Compare manifest\nversions"]:::check
  TICKET["🎫 Check tickets &\nrelease metadata"]:::check
  GATE{"✅ Validation\npassed?"}:::decision
  MR["📝 Create / update\nmanifest MR"]:::pass
  STOP["🛑 Stop: fix or\napproved override"]:::fail

  START --> DIFF --> TAG --> MAN --> TICKET --> GATE
  GATE -->|Yes| MR
  GATE -->|No| STOP

  classDef start fill:#455a64,stroke:#37474f,color:#fff,font-weight:bold
  classDef check fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef decision fill:#f9a825,stroke:#f57f17,color:#000,font-weight:bold
  classDef pass fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
  classDef fail fill:#c62828,stroke:#b71c1c,color:#fff,font-weight:bold
```

Validation should make sure:

- The expected tag exists.
- The tag points to the expected release branch/commit.
- The tag version matches the intended release version.
- The artefact was built from the expected source.
- Helm artefacts were created successfully.
- Vulnerability and code quality scans completed according to the agreed policy.

## Manifest Validation

Manifest updates must match the service tags and artefacts being released.

Validation should make sure:

- Manifest versions match the release tags.
- Missing tags fail fast.
- Incorrect tag versions fail fast.
- Manifest merge requests include the expected services only.
- Current manifest versions are compared with update versions.
- Invalid or blocked ticket statuses are handled according to agreed rules.
- `do not deploy` markers are surfaced clearly and stop release unless explicitly overridden.
- `NA` tag entries are represented clearly and do not silently hide release-impacting changes.
- DB Liquibase exceptions are handled explicitly because one Liquibase update may affect multiple projects.

## Ticket And Release Metadata Validation

Observed script responsibilities include:

- Compare start tag and end tag.
- Identify tickets included in a release.
- Add or update release-related labels.
- Update the changelog.
- Check ticket status.
- Check whether the correct tag version has been entered.
- Detect blocked, invalid or missing release metadata.
- Create a release ticket.
- Create a manifest update branch/MR.
- Update chart versions from Jira GitLab tag fields.
- Write auto-manifest changelog entries.

The team should decide which cases are warnings and which cases must fail the pipeline.

## Recommended Validation Policy

Use a strict policy for release integrity:

```text
Wrong tag -> fail.
Missing tag -> fail.
Manifest/tag mismatch -> fail.
Invalid ticket status -> fail or require explicit override.
Unknown service ownership -> fail or require explicit release-owner approval.
Do-not-deploy marker -> fail unless release owner explicitly approves an override.
```

Overrides may still be necessary, but they should be visible, approved and audited.

## Auto Manifest And Tag Jump Follow-Up

Auto manifest and tag jump tooling must be reassessed against the proposed non-linear release branch model.

Follow-up needed:

- Decide whether tag jump checking is retired, replaced or adapted for the new branching model.
- Confirm whether strict mode should fail on wrong tags, missing tags and invalid ticket status.
- Confirm how `NA` GitLab tag entries are handled in reports.
- Confirm whether release label/tag metadata still uses the same Jira fields.
- Confirm whether local/workspace runs still require proxy setup for Jira access.

## Open Questions

- Which scripts are already reliable enough to move into pipelines?
- Which scripts need refactoring before pipeline execution?
- Who owns the standard release pipeline?
- Which pipeline steps require approval gates?
- How will the automation detect services with actual changes?
- What information should be included in the audit trail?
- What should fail immediately vs require manual approval?

## Related Best Practices

Validation gates, idempotent pipeline design, immutable artefacts, release metrics and supply-chain security considerations are summarised in [release engineering best practices](release-engineering-best-practices.md).



---

# Hotfix And Rollback

This page captures the open hotfix and rollback questions.

Rollback and hotfix handling need to be clear because they affect the branching model, tag strategy, manifest updates and post-release reconciliation.

## Hotfix Current Understanding

Hotfixes should be possible from the production state, but the detailed flow still needs to be clarified.

There are two distinct hotfix scenarios that must be supported:

### Production Hotfix (Critical Live Issue)

When a critical issue is found in production and no active release branch covers it:

```text
main / production state
  -> hotfix branch (from main)
  -> test and release hotfix
  -> update production
  -> merge hotfix back into main
  -> forward-merge hotfix into any active release branches
```

This is for urgent production fixes that cannot wait for the next release cycle.

### Release-Phase Hotfix (Issue Found During Release Preparation)

When an issue is found during release preparation or testing:

```text
active release branch
  -> hotfix branch (from release branch)
  -> test hotfix
  -> merge back into release branch
  -> release version incremented as normal
```

This is for fixes discovered during SIT, QAT or pre-production validation.

### Shared Behaviour

Both hotfix types share the following automation behaviour:

- Feature and hotfix branches are treated similarly by the automation.
- Commits on a hotfix branch should generate a deployable candidate and update the matching Cerberus chart branch.
- When merged into the target branch, the hotfix should increment the release version/tag like any other merged change.
- CVE and Renovate-style changes are expected to raise hotfix/MR work targeting the active release branch.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  subgraph PROD_HF["🚨 Production Hotfix"]
    M["🏁 main"]:::prod --> HF["🔥 Hotfix branch"]:::hotfix
    HF --> TEST["🧪 Test"]:::test
    TEST --> TAG["🏷️ Tag"]:::tag
    TAG --> DEPLOY["🚀 Deploy to prod"]:::deploy
    DEPLOY --> BACK_MAIN["🔄 Merge to main"]:::merge
    BACK_MAIN --> FWD["➡️ Forward-merge\nto release branches"]:::merge
  end

  subgraph REL_HF["⚡ Release-Phase Hotfix"]
    REL["📋 Release branch"]:::rel --> RHF["🔥 Hotfix branch"]:::hotfix
    RHF --> RTEST["🧪 Test"]:::test
    RTEST --> RMERGE["🔄 Merge to release"]:::merge
    RMERGE --> RVER["🏷️ Version incremented"]:::tag
  end

  classDef prod fill:#6a1b9a,stroke:#4a148c,color:#fff,font-weight:bold
  classDef hotfix fill:#c62828,stroke:#b71c1c,color:#fff,font-weight:bold
  classDef test fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef tag fill:#f57c00,stroke:#e65100,color:#fff,font-weight:bold
  classDef deploy fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
  classDef merge fill:#455a64,stroke:#37474f,color:#fff,font-weight:bold
  classDef rel fill:#f57c00,stroke:#e65100,color:#fff,font-weight:bold
```

## Hotfix Questions To Answer

- Who approves a hotfix merge?
- When is the hotfix tagged?
- How is the manifest updated?
- How is the hotfix forward-merged into active release branches?
- How do we prevent hotfix drift between production and `main`?
- How do CVE/Renovate hotfix branches get reviewed and prioritised during release work?
- What is the maximum acceptable time from hotfix decision to production deployment?

## Rollback Current Understanding

Rollback appears to be technically possible through Helm, but it is not currently built into the automated deployment flow.

Current state:

```text
Rollback capability: technically possible through Helm
Automated rollback: not currently built into deployment flow
Operational rollback process: unclear / not fully standardised
Common practical response: fix-forward
```

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart TD
  ISSUE["🚨 Production issue detected"]:::alert
  DECIDE{"⚖️ Rollback or fix-forward?"}:::decision

  subgraph RB_PATH["Rollback Path"]
    RB["⏪ Run rollback procedure"]:::rollback
    MANRB["📋 Reconcile manifest"]:::action
    BRRB["🌿 Reconcile branches"]:::action
  end

  subgraph FF_PATH["Fix-Forward Path"]
    FF["🔧 Create and release fix"]:::fix
    MANFF["📋 Update manifest"]:::action
    BRFF["🔄 Back-merge fix"]:::action
  end

  CLOSE["✅ Validate and close incident"]:::done

  ISSUE --> DECIDE
  DECIDE -->|Rollback| RB
  DECIDE -->|Fix-forward| FF
  RB --> MANRB & BRRB --> CLOSE
  FF --> MANFF & BRFF --> CLOSE

  classDef alert fill:#c62828,stroke:#b71c1c,color:#fff,font-weight:bold
  classDef decision fill:#f9a825,stroke:#f57f17,color:#000,font-weight:bold
  classDef rollback fill:#6a1b9a,stroke:#4a148c,color:#fff,font-weight:bold
  classDef fix fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef action fill:#455a64,stroke:#37474f,color:#fff,font-weight:bold
  classDef done fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
```

## Rollback Questions To Answer

- Is rollback a standard operating path or mostly an exception?
- When do we rollback vs fix-forward?
- Who owns the rollback decision?
- Who executes the rollback?
- Is rollback tested regularly?
- How are rollback actions audited?
- How are branches and manifests reconciled after rollback?

## What Exactly Rolls Back?

The rollback process should say whether rollback includes:

- Service image.
- Helm chart.
- Values/config.
- Manifest.
- Runbook changes.
- Secrets or environment variables.
- Database or data changes, where relevant.

If some items are not rolled back, the process should say so explicitly.

## Database And Liquibase Rollback

Database changes require special consideration because they are often forward-only.

### Current Understanding

- Liquibase is used for database schema and data changes.
- One Liquibase update may affect multiple projects.
- Liquibase changesets are typically applied once and tracked by checksum.
- There is no standard rollback block requirement documented.

### Proposed Rollback Rules

| Scenario | Action |
| --- | --- |
| Schema change with rollback block | Execute Liquibase rollback as part of the release rollback. |
| Schema change without rollback block | Fix-forward is likely the only safe option. Document why rollback is not possible. |
| Destructive data change (DROP, DELETE) | Cannot be rolled back. Fix-forward or restore from backup. Incident process applies. |
| Additive-only change (ADD COLUMN, new table) | May not need rollback if application code handles both states. |

### Recommended Practice

```text
Every production Liquibase changeset should include a rollback block or a documented justification for why rollback is not supported.
```

Release readiness for changes that include Liquibase should confirm:

1. Rollback block exists, or explicit documentation explains why not.
2. The change has been tested in a lower environment with the same rollback path.
3. The team understands whether fix-forward or rollback is the plan if the release fails.
4. If rollback is not possible, this is flagged in the release report.

## Branch And Manifest Reconciliation

Rollback is not only an environment action. It can create source-control and release-state questions.

The process should define:

- Whether `master` still reflects production after rollback.
- Whether the manifest is reverted or updated to the rollback version.
- Whether the failed release branch remains open.
- Whether a fix-forward branch is created.
- Whether `development` needs a revert, fix or follow-up merge.
- How the release notes/changelog reflect the rollback.

## Suggested Operating Principles

Useful principles to confirm:

- Hotfixes start from the known production baseline.
- `master` must stay aligned with production state.
- Hotfixes are back-merged into `development` and relevant active release branches.
- Rollback decisions are owned, documented and audited.
- Rollback instructions include code, chart, manifest, config and runbook impact.
- Fix-forward is allowed only when the risk is lower than rollback and the decision is explicit.

## Output Needed

The team should produce:

1. A documented hotfix flow.
2. A documented rollback flow.
3. A rollback vs fix-forward decision guide.
4. A branch reconciliation checklist.
5. A manifest reconciliation checklist.
6. Clear ownership for decision, execution and validation.

## Related Best Practices

Helm rollback limits, rollback runbook structure, hotfix time budgeting and Liquibase forward-only migration guidance are summarised in [release engineering best practices](release-engineering-best-practices.md).



---

# Release Scope, Ownership And Approvals

This page captures the release scope, ownership and approval questions that should be clarified.

## Why Scope Matters

The phrase "all services" needs a clear definition.

Release risk is not limited to source branches. It may also include Helm charts, manifests, configuration, secrets, runbooks and deployment management repositories.

If scope is unclear, automation may process too much, too little or the wrong thing.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  REL["📋 Release Process"]:::process --> SCOPE["📦 Scope\n─────────\nRepos • Charts • Manifests\nConfig • Secrets • Liquibase\nRunbooks"]:::scope
  SCOPE --> OWNER["👥 Named Owners\n+ Approvals"]:::owner

  classDef process fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef scope fill:#f57c00,stroke:#e65100,color:#fff,font-weight:bold
  classDef owner fill:#6a1b9a,stroke:#4a148c,color:#fff,font-weight:bold
```

## Ownership Gap

Automation cannot replace accountability. If an automated step fails, someone still needs to decide whether to rerun, override, stop, roll back or fix forward. Without named owners, decisions are delayed and escalation is unclear.

| Area | Accountable Owner Needed | Why |
| --- | --- | --- |
| Release readiness | Release owner | Confirms release can progress. |
| Manifest/tag validation | Release owner / platform owner | Prevents wrong artefacts. |
| Drone secrets/tokens | Platform owner | Prevents environment failures. |
| Hotfix decision | Release owner / incident lead | Avoids production drift. |
| Rollback decision | Release owner / incident lead | Ensures fast incident response. |
| Changed-chart exclusion | Release owner | Prevents hidden deployment gaps. |
| Environment readiness | Platform / environment owner | Confirms deployability. |
| Alert response | Named squad/platform owner | Ensures failed automation is handled. |

## Repositories To Classify

Confirm whether these are in scope for the same release process:

- Service repositories.
- Helm chart repositories.
- Cerberus deployment management repository.
- Manifest repositories.
- Secrets/config repositories.
- Liquibase/database change repositories or scripts.
- Runbook repositories.
- Any release metadata or changelog repositories.

## Service Scope Questions

- What does "all services" mean in practice?
- Are release branches created for all services or only changed services?
- Can the automation detect services with actual changes?
- Are there services without clear squad ownership?
- Are shared libraries or shared charts included?
- Are environment-only changes included in the same release scope?
- Are secrets and Liquibase/database changes included in the same release readiness check?

## Change Types To Track

A production or feature change may involve more than application code.

Track whether each release includes:

| Change Type | Included? | Notes |
| --- | --- | --- |
| Application/service code | TBD | Service repository changes. |
| Service chart changes | TBD | May remain partly manual until Drone pipelines are updated. |
| Manifest updates | TBD | Must match generated/expected tags. |
| Secrets/config changes | TBD | Needs careful handling and audit trail. |
| Liquibase/database changes | TBD | Needs release sequencing and rollback consideration. |
| Runbook steps | TBD | Needed for manual or environment-specific operations. |

## New Environment Readiness

Several setup points apply for new dev/test environments.

Before a new environment is treated as release-ready, confirm:

**An environment existing in Kubernetes does not mean it is release-ready.**

Environment readiness checklist:

- [ ] Values files exist and match naming expectations.
- [ ] Environment name is supported by deployment scripts.
- [ ] Drone secrets/tokens are configured.
- [ ] Kube/robot token ownership is clear.
- [ ] Required secrets are present and encrypted correctly.
- [ ] Feature flag defaults are known and documented.
- [ ] External integrations are reachable.
- [ ] Required runbook steps are documented.
- [ ] Access and permissions are confirmed.
- [ ] Smoke test path is known and executable.


- Required values files exist.
- Environment names are configured in the relevant setup/deploy scripts.
- Drone secrets/tokens exist for the environment.
- Kube/robot token ownership is clear.
- ACU responsibilities are clear where token/environment provisioning depends on them.
- Deployment scope behaviour is known for live, historical or both.
- Secret chart entries exist and use the expected encrypted format.

## Cross-Repository Ticket Grouping

The proposed automation relies heavily on consistent ticket and branch naming.

If multiple repositories use the same ticket/branch name, their changes should update the same Cerberus chart branch. This allows one feature ticket to group service, config, secret, Liquibase and runbook changes together for deployment/testing.

Open items:

- Confirm the exact branch/ticket naming rule.
- Confirm which repositories participate in cross-repo grouping.
- Confirm what happens when one ticket depends on another ticket/branch.
- Confirm who can manually adjust chart entries for cross-ticket dependencies.
- Confirm who owns secret/config updates when the change spans multiple repositories.

## Ownership Areas

Ownership should be explicit for:

- Merge approval into `development`.
- Release branch creation.
- Tag creation.
- Manifest update.
- Release readiness for each service.
- Deployment execution.
- QAT approval.
- Production release approval.
- Hotfix approval.
- Rollback decision and execution.
- Post-release validation.
- Branch and manifest reconciliation.

## Approval Points

Potential approval points:

- Merge to `development`.
- Release branch cut.
- Tag creation.
- Manifest merge request.
- Promotion to SIT.
- Promotion to higher environments.
- QAT approval.
- Production release.
- Rollback or fix-forward decision.
- Post-release closure.

The team should decide which approval points are mandatory and which can be automated.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  DEV["🔀 Merge to\ndevelopment"]:::step
  CUT["✂️ Release\nbranch cut"]:::step
  TAG["🏷️ Tag\ncreation"]:::step
  MAN["📝 Manifest\nMR"]:::step
  SIT["🚀 Deploy /\npromote"]:::step
  QAT["✅ QAT\napproval"]:::gate
  PROD["🏁 Production\nrelease"]:::gate
  POST["🔄 Post-release\nreconciliation"]:::step

  DEV --> CUT --> TAG --> MAN --> SIT --> QAT --> PROD --> POST

  classDef step fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef gate fill:#c62828,stroke:#b71c1c,color:#fff,font-weight:bold
```

## Ownership Matrix Template

| Activity | Owner | Approver | Backup | Evidence |
| --- | --- | --- | --- | --- |
| Merge to `development` | Squad developer | Squad lead / peer reviewer | Another squad member | Merge request |
| Create release branch | Automation (Gareth/Achilles) | Release owner | TBD | Pipeline/job link |
| Create service tag | Automation or release management | Release owner | TBD | Tag + pipeline link |
| Update manifest | Automation (Gareth/Achilles) | Release owner | TBD | Manifest MR |
| Deploy to lower environment | Squad developer | Squad lead | Another squad member | Deployment job |
| Deploy to SIT and above | Release management | Release owner | TBD | Deployment job |
| QAT approval | QAT team | QAT lead | TBD | Approval record |
| Production release | Release management | Release owner | TBD | Release record |
| Hotfix | Squad developer + release mgmt | Release owner | TBD | Hotfix MR/tag |
| Rollback | Release management | Release owner + incident lead | TBD | Rollback record |
| Post-release reconciliation | Automation + release owner | Release owner | TBD | Merge records |

Note: Names marked TBD still need to be confirmed with team leads. Known automation ownership sits with Gareth/Achilles for the pilot phase.

## Access And Operational Constraints

The release process should document operational constraints, including:

- Whether Thursday is the standard release day.
- Whether PNR room/location access is required for higher environments.
- Which commands require tools pod access.
- Which steps depend on environment variables or secrets.
- Which runbook steps must be executed alongside release.
- How secret exposure during screen sharing/recording is prevented.
- What happens if a secret is exposed and rotation is required.

## Output Needed

The team should produce:

1. A repository scope list.
2. A service scope list.
3. A service ownership list.
4. A release approval map.
5. A manual access/runbook checklist.
6. A post-release reconciliation owner and checklist.

## Related Best Practices

RACI, CODEOWNERS, branch protection, platform-vs-squad ownership and release-train guidance are summarised in [release engineering best practices](release-engineering-best-practices.md).



---

# Rollout Decision Proposals

These are the proposed decisions that still need release/process-owner approval.

This page is intentionally short. For rationale and detailed procedures, see [detailed rollout decision proposals](reference/rollout-decision-proposals-detailed.md).

## Decision Summary

| No | Area | Proposed Decision | Status |
| --- | --- | --- | --- |
| 1 | Branch baseline | Move to `main` as the production/live baseline after an agreed cutover release. | Proposed |
| 2 | Production sync | No release is closed until the released state is reconciled back to `main`. | Proposed |
| 3 | Release branches | Auto-create release branches at the start of each sprint/release from `main`. | Proposed |
| 4 | Feature/hotfix branches | Create feature and release-phase hotfix branches from the relevant release branch. | Proposed |
| 5 | Multiple active releases | Forward-merge production/release fixes into later active release branches before closure. | Proposed |
| 6 | Changed-chart deployment | Deploy changed charts by default; require approved override to exclude one. | Proposed |
| 7 | Quality gates | Keep human approval before higher-environment promotion and production. | Proposed |
| 8 | Failure handling | Make final Git/chart/reporting steps idempotent and rerunnable. | Proposed |
| 9 | Alerting | Add Slack/email alerts for failed automation steps before production rollout. | Proposed |
| 10 | Shared dev | Roll out shared dev deployment in phases, starting with manual trigger. | Proposed |
| 11 | Ephemeral environments | Keep ephemeral branch environments out of scope for now. | Proposed |
| 12 | New environments | Treat new dev/test environments as ready only after values, Drone secrets/tokens and setup scripts are confirmed. | Proposed |
| 13 | Auto manifest validation | Fail on wrong tag, missing tag, manifest/tag mismatch and do-not-deploy markers unless explicitly overridden. | Proposed |
| 14 | Rollback reconciliation | After rollback, reconcile `main`, manifests, release records and JIRA tickets to match actual production state. | Proposed |
| 15 | Tag jump checker | Retire after the new validation is green for two consecutive releases. | Proposed |

## Highest-Risk Decisions

These decisions should be approved first because they control release safety:

1. `main` must start from confirmed production state, not from `development`.
2. Wrong tag, missing tag and manifest/tag mismatch should fail fast.
3. Changed chart exclusions need release-owner approval and an audit note.
4. Rollback must reconcile branch, manifest, release report and JIRA state.
5. Failed automation needs an alert owner and safe rerun procedure.

## Cutover Guardrails

Do not cut over to `main = production` until:

- production state is tied to a known branch/tag/manifest,
- Drone pilot is green,
- branch protections are ready,
- open work on `development` is inventoried,
- hotfix and rollback reconciliation are approved,
- release owner and backup owner are named.

## Approval Checklist

Before rollout, approve or amend:

- cutover release and `main` branch protection,
- release branch naming and source branch,
- repository scope for auto-created release branches,
- forward-merge ownership,
- changed-chart deployment override rule,
- quality gates and human approval points,
- rerun/manual intervention procedure,
- alerting channels and owners,
- shared dev rollout phase,
- new environment readiness checklist,
- manifest/tag validation strictness,
- rollback reconciliation procedure,
- tag jump checker retirement plan.

## Related Detail

- Full decision rationale: [detailed rollout decision proposals](reference/rollout-decision-proposals-detailed.md)
- Rollout execution practices: [release engineering best practices](release-engineering-best-practices.md)
- Ownership model: [release scope, ownership and approvals](scope-ownership-approvals.md)



---

# Squad Briefing Summary

This is a short CI/CD and deployment summary for squad leads.

## What Is Changing

The team is working to reduce the current manual-heavy release process.

The target direction is to automate more of the release flow so that release branches, versions, tags, Cerberus chart changes and reporting can be generated through a repeatable pipeline.

The proposed model is:

- `development` effectively becomes `main`.
- `main` represents production/live state.
- Release branches are automatically created at the start of each sprint/release.
- Feature and hotfix branches are created from the relevant release branch.
- Commits on those branches generate deployable candidate tags and update matching Cerberus chart branches.

The proposed decision set is captured in [rollout decision proposals](rollout-decision-proposals.md).

## Why It Matters

The current process takes a lot of manual effort each week. The automation should help:

- Reduce manual release work.
- Improve visibility of what changed.
- Cross-reference release content with JIRA.
- Check that the release contains what it is expected to contain.
- Make the process easier to audit and repeat.
- Deploy changed charts without manually listing every service.

## Current Status

- Gareth/Achilles are testing the automation on the new configuration service.
- The scripts work locally.
- The next implementation step is to run the automation and reporting in Drone.
- Rollout may be possible within the next release or two, subject to team confirmation.
- Some manual server chart work may remain until the relevant Drone pipelines are updated.
- Alerting for failed automation steps is not yet defined.
- Quality gates and human approval points still need to be confirmed.

Current recommendation:

- Keep human approval before higher-environment promotion and production.
- Deploy changed charts by default.
- Allow chart deployment exclusions only with release owner approval and an audit note.
- Keep ephemeral branch environments out of scope for now.
- Treat new dev/test environments as ready only after values files, setup script entries and Drone secrets/tokens are confirmed.

## What Squads Should Know

- Release branches may start being used soon.
- The active release branch may be deployed regularly to a shared dev environment for cross-team integration testing. The initial rollout phase will use a manual trigger only; automatic deployment to shared dev will come in later phases.
- Squad dev test environments remain separate.
- Feature branches are expected to be deleted after merge, once any required reporting has been generated.
- Merge commits into release branches need MMA/JIRA ticket references and meaningful messages because release branch history becomes the changelog.
- Long-running feature branches may need to merge in previous and next release branches to avoid missing hotfixes or conflicts.
- Squads should raise concerns about branch naming, ticket references, server chart handling, release reporting, shared dev deployment or quality gates before rollout.

## Input Needed From Squads

1. Are there services in your squad that need special handling during release?
2. Do your changes commonly include secrets, config or Liquibase/database updates?
3. Are there current manual release steps that automation might miss?
4. Are commit messages consistently linked to MMA/JIRA tickets?
5. Do any long-running branches need special handling across multiple releases?
6. Are there services that should not be auto-deployed even if their chart changed?
7. Do any squad-owned changes use `NA` tag entries, secrets/config or Liquibase exceptions?
8. Who should be the squad contact for rollout questions?

## How This Rollout Will Be Communicated

### Feedback Loop

The rollout follows a "show, don't tell" approach:

```text
1. Pilot runs -> results shared with squads.
2. Squads review results -> raise concerns or questions.
3. Concerns addressed -> next phase starts.
4. Repeat until all squads are on the new process.
```

No squad will be switched to the new process without seeing it work first on a real release.

### What Squads Should Do Now

| Action | When | Who |
| --- | --- | --- |
| Answer the input questions above | Before rollout review meeting | Squad lead or nominated rep |
| Ensure commit messages reference MMA tickets | Immediately (good practice regardless) | All developers |
| Review current manual release steps for your service | Before pilot completion | Squad lead |
| Identify long-running branches that span releases | Before first release branch auto-creation | Feature owners |
| Nominate a squad contact for rollout questions | Before Phase 2 expansion | Squad lead |

### What Will NOT Change Immediately

- **Squad dev/test environments**: remain yours, deployed by you, no change.
- **Feature development workflow**: still branch -> develop -> MR -> review -> merge.
- **QAT approval**: still required for SIT and above.
- **Production release timing**: still Thursday (or as agreed).
- **Release owner approval**: still human, still required.

The automation handles the plumbing between your merge and the deployment. Your day-to-day development workflow stays the same.



---

# Release Engineering Best Practices

This page keeps industry/practice guidance out of the main operating-model pages.

Use it as supporting reference when deciding how far to take the Cerberus release automation, branching, validation, rollback, ownership and environment-management changes.

## Branching Model Selection

The branching model should match release cadence and operational maturity.

| Factor | GitFlow-style Better | Trunk-based Better |
| --- | --- | --- |
| Release cadence | Weekly / fortnightly / scheduled | Multiple times per day / on demand |
| Approval gates | QAT and release sign-off | Mostly automated gates |
| Feature flags | Deploy-time or limited | Runtime and reliable |
| Test automation | Partial | Strong regression coverage |
| Rollback confidence | Manual or untested | Fast and tested |
| Team ownership | Multiple squads, shared release | Small services, clear ownership |

Recommended Cerberus position:

```text
Stabilise the current GitFlow-style model first.
Then move to streamlined release branches with `main = production`.
Only move toward trunk-based development after feature flags, validation and rollback are mature.
```

## Release Automation

The proposed Cerberus flow aligns with GitOps principles:

```text
Git commit -> pipeline builds artefact -> deployment repo is updated -> environment deploys known state
```

Good release automation should:

- run centrally in Drone rather than on local machines,
- be idempotent and safe to rerun,
- build once and deploy the same artefact to higher environments,
- produce a release report,
- store logs and reports for audit,
- fail fast on release-integrity issues,
- alert the right owner when it fails.

Avoid:

- manual chart version edits as the default path,
- hidden Drone UI configuration that is not versioned,
- rebuilding artefacts for higher environments,
- continuing after wrong or missing tag validation.

## Validation Gates

Use a layered validation model:

| Gate | When | Purpose |
| --- | --- | --- |
| Pre-commit / MR | Before merge | Ticket reference, format, basic hygiene. |
| Branch pipeline | On push | Build, unit test, Helm lint/template, security checks. |
| Release pipeline | On merge/tag | Artefact creation, manifest/tag validation, report generation. |
| Promotion gate | Before SIT and above | Human approval plus report and diff review. |
| Production gate | Before production | QAT approval, rollback/fix-forward plan, final report check. |

Recommended strict rules:

```text
Wrong tag -> fail.
Missing tag -> fail.
Manifest/tag mismatch -> fail.
Do-not-deploy marker -> fail unless explicitly overridden.
Invalid ticket status -> fail or release-owner override.
```

Overrides should record approver, reason, timestamp, risk and follow-up action.

## Helm And Deployment

Treat chart versions and application versions separately:

```text
Chart version = version of chart packaging/templates.
App version = version of the application image inside the chart.
```

Recommended Helm practices:

- bump chart version when templates or deployment config change,
- keep base values safe for the lowest environment,
- keep environment override files focused on differences,
- keep secrets out of plain values files,
- run Helm lint/template in CI,
- store mass diff output with the release record,
- document which services are inside each umbrella chart.

Changed-chart deployment is a good default, but early rollout should keep human review because false negatives are risky.

## Environment And Feature Flags

Deployment does not always mean activation.

Feature flag maturity:

| Level | Description | Release Impact |
| --- | --- | --- |
| Build-time | Compile-time or static config | Least flexible. |
| Deploy-time | Helm values or environment config | Enables dark launch but needs redeploy to change. |
| Runtime static | Read at startup from config service | Better central control, restart may be needed. |
| Runtime dynamic | Change without redeploy | Best for kill-switches and progressive rollout. |

Cerberus appears closest to deploy-time flags today. That means trunk-based development would still carry release risk unless runtime flag control improves.

Feature flag rules:

- every incomplete feature must be behind a flag,
- each flag has an owner,
- each flag has a planned removal date,
- flag state per environment appears in the release report,
- critical features have a fast-disable path.

Environment readiness should confirm:

- values files,
- secrets,
- tokens,
- data shape,
- network rules,
- external integrations,
- permissions,
- runbook steps,
- feature flag defaults.

## Secrets Management

Git-crypt and managed secrets scripts are workable short-term controls, but they add operational cost as teams and environments grow.

| Option | Strength | Risk |
| --- | --- | --- |
| Git-crypt | Simple and version-controlled. | GPG onboarding and rotation overhead. |
| Sealed Secrets | Kubernetes-native encrypted secrets. | Requires controller per cluster. |
| External Secrets Operator | Syncs from a central secret store. | Adds infrastructure dependency. |
| Vault / AWS Secrets Manager | Strong audit and rotation model. | Larger platform migration. |

Recommended sequence:

```text
Short term: keep managed secrets scripts and Drone secrets stable.
Medium term: pilot External Secrets Operator or Sealed Secrets.
Long term: centralise secret storage and rotation.
```

Do not combine a major secret-management migration with the first release-automation rollout.

## Hotfix And Rollback

Helm rollback can revert Kubernetes manifests to a previous revision, but it does not automatically undo:

- database/data changes,
- external state,
- queue/cache side effects,
- third-party calls,
- dependent service behaviour.

Recommended rollback runbook:

1. Release owner approves rollback or fix-forward.
2. Notify squads and stakeholders.
3. Check database and Liquibase impact.
4. Roll back application/chart/config where safe.
5. Reconcile manifest and deployment-management state.
6. Run smoke tests.
7. Reconcile `main`, active release branches and release records.
8. Update incident and JIRA records.

Practical rule:

```text
If a production hotfix cannot be developed, tested and deployed within the agreed time budget,
reassess rollback instead of letting fix-forward drift indefinitely.
```

For Liquibase/database work, prefer expand/migrate/contract patterns so application rollback remains possible without database rollback.

## Ownership And Approvals

Use RACI for release activities:

```text
R = Responsible: does the work.
A = Accountable: owns the outcome.
C = Consulted: gives input.
I = Informed: notified.
```

The important rule is one accountable owner per critical activity.

Recommended ownership split:

- Platform owns Drone pipelines, Helm libraries, deployment tooling, environment provisioning and secrets infrastructure.
- Squads own service code, service config, feature flags, Liquibase migrations and functional testing.
- Release owner owns release timing, production approval, hotfix/rollback decision coordination and final reconciliation.

Use CODEOWNERS and branch protection to enforce approvals where possible.

## Rollout Strategy

Avoid big-bang process rollout.

Recommended phases:

```text
Phase 1: one service, one squad, one release cycle.
Phase 2: two or three squads.
Phase 3: all squads and services.
Phase 4: optimise with metrics and remove friction.
```

Measure:

- release preparation time,
- time from merge to deployable artefact,
- manual step count,
- release report accuracy,
- failed deployment recovery time,
- hotfix to production time.

If the pilot creates more risk than it removes, stop the pilot, revert affected services to the previous manual process, fix the root cause and restart from the last known-good phase.



---

# Platform Engineering Strategy

> **This section is not a blocker for the initial release automation rollout.** It describes the maturity roadmap after the immediate release operating model is stabilised. All items below (SBOM, ArgoCD, Argo Rollouts, canary deployment, observability gates, supply chain security) are **medium-term or long-term improvements**, not immediate required changes.

This page covers the platform-level capabilities that strengthen the release process beyond branching and CI/CD pipelines: environment promotion, deployment strategies, observability gates, GitOps readiness and supply chain security.

These are not immediate blockers for the release automation rollout, but they represent the maturity path that moves the team from "release automation works" to "releases are safe, observable and verifiable by design."

## 1. Environment Promotion Model

### Current State

The current promotion path is understood but not formally documented as a model:

```text
Squad dev/test → Shared dev → SIT → B.Val / Pre-prod → Production
```

Promotion today is largely manual: a person triggers deployment to the next environment after the previous one passes some form of validation.

### Target Promotion Model

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart TD
  DEV["🧪 Squad Dev/Test\n──────────\nDeveloper deploys\nFeature branch artefact\nNo gate required"]:::dev
  SHARED["🔗 Shared Dev\n──────────\nRelease branch artefact\nIntegration testing\nGate: pipeline green"]:::shared
  SIT["📋 SIT\n──────────\nRelease branch artefact\nFunctional validation\nGate: release owner approval"]:::sit
  PREPROD["🔒 Pre-prod / B.Val\n──────────\nSame artefact as SIT\nProduction-like validation\nGate: QAT approval"]:::preprod
  PROD["🏁 Production\n──────────\nSame artefact\nFinal promotion\nGate: release + QAT approval\n+ rollback plan confirmed"]:::prod

  DEV --> SHARED --> SIT --> PREPROD --> PROD

  classDef dev fill:#43a047,stroke:#2e7d32,color:#fff,font-weight:bold
  classDef shared fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef sit fill:#f57c00,stroke:#e65100,color:#fff,font-weight:bold
  classDef preprod fill:#7b1fa2,stroke:#4a148c,color:#fff,font-weight:bold
  classDef prod fill:#c62828,stroke:#b71c1c,color:#fff,font-weight:bold
```

### Promotion Rules

| Rule | Description |
| --- | --- |
| Immutable artefact | The same container image and Helm package moves through all environments. Never rebuild for a higher environment. |
| Environment-specific config only | Values files, secrets and feature flags are the only things that change between environments. |
| Gate before promotion | Each promotion requires a defined gate to pass. No silent auto-promote to production. |
| Audit trail | Every promotion records: who, when, which version, which gate passed, link to pipeline. |
| No skipping | Cannot promote to production without passing through pre-prod. Exception: approved emergency hotfix with explicit release-owner sign-off. |

### Promotion Gate Matrix

| Environment | Trigger | Gate | Approver |
| --- | --- | --- | --- |
| Squad dev/test | Developer push/trigger | Pipeline green | None (self-service) |
| Shared dev | Merge to release branch | Pipeline green + chart update complete | Automated |
| SIT | Release owner decision | Release report generated + changed charts identified | Release owner |
| Pre-prod / B.Val | QAT progression | SIT functional validation complete | QAT lead |
| Production | Release approval | QAT approved + rollback plan + release report final | Release owner + QAT |


## 2. Deployment Strategy

### Current State

The current deployment approach appears to be a standard Kubernetes **rolling update**: pods are replaced in sequence, health checks confirm readiness, and Helm manages the upgrade.

This works but has limitations:
- If health checks pass but functional issues exist, the full rollout completes before the problem is detected.
- Rollback requires manual `helm rollback` or redeployment.
- There is no traffic-based validation before full rollout.

### Deployment Strategy Options

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart TD
  subgraph CURRENT["Current: Rolling Update"]
    R1["Replace pods sequentially"]:::current
    R2["Health check gates"]:::current
    R3["Full rollout or manual rollback"]:::current
    R1 --> R2 --> R3
  end

  subgraph NEXT["Near-term: Blue-Green"]
    B1["Deploy new version alongside old"]:::next
    B2["Validate new version (no traffic)"]:::next
    B3["Switch traffic atomically"]:::next
    B4["Instant rollback: switch back"]:::next
    B1 --> B2 --> B3 --> B4
  end

  subgraph FUTURE["Future: Canary / Progressive"]
    C1["Deploy to small subset (5-10%)"]:::future
    C2["Monitor SLOs and error rates"]:::future
    C3["Auto-promote or auto-rollback"]:::future
    C4["Full rollout when healthy"]:::future
    C1 --> C2 --> C3 --> C4
  end

  classDef current fill:#455a64,stroke:#37474f,color:#fff,font-weight:bold
  classDef next fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef future fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
```

### Strategy Comparison

| Strategy | Rollback Speed | Infrastructure Cost | Complexity | Best For |
| --- | --- | --- | --- | --- |
| Rolling update | Minutes (manual) | 1x | Low | Simple services, low traffic |
| Blue-green | Instant (traffic switch) | 2x during deploy | Medium | Stateless services, critical path |
| Canary | Instant (remove canary) | 1.1x | High | High-traffic services, gradual confidence |
| Progressive (Argo Rollouts) | Automatic | 1.1x | High | Mature teams with observability |

### Recommended Adoption Path

```text
Phase 1 (Now): Rolling update with documented manual rollback procedure.
Phase 2 (After automation stable): Blue-green for critical services (API gateway, core services).
Phase 3 (After observability gates): Canary / progressive delivery via Argo Rollouts or Flagger.
```

### Argo Rollouts Integration (Future)

If the team adopts Argo Rollouts, the deployment definition moves from standard `Deployment` to a `Rollout` resource:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: my-service
spec:
  strategy:
    canary:
      steps:
        - setWeight: 10
        - pause: {duration: 5m}
        - analysis:
            templates:
              - templateName: success-rate
        - setWeight: 50
        - pause: {duration: 5m}
        - setWeight: 100
```

This requires:
- Argo Rollouts controller installed in the cluster.
- Analysis templates defined (connected to Prometheus/Datadog/etc.).
- Ingress or service mesh for traffic splitting.
- Helm charts updated to use Rollout instead of Deployment.


## 3. Observability Gates

### Current State

The current process checks:
- Pods started (health check).
- Deployment completed (Helm reports success).
- Basic monitoring may exist but is not integrated into the release pipeline.

There is no automated observability gate that validates release health against SLOs before or after promotion.

### Target: Observability-Driven Release Validation

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  DEPLOY["🚀 Deploy to environment"]:::deploy
  BAKE["⏱️ Bake time\n(5-15 min)"]:::wait
  CHECK["📊 Observability gate"]:::gate
  PASS{"SLOs met?"}:::decision
  PROMOTE["✅ Promote to next env"]:::pass
  ROLLBACK["⏪ Auto-rollback or alert"]:::fail

  DEPLOY --> BAKE --> CHECK --> PASS
  PASS -->|Yes| PROMOTE
  PASS -->|No| ROLLBACK

  classDef deploy fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef wait fill:#455a64,stroke:#37474f,color:#fff,font-weight:bold
  classDef gate fill:#7b1fa2,stroke:#4a148c,color:#fff,font-weight:bold
  classDef decision fill:#f9a825,stroke:#f57f17,color:#000,font-weight:bold
  classDef pass fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
  classDef fail fill:#c62828,stroke:#b71c1c,color:#fff,font-weight:bold
```

### Observability Gate Metrics

| Metric | What It Measures | Threshold Example | Source |
| --- | --- | --- | --- |
| Error rate (5xx) | Service returning errors | < 0.1% over bake period | Prometheus / OpenTelemetry |
| Latency P99 | Slowest requests | < 500ms (or < 2x baseline) | Prometheus / Datadog |
| Success rate | Requests completing successfully | > 99.9% | Application metrics |
| Pod restarts | Stability after deploy | 0 restarts in bake period | Kubernetes metrics |
| SLO burn rate | Rate of SLO budget consumption | < 1x normal burn | SLO platform |
| Business metric | Domain-specific health | No anomaly detected | Custom metrics |

### Implementation Options

| Approach | How It Works | Complexity |
| --- | --- | --- |
| Manual observability check | Human checks dashboards after deploy | Low (current state) |
| Pipeline metric query | Drone step queries Prometheus after deploy, fails if threshold breached | Medium |
| Argo Rollouts analysis | Analysis template auto-queries metrics during canary | High |
| Keptn / Dynatrace | Full SLO-based quality gate evaluation | High |

### Recommended Adoption Path

```text
Phase 1 (Now): Document key metrics and dashboards per service. Establish SLO targets.
Phase 2 (After Drone automation): Add a pipeline step that queries error rate and latency after deploy. Alert on breach.
Phase 3 (After Argo Rollouts): Connect analysis templates to Prometheus for automated canary validation.
```

### OpenTelemetry Integration

For services instrumented with OpenTelemetry:

```text
Traces → identify slow spans and error sources after deploy.
Metrics → feed observability gates (error rate, latency, throughput).
Logs → correlate errors with specific release version/commit.
```

The release report should include a link to the observability dashboard filtered by the deployed version, so reviewers can see the health state at a glance.


## 4. GitOps Readiness

### Current State

The current model is partially GitOps-aligned:
- Cerberus deployment-management repo holds chart versions and deployment state (Git as source of truth).
- Changes are applied via Drone pipelines (push-based).
- Deployment is triggered by manual promotion or pipeline step.

This is **push-based CI/CD**, not full GitOps. The key difference:

| Aspect | Push-Based (Current) | Pull-Based (GitOps) |
| --- | --- | --- |
| Who applies changes | Pipeline pushes to cluster | Controller in cluster pulls from Git |
| Drift detection | None (cluster may drift from Git) | Continuous (controller reconciles) |
| Rollback | Manual Helm rollback | Revert Git commit → controller syncs |
| Audit trail | Pipeline logs | Git history (complete, immutable) |
| Secret handling | Injected at deploy time | Sealed Secrets or External Secrets Operator |

### GitOps Target Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart TD
  subgraph CI["CI Pipeline (Build)"]
    CODE["🔨 Code change"]:::ci
    BUILD["📦 Build + test + scan"]:::ci
    PUSH["📤 Push image to registry"]:::ci
    CODE --> BUILD --> PUSH
  end

  subgraph CD["CD Pipeline (GitOps)"]
    UPDATE["📝 Update chart version\nin deployment repo"]:::cd
    COMMIT["💾 Commit to deployment repo"]:::cd
    UPDATE --> COMMIT
  end

  subgraph CLUSTER["Cluster (Pull-Based)"]
    ARGO["🔄 ArgoCD / Flux\ndetects change"]:::gitops
    SYNC["⚙️ Sync desired state\nto cluster"]:::gitops
    HEALTH["✅ Health check\n+ drift detection"]:::gitops
    ARGO --> SYNC --> HEALTH
  end

  PUSH --> UPDATE
  COMMIT --> ARGO

  classDef ci fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef cd fill:#f57c00,stroke:#e65100,color:#fff,font-weight:bold
  classDef gitops fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
```

### ArgoCD vs Flux Comparison

| Feature | ArgoCD | Flux |
| --- | --- | --- |
| UI | Rich web UI with app visualisation | Minimal (CLI + Grafana dashboards) |
| Multi-tenancy | Application projects with RBAC | Namespace-based tenancy |
| Helm support | Native (renders in-cluster) | Native (HelmRelease CRD) |
| Rollback | One-click in UI or CLI | Git revert → auto-sync |
| Notifications | Built-in (Slack, webhook, etc.) | Notification controller (separate) |
| Progressive delivery | Via Argo Rollouts (same ecosystem) | Via Flagger |
| Learning curve | Medium | Medium |
| Ecosystem fit | Better if also using Argo Workflows / Rollouts | Better if purely Git-centric |

### Recommended GitOps Adoption Path

```text
Phase 1 (Now): Treat the deployment-management repo as the GitOps source of truth.
              No manual changes to cluster state. All changes via Git.
              This is achievable without installing ArgoCD.

Phase 2 (Medium-term): Install ArgoCD in non-prod.
                        Configure it to sync from the deployment-management repo.
                        Validate drift detection and auto-sync behaviour.
                        Keep Drone for CI (build + test + push image).
                        Let ArgoCD handle CD (sync chart versions to cluster).

Phase 3 (Long-term): ArgoCD in production.
                      Remove Drone deployment steps (Drone only builds).
                      Add Argo Rollouts for progressive delivery.
                      Full GitOps: rollback = git revert.
```

### Prerequisites Before GitOps Adoption

- Deployment-management repo must be the single source of truth (no manual kubectl/helm overrides).
- Secrets must be handled without putting plain values in Git (Sealed Secrets or External Secrets Operator).
- Branch protection on deployment-management repo must prevent unauthorized changes.
- ArgoCD RBAC must align with release ownership model.
- Monitoring must detect sync failures and drift.


## 5. SBOM And Supply Chain Security

### Current State

Current security posture:
- Trivy vulnerability scanning runs during artefact creation.
- Sonar code quality scanning runs.
- No SBOM generation observed.
- No artefact signing observed.
- No provenance attestation observed.

### Why Supply Chain Security Matters

```text
A release is only trustworthy if you can prove:
1. What source code produced it (provenance).
2. What dependencies are inside it (SBOM).
3. That it was not tampered with after build (signing).
4. That known vulnerabilities were assessed (scanning).
```

The current process covers (4) but not (1), (2) or (3).

### SLSA Framework Levels

SLSA (Supply-chain Levels for Software Artifacts) defines maturity levels:

| Level | Requirement | Current State |
| --- | --- | --- |
| SLSA 1 | Build process exists and produces provenance | Partial (Drone builds, no provenance doc) |
| SLSA 2 | Build service is hosted (not local), provenance is signed | Partial (Drone is hosted, no signing) |
| SLSA 3 | Build platform is hardened, provenance is non-forgeable | Not met |
| SLSA 4 | Two-party review, hermetic builds | Not met |

### Recommended Supply Chain Controls

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  BUILD["🔨 Build"]:::build
  SBOM["📋 Generate SBOM\n(Syft / Trivy)"]:::security
  SCAN["🔍 Scan SBOM for CVEs"]:::security
  SIGN["🔏 Sign image\n(Cosign / Notation)"]:::security
  ATTEST["📜 Provenance attestation\n(SLSA / in-toto)"]:::security
  VERIFY["✅ Verify at deploy time"]:::verify

  BUILD --> SBOM --> SCAN --> SIGN --> ATTEST --> VERIFY

  classDef build fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef security fill:#7b1fa2,stroke:#4a148c,color:#fff,font-weight:bold
  classDef verify fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
```

### Tool Recommendations

| Capability | Tool Options | Integration Point |
| --- | --- | --- |
| SBOM generation | Syft, Trivy, Docker Scout | Build pipeline (after image build) |
| Vulnerability scan | Trivy (already in use), Grype | Build pipeline + periodic rescan |
| Image signing | Cosign (Sigstore), Notation (OCI) | Build pipeline (after push to registry) |
| Signature verification | Cosign verify, Kyverno admission policy | Deployment time (admission controller) |
| Provenance attestation | SLSA GitHub/GitLab generators, in-toto | Build pipeline (metadata generation) |
| Dependency pinning | Renovate (already mentioned), Dependabot | Ongoing (MR-based updates) |

### Recommended Adoption Path

```text
Phase 1 (Quick win): Generate SBOM with Trivy during existing scan step. Store as pipeline artefact.
                      Cost: minimal (Trivy already runs, add --format spdx-json flag).

Phase 2 (Medium-term): Sign container images with Cosign after push to registry.
                        Store signatures in the same registry (OCI artefact).
                        Add Cosign verify step before deployment.

Phase 3 (Long-term): Add Kyverno or OPA Gatekeeper admission policy that rejects unsigned images.
                      Generate SLSA provenance attestation.
                      Periodic SBOM rescan for newly discovered CVEs in deployed images.
```

### Quick Win: SBOM Generation

Adding SBOM generation to the existing pipeline requires one additional command:

```bash
# After image build and before push
trivy image --format spdx-json --output sbom.spdx.json myregistry/myservice:${TAG}
```

This produces a machine-readable inventory of every dependency in the image. It can be stored alongside the release report and used for:
- Post-release CVE triage (which services are affected by a new CVE?).
- Compliance and audit (what open-source licences are in production?).
- Incident response (does our production contain Log4Shell?).


## Maturity Roadmap Summary

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  subgraph NOW["Now (Phase 1)"]
    N1["✅ Release automation in Drone"]:::now
    N2["✅ Strict tag/manifest validation"]:::now
    N3["✅ Document promotion model"]:::now
    N4["✅ SBOM generation (Trivy flag)"]:::now
  end

  subgraph NEXT["Next (Phase 2)"]
    X1["🔜 Blue-green for critical services"]:::next
    X2["🔜 Pipeline observability query"]:::next
    X3["🔜 Image signing (Cosign)"]:::next
    X4["🔜 ArgoCD in non-prod"]:::next
  end

  subgraph FUTURE["Future (Phase 3)"]
    F1["🎯 Canary / Argo Rollouts"]:::future
    F2["🎯 SLO-based auto-promotion"]:::future
    F3["🎯 Admission policy (reject unsigned)"]:::future
    F4["🎯 ArgoCD in production"]:::future
  end

  NOW --> NEXT --> FUTURE

  classDef now fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
  classDef next fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef future fill:#7b1fa2,stroke:#4a148c,color:#fff,font-weight:bold
```



---

# One-Page Summary

## Current State

Cerberus uses a GitFlow-like branching model with release branches, tags, Helm packaging and environment promotion. The release process is functional but manual-heavy, with fragmented state across branches, tags, images, charts, manifests, Jira, secrets and runbooks. Automation is being piloted on the configuration service by Gareth/Achilles.

## Top 5 Risks

| # | Risk | Likelihood | Impact |
| --- | --- | --- | --- |
| 1 | Wrong artefact deployed due to weak tag/manifest validation. | Medium | High |
| 2 | Production incident with no standardised rollback procedure. | Medium | Critical |
| 3 | Release scope incomplete (missing secrets, config or DB changes). | High | High |
| 4 | Ownership gaps delay decisions during incidents. | High | Medium |
| 5 | Environment readiness failure blocks release at deploy time. | Medium | Medium |

## Top 5 Recommendations

| # | Recommendation | Effort | Priority |
| --- | --- | --- | --- |
| 1 | Move release automation scripts into Drone (complete the pilot). | Medium | Immediate |
| 2 | Enforce strict tag/manifest validation (fail on mismatch). | Low | Immediate |
| 3 | Document and test hotfix and rollback flows. | Medium | Before next production incident |
| 4 | Assign named owners for all release activities. | Low | Before pilot expands |
| 5 | Formalise environment readiness as a pre-deployment gate. | Low | Before new environments are used |

## Go / No-Go Criteria For Rollout Expansion

Before expanding the automation beyond the pilot:

- [ ] Configuration-service pilot completes successfully in Drone.
- [ ] Generated chart changes, versions and tags are correct.
- [ ] Release report is produced and matches expected content.
- [ ] Changed-chart detection identifies expected charts.
- [ ] Alerting for failed steps is in place.
- [ ] Rollback procedure is documented and tested.
- [ ] Named release owner and platform owner are assigned.
- [ ] At least one squad lead has reviewed and confirmed understanding.

## Suggested Next Step

> **Validate the current-state assumptions with Gareth, Achilles, release management and one squad lead before asking for approval on the rollout decisions.**

This ensures the assessment reflects reality, not just documentation interpretation, before any process change is made.


---

# System State, Problems, Solution Options And Risks - Detailed Analysis

This page contains the detailed analysis behind the shorter decision-ready summary.

Use this page when you need the rationale, operational detail and experience-based notes. Use [system state, problems, solution options and risks](../system-state-problems-solutions.md) for the short version.

## Purpose

This analysis answers four questions:

1. What is the current state of the CI/CD, branching, release and deployment system?
2. What are the main problems?
3. What solution options are available?
4. What risks does each solution introduce?

Related pages:

- [Current release operating model](../current-release-operating-model.md)
- [Deployment and release findings](../deployment-and-release-findings.md)
- [CI/CD deployment findings and actions](../cicd-deployment-findings-and-actions.md)
- [Proposed release automation flow](../proposed-release-automation-flow.md)
- [Branching strategy options](../branching-options.md)
- [Automation and validation](../automation-and-validation.md)
- [Hotfix and rollback](../hotfix-and-rollback.md)
- [Release scope, ownership and approvals](../scope-ownership-approvals.md)
- [Rollout decision proposals](../rollout-decision-proposals.md)

## Detailed Executive Summary

The main issue is not the branch model alone.

The bigger issue is that release state is distributed across several moving parts:

- source branches,
- release tags,
- images and Helm artefacts,
- Cerberus chart branches,
- manifests,
- values files,
- secrets and configuration,
- Liquibase/database changes,
- runbooks,
- JIRA metadata,
- QAT approvals,
- post-release reconciliation.

That means a branch model change cannot, by itself, make releases safe.

Recommended order:

```text
1. Make the current release process visible and auditable.
2. Move repeatable release work into Drone.
3. Enforce strict tag, manifest and ticket validation.
4. Name owners for release, hotfix, rollback, environment readiness and alerting.
5. Cut over to `main = production` only after the pilot is proven.
6. Consider trunk-based development later, after feature flags and rollback maturity improve.
```

## 1. Current System State

### 1.1 Branching And Release Model

The current branching model is close to GitFlow:

```text
feature branch -> development -> release branch -> master / production
```

Current understanding:

- Feature or ticket branches are used for individual changes.
- Completed work is merged into `development`.
- Release branches are cut from `development`.
- `master` is expected to represent production/live state.
- Release branches are tagged to trigger releasable artefact creation.
- After release, the release branch should be reconciled back into `master` and `development`.

Target direction:

```text
main = production/live baseline
release branch = sprint/release candidate
feature/hotfix branch = created from the relevant release branch
production release = reconciled back into main
```

Important distinction:

```text
Do not rename `development` to `main`.
Create or rename `main` from the confirmed production state.
```

Experience-based note:

In release-process changes, teams often focus too early on "GitFlow vs trunk-based". The better first question is whether the team can prove exactly what is included in a release, who approved it, which artefact was deployed and how rollback would be handled.

### 1.2 Artefacts, Tags And Deployment

A release branch alone does not produce a deployable artefact. The release tag is the bridge between source state and deployable state.

Tag creation appears to trigger:

- repository clone,
- build/test setup,
- Artifactory login,
- service build,
- Maven install/tests for Spring Boot services,
- vulnerability scanning such as Trivy,
- code quality scanning such as Sonar,
- Helm package, dependency build and artefact upload.

Deployment uses packaged Helm artefacts and environment-specific values files.

Key risk:

```text
If the tag points at the wrong commit, every later step can look correct while still deploying the wrong artefact.
```

Experience-based note:

"The branch is correct" is not enough. Production receives an image, chart, manifest, values, secrets and runbook combination. Release safety depends on that whole combination being consistent.

### 1.3 Manifest, JIRA And Release Metadata

Existing scripts appear to support:

- release ticket creation,
- manifest creation,
- JIRA release-label lookup,
- GitLab tag-field lookup,
- changelog update,
- branch creation,
- commits,
- pushes,
- merge requests.

Open validation questions:

- Should a wrong tag fail or warn?
- Should a missing tag fail or warn?
- Does a `do not deploy` marker always stop release?
- How should `NA` tag entries appear in the release report?
- Can invalid ticket status be overridden?
- Is the tag jump checker retired, replaced or adapted?

Recommended position:

```text
Release-integrity issues should fail fast.
Exceptions should be explicit, approved and recorded.
```

### 1.4 Environment Readiness

Lower environments are more ad hoc. SIT and above rely more heavily on release management and QAT approval.

Environment readiness should include:

- values files,
- environment setup script entries,
- Drone secrets/tokens,
- kube/robot token ownership,
- secret chart entries,
- deployment scope behaviour,
- data shape,
- external integrations,
- network access,
- operational permissions,
- runbook steps.

Experience-based note:

A namespace existing in Kubernetes does not mean the environment is release-ready. Release readiness includes secrets, tokens, values, data, access and operational runbooks.

### 1.5 Secrets, Config, Feature Flags And Liquibase

Secrets:

- Managed secrets scripts and Git-crypt appear to be the current direction.
- Secret keys should remain consistent across environments.
- Secret values differ by environment.
- GPG/Git maintainer onboarding is required.
- Secret exposure during screen sharing or recording may require rotation.

Feature flags:

- Feature activation appears to be mostly deploy-time, through values/config.
- Runtime dynamic feature flags are not clearly documented.
- Enabling or disabling a feature may require redeployment.

Liquibase:

- Database changes are part of release scope.
- One Liquibase update may affect multiple projects.
- Rollback-block expectations are not fully defined.

Experience-based note:

Trunk-based development works best when deployment and release are separated. If flag changes require chart redeployment, the team has moved complexity from branches into deployment/configuration rather than removing it.

### 1.6 Ownership And Approval

The ownership need is correctly identified, but several roles still need named owners:

- release owner,
- rollback decision owner,
- hotfix approver,
- Drone secret/token owner,
- service ownership list,
- environment readiness approver,
- post-release reconciliation owner,
- alert owner.

Experience-based note:

Automation is not an owner. When automation fails, someone must decide whether to rerun, override, stop release, roll back or fix forward.

## 2. Main Problems

### P1 - The Problem Can Be Misframed As Branching Only

The documents started from branching strategy, but the real system spans tags, artefacts, manifests, charts, config, secrets, environments, QAT, rollback and ownership.

Impact:

- A branch change may move risk rather than reduce it.
- A simpler branch model may expose more ambiguity if validation and ownership are weak.

Root cause:

- Release state is not represented by one system.

Recommendation:

- Treat branching as one part of the release operating model.

### P2 - Release Work Is Too Manual

The current process still includes local scripts and manual chart, tag or deployment steps.

Impact:

- Release preparation can take days.
- Execution varies by person.
- Audit trail is weak.
- Local environment differences affect outcomes.

Root cause:

- Automation exists, but it is not yet the mandatory central path.

Recommendation:

- Move repeatable release tasks into Drone and make pipeline output the audit source.

### P3 - Branch, Tag And Artefact Timing Is Not Strict Enough

Branch lifecycle and artefact lifecycle are different.

Impact:

- Wrong commit can be tagged.
- Wrong image or chart can be produced.
- Manifest state can drift from branch state.

Root cause:

- Tag creation rules and validation gates are not fully formalised.

Recommendation:

- Enforce tag timing, tag ownership and tag-to-commit validation in the release pipeline.

### P4 - Release Scope Is Not Explicit

"All services" needs a precise definition.

Scope may include:

- service repos,
- Helm chart repos,
- deployment-management,
- manifests,
- secrets/config,
- Liquibase/database changes,
- runbooks,
- shared libraries,
- changelog/release metadata.

Impact:

- Automation may include too much, too little or the wrong thing.
- Config, secret or database changes may be missed.

Recommendation:

- Create a repository and change-type scope list before scaling automation.

### P5 - Manifest And Ticket Validation May Be Too Permissive

Validation exists, but fail/warn policy is not fully agreed.

Impact:

- Blocked tickets can enter release.
- Wrong service versions can be promoted.
- Release reports can become misleading.

Recommendation:

```text
Wrong tag -> fail
Missing tag -> fail
Manifest/tag mismatch -> fail
Do-not-deploy marker -> fail unless explicitly overridden
Invalid ticket status -> fail or release-owner override
```

### P6 - Changed-Chart Deployment Needs Proof

Deploying only changed charts is the right direction, but detection must be trusted.

Impact:

- A changed chart can be missed.
- An unchanged chart can be deployed unnecessarily.
- Umbrella-chart blast radius can be misunderstood.

Recommendation:

- Use changed-chart deployment by default only after detection has been reviewed against real releases.
- Keep mass diff review mandatory early in rollout.

### P7 - Hotfix And Rollback Are Not Fully Operationalised

Production hotfix and release-phase hotfix scenarios are identified, but the runbook needs approval.

Impact:

- Production fixes can drift from `main`, release branches and manifests.
- Rollback can leave source control and deployment-management inconsistent.
- Liquibase and config changes can make rollback unsafe.

Recommendation:

- Make hotfix and rollback runbooks production gates.

### P8 - Environment Readiness Is Not A Gate

New environments need values, setup entries, Drone secrets/tokens and token ownership confirmed.

Impact:

- An environment can appear available but fail deployment.
- Pre-prod approval can create false confidence if parity is poor.

Recommendation:

- Create an environment readiness checklist and require it before rollout.

### P9 - Secrets And Config Management Will Become Harder At Scale

Git-crypt and managed secrets scripts are workable, but operationally heavy.

Impact:

- Maintainer onboarding slows down.
- Rotation becomes harder.
- Secret exposure response is more expensive.

Recommendation:

- Keep the current approach short term.
- Evaluate External Secrets Operator, Sealed Secrets or a central secret manager after release automation stabilises.

### P10 - Trunk-Based Development Is Risky Without Runtime Feature Flags

Feature flags appear closer to deploy-time values than dynamic runtime control.

Impact:

- Incomplete work may be harder to isolate.
- Turning a feature off may require redeployment.

Recommendation:

- Move toward trunk-based development only after feature flag, testing, monitoring and rollback maturity improve.

### P11 - Ownership Gaps Can Break The Rollout

Templates exist, but named owners are incomplete.

Impact:

- Failures become slow to resolve.
- Overrides become unclear.
- Rollback decisions are delayed.

Recommendation:

- Use a RACI model with one accountable owner per critical activity.

### P12 - Alerting And Rerun Rules Are Incomplete

Failed final Git/chart/reporting steps can leave partial state.

Impact:

- Artefacts may exist while chart updates or reports are missing.
- Manual edits may conflict with reruns.

Recommendation:

- Define alert content, alert channels, alert owners and safe rerun criteria before production rollout.

## 3. Solution Options And Risks

### S1 - Keep The Current Branch Model Temporarily

What changes:

- The current GitFlow-style model remains short term.
- Decisions, validation, scope, hotfix, rollback and ownership are completed first.

Benefits:

- Lowest immediate process risk.
- Familiar workflow remains in place.
- Real process problems become visible before branch cutover.

Risks:

- Teams may feel the branching problem is not being addressed.
- Manual work continues in the short term.

Mitigation:

- Time-box this phase.
- Publish exit criteria.
- Deliver quick wins such as strict validation dry-run and deployment parameter documentation.

### S2 - Move Release Automation Into Drone

What changes:

- Local scripts become centrally executed pipeline steps.
- Tags, chart updates and release reports are generated through Drone.

Benefits:

- Better auditability.
- Repeatable execution.
- Less local-machine dependency.
- Clearer failure visibility.

Risks:

- Drone may expose proxy, permission, token, secret or working-directory issues.
- Rerun may be unsafe if idempotency is not proven.

Mitigation:

- Keep pilot scope narrow.
- Test failure and rerun cases deliberately.
- Store output as release evidence.

### S3 - Add Strict Validation

What changes:

- Release-integrity problems stop the pipeline unless explicitly overridden.

Benefits:

- Prevents wrong artefacts and blocked work from reaching production.
- Improves release report trust.
- Strengthens incident review.

Risks:

- Early rollout may fail often because metadata quality is inconsistent.
- False positives may frustrate squads.

Mitigation:

- Run in dry-run/report-only mode first.
- Track common failure reasons.
- Clean metadata before enforcing fail-fast.

### S4 - Cut Over To `main = Production`

What changes:

- `main` starts from confirmed production state.
- Release branches are created from `main`.
- Production release is reconciled back into `main`.

Benefits:

- Clear production baseline.
- Less long-lived `development` drift.
- Better foundation for a streamlined release model.

Risks:

- Wrong production baseline could be selected.
- Open work on `development` could be mishandled.
- Automation may still point at old branch names.

Mitigation:

- Inventory open work.
- Freeze `development`.
- Test branch protections and pipeline targets before cutover.

### S5 - Use Ticket-Based Multi-Repo Aggregation And Changed-Chart Deployment

What changes:

- Changes using the same ticket/branch name feed into the same Cerberus chart branch.
- Changed charts are deployed by default.

Benefits:

- Better multi-service release visibility.
- Less manual chart editing.
- Clearer release blast radius.

Risks:

- Naming inconsistencies break aggregation.
- Cross-ticket dependencies may require manual handling.
- Umbrella chart detection may be imperfect.

Mitigation:

- Enforce naming rules.
- Keep chart diff review mandatory.
- Require audited exclusions.

### S6 - Make Hotfix And Rollback A Production Gate

What changes:

- Release cannot proceed without rollback/fix-forward guidance and reconciliation rules.

Benefits:

- Faster incident decision-making.
- Less production/source-control drift.
- Clearer database and config risk handling.

Risks:

- Rollback may be unsafe when database/data changes are involved.
- Runbook may stay theoretical if not tested.

Mitigation:

- Run rollback tabletop exercises.
- Require Liquibase rollback block or no-rollback justification.
- Define hotfix time budget.

### S7 - Name Ownership And Approvals

What changes:

- Critical release activities get responsible and accountable owners.
- CODEOWNERS and branch protection can enforce approvals where possible.

Benefits:

- Faster decisions.
- Cleaner overrides.
- Better auditability.

Risks:

- Too many approval gates slow delivery.
- Owner naming may become political or vague.

Mitigation:

- Keep gates focused on release risk.
- Name backups.
- Define approval SLA.

### S8 - Improve Feature Flag And Config Maturity Later

What changes:

- Deploy-time flags are documented and governed.
- Runtime flags are evaluated as a future improvement.

Benefits:

- Better separation of deployment and release.
- Safer future movement toward trunk-based development.

Risks:

- Feature flag debt can grow.
- Runtime flag platforms add operational dependency.

Mitigation:

- Add owner and expiry date to every flag.
- Include flag state in release reports.
- Review old flags regularly.

### S9 - Modernise Secrets Management Later

What changes:

- Current managed secrets approach stays short term.
- Modern secrets platforms are evaluated after release automation stabilises.

Benefits:

- Better rotation and audit in the long term.
- Less GPG onboarding friction.

Risks:

- Migration can introduce path/name mismatches.
- New controllers or platforms add operational dependencies.

Mitigation:

- Pilot in non-production.
- Create a secret inventory.
- Avoid combining this migration with the first release-automation rollout.

## 4. Recommended Roadmap

### Phase 0 - Decisions And Baseline

Complete:

- rollout decision approval,
- repository scope list,
- service ownership list,
- hotfix/rollback owners,
- validation fail/warn policy.

Exit criterion:

```text
The team knows which steps are automated, which require approval and which are exceptions.
```

### Phase 1 - Quick Wins

Complete:

- ticket reference validation,
- strict tag validation dry-run,
- deployment parameter documentation,
- changed-chart list in the release report,
- alert template.

Exit criterion:

```text
Release metadata errors become visible before they become production risk.
```

### Phase 2 - Drone Pilot

Complete:

- configuration-service pilot in Drone,
- generated tag/version/chart validation,
- release report validation,
- rerun testing,
- pilot review with squads.

Exit criterion:

```text
One service has release plumbing that is central, auditable and rerunnable.
```

### Phase 3 - Controlled Branch Cutover

Complete:

- create `main` from confirmed production state,
- freeze `development`,
- apply branch protections,
- auto-create release branches,
- require production-to-main reconciliation.

Exit criterion:

```text
`main` represents production and release branches are short-lived and automation-managed.
```

### Phase 4 - Scale-Out

Complete:

- onboard more squads,
- make changed-chart deployment the default,
- audit chart exclusions,
- expand shared dev deployment,
- track release metrics.

Exit criterion:

```text
Manual release steps decrease and release report accuracy increases.
```

### Phase 5 - Optimise

Complete:

- evaluate runtime feature flags,
- pilot modern secrets management,
- consider progressive delivery,
- retire tag jump checker after new validation is green for two releases.

Exit criterion:

```text
Release control can gradually move from branch management toward runtime configuration and progressive delivery.
```

## 5. Go / No-Go Criteria

### Go For Branch Cutover

- Confirmed production state is known.
- `main` branch protection is ready.
- Automation targets the correct branch.
- Release branch naming is approved.
- Hotfix and rollback flow is approved.
- Release owner and backup owner are named.
- Strict validation has passed at least the pilot.
- Open work inventory is complete.
- `development` freeze plan is communicated.

### No-Go For Branch Cutover

- Production state cannot be tied to branch/tag/manifest.
- Drone pilot is not green.
- Open work on `development` is unknown.
- Forward-merge owner is missing.
- Manifest/tag validation remains warning-only.
- Rollback reconciliation is unclear.

### Go For Automation Rollout

- Pipeline logs and report are stored.
- Rerun rules are tested.
- Failure alerting is ready.
- Manual chart edit policy is written.
- Drone secrets/tokens are ready.
- Changed-chart report has passed human review.
- Squads have answered rollout input questions.

### No-Go For Automation Rollout

- Scripts only work locally.
- Pipeline failures are silent.
- Rerun can create duplicate artefacts.
- Release report does not match actual chart/manifest state.
- Owners and approvals are unclear.

## 6. Critical Decisions

| No | Decision | Why It Matters |
| --- | --- | --- |
| 1 | When does `main` become the production baseline? | Foundation of the branch model. |
| 2 | When and from where are release branches created? | Scope and conflict control. |
| 3 | Do wrong/missing tags fail? | Release integrity. |
| 4 | Who can override `do not deploy`? | Governance and audit. |
| 5 | Who approves changed-chart exclusions? | Production blast radius. |
| 6 | Who decides rollback vs fix-forward? | Incident response speed. |
| 7 | What is the Liquibase rollback policy? | Database risk management. |
| 8 | Who owns Drone secrets/tokens? | Environment readiness. |
| 9 | Where are release reports stored? | Audit and incident review. |
| 10 | When is tag jump checker retired? | Old/new validation overlap. |

## 7. Final Recommendation

The documentation is moving in the right direction. The key remaining gap is not more technical explanation; it is turning proposed decisions into an approved operating model.

Recommended sequence:

```text
Do not change the branch model immediately.
Complete Drone pilot, strict validation, ownership and hotfix/rollback runbooks first.
After the pilot is trusted, cut over to `main = production`.
Move toward trunk-based development only after feature flags, testing, rollback and environment parity mature.
```

This path is not the fastest-looking option, but it reduces production release risk in the most controlled way.



---

# Rollout Decision Proposals

These are proposed decisions for the remaining open items.

They are written as defaults the team can approve or amend. They should not be treated as formally agreed until the relevant release/process owners confirm them.

## Decision Summary

| Area | Proposed Decision | Status |
| --- | --- | --- |
| Branch baseline | Move to `main` as the production/live baseline. | Proposed |
| Production sync | Merge the released branch/state back into `main` after production validation. | Proposed |
| Release branches | Auto-create release branches at the start of each sprint/release from `main`. | Proposed |
| Feature/hotfix branches | Create feature and release-phase hotfix branches from the relevant release branch. | Proposed |
| Multiple active releases | Forward-merge production/release fixes into later active release branches before closure. | Proposed |
| Changed-chart deployment | Deploy changed charts by default; require approved override to exclude one. | Proposed |
| Quality gates | Keep human approval before higher-environment promotion and production. | Proposed |
| Failure handling | Make the final Git/chart/reporting step idempotent and rerunnable. | Proposed |
| Alerting | Add Slack/email alerts for failed automation steps. | Proposed |
| Shared dev | Roll out shared dev deployment in phases, starting with manual trigger. | Proposed |
| Ephemeral environments | Keep ephemeral branch environments out of scope for now. | Proposed |
| New environments | Treat new dev/test environments as ready only after values, Drone secrets/tokens and setup scripts are confirmed. | Proposed |
| Auto manifest validation | Fail on wrong tag, missing tag, manifest/tag mismatch and do-not-deploy markers unless explicitly overridden. | Proposed |
| Rollback reconciliation | After rollback, reconcile `main`, manifests, release records and JIRA tickets to match actual production state. | Proposed |
| Tag jump checker | Retire after the new validation is confirmed green for two consecutive releases. | Proposed |

## 1. `development` To `main`

Proposed decision:

```text
Adopt `main` as the production/live baseline branch.
Treat the current `development` model as transitional until the release automation pilot is ready.
```

### Technical Cutover Steps

The transition means:

1. `master` currently represents production/live (even if drift has occurred).
2. After the agreed cutover release, `master` is renamed to `main` (or a new `main` is created from the confirmed production state).
3. `development` is not renamed to `main`. Instead, `main` starts from the confirmed production release state.
4. `development` is frozen and eventually archived/deleted after confirming no open work depends on it.
5. Existing `master` is archived or deleted after `main` is confirmed.

This is not a rename of `development` to `main`. It is a fresh start where `main` represents the actual production release state at cutover time.

Recommended rollout:

1. Confirm the cutover release.
2. Freeze new process changes on `development`.
3. Create `main` from the confirmed production release state (or rename `master` to `main`).
4. Confirm branch protections on `main`.
5. Update automation, documentation and team guidance to use `main`.
6. Archive `development` and old `master` after transition is stable.

Minimum approval needed:

- Release/process owner approval.
- Repo owner approval.
- Automation owner confirmation that Drone jobs target the right branch.

## 2. Keeping `main` Aligned With Production

Proposed decision:

```text
`main` must represent production/live state.
No release is closed until the released state has been reconciled back to `main`.
```

Recommended rule:

1. Release branch is deployed to production.
2. Production smoke/technical validation passes.
3. QAT/release approval is recorded where required.
4. Release branch is merged into `main`.
5. Release report links are attached to the release record.
6. Any active future release branches receive required forward merges.

Closure checklist:

- `main` contains the production release state.
- Release tag/report is available.
- Manifest/chart state matches production.
- Required forward merges are complete or explicitly tracked.

## 3. Release Branch Creation

Proposed decision:

```text
Create release branches automatically at the start of each sprint/release for every in-scope repository that needs one.
Default source branch is `main`.
```

Recommended naming:

```text
release/<major.minor>
```

Example:

```text
release/5.14
```

Exception:

```text
If releases need to be chained, explicitly configure the release branch source instead of silently using another branch.
```

## 4. Multiple Active Release Branches

Proposed decision:

```text
Any fix merged into an earlier active release must be assessed for forward-merge into later active release branches.
```

Recommended rule:

- If a hotfix goes into `release/5.14`, check whether `release/5.15` also needs it.
- If a delayed feature branch continues across releases, the feature owner must regularly merge in the relevant active release branch.
- Before opening or updating an MR, the feature owner should merge the current target release branch into the feature branch to expose conflicts early.
- Release closure should include a forward-merge check.

Suggested owner:

- Feature owner for feature branches.
- Release owner for release-to-release forward-merge tracking.

## 5. Changed-Chart Deployment Override

Proposed decision:

```text
Deploy all changed charts by default.
Allow exclusions only with explicit release owner approval and an audit note.
```

Override should record:

- Chart/service excluded.
- Reason for exclusion.
- Approver.
- Impact/risk.
- Follow-up action or release where it will be included.

Recommended default:

```text
If the chart changed and there is no approved exclusion, deploy it.
```

## 6. Quality Gates And Human Approval

Proposed decision:

```text
Automation can prepare release artefacts and reports, but higher-environment promotion and production release still require human approval.
```

Recommended gates:

| Stage | Gate |
| --- | --- |
| Branch commit | Build/test/scan succeeds before chart update. |
| Chart update | Image and Helm chart are built/uploaded before Cerberus chart update runs. |
| Shared dev deploy | Pipeline green, chart update complete, report generated. |
| SIT / higher environment | Release owner reviews report and changed charts. |
| Production | QAT/release approval, rollback/fix-forward plan, final report check. |

Recommended fail-fast items:

- Image build failure.
- Helm chart upload failure.
- Tag generation failure.
- Cerberus chart update failure.
- Missing or invalid release report.
- Manifest/tag mismatch.

## 7. Failure Handling And Rerun Procedure

Proposed decision:

```text
The final Git/chart/reporting step should be idempotent and safe to rerun after transient failures.
```

Recommended rerun procedure:

1. Identify the failed step.
2. Confirm image and Helm artefact were built/uploaded successfully.
3. Confirm no manual conflicting chart update was made.
4. Rerun the failed automation step.
5. Confirm tags, build numbers, chart branch updates and report output.
6. Record the rerun in the release notes or pipeline audit trail.

Manual intervention rule:

```text
Manual chart edits should be avoided.
If required, they must be recorded in the release report or release notes.
```

## 8. Alerting

Proposed decision:

```text
Add Slack/email alerting for failed automation steps before the process is treated as production-ready.
```

Alert should include:

- Repository/service.
- Branch.
- Release version.
- Failed step.
- Whether rerun is safe.
- Link to failed Drone job.
- Suggested owner/action.

Recommended channels:

- Release channel for release branch failures.
- Squad/team channel for feature branch failures.
- Email only for production or higher-environment release failures, if required by the wider process.

## 9. Shared Dev Environment Rollout

Proposed decision:

```text
Roll out shared dev deployment in phases.
Keep squad dev test environments separate.
```

Recommended phases:

1. Manual trigger: deploy active release branch to shared dev on demand.
2. Scheduled trigger: deploy active release branch to shared dev on a regular cadence.
3. Event trigger: deploy to shared dev after successful merge into the active release branch.
4. Metrics/reporting: add automated integration, performance and health reporting when available.

Out of scope for now:

```text
Ephemeral branch environments.
```

Reason:

```text
ACP support for ephemeral branch environments is uncertain, and the current direction is to use squad dev test environments plus a shared dev integration environment.
```

## 10. Release Report Location And Retention

Proposed decision:

```text
Store release reports as pipeline artefacts and attach/link them from the release record.
```

Recommended retention:

- Keep reports at least through production release, post-release validation and any incident review window.
- Prefer keeping release reports with the release record permanently if storage is cheap and access-controlled.

## 11. Rollback Reconciliation

Proposed decision:

```text
Rollback is an operational path that must leave source control, manifests and release records in a consistent state.
```

### After A Rollback

| Item | Action |
| --- | --- |
| `main` | Must still reflect production state. If rollback reverts production to an earlier release, `main` should be updated to match that state (revert commit or reset to earlier release tag). |
| Manifest | Revert manifest to the version that matches the rolled-back production state. |
| Failed release branch | Keep open for investigation. Close only after the fix-forward or abandonment decision is made. |
| Active future release branches | Forward-merge the rollback state if they depended on the failed release. |
| Release report/notes | Record the rollback event, reason, who decided and what was rolled back. |
| JIRA tickets | Update ticket status to reflect that the release was rolled back. |

### Rollback vs Fix-Forward Decision Guide

| Factor | Prefer Rollback | Prefer Fix-Forward |
| --- | --- | --- |
| User impact severity | High / data risk | Low / cosmetic |
| Fix complexity | Unknown or high | Simple and well-understood |
| Time to fix | Hours or unknown | Minutes |
| Database changes involved | No / reversible | Irreversible DB changes already applied |
| Confidence in rollback | High (tested, no data impact) | Low (untested, data risk) |

### Database/Liquibase Rollback

```text
Database rollback requires special handling because Liquibase changes may be forward-only.
```

Rules:

- If the release included Liquibase changes that have already been applied, assess whether a rollback script exists.
- If no rollback script exists and the DB change is not destructive, fix-forward may be the only safe option.
- If the DB change is destructive or causes data corruption, the incident process takes over.
- Liquibase rollback scripts should be written proactively for any release that includes schema changes to production.

Recommended practice:

```text
Every production Liquibase changeset should have a corresponding rollback block or a documented reason why rollback is not possible.
```

## 12. Tag Jump Checker Future

Proposed decision:

```text
Retire the tag jump checker in its current form once the new release branch model is active.
Replace its validation responsibilities with the new manifest/tag validation rules built into the release automation pipeline.
```

Rationale:

- The tag jump checker assumes linear version/tag ordering, which does not hold in the proposed non-linear release branch model.
- Its core responsibilities (detecting missing tags, wrong tags, blocked tickets, do-not-deploy cases) are being absorbed into the new automation validation rules.
- Rollback version comparisons in the old script are awkward because it prefers higher versions.

Recommended transition:

1. Keep the tag jump checker active during the transition period alongside the new validation.
2. Once the new automation validation is confirmed green for two consecutive releases, retire the tag jump checker.
3. Archive the script for reference but do not maintain it.
4. Ensure the new validation covers: wrong tag, missing tag, manifest/tag mismatch, invalid ticket status, do-not-deploy markers and `NA` entries.

## Approval Checklist

Before rollout, approve or amend:

1. `development -> main` cutover release.
2. `main` branch protection and production reconciliation rule.
3. Release branch naming.
4. Repository scope for auto-created release branches.
5. Multiple active release branch forward-merge rule.
6. Changed-chart deployment override rule.
7. Quality gates and human approval points.
8. Rerun/manual intervention procedure.
9. Alerting channels and owners.
10. Shared dev rollout phase.
11. New environment readiness checklist.
12. Auto manifest/tag validation strictness.
13. Rollback reconciliation procedure.
14. Tag jump checker retirement plan.

## Related Best Practices

Incremental rollout, success metrics, rollout rollback and resistance/edge-case handling are summarised in [release engineering best practices](../release-engineering-best-practices.md).



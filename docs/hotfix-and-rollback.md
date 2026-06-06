# Hotfix And Rollback

This page captures the open hotfix and rollback questions.

Rollback and hotfix handling need to be clear because they affect the branching model, tag strategy, manifest updates and post-release reconciliation.

Open hotfix and rollback decisions are tracked in the [release decision register](release-decision-register.md), especially D16, D17 and D18.

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

## Minimum Hotfix Operating Model To Approve

Before production rollout, the team should approve the following minimum model or replace it with a better one:

| Step | Production Hotfix Default | Release-Phase Hotfix Default | Approval / Evidence |
| --- | --- | --- | --- |
| Source branch | Known production baseline (`main` after cutover, current production branch before cutover). | Active release branch. | Release owner confirms source branch. |
| Approver | Release owner plus incident lead for critical production issues. | Release owner or delegated release approver. | Approval record linked to hotfix MR. |
| Tag timing | Tag after fix is reviewed, tested and accepted for production deployment. | Tag/version increment after merge back into release branch. | Tag and pipeline link. |
| Manifest update | Update manifest to the hotfix tag before production deploy. | Update release manifest as part of normal release preparation. | Manifest MR or deployment-management change. |
| Forward merge | Merge back to `main` and assess all active release branches. | Assess later active release branches before release closure. | Forward-merge checklist. |
| Closure | Confirm production state, manifest, release record and Jira are aligned. | Confirm release branch, manifest and report are aligned. | Release/hotfix closure note. |

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

## Rollback vs Fix-Forward Decision Guide

The decision should be made by the release owner and incident lead, with input from the affected squad and platform owner.

| Situation | Default Decision | Why |
| --- | --- | --- |
| Bad deployment with no database or irreversible config change | Rollback candidate | Environment can likely return to the previous known-good release. |
| Defect can be fixed faster than rollback can be validated | Fix-forward candidate | Lower operational risk if the fix path is faster and clear. |
| Liquibase/data change has no rollback block | Fix-forward candidate | Database rollback may be unsafe or impossible. |
| Secret/config change is the failure cause | Case-by-case | May require config restore, secret rotation or both. |
| Security incident or exposed secret | Incident process first | Rotation and containment may matter more than application rollback. |
| Failed release partially deployed across services/charts | Stop and assess | Need manifest, chart and environment state before deciding. |

Every rollback or fix-forward decision should record:

- decision owner,
- reason,
- affected services/charts,
- database/config/secrets impact,
- selected rollback or fix-forward target,
- validation result,
- branch, manifest, release report and Jira reconciliation actions.

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

<- [Automation and validation](automation-and-validation.md) | -> [Release scope, ownership and approvals](scope-ownership-approvals.md)

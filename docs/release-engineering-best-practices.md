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

## Related Pages

- [Branching Strategy Options](branching-options.md)
- [Automation And Validation](automation-and-validation.md)
- [Hotfix And Rollback](hotfix-and-rollback.md)
- [Platform Engineering Strategy](platform-engineering-strategy.md)

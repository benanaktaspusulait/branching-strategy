# Release Scope, Ownership And Approvals

This page captures the release scope, ownership and approval questions that should be clarified.

## Why Scope Matters

The phrase "all services" needs a clear definition.

Release risk is not limited to source branches. It may also include Helm charts, manifests, configuration, secrets, runbooks and deployment management repositories.

If scope is unclear, automation may process too much, too little or the wrong thing.

```mermaid
flowchart LR
  REL["Release process"] --> SCOPE["Repos + charts + manifests<br/>config + secrets + Liquibase + runbooks"]
  SCOPE --> OWNER["Named owners + approvals"]
```

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
flowchart LR
  DEV["Merge to development"] --> CUT["Release branch cut"]
  CUT --> TAG["Tag creation"]
  TAG --> MAN["Manifest MR"]
  MAN --> SIT["Deploy / promote"]
  SIT --> QAT["QAT approval"]
  QAT --> PROD["Production release"]
  PROD --> POST["Post-release reconciliation"]
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

<- [Hotfix and rollback](hotfix-and-rollback.md) | -> [Rollout decision proposals](rollout-decision-proposals.md)

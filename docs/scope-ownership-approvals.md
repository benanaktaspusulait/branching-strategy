# Release Scope, Ownership And Approvals

This page captures the release scope, ownership and approval questions that should be clarified.

## Why Scope Matters

The phrase "all services" needs a clear definition.

Release risk is not limited to source branches. It may also include Helm charts, manifests, configuration, secrets, runbooks and deployment management repositories.

If scope is unclear, automation may process too much, too little or the wrong thing.

```mermaid
flowchart TD
  REL["Release process"] --> SVC["Service repositories"]
  REL --> HELM["Helm chart repositories"]
  REL --> MAN["Manifest repositories"]
  REL --> CFG["Secrets / config repositories"]
  REL --> RUN["Runbook repositories"]
  REL --> META["Release metadata / changelog"]

  SVC --> OWNER["Service ownership"]
  HELM --> OWNER
  MAN --> OWNER
  CFG --> OWNER
  RUN --> OWNER
  META --> OWNER
```

## Repositories To Classify

Confirm whether these are in scope for the same release process:

- Service repositories.
- Helm chart repositories.
- Cerberus deployment management repository.
- Manifest repositories.
- Secrets/config repositories.
- Runbook repositories.
- Any release metadata or changelog repositories.

## Service Scope Questions

- What does "all services" mean in practice?
- Are release branches created for all services or only changed services?
- Can the automation detect services with actual changes?
- Are there services without clear squad ownership?
- Are shared libraries or shared charts included?
- Are environment-only changes included in the same release scope?

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
| Merge to `development` | TBD | TBD | TBD | Merge request |
| Create release branch | TBD | TBD | TBD | Pipeline/job link |
| Create service tag | TBD | TBD | TBD | Tag + pipeline link |
| Update manifest | TBD | TBD | TBD | Manifest MR |
| Deploy to environment | TBD | TBD | TBD | Deployment job |
| QAT approval | TBD | TBD | TBD | Approval record |
| Production release | TBD | TBD | TBD | Release record |
| Hotfix | TBD | TBD | TBD | Hotfix MR/tag |
| Rollback | TBD | TBD | TBD | Rollback record |
| Post-release reconciliation | TBD | TBD | TBD | Merge records |

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

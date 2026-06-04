 Cerberus Branching, Release and Deployment Process – Summary

 1. Purpose

This document summarises the current understanding of the Cerberus branching, release and deployment process based on the branching strategy discussion and the deployment KT sessions.

The main observation is that the current challenge is broader than the branching model alone. Branching, release coordination, service tags, Helm artefacts, manifests, configuration, feature flags, approvals, runbooks, rollback and ownership all need to be considered together as part of the overall release operating model.

---

 2. Current Branching Model

The current approach appears to be close to a GitFlow-style model:

```text
feature branch -> development -> release branch -> master / production
```

 Current understanding

- Feature or ticket branches are created for individual changes.
- Completed work is merged into the `development` branch.
- The `development` branch represents ongoing work and the candidate state for upcoming releases.
- Release branches are created from `development`.
- `master` is intended to reflect the production/live state.
- Release branches are tagged to trigger the creation of releasable artefacts.
- After a release, the release branch should be reconciled back into `master` and `development`.
- Hotfixes should be possible from the production state, but the exact hotfix and back-merge process needs to be clearly documented.

 Key context

The previous approach was closer to using `main/master` and release tags only. That reportedly led to long periods without releasing, fix-forward pressure and defect accumulation. The introduction of a `development` branch was intended to separate active development from the production state.

However, the current model still has risks if release branches, tags, manifests and post-release branch reconciliation are not handled consistently.

---

 3. Release Process Overview

From the KT sessions, the release process appears to involve several connected repositories, tools and manual steps.

At a high level, the flow can be described as:

```text
Feature branch
    -> merge to development
    -> create release branch
    -> create service tag
    -> build and test service
    -> security and quality scans
    -> Helm package / dependency build / artefact upload
    -> manifest update
    -> deployment through service repo / Helm scripts
    -> technical validation
    -> QAT approval
    -> higher environment promotion
    -> production release
    -> post-release reconciliation
```

The exact flow may vary by service and environment, which is one reason why the process should be mapped end to end.

---

 4. Deployment Repository and Helm Scripts

The deployment KT sessions clarified that the current deployment focus is on the service repo and the MMA Helm repo.

 Key points

- Historically, individual service charts had their own Drone pipelines.
- That was part of the previous way of working, when the dev environment deployed individual services as Helm charts.
- The current approach appears to deploy through the service repo instead.
- The MMA Helm repo contains deployment scripts used for Helm packaging, linting, templating, diffing, uploading and deployment-related tasks.
- If future changes are needed in the Drone pipeline for Helm deployment, the MMA Helm repo is likely where those changes would be added.

 Deployment script stages mentioned

- Helm packaging
- Helm linting
- Helm templating
- Mass diff
- Uploading
- Deployment

---

 5. Tagging and Artefact Creation

A release branch alone is not enough to produce a releasable service artefact. A tag is created on the release branch when it is ready to go.

Creating a tag triggers a tag creation pipeline, which generally performs the following activities:

- Clone the Git repository.
- Set up Docker/test dependencies.
- Log into Artifactory.
- Build the service.
- Run Maven clean install and tests for Spring Boot services.
- Run vulnerability scanning, for example Trivy.
- Run code quality scanning, for example Sonar.
- Produce Helm artefacts through:
  - Helm package
  - Helm dependency build
  - Helm artefact upload

This makes tag timing and tag correctness critical. The tag is effectively the bridge between source control and releasable artefact creation.

---

 6. Manifest, Ticket and Release Metadata Automation

There are scripts that appear to analyse release content based on tickets, tags and manifest versions.

 Observed responsibilities

- Compare start tag and end tag.
- Identify tickets included in a release.
- Add or update release-related labels.
- Update the changelog.
- Check ticket status.
- Check whether the correct tag version has been entered.
- Compare update versions with current manifest versions.
- Detect cases such as:
  - Incorrect tag version
  - No tags found
  - Blocked or invalid ticket status

 Risk

Some validation appears to be present, but it was also mentioned that parts of the process may currently be more permissive than expected. For example, some scenarios that might previously have failed may now pass or behave more loosely.

This creates a risk that incorrect release metadata, wrong tags or missing tags could pass through the process unless validation rules are clearly defined and enforced.

---

 7. Configuration and Feature Flags

Feature flags are an important part of the current release model.

 Current understanding

- A new feature or rule can be deployed without necessarily being active.
- Activation is controlled by feature flags and environment-specific values.
- Development teams decide which features need to be enabled in which environments.
- Some flag values appear to be controlled through value files or chart configuration.

This means there is a distinction between code deployment and feature activation:

```text
Code deployed does not always mean feature enabled
```

 Risk for trunk-based development

Trunk-based development was suggested as a possible future direction. However, it depends heavily on whether unfinished or risky functionality can be safely controlled outside the deployment itself.

If feature flags are baked into Helm charts or values files, and changing a flag requires a redeployment, then trunk-based development may move complexity from branching into configuration and deployment rather than removing it.

A centralised runtime configuration mechanism, such as a Cloud Config Server-style model, was discussed as a potential longer-term improvement. This could allow configuration and feature flags to be changed independently from service deployments.

---

 8. Testing, Validation and Approval

The KT sessions highlighted an important distinction between deployment success and functional release confidence.

 Technical validation

From the deployment perspective, checks generally confirm that:

- The deployment completed.
- Pods started successfully.
- Basic monitoring or health checks passed.

 Functional validation

Functional validation is handled separately by development teams and QAT.

- Development teams may use Playwright or Cypress for automated functional testing.
- For SIT and above, QAT approval is required before progressing further.
- A green deployment pipeline does not necessarily prove that the release is functionally safe.

This distinction should be explicit in the release documentation:

```text
Deployment success != Functional validation complete
```

---

 9. Rollback and Fix-Forward

Rollback is one of the clearest gaps identified in the KT sessions.

 Current understanding

- There is no automatic rollback built into the deployment scripts.
- If a deployment fails, the pipeline does not automatically trigger a rollback.
- Monitoring or health check failure does not automatically initiate rollback.
- Helm rollback is technically possible using Helm history and Helm rollback commands.
- In practice, recent issues appear to have been handled through fix-forward rather than rollback.

 Implication

The rollback process needs to be documented and standardised.

Questions that need to be answered include:

- What exactly is rolled back?
  - Service image?
  - Helm chart?
  - Values/config?
  - Manifest?
  - Runbook changes?
  - Secrets or environment variables?
- Who decides whether to rollback or fix-forward?
- Who executes the rollback?
- Is rollback tested regularly?
- How are rollback actions audited?
- How are branches and manifests reconciled after rollback?

Current state can be summarised as:

```text
Rollback capability: technically possible through Helm
Automated rollback: not currently built into deployment flow
Operational rollback process: unclear / not fully standardised
Common practical response: fix-forward
```

---

 10. Environment Parity

There was uncertainty around the differences between pre-production/B.Val and production.

 Current understanding

- In theory, pre-production should be as close to production as possible.
- Some people have limited or no direct production deployment experience.
- Production access is restricted.
- B.Val/pre-production may contain more data than production in some cases.
- The exact differences between environments are not clearly documented from the discussion.

 Risk

If environment differences are not well understood, then successful validation in pre-production may not fully reduce production risk.

Areas to document include:

- Data volume and data shape
- Configuration differences
- Feature flag defaults
- Secrets and credentials
- External integrations
- Network/access constraints
- Operational permissions

---

 11. Manual Steps, Access and Operational Constraints

The release process includes manual and operational constraints beyond source control and pipelines.

 Observed points

- Thursday appears to be the regular release day.
- Some production or higher-environment actions may require PNR room/location access.
- Tools pods may contain environment variables or secrets required for certain commands.
- Some runbook steps may need to be executed alongside releases.
- There is a runbook repository used for environment-specific release activities.
- Screen sharing or recording while viewing decoded secrets is a security risk.
- If secrets are exposed in a recording, secret rotation may be required.

These operational requirements should be documented as part of the release process, not treated as informal knowledge.

---

 12. Automation Direction

There is ongoing work to improve automation.

 Intended direction

- Move local or manual scripts into centrally executed pipelines.
- Improve auditability.
- Reduce manual service chart management.
- Automatically identify what is in or out of a branch/release.
- Automate start-of-sprint and end-of-sprint release tasks.
- Ideally reduce release work to running one or two standard pipelines.
- Roll the improved process out iteratively after review and sign-off.

 Immediate value

This appears to be the safest short-term improvement path:

```text
Standardise and automate the existing process before changing the branching model
```

Changing the branching model without first improving automation, validation, ownership and rollback may simply move the complexity elsewhere.

---

 13. Main Challenges Identified

 13.1 Branch Reconciliation

- Release branches need to be merged or reconciled back into `master` and `development`.
- It is unclear how consistently this happens today.
- If missed, `master` may not accurately represent production.
- Hotfix back-merging also needs to be clear.

 13.2 Tag, Artefact and Manifest Consistency

- Tags trigger releasable artefact creation.
- Manifest updates must match the actual service tags.
- Wrong tags or missing tags should fail fast.
- Validation rules need to be explicit and strict enough.

 13.3 Release Scope

- “All services” needs a clear definition.
- The process should clarify whether the following are in scope:
  - Service repositories
  - Helm chart repositories
  - Cerberus deployment management repository
  - Manifest repository
  - Secrets/config repositories
  - Runbook repository

 13.4 Configuration and Feature Flags

- Feature flags exist, but the runtime control model is unclear.
- If flags are deployment-bound, trunk-based development is riskier.
- Centralised runtime configuration may be required for a safer long-term model.

 13.5 Rollback

- Rollback is technically possible but not automated.
- The operational rollback path is not clearly standardised.
- Fix-forward seems to be the common practical approach.
- Rollback should include code, chart, config, manifest and runbook considerations.

 13.6 Environment Parity

- Differences between B.Val/pre-production and production are not fully clear.
- Production access and deployment experience appear limited for some people.
- Environment differences should be documented.

 13.7 Manual Steps and Access

- Some release activities depend on PNR/location access.
- Some commands depend on secrets or tools pod environment variables.
- Manual runbook steps need to be integrated into the documented release flow.

 13.8 Ownership

- Some services may not have clear squad ownership.
- Merge approval, release readiness, deployment execution and post-release validation ownership should be explicit.

---

 14. Branching Strategy Options Discussed

 Option 1: Continue with GitFlow-style model

```text
feature branch -> development -> release branch -> master
```

 Benefits

- Separates ongoing development from production state.
- Allows release branch stabilisation.
- Supports hotfixing from production state.
- Provides a controlled release candidate branch.

 Risks

- More branches to manage.
- Requires disciplined reconciliation.
- Can become heavy across many services.
- Manual tag/manifest/config coordination can be error-prone.

 Option 2: Simplify by removing the development branch

Possible direction:

```text
feature branches -> release branches tracking live/main
```

 Benefits

- Fewer long-lived branches.
- Potentially simpler relationship with live state.
- May reduce branch management overhead if releases are frequent.

 Risks

- Less separation between active development and release preparation.
- Risk of incomplete work entering release scope.
- Does not automatically solve manifest/config/feature flag complexity.

 Option 3: Trunk-based development with feature flags

Possible direction:

```text
short-lived branches -> trunk/main
release control -> feature flags/config
```

 Benefits

- Reduces long-running branches.
- Improves continuous integration.
- Reduces late merge conflict risk.
- Can increase release speed if operational capabilities are mature.

 Risks

- Requires strong runtime feature flag control.
- Requires centralised or easily changeable configuration.
- Requires strong automated testing.
- Instability may be harder to isolate if multiple changes are merged quickly.
- If flags are baked into charts, the complexity moves into deployment/configuration.

---

 15. Recommended Short-Term Approach

The safest short-term approach appears to be improving and standardising the current GitFlow-style process rather than immediately changing the branching model.

 Recommended short-term actions

1. Map the current release flow end to end.
2. Define the full release scope across repos and services.
3. Move local/manual scripts into audited pipelines.
4. Automate only-changed-service detection.
5. Automate tag and manifest update steps where possible.
6. Make validation strict for incorrect tags, missing tags and invalid ticket states.
7. Document hotfix, rollback and back-merge paths.
8. Clarify service ownership and release approval responsibilities.
9. Document environment differences between B.Val/pre-production and production.
10. Include runbook, access and secret-handling requirements in the release documentation.

---

 16. Recommended Longer-Term Direction

A longer-term move towards trunk-based development may be possible, but only after assessing readiness.

 Readiness criteria for trunk-based development

- Runtime feature flags are available and reliable.
- Feature activation is independent of deployment.
- Configuration can be changed centrally or without full redeployment.
- Automated test coverage is strong enough to detect regressions quickly.
- Rollback or disablement mechanisms are fast and well understood.
- Feature flag lifecycle is managed to avoid long-lived inactive code paths.
- Environment parity is well understood.
- Release ownership and approvals are clear.

Without these capabilities, trunk-based development could increase risk rather than reduce it.

---

 17. Suggested Discussion Structure for the Next Meeting

 1. Confirm the current end-to-end release flow

Questions:

- Where is the release branch cut?
- When is the service tag created?
- Which pipeline creates the releasable artefact?
- How is the manifest updated?
- Which approvals are required before deployment?
- What happens after production release?

 2. Confirm release scope

Questions:

- Which repositories are included in a release?
- Are service repos, Helm repos, Cerberus deployment management, secrets/config and runbooks all in scope?
- What does “all services” mean in practice?

 3. Review automation gaps

Questions:

- Which steps are currently manual?
- Which steps will Gareth’s automation cover?
- Will the automation only process services with actual changes?
- Where will audit trail and approval gates sit?

 4. Clarify rollback and hotfix handling

Questions:

- What is the standard rollback path today?
- When do we rollback vs fix-forward?
- How are rollback changes reflected in manifests and branches?
- How are hotfixes back-merged into `development` and release branches?

 5. Assess trunk-based readiness

Questions:

- Are feature flags runtime-changeable?
- Are they currently stored in chart/value files?
- Can config changes be made without redeployment?
- Is test coverage sufficient for frequent trunk integration?

---

 18. Suggested Meeting Statement

The following statement could be used to frame the discussion:

> From the KT sessions and branching discussion, it feels like the release challenge is broader than the branch model itself. Branching is one part of the process, but the actual release flow also depends on service tags, Helm packaging, manifest updates, config and feature flags, runbooks, environment access, QAT approval, rollback and ownership.
>
> Before deciding whether to stay with GitFlow, simplify release branches or move towards trunk-based development, it would be useful to map the current release flow end to end. That should include branch creation, tag creation, artefact generation, manifest update, configuration and feature flag handling, deployment, validation, QAT approval, runbook steps, hotfix and rollback.
>
> Trunk-based development could be a good longer-term direction, but only if release control can be separated from code integration. If feature flags are currently controlled through chart/value files and require redeployment, then trunk-based development may move complexity rather than remove it.
>
> In the short term, the safer path may be to standardise the current GitFlow-style process, move manual scripts into audited pipelines, automate service/chart/manifest handling, document rollback and hotfix paths, and clarify ownership.

---

 19. Proposed Next Actions

1. Create a current-state release flow diagram.
2. Create a repository and service scope list.
3. Create an automation gap list.
4. Document the hotfix and rollback process.
5. Document tag, artefact and manifest validation rules.
6. Document environment differences between B.Val/pre-production and production.
7. Create a service ownership and approval matrix.
8. Assess feature flag and configuration readiness for trunk-based development.
9. Align on short-term improvements versus longer-term branching strategy changes.

---

 20. Summary

The current release process has a GitFlow-style branching foundation, but the main complexity lies in coordinating multiple services, Helm artefacts, tags, manifests, configuration, feature flags, approvals, access constraints and manual runbook steps.

The immediate priority should be to make the current release operating model visible, repeatable and auditable. Once the process is clearly documented and automated, the team will be in a better position to decide whether to continue with GitFlow, simplify the branch model or move towards trunk-based development.

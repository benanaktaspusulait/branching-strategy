Branching Strategy Discussion – Pre-Meeting Brief

 1. Purpose of this note

This note summarises the branching strategy discussion so far and the related deployment context that may affect the branching decision.

The aim is not to define the final branching model in this document. The aim is to create a shared view before the next meeting of:

- What has been discussed so far
- What the current working assumptions appear to be
- What work is already in progress
- What remains unclear
- Which decisions or next steps may be useful to agree in the meeting

A recurring theme from the discussion is that the challenge is broader than branching alone. The branching model needs to work with the wider release process, including service tags, Helm artefacts, manifests, configuration, feature flags, approvals, hotfixes, rollback paths, runbooks and ownership.

---

 2. Current context

The current process appears to follow a GitFlow-style model:

```text
feature branch -> development -> release branch -> master / production
```

Current understanding:

- Feature branches are created for individual tickets or changes.
- Completed work is merged into `development`.
- `development` represents ongoing work and the candidate base for upcoming releases.
- Release branches are created from `development`.
- `master` is intended to represent the production/live state.
- Release branches are tagged to create releasable service artefacts.
- After a release, release branches should be reconciled back into `master` and `development`.
- Hotfixes should be possible from the production state, but the detailed flow needs to be clarified.

The previous approach was closer to using `master/main` and release tags only. That reportedly contributed to long release gaps, fix-forward pressure and defect accumulation. The introduction of `development` appears to have been intended to separate active development from production state.

---

 3. What has been discussed so far

 3.1 Branching approach

The current GitFlow-style model has been explained as the current working model:

- `development` is used as the target for ongoing work.
- `master` is intended to reflect production.
- Feature branches are created from `development`.
- Leads/seniors have merge approval rights.
- Anything merged into `development` is generally expected to be part of a future release.

There was also discussion about whether the process could be simplified by removing the long-lived `development` branch and having release branches track changes against live/production more directly.

A third option, trunk-based development, was also raised. This would reduce long-running branches, but depends heavily on reliable feature flags, runtime configuration control and strong automated testing.

---

 3.2 Release coordination across services

A key point from the discussion is that Cerberus has multiple moving parts. Release risk is not only about source branches; it also includes coordination across:

- Service repositories
- Helm charts
- Manifest updates
- Environment-specific configuration
- Feature flags
- Runbooks
- Secrets/config repositories
- Deployment management repositories

This means the scope of “all services” needs to be clearly defined. It is not yet fully clear whether repositories such as Cerberus deployment management, secrets/config repositories and runbook repositories are considered part of the same release process.

---

 3.3 Automation work in progress

There are existing scripts or automation steps that cover parts of the release process, including:

- Merging release branches into `master`
- Cleaning up old release branches
- Creating new release branches from `development`
- Tagging release branches
- Updating manifest merge requests with tags
- Raising manifest merge requests in Cerberus deployment management

Some of these steps currently require tweaking or are not fully automated yet.

Gareth has proposed moving scripts from local execution into pipelines. This would improve:

- Auditability
- Central ownership of the release flow
- Visibility of what has been run
- Repeatability
- Potentially, detection of which services actually have changes

There is also ongoing work intended to reduce manual service chart management and automate more of the process around identifying what is in or out of a release branch.

---

 3.4 Deployment context relevant to branching

The deployment KT sessions are not the main topic of the branching meeting, but they provide important context.

Relevant points:

- Release tags appear to trigger creation of releasable artefacts.
- The tag creation pipeline builds the service, runs tests, performs scans and creates Helm artefacts.
- Manifest/tag consistency is therefore critical.
- Deployment success is not the same as functional validation.
- QAT approval is required before promotion to higher environments.
- Feature activation may be controlled by feature flags and values/configuration.
- Rollback is technically possible through Helm, but does not currently appear to be automated in the deployment scripts.
- Recent operational behaviour appears to lean towards fix-forward in some scenarios.

These points matter because the branching model must support the actual release and recovery process.

---

 4. Current working understanding

The current release flow appears to be roughly:

```text
feature branch
  -> merge to development
  -> create release branch
  -> create release tag
  -> build/test/scan/package artefact
  -> update manifest
  -> deploy to environment
  -> technical validation
  -> QAT approval
  -> promote to higher environments
  -> production release
  -> reconcile release branch back to master/development
```

This should be confirmed during the meeting, especially around:

- When release branches are cut
- When tags are created
- Which repositories are included
- Which steps are manual vs automated
- How hotfixes and rollback are handled
- How `master` is kept aligned with production

---

 5. Emerging themes from the discussion

The following themes appear to be emerging from the discussion so far:

 5.1 Branching is only one part of the problem

Changing the branching model alone may not solve the wider release pain. The release process also depends on tags, manifests, configuration, feature flags, approvals, runbooks, hotfixes, rollback and ownership.

 5.2 Long-running branches should be avoided where possible

There is broad concern that long-running branches increase merge overhead and release risk. Any model should aim to keep branches short-lived where practical.

 5.3 `master` should reliably represent production

A key goal is for `master` to reflect the live/production state. This is important for hotfixing, rollback reasoning and release traceability.

 5.4 Release branch timing needs to be clarified

One of the main open points is how and when release branches should be created:

- At the start of a sprint?
- After release scope is agreed?
- After the release call?
- Only when services have changes?

 5.5 Automation is likely the safest short-term improvement

Moving manual/local scripts into audited pipelines seems to be a practical short-term improvement. This may reduce risk without immediately changing the branching model.

 5.6 Trunk-based development may be a longer-term option

Trunk-based development could reduce long-running branch issues, but it requires mature release control. In particular, unfinished or risky functionality must be safely controlled through runtime feature flags or configuration.

If feature flags are tied to Helm values/charts and require redeployment, then trunk-based development may move complexity into configuration and deployment rather than removing it.

 5.7 Rollback and hotfix paths need clearer definition

Rollback appears to be technically possible through Helm, but not currently built into the automated deployment flow. The team may need a clearer operational definition of:

- When to rollback vs fix-forward
- What exactly is rolled back
- Who owns the rollback decision
- How branches, tags and manifests are reconciled afterwards

---

 6. What appears to be in progress

The following work or direction appears to be in progress or proposed:

- Improving release automation
- Moving locally run scripts into pipelines
- Adding auditability and central control to release operations
- Detecting differences between commits/services so only changed services are processed
- Reducing manual service chart management
- Automating some of the release branch and manifest update process
- Potentially giving squads a more standard release pipeline to use

This work may provide a safer short-term path before making a major branching model change.

---

 7. Decisions or confirmations still needed

The discussion so far has raised several areas that likely need confirmation or decision.

 7.1 Branching model

- Are we keeping the current GitFlow-style model in the short term?
- Should `development` remain a long-lived integration branch?
- Should `master` continue to represent production state?
- Should release branches be created from `development` or from the production baseline?
- Are release branches per-service, coordinated across services, or both depending on context?

 7.2 Release branch timing

- When exactly should release branches be created?
- Should release branches be cut at the start of a sprint, after release scope is known, or after a release call?
- Should branches only be created for services with actual changes?

 7.3 Release scope

- What does “all services” mean in practice?
- Are the following repositories in scope?
  - Service repositories
  - Helm chart repositories
  - Cerberus deployment management
  - Manifest repositories
  - Secrets/config repositories
  - Runbook repositories

 7.4 Tags and manifests

- Who owns tag creation?
- When should tags be created?
- How is tag-to-manifest consistency guaranteed?
- What validation should fail the pipeline?
- What should happen if a wrong tag or missing tag is detected?

 7.5 Hotfixes

- What is the expected hotfix flow from production?
- Should hotfixes be made from `master`?
- How are hotfixes merged back into `development` and any active release branches?
- How do we avoid hotfix drift between production and development?

 7.6 Rollback

- Is rollback a standard operating path or mostly an exception?
- When do we rollback vs fix-forward?
- What is included in rollback: service image, Helm chart, values, manifest, config, runbooks?
- Who owns the rollback decision and execution?
- Should rollback be automated, documented, or both?

 7.7 Feature flags and configuration

- Are feature flags runtime-changeable?
- Are they currently controlled through Helm values/charts?
- Can feature activation be separated from deployment?
- Is a centralised runtime configuration approach needed before trunk-based development is realistic?

 7.8 Ownership and approvals

- Who owns release readiness for each service?
- Who approves merges into `development`, release branches and `master`?
- Who owns the production release execution?
- Who owns post-release validation and branch reconciliation?

---

 8. Options on the table

 Option A: Continue with the current GitFlow-style model and improve automation

```text
feature branch -> development -> release branch -> master
```

Potential benefits:

- Keeps a familiar model.
- Separates active development from production.
- Allows release stabilisation.
- Supports production-based hotfixing if `master` is reliable.
- May be safer in the short term while automation and documentation improve.

Potential concerns:

- More branches to manage.
- Requires disciplined reconciliation after release.
- Can create overhead across many services.
- Still depends on tag/manifest/config coordination.

---

 Option B: Simplify by removing or reducing reliance on `development`

Possible model:

```text
feature branches -> release branches tracking live/main
```

Potential benefits:

- Fewer long-lived branches.
- Closer alignment to production state.
- Potentially easier to reason about changes against live.

Potential concerns:

- Less separation between active development and release preparation.
- Incomplete or risky work may be harder to isolate.
- Does not automatically solve manifest, config, feature flag or rollback complexity.

---

 Option C: Move towards trunk-based development with feature flags

Possible model:

```text
short-lived branches -> trunk/main
release control -> feature flags/config
```

Potential benefits:

- Reduces long-running branches.
- Improves continuous integration.
- Reduces late merge conflicts.
- Can support faster release cycles if operational controls are mature.

Potential concerns:

- Requires strong runtime feature flag control.
- Requires configuration to be changeable without redeployment, or at least with very low friction.
- Requires strong automated testing and monitoring.
- Can make instability harder to isolate if many changes are merged quickly.
- If feature flags are baked into charts/values, this may not reduce overall complexity.

---

 9. Suggested focus for the next meeting

The next meeting may be most useful if it focuses on confirming the current state and agreeing the next practical steps, rather than trying to jump straight to a final branching model.

Suggested agenda:

1. Confirm the current branching and release flow.
2. Confirm whether the current GitFlow-style model remains the short-term baseline.
3. Clarify when release branches are created and when tags are created.
4. Define what repositories and services are in release scope.
5. Confirm what Gareth’s automation will cover and what will remain manual.
6. Clarify hotfix and rollback expectations.
7. Assess whether trunk-based development is an immediate option or a longer-term target.
8. Agree the minimum documentation/actions needed before changing the branching model.

---

 10. Proposed meeting outcomes

Useful outcomes from the meeting could be:

1. A confirmed current-state branching/release flow.
2. Agreement on the short-term branching baseline.
3. Agreement on when release branches and tags should be created.
4. A clear list of repositories/services in release scope.
5. A clear view of which automation improvements are in progress.
6. An action to document the hotfix process.
7. An action to document the rollback process.
8. An action to define tag/manifest validation rules.
9. A decision on whether trunk-based development is a near-term target or a longer-term option.
10. Clear ownership for follow-up actions.

---

 11. Suggested framing statement

The following could be used to frame the discussion:

> From the discussion so far, it feels like the release challenge is broader than the branch model itself. Branching is one part of the process, but the actual release flow also depends on service tags, Helm artefacts, manifest updates, configuration and feature flags, runbooks, environment access, QAT approval, rollback and ownership.
>
> Before deciding whether to stay with GitFlow, simplify release branches or move towards trunk-based development, it may be useful to confirm the current release flow end to end and identify which parts need to be standardised or automated.
>
> Trunk-based development could be a good longer-term direction, but only if release control can be separated from code integration. If feature flags are currently controlled through chart/value files and require redeployment, then trunk-based may move complexity rather than remove it.
>
> In the short term, improving the current process through pipeline-based automation, clearer hotfix and rollback paths, stronger tag/manifest validation and clearer ownership may be the safer first step.

---

 12. Suggested position / point of view

A balanced position for the discussion could be:

```text
We should avoid treating the branching model as the only problem to solve.
The branching strategy needs to be supported by a clear and repeatable release process.

In the short term, it may be safer to stabilise and automate the current GitFlow-style process.
Once release flow, automation, rollback, hotfixes and ownership are clearer, we can make a more informed decision about simplifying the model or moving towards trunk-based development.
```

---

 13. Summary

The current discussion is not simply GitFlow vs trunk-based development. The more important question is which branching model can be safely supported by the current release operating model.

The immediate priority appears to be making the current process visible, repeatable and auditable:

- Confirm the current branching/release flow
- Clarify release branch and tag timing
- Define release scope across repositories
- Improve automation through pipelines
- Document hotfix and rollback paths
- Strengthen tag/manifest validation
- Clarify ownership

Once those areas are clearer, the team will be in a stronger position to decide whether to continue with the current GitFlow-style model, simplify it, or move towards trunk-based development.

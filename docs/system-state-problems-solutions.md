# System State, Problems, Solution Options And Risks

This is the decision-ready summary of the CI/CD, branching, release and deployment documentation.

For the full detailed analysis, see [system state detailed analysis](reference/system-state-problems-solutions-detailed.md).

## Executive Summary

```text
Do not change the branching model first.
First make the release process visible, repeatable, validated and owned.
Then move to the target `main = production` model through a controlled cutover.
```

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

| Priority | Problem | Impact | Root Cause |
| --- | --- | --- | --- |
| P1 | The issue can be misframed as "branching only". | A branch change may move risk rather than reduce it. | Release state is distributed across many systems. |
| P2 | Release work is too manual and locally executed. | Slow releases, inconsistent execution, weak audit trail. | Automation is not yet the mandatory central path. |
| P3 | Branch, tag and artefact timing rules are not strict enough. | Wrong artefacts or manifests can be produced. | Branch lifecycle and artefact lifecycle are different. |
| P4 | Release scope is unclear. | Secrets, config, Liquibase or runbook changes can be missed. | "All services" is not yet defined as a repo/change-type scope. |
| P5 | Manifest and ticket validation can be too permissive. | Blocked or wrong work can reach release. | Fail vs warning policy is still proposed. |
| P6 | Changed-chart deployment is not yet a proven default. | Changed charts may be missed or unnecessary charts deployed. | Umbrella chart and service mapping need reliable detection. |
| P7 | Hotfix and rollback are not operationally standardised. | Production can drift from branch, manifest and release records. | Rollback is treated as technical capability, not full process. |
| P8 | Environment readiness and parity are not explicit gates. | Release day failures can appear late. | Values, secrets, data, access and tokens are not centrally confirmed. |
| P9 | Secrets/config management will get harder at scale. | Onboarding, rotation and audit risk increase. | Git-crypt/GPG is workable but operationally heavy. |
| P10 | Trunk-based development is risky without stronger feature flags. | Incomplete work may need branch or config workarounds. | Feature flags appear deploy-time rather than dynamic runtime. |
| P11 | Ownership and approval gaps can break the rollout. | Failures, overrides and rollback decisions become slow. | RACI is not yet fully named. |
| P12 | Alerting and rerun rules are incomplete. | Failed automation can leave state half-updated. | Failure modes are not yet production-readiness gates. |

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

<- [README](../README.md) | -> [Rollout decision proposals](rollout-decision-proposals.md)

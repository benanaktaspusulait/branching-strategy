# Hotfix and Rollback

| Field | Value |
| --- | --- |
| Owner | Benan Aktas |
| Status | In Review |
| Created | 2026-06-09 |
| Last updated | 2026-06-09 |
| Labels | hotfix, rollback, production-safety, cerberus, proposal |

---

## Summary

Hotfix and rollback flows directly affect production safety. Two distinct hotfix scenarios exist (production critical and release-phase). Rollback is technically possible via Helm but is not operationally standardised — the practical response today is fix-forward.

This page defines both hotfix scenarios, proposes a minimum operating model, provides a rollback vs fix-forward decision guide and outlines Liquibase and branch reconciliation rules.

---

## Two Hotfix Scenarios

### Production Hotfix (Critical Live Issue)

```text
main / production state
  → hotfix branch (from main)
  → test and release hotfix
  → update production
  → merge hotfix back into main
  → forward-merge into any active release branches
```

### Release-Phase Hotfix (Issue During Release Preparation)

```text
active release branch
  → hotfix branch (from release branch)
  → test hotfix
  → merge back into release branch
  → release version incremented as normal
```

**Shared behaviour:** Both types are treated identically by automation. Commits generate deployable candidates and update the matching Cerberus chart branch. On merge, the release version/tag increments normally.

---

## Minimum Hotfix Operating Model To Confirm

| Step | Production Hotfix | Release-Phase Hotfix | Evidence |
|------|-------------------|----------------------|----------|
| Source branch | `main` (after cutover) or current production branch (before cutover). | Active release branch. | Release owner confirms. |
| Approver | Release owner + incident lead. | Release owner or delegate. | Approval record on MR. |
| Tag timing | After fix reviewed, tested and accepted. | After merge back into release branch. | Tag + pipeline link. |
| Manifest update | Update to hotfix tag before production deploy. | Update as part of normal release preparation. | Manifest MR. |
| Forward merge | Merge to `main` + assess all active release branches. | Assess later release branches before closure. | Forward-merge checklist. |
| Closure | Confirm production state, manifest, release record and Jira align. | Confirm release branch, manifest and report align. | Closure note. |

---

## Rollback vs Fix-Forward Decision Guide

| Situation | Default Decision | Rationale |
|-----------|------------------|-----------|
| Bad deployment with no DB/irreversible config change | Rollback | Environment can return to previous known-good release. |
| Defect fixable faster than rollback validation | Fix-forward | Lower operational risk if fix path is faster. |
| Liquibase change has no rollback block | Fix-forward | Database rollback may be unsafe or impossible. |
| Secret/config change is the failure cause | Case-by-case | May require config restore, rotation or both. |
| Security incident or exposed secret | Incident process first | Rotation and containment take priority. |
| Partial deployment across services/charts | Stop and assess | Need full state picture before deciding. |

Every rollback or fix-forward decision must record: decision owner, reason, affected services, DB/config/secrets impact, target version, validation result and reconciliation actions.

---

## What Exactly Rolls Back?

The rollback scope must be explicit:

| Item | Included in Rollback? |
|------|-----------------------|
| Service image | Yes |
| Helm chart | Yes |
| Values/config | Yes (if changed) |
| Manifest | Yes |
| Runbook changes | Case-by-case |
| Secrets/environment variables | Case-by-case |
| Database/data changes | Only if rollback block exists |

If any item is not rolled back, this must be documented explicitly.

---

## Liquibase Rollback Rules

| Scenario | Action |
|----------|--------|
| Schema change with rollback block | Execute Liquibase rollback as part of release rollback. |
| Schema change without rollback block | Fix-forward only. Document why rollback not possible. |
| Destructive data change (DROP, DELETE) | Cannot roll back. Fix-forward or restore from backup. |
| Additive-only change (ADD COLUMN, new table) | May not need rollback if application handles both states. |

**Proposed practice:** Every production Liquibase changeset should include a rollback block or documented justification for its absence.

Release readiness for Liquibase changes must confirm:
1. Rollback block exists, or justification documented.
2. Change tested in lower environment with same rollback path.
3. Team understands whether rollback or fix-forward is the plan.
4. Non-rollbackable changes flagged in release report.

---

## Branch and Manifest Reconciliation

After rollback, define:

| Question | Required Answer |
|----------|----------------|
| Does `main` still reflect production? | Must be updated to match actual production state. |
| Is the manifest reverted or updated? | Must point to the rollback version. |
| Does the failed release branch remain open? | Decision by release owner. |
| Is a fix-forward branch created? | If fix-forward chosen, yes. |
| Does `development` need a revert/fix? | Assess and merge as needed. |
| How do release notes reflect the rollback? | Rollback recorded in report/changelog. |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Extended incident due to no tested rollback process | Medium | Critical | Document and test rollback before next production incident. |
| Hotfix drifts from `main` and active releases | Medium | High | Forward-merge checklist enforced on every hotfix. |
| Liquibase change without rollback block deployed | High | High | Require rollback block or explicit exemption in release readiness. |

---

## References

- Rollback decisions (D16, D17, D18): see 04 — Rollout Decision Proposals
- Ownership and approval: see 06 — Ownership and Approvals
- Automation handling: see 03 — Proposed Release Automation Flow

---

Feedback or questions? Contact the page owner or comment below.

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

---

## Recent Rollback Relevance

Recent discussion highlighted that rollback readiness is not purely theoretical. Key concerns include: runbook gaps for operational rollback procedures, inherited architecture issues making some services harder to revert, and feature flagging limitations meaning partial rollback at the feature level may require redeployment rather than configuration change. These reinforce the need to test rollback procedures before they are needed in production.

---

## Pre-Rollback Checklist

Before executing a rollback, confirm:

1. [ ] Previous healthy deployment version is identified and Helm revision exists.
2. [ ] Liquibase/database changes between versions are reviewed for rollback safety.
3. [ ] Config/secret changes between versions are reviewed for reversibility.
4. [ ] Downstream service compatibility with rollback version is confirmed.
5. [ ] Branch, manifest and release record reconciliation plan is agreed.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Extended incident due to no tested rollback process | Medium | Critical | Document and test rollback before next production incident. |
| Hotfix drifts from `main` and active releases | Medium | High | Forward-merge checklist enforced on every hotfix. |
| Liquibase change without rollback block deployed | High | High | Require rollback block or explicit exemption in release readiness. |

---

## Child Pages

| Page | Content |
| --- | --- |
| [Hotfix Operating Model Detail](05.1-hotfix-operating-model-detail.md) | Detailed hotfix scenarios, approval routes, forward-merge procedures |
| [Rollback, Fix-Forward And Reconciliation Detail](05.2-rollback-fix-forward-and-reconciliation-detail.md) | Rollback detail, fix-forward detail, branch/manifest reconciliation |
| [Liquibase Rollback Considerations](05.3-liquibase-rollback-considerations.md) | Liquibase-specific rules, expand/migrate/contract patterns |

---

## References

- Rollback decisions (D16, D17, D18): see [04 — Rollout Decision Proposals](04-rollout-decision-proposals.md)
- Ownership and approval: see [06 — Ownership and Approvals](06-ownership-and-approvals.md)
- Automation handling: see [03 — Proposed Release Automation Flow](03-proposed-release-automation-flow.md)

---

Feedback or questions? Contact the page owner or comment below.

---

## Related Pages

- [CI/CD Findings And Actions](01-cicd-findings-and-actions.md)
- [Proposed Release Automation Flow](03-proposed-release-automation-flow.md)
- [Rollout Decision Proposals](04-rollout-decision-proposals.md)
- [Ownership And Approvals](06-ownership-and-approvals.md)

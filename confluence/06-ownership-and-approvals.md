# Ownership and Approvals

| Field | Value |
| --- | --- |
| Owner | Benan Aktas |
| Status | In Review |
| Created | 2026-06-09 |
| Last updated | 2026-06-09 |
| Labels | ownership, raci, governance, cerberus, release-engineering |

---

## Summary

Automation cannot replace accountability. Without named owners, decisions are delayed and escalation is unclear. This page identifies ownership gaps, defines the repositories and change types needing classification, provides an ownership matrix template, outlines the environment readiness checklist and maps the approval points in the release lifecycle.

Open scope and ownership decisions are tracked under D20 and D21 in 04 — Rollout Decision Proposals.

---

## Ownership Gap Table

| Area | Accountable Owner Needed | Why |
|------|--------------------------|-----|
| Release readiness | Release owner | Confirms release can progress. |
| Manifest/tag validation | Release owner / platform owner | Prevents wrong artefacts. |
| Drone secrets/tokens | Platform owner | Prevents environment failures. |
| Hotfix decision | Release owner / incident lead | Avoids production drift. |
| Rollback decision | Release owner / incident lead | Ensures fast incident response. |
| Changed-chart exclusion | Release owner | Prevents hidden deployment gaps. |
| Environment readiness | Platform / environment owner | Confirms deployability. |
| Alert response | Named squad/platform owner | Ensures failed automation is handled. |

---

## Repositories to Classify

Confirm whether these are in scope for the same release process:

- Service repositories
- Helm chart repositories
- Cerberus deployment management repository
- Manifest repositories
- Secrets/config repositories
- Liquibase/database change repositories
- Runbook repositories
- Release metadata/changelog repositories

---

## Change Types to Track

| Change Type | Proposed Inclusion | Decision Needed | Notes |
|-------------|-------------------|-----------------|-------|
| Application/service code | In scope by default | Confirm repository list | — |
| Service chart changes | In scope when changed | Confirm automation/manual boundary | May remain partly manual until Drone updated. |
| Manifest updates | In scope by default | Confirm source of truth and approval point | Must match generated/expected tags. |
| Secrets/config | Per release decision | Confirm ownership and audit path | Careful handling required. |
| Liquibase/database | Per release decision | Confirm rollback/fix-forward plan | Sequencing and rollback consideration. |
| Runbook steps | Per release decision | Confirm execution owner | Manual or environment-specific operations. |

If an item is excluded from a release, the release owner must record the reason and approver.

---

## Environment Readiness Checklist

An environment existing in Kubernetes does not mean it is release-ready. Before treating a new environment as ready, confirm:

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

---

## Cross-Repository Ticket Grouping

The automation relies on consistent ticket and branch naming. Open items to confirm:

- Exact branch/ticket naming rule.
- Which repositories participate in cross-repo grouping.
- Handling when one ticket depends on another ticket/branch.
- Who can manually adjust chart entries for cross-ticket dependencies.
- Who owns secret/config updates spanning multiple repositories.

---

## Ownership Matrix

| Activity | Owner | Approver | Backup | Evidence |
|----------|-------|----------|--------|----------|
| Merge to `development` | Squad developer | Squad lead / peer | Another squad member | Merge request |
| Create release branch | Automation (TBC) | Release owner | TBC | Pipeline link |
| Create service tag | Automation / release management | Release owner | TBC | Tag + pipeline link |
| Update manifest | Automation (TBC) | Release owner | TBC | Manifest MR |
| Deploy to lower environment | Squad developer | Squad lead | Another squad member | Deployment job |
| Deploy to SIT and above | Release management | Release owner | TBC | Deployment job |
| QAT approval | QAT team | QAT lead | TBC | Approval record |
| Production release | Release management | Release owner | TBC | Release record |
| Hotfix | Squad developer (implements) | Release owner + incident lead | TBC | Hotfix MR/tag |
| Rollback | Platform/DevOps (executes) | Release owner + incident lead | TBC | Rollback record |
| Post-release reconciliation | Automation + release owner | Release owner | TBC | Merge records |

**Note:** Backup owners need confirmation with team leads. Pilot automation ownership sits with Gareth/Achilles; long-term owner TBC.

---

## Approval Points

| Point | Type | Approver |
|-------|------|----------|
| Merge to `development` | Process step | Squad lead / peer |
| Release branch cut | Automated | Release owner (oversight) |
| Tag creation | Automated | Release owner (oversight) |
| Manifest MR | Approval gate | Release owner |
| Promotion to SIT | Approval gate | Release owner |
| QAT approval | **Mandatory gate** | QAT lead |
| Production release | **Mandatory gate** | Release owner + QAT |
| Rollback/fix-forward decision | **Mandatory gate** | Release owner + incident lead |
| Post-release closure | Process step | Release owner |

The team should decide which points are mandatory and which can be automated.

---

## References

- Decision register (D20, D21): see 04 — Rollout Decision Proposals
- Hotfix approval flow: see 05 — Hotfix and Rollback
- RACI matrix detail: see 07 - Improvement Path And Maturity Observations

---

Feedback or questions? Contact the page owner or comment below.

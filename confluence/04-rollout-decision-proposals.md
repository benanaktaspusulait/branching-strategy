# Rollout Decision Proposals

```
Owner: Benan Aktas
Status: In Review
Created: 2026-06-09
Last updated: 2026-06-09
Labels: decisions, proposal, release-engineering, cerberus, governance
```

---

## Executive Summary

There are 23 open decisions that need release/process-owner confirmation before the rollout can proceed. This page consolidates the decision summary, highlights the highest-risk items and defines the cutover guardrails and approval checklist.

No decision is confirmed until the accountable owner signs off. Confirmation status is tracked per decision.

---

## Decision Summary Table

| ID | Area | Proposed Default | Status |
|----|------|------------------|--------|
| D01 | Branch baseline | `main` = production baseline after agreed cutover release. | Needs confirmation |
| D02 | Production sync | No release closed until production state reconciled to `main`. | Needs confirmation |
| D03 | Release branch creation | Auto-create from `main` for every in-scope repo. | Needs confirmation |
| D04 | Feature/hotfix branch source | Branch from relevant release branch. | Needs confirmation |
| D05 | Multiple active releases | Forward-merge fixes into later release branches before closure. | Needs owner |
| D06 | Changed-chart deployment | Deploy changed charts by default; override requires release-owner confirmation. | Needs confirmation |
| D07 | Quality gates | Human approval before higher-environment promotion and production. | Needs confirmation |
| D08 | Failure handling | Final Git/chart/reporting steps idempotent and rerunnable. | Needs confirmation |
| D09 | Alerting | Slack/email alerts for failed automation steps before production rollout. | Needs owner |
| D10 | Shared dev | Phased rollout starting with manual trigger. | Proposed |
| D11 | Ephemeral environments | Out of scope for now. | Proposed |
| D12 | New environment readiness | Ready only after values, secrets/tokens and scripts confirmed. | Needs confirmation |
| D13 | Manifest/tag validation | Fail on wrong/missing tag, mismatch, `do not deploy` unless overridden. | Needs confirmation |
| D14 | `NA` tag entries | Define when `NA` entries are allowed; prevent them hiding changes. | Needs confirmation |
| D15 | Ticket status validation | Define valid, blocked and invalid Jira statuses for release. | Needs confirmation |
| D16 | Rollback reconciliation | Reconcile `main`, manifests, records and Jira to actual production state. | Needs confirmation |
| D17 | Rollback vs fix-forward | Define decision criteria and decision owner. | Needs confirmation |
| D18 | Hotfix approval route | Define confirmer, tag timing, manifest update and forward-merge route. | Needs confirmation |
| D19 | Tag jump checker retirement | Retire after new validation green for two consecutive releases. | Proposed |
| D20 | Release scope | Define "all services" and which repos/change types are in scope. | Needs confirmation |
| D21 | Ownership matrix | Replace placeholders with named owners, approvers and backups. | Needs owner |
| D22 | Release report location | Define where reports are published and retained. | Needs confirmation |
| D23 | First rollout candidate | Confirm first release/repo set for the new process. | Needs confirmation |

---

## Highest-Risk Decisions (Confirm First)

These control release safety and should be closed before any other decisions:

1. **D01** — `main` must start from confirmed production state, not from `development`.
2. **D13** — Wrong tag, missing tag and mismatch must fail fast.
3. **D06** — Chart exclusions need release-owner confirmation + audit note.
4. **D16** — Rollback must reconcile branch, manifest, report and Jira state.
5. **D09** — Failed automation needs an alert owner and safe rerun procedure.

---

## Immediate Closure Order

| Priority | Decisions | Rationale |
|----------|-----------|-----------|
| 1st | D20, D21 | Scope and ownership must be known first. |
| 2nd | D13, D14, D15 | Before strict validation moves from dry-run to enforcement. |
| 3rd | D16, D17, D18 | Before production rollout. |
| 4th | D01, D02, D05 | Before branch cutover. |
| 5th | D08, D09, D22 | Before automation becomes the normal release path. |

---

## Cutover Guardrails

Do not cut over to `main = production` until:

- [ ] Production state is tied to a known branch/tag/manifest.
- [ ] Drone pilot is green.
- [ ] Branch protections are ready.
- [ ] Open work on `development` is inventoried.
- [ ] Hotfix and rollback reconciliation are confirmed.
- [ ] Release owner and backup owner are named.

---

## Approval Checklist

Before rollout, confirm or amend:

- [ ] Cutover release and `main` branch protection.
- [ ] Release branch naming and source branch.
- [ ] Repository scope for auto-created release branches.
- [ ] Forward-merge ownership.
- [ ] Changed-chart deployment override rule.
- [ ] Quality gates and human approval points.
- [ ] Rerun/manual intervention procedure.
- [ ] Alerting channels and owners.
- [ ] Shared dev rollout phase.
- [ ] New environment readiness checklist.
- [ ] Manifest/tag validation strictness.
- [ ] Rollback reconciliation procedure.
- [ ] Tag jump checker retirement plan.

---

## References

- Full decision register with evidence requirements: source `docs/release-decision-register.md`
- Detailed rationale: source `docs/reference/rollout-decision-proposals-detailed.md`
- Ownership model: see [06 — Ownership and Approvals](06-ownership-and-approvals.md)
- Automation detail: see [03 — Proposed Release Automation Flow](03-proposed-release-automation-flow.md)

---

Feedback or questions? Contact the page owner or comment below.

# Potential Future Architecture Review Considerations

Status: Optional review note / working reference.

## Possible ADR Topic: Controlled Release Foundation Before Future Platform Capabilities

### Context

Cerberus release state appears fragmented across Git, Drone, Helm, deployment-management, Jira, Kubernetes, secrets, Liquibase, runbooks and human approvals. If the team later seeks formal review, the near-term discussion would likely focus on release automation, stricter validation, clearer ownership, better evidence and tested recovery.

### Problem

The notes include both immediate release-control ideas and later platform-modernisation ideas. If these are treated as one approval scope, review risk increases. In a border-security context, automation must not create ungoverned deployment pathways or false confidence from incomplete release metadata.

### Options Considered

| Option | Description | Strengths | Weaknesses |
| --- | --- | --- | --- |
| A | Treat all improvement ideas as one programme. | Fast alignment, ambitious target. | Too much blast radius; unclear approvals. |
| B | Discuss controlled release-foundation work first. | Reduces risk, strengthens audit and ownership. | Slower path to platform intelligence. |
| C | Start future platform modernisation immediately. | Builds future capability early. | Data quality, ownership and governance not ready. |
| D | Do nothing beyond current process. | Avoids change risk. | Leaves current release and audit risks unresolved. |

### Suggested Position

Option B appears to be the safer discussion path: treat controlled release-foundation work separately from future platform modernisation, and gate later platform ideas on release metadata quality, ownership, security and operational evidence.

### Trade-Offs

| Trade-Off | Decision |
| --- | --- |
| Speed vs safety | Prefer controlled evolution and operational safety. |
| Automation vs human control | Automate evidence and repeatable steps; retain human approval for high-impact environments. |
| Centralisation vs resilience | Centralise visibility first; defer centralised control. |
| Innovation vs audit | Permit pilots only with audit, RBAC and source-of-truth discipline. |

### Consequences

- Release governance, validation, environment readiness and rollback become near-term priorities.
- Branch cutover is gated rather than assumed.
- Future platform capabilities are deferred until the release foundation has measurable evidence.

### Risks

| Risk | Mitigation |
| --- | --- |
| Teams expect immediate tooling rather than governance work. | Publish indicative phases and confirmation gates. |
| Automation becomes a hidden approval bypass. | Enforce SoD, approval records and manual gates. |
| Future-state architecture loses momentum. | Keep pilots on roadmap with measurable entry criteria. |
| Benefits remain unproven. | Start baseline measurement in Phase 1. |

### Potential Formal Review Questions

If this were reviewed formally, reviewers would likely want confirmation of:

1. Near-term release-foundation scope.
2. Explicit deferral of future platform trigger/action capabilities.
3. NFR and governance expectations below.
4. Conditions for moving from pilot to production rollout.

## Non-Functional Requirements

| Category | Target | Applies To | Evidence |
| --- | --- | --- | --- |
| Availability | Release automation evidence systems available during release windows. | Drone and release reports. | Availability dashboard and incident log. |
| Reliability | Release automation rerunnable for transient failures; no duplicate tags or chart updates. | Drone automation. | Idempotency tests and rerun records. |
| Security | RBAC, least privilege and no secret values in reports. | Release and reporting layers. | Access review and audit logs. |
| Auditability | Every approval, override, rerun, rollback and exclusion has a durable evidence link. | Release operating model. | Release record and report retention. |
| Performance | Standard release report generated within agreed release-window target. | Reporting. | Generation metrics. |
| Scalability | Support hundreds of services and multiple environments in release evidence and validation. | Release automation. | Capacity model and load test. |
| Data freshness | Release report data current at generation time. | Reporting. | Freshness metrics and alerts. |
| Data retention | Release evidence retained according to audit policy; minimum retention to be confirmed before rollout. | Reports, approvals, graph events. | Retention policy and purge logs. |
| Disaster recovery | Release evidence recoverable. Target RTO/RPO to be confirmed. | Reports. | DR test. |
| Compliance | Classification, SoD, privileged access, data sovereignty and change advisory alignment documented. | Whole package. | Security/architecture sign-off. |

## Possible Formal Review Conditions

| Condition | Required Before |
| --- | --- |
| Named release owner, platform owner, data owner and backups. | Rollout expansion. |
| Strict validation dry-run evidence. | Fail-fast enforcement. |
| Hotfix and rollback test completed. | Production rollout. |
| Environment readiness gate implemented. | New environment rollout. |
| Release report retention confirmed. | Drone rollout expansion. |
| Release metadata quality baseline measured. | Rollout expansion. |
| RBAC, audit and SoD confirmed. | Release automation expansion. |

## Related Pages

- [Potential Architecture Review Notes](index.md)
- [Current Understanding And Architecture Quality Observations](executive-and-quality-review.md)
- [Potential Benefits And Roadmap Notes](business-case-and-roadmap.md)
- [Summary Assessment And Open Risks](final-scorecard-and-verdict.md)

# ARB Package

Status: Completed architecture review output.

## ADR-001: Controlled Release Transformation Before Platform Intelligence

### Context

Cerberus release state is fragmented across Git, Drone, Helm, deployment-management, Jira, Kubernetes, secrets, Liquibase, runbooks and human approvals. The documentation proposes release automation, stricter validation, branch model changes, Knowledge Graph, unified control plane and future copilot capabilities.

### Problem

The package contains strong recommendations, but ARB approval would be unsafe unless immediate release controls are separated from future platform capabilities. In a border-security context, automation and intelligence layers must not create ungoverned deployment pathways or false confidence from stale metadata.

### Options Considered

| Option | Description | Strengths | Weaknesses |
| --- | --- | --- | --- |
| A | Approve all recommendations as one programme. | Fast alignment, ambitious target. | Too much blast radius; unclear approvals. |
| B | Approve controlled release-foundation work only. | Reduces risk, strengthens audit and ownership. | Slower path to platform intelligence. |
| C | Start Knowledge Graph/control plane immediately. | Builds future capability early. | Data quality and governance not ready. |
| D | Do nothing beyond current process. | Avoids change risk. | Leaves current release and audit risks unresolved. |

### Recommendation

Approve Option B: controlled release-foundation work. Treat Knowledge Graph, control plane, GitOps, progressive delivery and copilot capabilities as future options gated by release metadata quality, ownership, security and operational evidence.

### Trade-Offs

| Trade-Off | Decision |
| --- | --- |
| Speed vs safety | Prefer safety. |
| Automation vs human control | Automate evidence and repeatable steps; retain human approval for high-impact environments. |
| Centralisation vs resilience | Centralise visibility first; defer centralised control. |
| Innovation vs audit | Permit pilots only with audit, RBAC and source-of-truth discipline. |

### Consequences

- Release governance, validation, environment readiness and rollback become near-term priorities.
- Branch cutover is gated rather than assumed.
- Knowledge Graph starts as read-only pilot only after metadata quality improves.
- Control plane trigger capability is deferred.
- Copilot is restricted to evidence retrieval and explanation.

### Risks

| Risk | Mitigation |
| --- | --- |
| Teams expect immediate tooling rather than governance work. | Publish phased roadmap and approval gates. |
| Automation becomes a hidden approval bypass. | Enforce SoD, approval records and manual gates. |
| Future-state architecture loses momentum. | Keep pilots on roadmap with measurable entry criteria. |
| Benefits remain unproven. | Start baseline measurement in Phase 1. |

### Approval Required

ARB should approve:

1. Near-term release-foundation scope.
2. Explicit deferral of write-capable control plane and operational copilot.
3. NFR and governance requirements below.
4. Conditions for moving from pilot to production rollout.

## Non-Functional Requirements

| Category | Target | Applies To | Evidence |
| --- | --- | --- | --- |
| Availability | Release automation evidence systems available during release windows; Knowledge Graph pilot target 99.9% during working hours. | Drone, reports, future graph. | Availability dashboard and incident log. |
| Reliability | Release automation rerunnable for transient failures; no duplicate tags or chart updates. | Drone automation. | Idempotency tests and rerun records. |
| Security | RBAC, least privilege and no secret values in reports or graph. | All release/reporting/intelligence layers. | Access review and audit logs. |
| Auditability | Every approval, override, rerun, rollback and exclusion has a durable evidence link. | Release operating model. | Release record and report retention. |
| Performance | Standard release report and graph operational query target < 2 seconds after data is available. | Reporting / future graph. | Query metrics. |
| Scalability | Support hundreds of services and multiple environments; graph capacity model required before build. | Future graph/control plane. | Capacity model and load test. |
| Data freshness | Release report data current at generation time; graph pilot target < 5 minutes ingestion lag. | Reporting / future graph. | Freshness metrics and alerts. |
| Data retention | Release evidence retained according to audit policy; minimum retention to be approved before rollout. | Reports, approvals, graph events. | Retention policy and purge logs. |
| Disaster recovery | Release evidence recoverable; future graph rebuildable from raw event store. Target RTO/RPO to be approved. | Reports / future graph. | DR test. |
| Compliance | Classification, SoD, privileged access, data sovereignty and change advisory alignment documented. | Whole package. | Security/architecture sign-off. |

## ARB Decision Conditions

| Condition | Required Before |
| --- | --- |
| Named release owner, platform owner, data owner and backups. | Rollout expansion. |
| Strict validation dry-run evidence. | Fail-fast enforcement. |
| Hotfix and rollback test completed. | Production rollout. |
| Environment readiness gate implemented. | New environment rollout. |
| Release report retention approved. | Drone rollout expansion. |
| Metadata quality baseline measured. | Knowledge Graph pilot. |
| RBAC, audit and SoD approved. | Control plane or graph build. |
| Copilot prohibited actions documented. | Any AI assistant pilot. |

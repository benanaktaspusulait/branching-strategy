# Platform and Knowledge Graph (Future Vision)

```
Owner: Benan Aktas
Status: In Review
Created: 2026-06-09
Last updated: 2026-06-09
Labels: future-vision, platform-engineering, knowledge-graph, cerberus, phase-5-plus
```

> **⚠️ All content on this page is a long-term future option (Phase 5+). None of this is part of Phase 0–4. The immediate priority remains release operating model maturity.**

---

## Executive Summary

Once release automation, validation and ownership are stable (Phase 0–4), the organisation may evaluate platform-level capabilities: environment promotion standardisation, deployment strategy options, observability gates, GitOps readiness, a unified control plane and a deployment knowledge graph. This page summarises the vision for these capabilities — it is not an implementation plan.

---

## Environment Promotion Model

| Environment | Trigger | Gate | Approver |
|-------------|---------|------|----------|
| Squad dev/test | Developer push | Pipeline green | None (self-service) |
| Shared dev | Merge to release branch | Pipeline green + chart updated | Automated |
| SIT | Release owner decision | Report generated + changed charts identified | Release owner |
| Pre-prod / B.Val | QAT progression | SIT functional validation complete | QAT lead |
| Production | Release approval | QAT approved + rollback plan + report final | Release owner + QAT |

**Key rules:** Immutable artefact (same image through all environments); environment-specific config only; no skipping environments without explicit sign-off; every promotion audited.

---

## Deployment Strategy Options

| Strategy | Rollback Speed | Infra Cost | Complexity | Best For |
|----------|----------------|------------|------------|----------|
| Rolling update (current) | Minutes (manual) | 1x | Low | Simple services, low traffic |
| Blue-green (future option) | Instant (traffic switch) | 2x during deploy | Medium | Stateless services, critical path |

**Possible adoption path:**
- Phase 1–4: Rolling update with documented manual rollback.
- Phase 5+: Blue-green evaluation for critical services (API gateway, core services).

---

## Observability Gates

Currently, deployment validation is limited to health checks and pod startup. The future option adds observability-driven release validation:

| Metric | What It Measures | Threshold Example |
|--------|------------------|-------------------|
| Error rate (5xx) | Service errors | < 0.1% over bake period |
| Latency P99 | Slowest requests | < 500ms (or < 2x baseline) |
| Success rate | Successful requests | > 99.9% |
| Pod restarts | Post-deploy stability | 0 in bake period |
| SLO burn rate | Budget consumption rate | < 1x normal burn |

**Possible adoption path:**
- Phase 2: Document key metrics and SLO targets per service.
- Phase 5+: Pipeline step queries error rate/latency after deploy; alerts on breach.

---

## GitOps Readiness

GitOps (e.g. ArgoCD) is not in scope for Phase 0–4. Evaluation criteria for Phase 6+:

- Declarative desired state in Git.
- Automated reconciliation (actual vs desired).
- Drift detection and alerting.
- Multi-environment promotion via Git commits.
- Requires stable metadata, environment config and secrets management as prerequisites.

---

## Unified Control Plane Concept

A future operational interface that provides:

- Read-only release/deployment visibility across Git, Drone, Helm, deployment-management, Jira and Kubernetes.
- Stronger observability links from release records to post-deploy health.
- Audit and incident investigation dashboards.
- Approval visibility and workflow integration.

This would not replace existing tools — it would provide a single operational interface over them.

---

## Knowledge Graph Summary

### What It Is

A relationship intelligence layer that reads from existing systems (Git, Drone, Jira, Kubernetes, Helm, deployment-management) and models connections between releases, services, commits, images, environments, deployments, approvals and incidents.

### Domain Model

The graph connects: Release → Service Version → Commit → Image → Helm Chart → Deployment → Environment → Approval → Jira Ticket → Incident → Rollback → Configuration Change.

### Value Proposition

| Use Case | Without Graph | With Graph |
|----------|--------------|------------|
| "What was in release 5.14?" | Query 5+ systems manually | Single traversal |
| "What deployed to prod this week?" | Complex manual correlation | One query |
| Incident root cause | 30–60 min manual investigation | Seconds (graph traversal) |
| Rollback targets | Deep investigation required | Instant with constraints shown |
| DORA metrics | Not computed | Derived from graph edges automatically |
| Full audit trail | Hours of manual assembly | < 30 seconds |

### Key Principles

- **Read-model only** — never writes back to source systems.
- **Event-driven ingestion** — webhooks, pipeline events, Kubernetes watch.
- **Eventually consistent** — acceptable for queries, not for deployment control.
- **Trust model** — every fact traceable to source, freshness and confidence scored.
- **No secrets** — stores metadata about changes only (never values).

---

## Engineering Copilot Guardrails

If AI-assisted operational intelligence is evaluated in the future:

- Must be grounded in graph data (no hallucinated answers).
- Must cite sources for every recommendation.
- Must not have write access to production systems.
- Must not replace human decision-making for rollback/release approval.
- Must surface confidence levels alongside answers.

This is a long-term future option only — not under active evaluation.

---

## Platform Product Framing

If built, the knowledge graph and control plane must be treated as an internal platform product:

| Decision Area | Required Before Build |
|---------------|-----------------------|
| Product owner | Named |
| Platform engineering owner | Named |
| Data ownership per source | Defined |
| Support model and SLA | Agreed |
| Security review | Passed |
| ARB approval | Architecture pattern validated |
| Funding model | Approved |
| Adoption metrics | Defined |

**Sustainability principle:** Without ownership, support and adoption planning, the platform risks becoming another untrusted dashboard built once and abandoned.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Graph becomes stale / engineers lose trust | Automated freshness scoring; reconciliation jobs; confidence indicators. |
| Source metadata quality too poor | Complete metadata standardisation (Phase 0–1) before starting graph. |
| Teams do not adopt | Start with highest pain point (incident investigation); embed in existing workflows. |
| Over-engineering before automation stable | Gate: do not start until Drone automation green for multiple releases. |
| Security classification limits visibility | Property-level RBAC; classification-aware filtering. |
| Cost grows before value proven | Phased delivery with decision gates; clear success criteria. |

---

## Roadmap Positioning

| Phase | Capability | Status |
|-------|-----------|--------|
| 5 (Month 6–12) | Read-only release intelligence dashboard feasibility | Future evaluation |
| 5 (Month 6–12) | Event ingestion proof of concept | Future evaluation |
| 6 (12+ months) | Knowledge Graph MVP evaluation | Future evaluation |
| 6 (12+ months) | Graph architecture pattern validation | Future evaluation |
| 7 (Future) | Control Plane integration | Future option |
| 7 (Future) | Rollback assistant | Future option |
| 7 (Future) | Engineering Copilot evaluation | Future option |

---

## References

- Immediate priorities: see [07 — Transformation Programme](07-transformation-programme.md)
- Current automation proposal: see [03 — Proposed Release Automation Flow](03-proposed-release-automation-flow.md)
- Source architecture detail: `docs/platform-engineering-strategy.md`, `docs/deployment-knowledge-graph-design.md`, `docs/advanced-architecture-sections.md`

---

Feedback or questions? Contact the page owner or comment below.

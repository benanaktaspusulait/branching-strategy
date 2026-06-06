# Deployment Knowledge Graph — Operations And Technology

> Part 3 of 3. See [Part 1: Design](deployment-knowledge-graph-design.md) for context.

## 16. Security And RBAC Model

### Access Levels

| Role | Can View | Can Trigger | Can Override |
| --- | --- | --- | --- |
| Developer / Squad member | Own squad services, deployments, tickets | Nothing via graph | Nothing |
| Squad lead | Own squad + dependent services | Nothing via graph | Nothing |
| Release owner | All release scope, approvals, environment state | Deployment (via Drone) | Chart exclusion (with audit) |
| Platform engineer | All environments, infrastructure, pipeline state | Rerun failed jobs | Manual state correction (with audit) |
| QAT | Release scope, validation status, environment health | Nothing via graph | Nothing |
| Incident lead | All environments, deployment history, rollback targets | Rollback (via process) | Emergency override (with audit) |
| Audit / compliance | Read-only full history | Nothing | Nothing |

### Data Sensitivity

| Data Type | Graph Storage | Access Control |
| --- | --- | --- |
| Commit messages | Full text | Team-visible |
| Jira ticket details | Summary + status (not comments) | Team-visible |
| Image digests | Full | Platform-visible |
| Secret values | **Never stored** | N/A |
| Secret change metadata | Name + timestamp + rotatedBy | Platform + release owner |
| Environment connection strings | **Never stored** | N/A |
| Approval records | Full | Audit-visible |
| Incident details | Summary + severity + resolution | Team-visible |

---

## 17. Data Retention And Compliance

| Data Category | Retention Period | Reason |
| --- | --- | --- |
| Active release data | Indefinite (while release is active or recent) | Operational |
| Deployment history | 2 years minimum | Audit trail, incident investigation |
| Approval records | 5 years minimum | Compliance, governance |
| Incident links | 3 years minimum | Post-incident review, trend analysis |
| Raw events | 1 year (hot) + 5 years (cold/archive) | Replay, recomputation, legal |
| DORA metrics | Indefinite (aggregated) | Trend reporting |
| Deleted/archived services | Retained with archived flag | Audit continuity |

### GDPR / Data Protection

- Personal data (names in approvals, commit authors) should follow data retention policies.
- Graph should support pseudonymisation if required.
- Right-to-erasure may require replacing person nodes with anonymised identifiers after retention period.

---

## 18. Integration Points

### Git Integration

| Event | Webhook | Data Extracted |
| --- | --- | --- |
| Push | `push` event | Commits, messages, authors, ticket references |
| Tag | `tag` event | ServiceVersion creation, release branch link |
| MR merge | `merge_request` event | Feature/hotfix merged into release branch |
| Branch creation | `branch` event | Release branch lifecycle |

### Jira Integration

| Event | Webhook | Data Extracted |
| --- | --- | --- |
| Ticket updated | `jira:issue_updated` | Status change, GitLab tag field, release label |
| Release label added | Custom webhook / poll | Ticket included in release scope |
| Approval recorded | Workflow transition webhook | QAT or release owner approval |

### Drone Integration

| Event | Webhook | Data Extracted |
| --- | --- | --- |
| Build started | `build` event | Pipeline execution start |
| Build completed | `build` event | Image built, tests passed, scans completed |
| Deployment triggered | `deploy` event (or promote) | Deployment to environment |
| Pipeline failed | `build` event | Failure with step information |

### Helm Integration

| Event | Source | Data Extracted |
| --- | --- | --- |
| Chart published | Registry webhook / poll | Chart name, version, app version |
| Helm release installed/upgraded | Kubernetes watch or Drone event | Helm revision, values used |

### Kubernetes Integration

| Event | Source | Data Extracted |
| --- | --- | --- |
| Deployment created/updated | K8s watch API | Image, replicas, status, namespace |
| Pod health change | K8s watch API | Ready/not-ready, restart count |
| HPA scaling | K8s watch API | Resource pressure signals |

### Cerberus Deployment-Management Integration

| Event | Source | Data Extracted |
| --- | --- | --- |
| Chart version updated | Git webhook on deployment-management repo | Intended version per environment |
| Manifest MR created | GitLab MR webhook | Release candidate manifest state |
| Manifest MR merged | GitLab MR webhook | Deployment intent confirmed |

### Observability Integration

| Event | Source | Data Extracted |
| --- | --- | --- |
| SLO breach | Prometheus alertmanager / Datadog webhook | Health degradation signal |
| Error rate spike | Custom alert rule | Post-deployment health signal |
| Latency anomaly | Custom alert rule | Performance regression signal |

### Secret Management Integration

| Event | Source | Data Extracted |
| --- | --- | --- |
| Secret rotated | Secrets management event (metadata only) | Which secret, which environment, when, by whom |
| Secret access granted | GPG/git-crypt event | Who gained access to which environment secrets |

---

## 19. Recommended Technology Options

### Graph Database

| Option | Strengths | Weaknesses | Fit |
| --- | --- | --- | --- |
| **Neo4j** | Mature, Cypher query language, rich tooling, strong community. | Operational overhead (self-hosted) or cost (Aura cloud). | Best for complex relationship queries and visualisation. |
| **Amazon Neptune** | Managed, scales well, supports both property graph and RDF. | Less mature query tooling, AWS lock-in. | Good if already AWS-native. |
| **PostgreSQL + Apache AGE** | Reuses existing Postgres skills, no new infrastructure. | Less performant for deep traversals, less mature graph tooling. | Good for start-small approach. |
| **Relational (PostgreSQL only)** | Simple, well-understood, existing team skills. | Deeply nested queries become expensive and hard to maintain. | Suitable for Phase 1 (simple joins) but limits future complex queries. |

### Neo4j vs Relational Comparison

| Aspect | Neo4j (Graph) | PostgreSQL (Relational) |
| --- | --- | --- |
| Query: "What is in release X?" | Single Cypher traversal | 3-5 JOINs |
| Query: "Trace incident to root cause" | Variable-depth traversal (fast) | Recursive CTE (complex, slow at depth) |
| Query: "Find all services affected by commit" | Pattern match across relationships | Multi-table JOIN with ticket cross-reference |
| Schema changes | Add labels/relationships without migration | ALTER TABLE, migration scripts |
| Visualisation | Built-in graph browser | Requires custom UI |
| Team familiarity | New skill (Cypher) | Existing skill (SQL) |
| Infrastructure | New system to operate | Existing PostgreSQL available |
| Recommendation | **Best for Phase 3+ when complex queries justify cost** | **Best for Phase 1-2 as MVP with simpler queries** |

### Event Bus

| Option | Strengths | Fit |
| --- | --- | --- |
| **Apache Kafka** | Durable, replayable, well-suited for event sourcing. | Best for high-volume, multi-consumer scenarios. |
| **NATS** | Lightweight, fast, easy to operate. | Good for lower volume or simpler setups. |
| **AWS SQS/SNS** | Managed, no operational overhead. | Good if AWS-native. |
| **Redis Streams** | Fast, simple, already common in stacks. | Good for MVP / start-small. |

### Search

| Option | Fit |
| --- | --- |
| **Elasticsearch / OpenSearch** | Full-text search across commit messages, tickets, reports. |
| **PostgreSQL full-text** | Simpler but less capable for fuzzy/ranked search. |

### UI / Dashboard

| Option | Fit |
| --- | --- |
| **Custom React/Next.js dashboard** | Full control, tailored to workflows. |
| **Backstage plugin** | Integrates with existing developer portal if adopted. |
| **Grafana (for metrics only)** | Good for DORA metrics visualisation, not for graph exploration. |

### Backstage Integration Options

If Backstage is adopted as the internal developer portal:

1. **Backstage catalog entity provider:** Sync services, squads and ownership from the knowledge graph into the Backstage catalog.
2. **Backstage plugin for release view:** Custom plugin that queries the GraphQL API to show release scope, environment state and deployment history within Backstage.
3. **Backstage TechDocs integration:** Generate release reports from the graph and publish as TechDocs.
4. **Backstage scaffolder integration:** Use graph ownership data to pre-populate scaffolder templates for new services.

Backstage is a presentation layer option, not a replacement for the knowledge graph itself.

---

## 20. Incremental Implementation Roadmap

| Phase | Timeframe | Scope | Technology | Outcome |
| --- | --- | --- | --- | --- |
| 0 | After release automation is stable | Define schema, agree query requirements | Design only | Documented graph schema and priority queries |
| 1 | Month 9-12 | Core entities: Release, ServiceVersion, Deployment, Environment | PostgreSQL + simple relationships | Basic "what is deployed where?" query |
| 2 | Month 12-15 | Add Jira tickets, commits, approvals | PostgreSQL + full-text search | "What is in release X?" with ticket cross-reference |
| 3 | Month 15-18 | Add Liquibase, config changes, health signals | Migrate to Neo4j if query complexity justifies | Incident investigation support |
| 4 | Month 18-24 | Add incident linking, rollback decision support | Neo4j + GraphQL API | Rollback safety assessment from graph |
| 5 | Month 24+ | DORA metrics derivation, full audit export, Backstage integration | Full platform | Complete deployment intelligence platform |

### Build vs Buy Analysis

| Approach | Pros | Cons | Recommendation |
| --- | --- | --- | --- |
| **Build custom** | Exact fit for Cerberus toolchain; full control; no vendor lock-in. | Development effort; maintenance burden; requires graph/platform expertise. | Recommended for core graph and API. |
| **Buy platform (e.g. Cortex, OpsLevel, Humanitec)** | Fast start; managed; feature-rich. | May not fit Cerberus toolchain; vendor lock-in; cost; may not support Drone/GitLab/Cerberus specifics. | Evaluate for UI/dashboard layer only. |
| **Adopt Backstage + custom plugins** | Open-source; extensible; community support; developer portal benefits. | Still requires custom plugins for graph queries; not a graph database. | Recommended as UI layer on top of custom graph. |
| **Hybrid: Custom graph + Backstage UI + managed graph DB** | Best of both; focused effort on domain logic; managed infrastructure. | Integration complexity; multiple vendors. | Recommended target architecture. |

**Recommended approach:** Build the graph model and ingestion layer custom (it is domain-specific). Use managed infrastructure (Neo4j Aura or Amazon Neptune) to reduce operational burden. Use Backstage or custom UI for the presentation layer.

---

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Graph becomes stale or inaccurate | Teams lose trust and stop using it. | Automated data quality checks; reconciliation against live state. |
| Over-engineering before automation is stable | Delays the immediate release improvement work. | Do not start Phase 1 until Drone automation is green for multiple releases. |
| Schema becomes too rigid | New entity types or relationships are hard to add. | Use property graph model (inherently flexible); avoid over-normalisation. |
| Performance degrades with scale | Slow queries discourage use. | Index frequently-traversed relationships; paginate results; cache common queries. |
| Security: graph exposes sensitive deployment data | Unauthorised access to production topology. | RBAC from day one; never store secret values; audit all queries. |
| Team lacks graph database skills | Implementation quality suffers. | Start with PostgreSQL (Phase 1-2); train team; migrate to Neo4j when justified. |

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Correct Approach |
| --- | --- | --- |
| Making the graph a write-through deployment tool | Creates a second source of truth; bypasses existing controls. | Graph is read-only; triggers go through existing Drone/Helm pipelines. |
| Ingesting everything from day one | Overwhelming complexity; poor data quality early on. | Start with core entities; add progressively as sources mature. |
| Building the graph before release metadata is standardised | Garbage in, garbage out. | Complete validation and metadata standardisation (Phase 1-2 of transformation) first. |
| Replacing Jira/Git/Drone instead of reading from them | Massive scope; team resistance; fragmentation risk. | Graph reads from existing tools; never replaces them. |
| Custom UI before API is stable | UI becomes tightly coupled to unstable schema. | API-first; UI consumes stable GraphQL/REST endpoints. |
| Ignoring data retention | Legal/compliance risk; storage cost explosion. | Define retention policy before ingesting historical data. |

---

## Summary

The Deployment Knowledge Graph is the intelligence layer that sits above the Unified Deployment and Release Control Plane. While the control plane provides operational workflow (approve, deploy, rollback), the knowledge graph provides understanding (what happened, why, what is connected, what is the impact).

It should be built incrementally, starting only after the immediate release automation, validation and ownership work is stable. The recommended path is:

1. Stabilise release automation (current transformation Phase 0-4).
2. Define graph schema and priority queries (design phase).
3. Build MVP with PostgreSQL (simple relationships, core entities).
4. Migrate to Neo4j when query complexity justifies it.
5. Add incident, rollback and DORA intelligence progressively.
6. Consider Backstage integration for developer-facing UI.

> **This is a long-term architectural investment. It creates compounding value as more events are ingested and more relationships are traversed. But it only works if the underlying data (tags, manifests, tickets, approvals) is reliable — which is why the immediate transformation must come first.**

---

← [Platform engineering strategy](platform-engineering-strategy.md) | → [README](../README.md)

---

← [Part 2: Implementation](deployment-knowledge-graph-implementation.md) | → [Business case and governance](deployment-knowledge-graph-business-case.md)

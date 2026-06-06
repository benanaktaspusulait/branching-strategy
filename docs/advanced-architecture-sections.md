# Advanced Architecture Sections

> **Status:** Long-term future-state architecture. Not part of the initial release automation rollout (Phases 0–4). These sections describe capabilities for Phase 5+ evaluation only.

---

## Cerberus Current Architecture Mapping

This section explains how the proposed control plane and knowledge graph relate to the existing Cerberus ecosystem. The Knowledge Graph does not replace these systems. It correlates their metadata and exposes relationship intelligence across the estate.

### Component Mapping

| Current Component | Current Role | Knowledge Graph / Control Plane Relationship |
| --- | --- | --- |
| GitLab | Source code, branches, tags, merge requests | Source of commit, tag and branch events. Graph ingests metadata (not code). |
| Jira | Work items, release labels, ticket status, approvals | Source of release scope, ticket metadata and approval records. |
| Drone CI/CD | Build, test, scan, deploy automation | Source of pipeline execution events, build artefact metadata. |
| Helm | Chart packaging, templating, deployment mechanism | Source of chart version and deployment execution metadata. |
| Cerberus deployment-management | Release intent, manifests, chart versions | Source of deployment intent and manifest state (canonical deployment truth). |
| Kubernetes | Runtime state, pods, deployments, namespaces | Source of actual deployed state and health signals. |
| Elasticsearch / OpenSearch | Log aggregation, search, operational data | Source of log-based health and error signals. |
| FDP internal processing | Data processing, rules evaluation | Source of processing completion events and data pipeline state. |
| Kafka | Event streaming, message bus | Ingestion transport layer — carries events from sources to graph. |
| Athena / analytical querying | Ad hoc analytical queries on data lake | Potential consumer of graph-derived metrics and audit data. |
| Liquibase | Database schema migrations | Source of migration execution events and rollback block metadata. |
| Secrets (Git-crypt / Drone) | Secret management and injection | Source of secret change metadata (never values). |
| Observability tools | Monitoring, alerting, SLO tracking | Source of health signals and post-deployment validation data. |
| Runbooks | Operational procedures | Source of operational context links (referenced, not ingested in full). |

### Architecture Relationship Diagram

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart TD
  subgraph SOURCES["Existing Cerberus Systems (Sources of Truth)"]
    GL["GitLab"]:::source
    JR["Jira"]:::source
    DR["Drone CI/CD"]:::source
    HM["Helm"]:::source
    DM["Deployment\nManagement"]:::source
    K8["Kubernetes"]:::source
    KF["Kafka"]:::source
    EL["Elastic /\nOpenSearch"]:::source
    FDP["FDP"]:::source
    LQ["Liquibase"]:::source
    SEC["Secrets"]:::source
    OBS["Observability"]:::source
  end

  subgraph INTELLIGENCE["Future Intelligence Layer"]
    KG["Knowledge Graph\n(relationship intelligence)"]:::graph
    CP["Unified Control Plane\n(operational interface)"]:::platform
    API["GraphQL / REST APIs"]:::api
  end

  subgraph CONSUMERS["Consumers"]
    DASH["Release Dashboard"]:::consumer
    INC["Incident Investigation"]:::consumer
    AUDIT["Audit / Compliance"]:::consumer
  end

  GL & JR & DR & HM & DM & K8 --> KF
  KF --> KG
  EL & FDP & LQ & SEC & OBS --> KG
  KG --> API
  API --> CP
  CP --> DASH & INC & AUDIT

  classDef source fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef graph fill:#00695c,stroke:#004d40,color:#fff,font-weight:bold
  classDef platform fill:#6a1b9a,stroke:#4a148c,color:#fff,font-weight:bold
  classDef api fill:#f57c00,stroke:#e65100,color:#fff,font-weight:bold
  classDef consumer fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
```

### Key Principle

> The Knowledge Graph is a read-model. It does not write back to source systems. It does not replace any existing tool. Its value is in connecting data that already exists but is currently siloed.

---

## Event-Driven Knowledge Graph Ingestion Model

The graph should be populated through a mixture of ingestion patterns:

- **Webhooks** — real-time events from GitLab, Jira, Drone
- **Pipeline-emitted events** — custom Drone steps publishing structured events
- **Kubernetes watch events** — deployment and pod state changes
- **Scheduled reconciliation jobs** — periodic full-state comparison against sources
- **Backfill jobs** — historical data import for initial population
- **Manual operational events** — rollback decisions, override approvals, manual deployments

### Ingestion Flow

```text
Source system event
  → Event gateway
  → Kafka topic
  → Validation and enrichment
  → Entity resolver
  → Graph update
  → Search index update
  → Audit event stored
```

### Ingestion Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#5f6368'}}}%%

flowchart LR
  SRC["Source Systems\nGitLab / Jira / Drone\nK8s / Helm / FDP"]:::source
  GW["Event Gateway"]:::gateway
  KAFKA["Kafka Topics"]:::kafka
  VAL["Validation +\nEnrichment"]:::process
  RES["Entity Resolver"]:::process
  GRAPH["Knowledge Graph"]:::graph
  SEARCH["Search Index"]:::search
  AUDIT["Immutable\nAudit Store"]:::audit
  API["GraphQL /\nREST APIs"]:::api
  UI["Control Plane /\nDashboard"]:::ui

  SRC --> GW --> KAFKA --> VAL --> RES --> GRAPH
  RES --> SEARCH
  RES --> AUDIT
  GRAPH --> API --> UI
  SEARCH --> API

  classDef source fill:#1565c0,stroke:#0d47a1,color:#fff,font-weight:bold
  classDef gateway fill:#455a64,stroke:#37474f,color:#fff,font-weight:bold
  classDef kafka fill:#f57c00,stroke:#e65100,color:#fff,font-weight:bold
  classDef process fill:#7b1fa2,stroke:#4a148c,color:#fff,font-weight:bold
  classDef graph fill:#00695c,stroke:#004d40,color:#fff,font-weight:bold
  classDef search fill:#c62828,stroke:#b71c1c,color:#fff,font-weight:bold
  classDef audit fill:#455a64,stroke:#37474f,color:#fff,font-weight:bold
  classDef api fill:#f57c00,stroke:#e65100,color:#fff,font-weight:bold
  classDef ui fill:#2e7d32,stroke:#1b5e20,color:#fff,font-weight:bold
```

### Event Types

| Event Type | Source | Example Payload | Graph Update |
| --- | --- | --- | --- |
| `commit.pushed` | GitLab webhook | Commit SHA, message, author, branch, ticket refs | Create/update Commit node, link to Repository and JiraTicket |
| `tag.created` | GitLab webhook | Tag name, commit SHA, branch | Create ServiceVersion node, link to Commit |
| `image.published` | Image registry webhook | Image name, tag, digest, built-at | Create Image node, link to ServiceVersion |
| `chart.published` | Helm registry event | Chart name, version, app version | Create HelmChart node, link to ServiceVersion |
| `manifest.updated` | deployment-management webhook | Chart versions changed, target environment | Update deployment intent, link chart versions to Release |
| `deployment.started` | Drone / K8s event | Service, version, environment, job ID | Create Deployment node (status: in-progress) |
| `deployment.succeeded` | K8s watch / Drone | Service, version, environment, pod status | Update Deployment status to succeeded |
| `deployment.failed` | K8s watch / Drone | Service, version, environment, error | Update Deployment status to failed, create alert |
| `ticket.updated` | Jira webhook | Ticket key, status, release label, GitLab tag field | Create/update JiraTicket node, link to Release |
| `approval.recorded` | Jira / workflow webhook | Approver, type, timestamp, release | Create Approval node, link to Release and Person |
| `incident.created` | Incident system webhook | Incident ID, severity, affected services | Create Incident node, link to Service and Deployment |
| `rollback.executed` | Drone / manual event | From version, to version, decided-by, environment | Create Rollback node, link Deployments |
| `liquibase.executed` | Pipeline event | Changeset ID, author, filename, rollback block | Create LiquibaseChangeset node, link to Commit |
| `secret.rotated` | Secrets management event | Secret name, environment, rotated-by (no value) | Create SecretChange node (metadata only) |
| `fdp.processing.completed` | FDP event / Kafka | Processing job ID, input/output, status, duration | Create FDPProcessingEvent node, link to Service |

### Ingestion Quality Principles

| Principle | Description |
| --- | --- |
| **Idempotency** | Processing the same event twice must produce the same graph state. |
| **Replayability** | All raw events are retained in the immutable audit store. The graph can be rebuilt from scratch by replaying the event log. |
| **Ordering** | Events are partitioned by entity key (e.g., service name) to preserve causal ordering within an entity. Cross-entity ordering is eventually consistent. |
| **Deduplication** | Events carry a unique event ID. The entity resolver rejects duplicates. |
| **Schema versioning** | Events carry a schema version field. Processors handle multiple versions during migration. |
| **Event retention** | Raw events retained for minimum 2 years in cold storage. Hot events retained for 90 days. |
| **Failed event handling** | Failed events route to a dead-letter queue. Alerting fires if DLQ depth exceeds threshold. Manual review and resubmission supported. |
| **Dead-letter queues** | Per-topic DLQ with alerting. Operations team reviews and resubmits or discards with audit note. |
| **Reconciliation jobs** | Scheduled weekly per source system. Compares graph state against source, flags discrepancies, auto-corrects where safe. |

---

## Data Freshness And Trust Model

### Freshness Expectations

| Source | Ingestion Method | Expected Freshness | Trust Level | Reconciliation Method |
| --- | --- | --- | --- | --- |
| GitLab | Webhook | < 60 seconds | High (authoritative for code) | Weekly branch/tag reconciliation |
| Jira | Webhook | < 60 seconds | High (authoritative for work items) | Weekly ticket status sweep |
| Drone | Webhook | < 60 seconds | High (authoritative for builds) | Daily pipeline completion check |
| Kubernetes | Watch API | < 30 seconds | High (authoritative for runtime) | Hourly state snapshot comparison |
| deployment-management | Webhook (Git) | < 5 minutes | High (authoritative for intent) | Daily manifest hash comparison |
| Helm registry | Webhook / poll | < 5 minutes | High (authoritative for charts) | Weekly chart version listing |
| Image registry | Webhook / poll | < 5 minutes | High (authoritative for images) | Weekly image digest listing |
| Liquibase | Pipeline event | On execution only | Medium (may miss manual runs) | Weekly DB schema comparison |
| Secrets metadata | Event / poll | < 15 minutes | Medium (metadata only) | Monthly secret inventory check |
| Observability | Alert webhook / poll | < 5 minutes | Medium (health signals lag) | Continuous (alert-driven) |
| FDP processing | Kafka event | < 5 minutes | Medium | Daily processing log reconciliation |

### Node And Relationship Metadata

Every graph node and relationship should carry:

| Field | Purpose |
| --- | --- |
| `source_system` | Which system provided this data. |
| `source_identifier` | The ID in the source system (for cross-reference). |
| `source_timestamp` | When the source system recorded the change. |
| `ingestion_timestamp` | When the graph ingested the event. |
| `last_verified_timestamp` | When reconciliation last confirmed this data against the source. |
| `confidence_score` | How confident the graph is in this data (1.0 = recently verified, 0.5 = stale, 0.0 = unverified). |
| `reconciliation_status` | `verified` / `stale` / `conflict` / `unreconciled` |

### Trust Principle

> A graph answer must be explainable. Users must be able to see where each fact came from, when it was last updated and whether it has been reconciled against the source system.

If a graph answer has low confidence or stale data, the UI must surface this clearly rather than presenting uncertain data as authoritative.

---

## Platform Product Framing

The Knowledge Graph and Control Plane should be treated as an internal platform product, not a one-off tool or project deliverable. Without ownership, support and adoption planning, the platform risks becoming another untrusted dashboard.

### Product Decisions Required

| Product Area | Decision Needed |
| --- | --- |
| Product owner | Who has product authority over features, priorities and roadmap? |
| Platform engineering owner | Who operates, monitors and maintains the infrastructure? |
| Data ownership | Who is responsible for data accuracy per source system? |
| Support model | How are issues reported and resolved? SLA? |
| Onboarding model | How do new teams/services get added to the graph? |
| Funding model | Is this centrally funded or charged back to consuming teams? |
| Security review | Has the platform passed security architecture review? |
| ARB approval | Has the architecture pattern been approved? |
| Operational support | Who is on-call for graph platform issues? |
| Service catalogue integration | Is the graph registered as a platform service? |
| Adoption metrics | How is usage measured and reported? |

### Sustainability Principle

> Without ownership, support and adoption planning, the platform risks becoming another untrusted dashboard that is built once and abandoned. Treat it as a product with a backlog, users, metrics and a funded team.

---

## Additional Risks

These risks apply to the Knowledge Graph and future control-plane capabilities:

| Risk | Why It Matters | Mitigation |
| --- | --- | --- |
| Graph becomes stale | Engineers lose trust; stale data is worse than no data. | Automated freshness scoring; reconciliation jobs; confidence indicators in UI. |
| Wrong relationships lead to wrong operational conclusions | Incorrect dependency or ownership links could misdirect incident response. | Reconciliation against source systems; human review for high-confidence relationships; flag unverified links. |
| Graph technology choice is challenged by ARB | Neo4j or selected product may not pass procurement or security review. | Present architecture pattern, not product choice. Validate pattern first; select product later. |
| Source systems have poor metadata quality | Graph quality depends on source quality. Garbage in, garbage out. | Complete metadata standardisation (Phase 0-1 transformation) before starting graph. |
| Teams do not adopt the platform | Investment wasted if engineers continue using existing manual methods. | Demonstrate value via incident response (highest pain); embed in existing workflows; avoid mandating adoption. |
| Security classification prevents broad visibility | Defence sector restrictions may limit who can see deployment topology. | Property-level RBAC; classification-aware query filtering; cleared personnel for admin roles. |
| Event ordering creates inconsistent state | Out-of-order events may create temporary graph inconsistencies. | Partition by entity key; use event timestamps; reconciliation corrects drift. |
| Manual actions are not captured | Decisions made outside automated systems (Slack, meetings) leave gaps. | Provide simple manual event submission; integrate with operational tooling where possible. |
| Cost grows before value is proven | Infrastructure and team costs accumulate during build phases. | Phased delivery with decision gates; Phase 1 time-boxed; clear success criteria before expanding. |

---

## Technology Decision Clarification

> **The decision at this stage is to validate the graph architecture pattern, not to approve a specific graph database product.**

The recommendation is to adopt a graph-based architecture for engineering intelligence. Neo4j is a candidate implementation option, alongside Amazon Neptune, JanusGraph and PostgreSQL-based alternatives (e.g., Apache AGE).

### ADR Status

| Field | Value |
| --- | --- |
| Decision | Adopt a graph-based architecture pattern for engineering intelligence. |
| Status | **Proposed** |
| Decision type | Architecture direction |
| Technology selection | **Not yet approved** — product evaluation follows pattern validation. |
| Evaluation criteria | Query expressiveness, operational maturity, security model, managed options, cost, team skills. |
| Next step | Validate the architecture pattern through Phase 5 proof of concept before selecting a specific product. |

---

## Updated Roadmap Positioning

These capabilities map to later transformation phases only:

| Phase | Capability | Status |
| --- | --- | --- |
| Phase 5 (Month 6-12) | Read-only release intelligence dashboard feasibility | Future evaluation |
| Phase 5 (Month 6-12) | Event ingestion proof of concept | Future evaluation |
| Phase 6 (12+ months) | Knowledge Graph MVP evaluation | Future evaluation |
| Phase 6 (12+ months) | Graph architecture pattern validation | Future evaluation |
| Phase 6 (12+ months) | Source-system reconciliation model | Future evaluation |
| Phase 7 (Future) | Control Plane integration | Future option |
| Phase 7 (Future) | Rollback assistant | Future option |
| Phase 7 (Future) | Approval visibility | Future option |
| Phase 7 (Future) | Metrics and audit reporting through platform | Future option |

> **None of these items are part of Phase 0–4.** The immediate priority remains release operating model maturity.

---

## Final Executive Position

The immediate transformation remains release operating model maturity:

- Make release state visible, repeatable, validated, owned and auditable.
- Move release automation into Drone.
- Enforce strict validation.
- Assign named ownership.
- Document and test rollback.
- Cut over to `main = production` only when the above is proven.

The long-term platform vision is a unified deployment intelligence capability:

- The **Knowledge Graph** is the relationship intelligence layer.
- The **Control Plane** is the operational interface layer.

The recommended next step is not to build everything, but to validate the operating model, metadata quality and event sources first. The graph is only valuable if the underlying data is reliable — which is why the immediate transformation must come first.

## Related Pages

- [Transformation Programme](transformation-programme.md)
- [Deployment Knowledge Graph — Implementation And Workflows](deployment-knowledge-graph-implementation.md)
- [Architecture Diagrams](architecture-review/architecture-diagrams.md)
- [Criticality Challenge Review](architecture-review/criticality-challenge-review.md)

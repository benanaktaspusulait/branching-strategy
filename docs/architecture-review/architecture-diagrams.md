# Architecture Diagrams

Status: Completed architecture review output.

## Current State: Systems And Dependencies

```mermaid
flowchart TD
  DEV["Engineering Teams"] --> GIT["Git branches / tags"]
  DEV --> JIRA["Jira tickets / release metadata"]
  GIT --> DRONE["Drone CI/CD"]
  DRONE --> IMG["Container images"]
  DRONE --> HELM["Helm packages"]
  HELM --> DM["Deployment Management manifests"]
  DM --> K8S["Kubernetes environments"]
  JIRA --> REPORT["Release reports / changelog"]
  SECRETS["Git-crypt / Drone secrets"] --> K8S
  LIQ["Liquibase changes"] --> DB["Databases"]
  RUNBOOK["Manual runbooks"] --> K8S
  OBS["Observability tools"] --> OPS["Release / incident decisions"]
  K8S --> OBS
```

## Future State: Knowledge Graph And Control Plane

```mermaid
flowchart TD
  subgraph Sources["Sources of truth"]
    GIT["Git"]
    JIRA["Jira"]
    DRONE["Drone"]
    DM["Deployment Management"]
    K8S["Kubernetes"]
    HELM["Helm / registries"]
    OBS["Observability"]
    LIQ["Liquibase"]
  end

  EVT["Validated event ingestion"] --> KG["Deployment Knowledge Graph"]
  Sources --> EVT
  KG --> API["GraphQL / REST APIs"]
  API --> CP["Unified Control Plane - read-only first"]
  CP --> DASH["Release dashboard"]
  CP --> AUDIT["Audit reports"]
  CP --> INC["Incident investigation"]
  CP -. future gated .-> DRONE
```

## Event Ingestion Model

```mermaid
flowchart LR
  SRC["Source event"] --> GATE["Event gateway"]
  GATE --> TOPIC["Kafka / event topic"]
  TOPIC --> VAL["Validate schema + auth"]
  VAL --> ENRICH["Enrich with release metadata"]
  ENRICH --> RESOLVE["Resolve entity identity"]
  RESOLVE --> GRAPH["Update graph"]
  GRAPH --> INDEX["Update search index"]
  GRAPH --> AUDIT["Store audit event"]
  VAL --> DLQ["Dead-letter queue"]
```

## Release Intelligence Architecture

```mermaid
flowchart TD
  REL["Release"] --> TICKETS["Jira tickets"]
  REL --> TAGS["Git tags"]
  TAGS --> BUILDS["Drone builds"]
  BUILDS --> ARTEFACTS["Images / Helm charts"]
  ARTEFACTS --> MANIFEST["Deployment manifest"]
  MANIFEST --> ENV["Environment state"]
  ENV --> HEALTH["Health signals"]
  REL --> APPROVALS["Approvals / overrides"]
  REL --> REPORT["Release report"]
  HEALTH --> REPORT
  APPROVALS --> REPORT
```

## Engineering Copilot Architecture

```mermaid
flowchart TD
  USER["Engineer / release owner"] --> UI["Copilot UI"]
  UI --> POLICY["Policy and permission check"]
  POLICY --> RAG["Retrieval layer"]
  RAG --> KG["Knowledge Graph"]
  RAG --> DOCS["Approved docs / runbooks"]
  RAG --> EVIDENCE["Evidence bundle"]
  EVIDENCE --> LLM["LLM summarisation"]
  LLM --> ANSWER["Answer with citations and confidence"]
  ANSWER -. prohibited .-> ACTION["No deploy / approve / rollback actions"]
```

## Data Trust And Governance Model

```mermaid
flowchart TD
  SRC["Source systems"] --> QUALITY["Quality checks"]
  QUALITY --> FRESH["Freshness SLO"]
  QUALITY --> COMPLETE["Completeness SLO"]
  QUALITY --> ACCURATE["Accuracy sampling"]
  FRESH --> TRUST["Trust score"]
  COMPLETE --> TRUST
  ACCURATE --> TRUST
  TRUST --> CONSUME["Dashboards / audits / copilot"]
  GOVERN["Data owners + stewards"] --> QUALITY
  SECURITY["RBAC + classification"] --> CONSUME
  AUDIT["Access audit log"] --> GOVERN
```

## Related Pages

- [Architecture Review Package](index.md)
- [Architecture Alignment And Enterprise Architecture Review](alignment-and-enterprise-architecture-review.md)
- [Criticality Challenge Review](criticality-challenge-review.md)
- [Advanced Architecture Sections](../advanced-architecture-sections.md)

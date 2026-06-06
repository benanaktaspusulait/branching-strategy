# Architecture Diagrams

Status: Optional review note / working reference.

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

## Related Pages

- [Potential Architecture Review Notes](index.md)
- [Architecture Alignment Considerations](alignment-and-enterprise-architecture-review.md)
- [Criticality Challenge Notes](criticality-challenge-review.md)

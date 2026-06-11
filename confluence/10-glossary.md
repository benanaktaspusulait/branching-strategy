# Glossary

| Field | Value |
| --- | --- |
| Owner | Benan Aktas |
| Status | In Review |
| Created | 2026-06-09 |
| Labels | glossary, reference, cerberus, release-engineering |

---

## Summary

Key terms used across the Cerberus release engineering page set.

---

## Terms

| Term | Definition |
| --- | --- |
| Release branch | A branch created from `main` (or `development` in the current model) to collect and stabilise changes for a planned release. |
| Temporary tag | A tag generated on a feature/hotfix branch to identify the current build candidate. Replaced by the full release tag on merge. |
| Full release tag | The definitive tag created on the release branch that triggers releasable artefact creation (image + Helm chart). |
| Manifest | A file in the deployment-management repository that declares the intended chart versions for an environment. |
| Cerberus charts | Helm chart packages in the Cerberus deployment-management structure, grouping services into deployable units. |
| MMA Helm repo | Repository containing Helm deployment scripts for packaging, linting, templating, uploading and deployment tasks. |
| Deployment management | The Cerberus deployment-management repository — the source of deployment intent and manifest state. |
| Shared dev | A shared development environment used for cross-team integration testing, separate from squad dev/test environments. |
| SIT | System Integration Testing environment. Functional validation by release owner and QAT. |
| B.Val | Business Validation environment. Production-like environment for final pre-production testing. |
| QAT | Quality Assurance and Testing. The team responsible for functional validation before production release. |
| Fix-forward | Resolving a production issue by deploying a new corrective release rather than reverting to a previous version. |
| Rollback | Reverting an environment to a previous known-good deployment version using Helm history or redeployment. |
| Release owner | The named person accountable for a specific release cycle — readiness, approvals, go/no-go and closure. |
| Changed-chart deployment | Deploying only the charts that have changes in the current release, rather than all charts. |
| Feature flag | A configuration value controlling whether a deployed feature is active. May be deploy-time (values file) or runtime (dynamic). |
| Environment readiness gate | A pre-deployment check confirming values, secrets, tokens, access and dependencies are in place. |
| Drone | The CI/CD pipeline system used for build, test, scan and deployment automation. |
| Helm | Kubernetes package manager. Used to template, package and deploy services as chart artefacts. |
| Liquibase | Database schema migration tool. Changesets are applied once and tracked by checksum. |
| Umbrella chart | A Helm chart that groups multiple service charts together for coordinated deployment. |
| RACI | Responsibility matrix: Responsible, Accountable, Consulted, Informed. Used to assign release activity ownership. |
| Forward-merge | Merging fixes from an earlier active release branch into later active release branches to prevent drift. |
| Reconciliation | The process of aligning `main`, manifests, release records and Jira after a release or rollback completes. |
| Immutable artefact | A container image or Helm chart that is built once and promoted unchanged through all environments. |

---

## Related Pages

- [Main Assessment And Reading Order](00-parent-release-engineering-assessment.md)
- [Page Coverage Index](09-page-coverage-index.md)

---

Feedback or questions? Contact the page owner or comment below.

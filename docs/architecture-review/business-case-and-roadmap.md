# Business Case And Recommended Roadmap

Status: Tasks 19, 20, 21 and 22 output from `TODO-ARCHITECTURE-REVIEW-FROM-NOTES.md`

## Benefits Realisation Table

| Benefit | Current State | Target State | KPI | Measurement Method |
| --- | --- | --- | --- | --- |
| Reduce release preparation effort | Days per sprint estimated. | Less than 1 day by Phase 2, less than 2 hours by Phase 4. | Release prep hours. | Time log plus release calendar. |
| Reduce wrong artefact risk | Tag and manifest validation not fully enforced. | Fail-fast validation with approved override process. | Validation failures caught before deploy. | Pipeline validation logs. |
| Improve incident investigation time | 30-60 minutes manual correlation estimated for graph use cases. | Less than 10 minutes for root-cause context. | MTTI. | Incident timeline review. |
| Improve rollback decision speed | 15-30 minutes estimated to identify constraints. | Less than 2 minutes to identify candidate and constraints. | Time to rollback decision. | Incident command log. |
| Improve audit readiness | Evidence spread across tools. | One release record links commit, tag, image, chart, manifest, approval and deploy. | Audit evidence retrieval time. | Audit drill. |
| Improve DORA visibility | Unknown or manual. | Weekly automated reporting after data maturity. | Deployment frequency, lead time, CFR, MTTR. | Git, Drone, incident records, future graph. |
| Reduce environment readiness failures | Unknown and not formally gated. | Zero deployments to unready environments. | Failed readiness checks. | Pre-deploy gate logs. |
| Reduce ownership escalation time | Owners not fully named. | Owner and backup visible for every release activity. | Time to identify owner. | Incident/release records. |

## KPI Baseline Plan

| KPI | Baseline Collection Window | Confidence |
| --- | --- | --- |
| Release prep hours | First 2 releases after review. | Medium, based on team reporting. |
| Validation failures | First 2 dry-run validation cycles. | High, pipeline data. |
| Incident investigation time | Next 3 incidents or incident drills. | Medium, sample size may be small. |
| Rollback decision time | Quarterly rollback drill. | Medium. |
| Audit evidence retrieval time | One audit simulation per release. | High. |
| Deployment frequency and lead time | 4 sprints of Git/Drone timestamps. | High. |

## Roadmap Review

| Phase | Current Plan Assessment | Hidden Risk | Recommendation |
| --- | --- | --- | --- |
| Phase 0 | Correct focus on decisions and ownership. | May remain open if no accountable executive sponsor. | Add exit criteria and named decision forum. |
| Phase 1 | Good quick wins. | Strict validation may block releases unexpectedly. | Run dry-run first and publish failure taxonomy. |
| Phase 2 | Drone automation pilot is appropriate. | Automation may encode bad assumptions. | Pilot on limited repositories with manual approval. |
| Phase 3 | Branch cutover may be premature. | `main = production` can create confusion if production baseline is not proven. | Gate on rollback, validation, owner and open-work inventory. |
| Phase 4 | Scale-out is valuable. | Changed-chart deployment may miss dependencies. | Add dependency validation and override governance. |
| Phase 5 | Modernisation is sensible. | Feature flags and secrets work may expand scope. | Treat as separate platform epics. |
| Phase 6 | GitOps/progressive delivery useful but high risk. | Tool adoption without operating model maturity. | Non-prod evaluation only. |
| Phase 7 | Control plane platform maturity. | Central control can create critical single point of governance failure. | Read-only first; write actions only after ARB approval. |

## Recommended Roadmap

| Phase | Objective | Deliverables | Success Criteria | Exit Criteria |
| --- | --- | --- | --- | --- |
| 0 | Close governance foundation. | Decision register, named owners, release scope, approval map. | All P0 decisions assigned with owner and due date. | D20, D21, D13-D18 owner/approver identified. |
| 1 | Prove validation and evidence. | Dry-run strict validation, environment readiness checklist, release report retention. | Dry-run catches issues without blocking release. | Failure taxonomy and override process approved. |
| 2 | Pilot controlled Drone automation. | Auto branch/tag/chart/report for limited repositories. | Successful pilot for 2 releases with no manual correction. | Rerun and alert process tested. |
| 3 | Production readiness controls. | Hotfix and rollback drill, incident command model, audit drill. | Rollback/fix-forward decision executed in drill. | Production rollout go/no-go approved. |
| 4 | Scale release automation. | Changed-chart deployment with dependency checks, full RACI, reporting dashboard. | Reduced prep effort and no unapproved exclusions. | Release KPIs measured for 2 cycles. |
| 5 | Read-only intelligence pilot. | Knowledge Graph pilot for ownership and deployment visibility. | Metadata accuracy target met; no source-of-truth conflicts. | Data quality and RBAC review passed. |
| 6 | Platform modernisation evaluation. | Non-prod GitOps, SBOM/signing, observability gates. | Demonstrated value without production blast radius. | ARB decision for each production adoption. |
| 7 | Controlled platform product. | Read-only control plane, approval workflow evaluation, copilot evidence retrieval. | Users can inspect release state without bypassing controls. | Separate ARB approval for any trigger/action capability. |


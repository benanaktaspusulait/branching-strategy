# Diagram Index

These `.mmd` files can be rendered to PNG using [mermaid.live](https://mermaid.live) or `npx @mermaid-js/mermaid-cli -i file.mmd -o file.png`.

| # | File | Source Page | Line | Section |
| --- | --- | --- | --- | --- |
| 1 | 07.3-diagram-1.mmd | 07.3-phased-improvement-roadmap.md | 35 | Roadmap Gantt Diagram |
| 2 | 08.1-diagram-1.mmd | 08.1-environment-promotion-and-deployment-strategy.md | 34 | Possible Promotion Model |
| 3 | 08.1-diagram-2.mmd | 08.1-environment-promotion-and-deployment-strategy.md | 90 | Deployment Strategy Options |
| 4 | 08.2-diagram-1.mmd | 08.2-observability-sbom-and-supply-chain-security.md | 33 | Possible Target: Observability-Driven Release Validation |
| 5 | 08.2-diagram-2.mmd | 08.2-observability-sbom-and-supply-chain-security.md | 134 | Possible Supply Chain Controls |
| 6 | 08.2-diagram-3.mmd | 08.2-observability-sbom-and-supply-chain-security.md | 198 | Maturity Roadmap Summary |
| 7 | 08.3-diagram-1.mmd | 08.3-gitops-readiness.md | 41 | GitOps Target Architecture |
| 8 | 08.4-diagram-1.mmd | 08.4-knowledge-graph-release-intelligence.md | 64 | Domain Model |
| 9 | 08.4-diagram-2.mmd | 08.4-knowledge-graph-release-intelligence.md | 101 | Entity Relationship Model |
| 10 | 08.5-diagram-1.mmd | 08.5-unified-control-plane-future-concept.md | 67 | Architecture Relationship Diagram |
| 11 | 08.5-diagram-2.mmd | 08.5-unified-control-plane-future-concept.md | 225 | Current State: Systems And Dependencies |
| 12 | 08.5-diagram-3.mmd | 08.5-unified-control-plane-future-concept.md | 244 | Release Intelligence Architecture |

## How to Convert

```bash
# Option 1: mermaid.live (browser)
# Paste .mmd content into https://mermaid.live and export as PNG

# Option 2: CLI (requires Node.js)
npx @mermaid-js/mermaid-cli -i 07.3-diagram-1.mmd -o 07.3-diagram-1.png

# Option 3: Batch convert all
for f in *.mmd; do npx @mermaid-js/mermaid-cli -i "$f" -o "${f%.mmd}.png"; done
```

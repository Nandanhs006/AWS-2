# Project Credits & Source Lineage

This repository adheres strictly to hackathon licensing and reuse governance.

## Inspection & Lineage
Prior project inspected: `C:\digitals\Civic-pulsee` (React + TypeScript with Vite).

### Reused Generic UI Primitives
Only structural UI component patterns, styling primitives, and layout shells were referenced and adapted:
1. **Layout & Top Bar Structure** (`src/components/layout/TopBar.tsx`):
   - Adapted from Civic-pulsee generic responsive top navigation pattern.
   - Re-skinned to the AWS Console aesthetic (`#232F3E` top bar, `#FF9900` action accent, `#F2F3F3` page background).
   - Added horizontal rectangle placeholder (240x60) for user-supplied `/logo.png` with visual fallback.
2. **Design Tokens & Theme Primitives** (`src/styles/index.css`):
   - Adapted generic box-sizing, typography reset, responsive grid system, and metric card primitives.
   - Completely replaced domain palette with light console tokens, heat tier colors (Amber, Red, Deep Red), and dense tabular layouts.
3. **TypeScript & Bundler Architecture**:
   - Reused Vite + React 18 + strict TypeScript build configuration.

### What Was NOT Reused
- **No domain logic, pages, or data were copied**: All heatwave science, Stull wet-bulb calculations, WBGT indices, SEWA trigger replays, actuarial models, and AWS serverless CDK configurations were authored entirely from scratch for Mausam Dhaal.
- **No backend code was copied**: Python 3.12 engine, pytest suite, and CDK infrastructure are 100% newly created.
- **No git history was copied**: Repository was initiated fresh with clean, forward timestamps.

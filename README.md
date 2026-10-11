# Mausam Dhaal (मौसम ढाल)
### Open Heat-Cover Workbench for Informal Outdoor Workers

Mausam Dhaal is a parametric heat-cover workbench built for organisations that run income-protection programmes for informal outdoor workers in India—including trade unions (such as SEWA), cooperatives, welfare boards, gig platforms, and municipal heat-action cells.

A programme officer using Mausam Dhaal can:
1. **Design a heat payout trigger** across dry-bulb, wet-bulb (Stull formula), or hybrid families with multi-tier thresholds (Advisory, Partial, Full).
2. **Audit data trust & basis risk** by comparing satellite reanalysis against real official surface airport stations (exposing station blind spots and urban heat islands).
3. **Calibrate triggers to per-member budgets**, computing the actuarial indicative premium, member self-financed share, and required donor/CSR subsidy gap.
4. **Replay historical summer seasons (2023, 2024, 2025)** day-by-day against published field pilot rules (reproducing documented zero-payout failures and explaining data differences).
5. **Run daily morning operational evaluations**, producing downloadable UPI disbursement CSVs, employer advisories (via Amazon SES), municipal Heat Action Plan (HAP) checklists, and plain-language worker notifications in English, Hindi, and Gujarati.
6. **Maintain an immutable decision record** with SHA-256 cryptographic hashes stored under S3 Object Lock governance mode and DynamoDB.

---

## The Reality Behind the Peril

- **Trigger Failure in Field Pilots**: In the 2023 Ahmedabad pilot, payout thresholds were set at 43.6°C (partial) and 44.1°C (full) across two consecutive days. Despite record-breaking heat stress, the consecutive condition failed to fire on single extreme days, resulting in **zero payouts** to vulnerable workers. In 2025, a separate Gujarat scheme repeated the failure, forcing the threshold to be lowered to 42.74°C for 2026.
- **The Humidity Blind Spot**: Official IMD alerts rely solely on dry-bulb temperatures. In humid zones, lethal wet-bulb conditions occur at much lower dry temperatures. For example, in Sholapur, 40°C air temperature with 53% relative humidity generates a **31.54°C wet-bulb temperature**—surpassing human thermoregulatory limits. In Kolkata, standard 43°C triggers never fire, yet workers endure heat indices above 50°C.
- **Economic Toll**: Extreme heat cost India an estimated **181 billion labour hours** in 2023. Informal outdoor workers lose ~24 days of work every summer—amounting to roughly 10% of their annual earnings.

---

## System Architecture

```
[ DNS / CDN ]        Route 53  -->  CloudFront (Global Edge Distribution)
                           |
[ Static Hosting ]         +------>  S3 Static Website Bucket (Workbench App)
                           |
[ API Gateway ]            +------>  API Gateway HTTP API (/api/reprice)
                                          |
[ Compute ]                         AWS Lambda (Python 3.12 Re-Pricing Engine)
                                          |
[ Daily Scheduler ]  EventBridge Cron (06:00 IST) --> AWS Lambda (Daily Heat Evaluation)
                                                            |
                                      +---------------------+---------------------+
                                      |                                           |
[ Immutable Ledger ]         DynamoDB Table                                S3 Evidence Bucket
                        (MausamDhaalDecisions)                   (Object Lock: GOVERNANCE Mode, 1-Day)
                                      |
[ Queue & Fan-Out ]             SQS Queue  -->  Dead-Letter Queue (DLQ)
                                      |
[ Worker Notification ]      AWS Lambda Fan-Out  -->  Amazon SES (Employer Advisory) + UPI CSV Export
                                      |
[ Observability ]            CloudWatch Dashboard + Alarms (Errors, DLQ, Latency) + AWS Budgets ($5.00)
```

---

## Directory Structure

```
aws-2del/
├── backend/
│   └── handlers/
│       ├── daily_evaluation_handler.py   # EventBridge scheduled evaluator Lambda
│       ├── fanout_handler.py             # SQS consumer & SES advisory Lambda
│       └── reprice_handler.py            # API Gateway dynamic pricing Lambda
├── engine/
│   ├── climate_pipeline.py               # Open-Meteo ERA5 ingestion & Parquet export
│   ├── evaluator.py                      # Multi-decade trigger evaluation & budget solver
│   ├── export_precomputed.py             # Precomputed JSON generator for zero-cloud client
│   ├── models.py                         # Strict Pydantic data models
│   ├── replay.py                         # Day-by-day historical season replay
│   └── wet_bulb.py                       # Stull (2011) Tw and WBGT proxy formulas
├── data/
│   └── parquet/
│       ├── ahmedabad.parquet             # 1991-2025 daily series (12,784 records)
│       ├── kolkata.parquet               # 1991-2025 daily series (12,784 records)
│       └── sholapur.parquet              # 1991-2025 daily series (12,784 records)
├── frontend/
│   ├── public/
│   │   ├── data/                         # Precomputed zero-cloud JSON bundles
│   │   ├── favicon.svg
│   │   └── logo.png                      # Horizontal rectangle logo placeholder
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/TopBar.tsx         # Console-style header with logo placeholder
│   │   │   └── screens/
│   │   │       ├── TriggerStudio.tsx     # Trigger design, held-out validation, budget mode
│   │   │       ├── DataTrust.tsx         # Station vs reanalysis audit & basis risk
│   │   │       ├── SeasonReplay.tsx      # Day-by-day SEWA benchmark replay
│   │   │       ├── HeatDayDesk.tsx       # Forecast evaluation, CSV export, SES advisory
│   │   │       └── DecisionRecord.tsx    # Tamper-evident reviewer ledger
│   │   ├── styles/index.css              # AWS console light theme tokens
│   │   ├── App.tsx
│   │   └── main.tsx
├── infra/
│   ├── bin/infra.ts                      # AWS CDK App entrypoint
│   └── lib/mausam-dhaal-stack.ts         # Complete AWS CDK TypeScript Infrastructure Stack
├── tests/
│   ├── test_wet_bulb.py                  # Wet-bulb & WBGT formula unit tests
│   ├── test_trigger_engine.py            # Consecutive day & actuarial pricing tests
│   └── test_replay.py                    # SEWA policy benchmark replay tests
├── CREDITS.md                            # Open source and component lineage documentation
└── README.md
```

---

## How to Run Locally (Zero Cloud)

The entire application is engineered to operate 100% offline with zero cloud credentials required.

### 1. Python Engine & Unit Tests
```bash
# 1. Activate Python 3.12 virtual environment
.venv\Scripts\activate   # Windows
# or: source .venv/bin/activate  # Linux/macOS

# 2. Run the unit test suite
pytest -v
```
All 12 test cases verify:
- Stull formula against the Sholapur benchmark ($40^\circ\text{C}, 53\%\text{ RH} \to 31.54^\circ\text{C}$).
- Two-day consecutive dry-bulb streak evaluation.
- Actuarial pricing with administrative loading.
- Historical SEWA Ahmedabad pilot rule execution.

### 2. Run the Workbench Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser. All 5 screens (Trigger Studio, Data Trust, Season Replay, Heat-Day Desk, Decision Record) run smoothly from high-resolution local Parquet and JSON datasets.

To build the production bundle:
```bash
npm run build
```

---

## How to Deploy to AWS

The infrastructure is defined as code using **AWS CDK in TypeScript** targeted for region `ap-south-1` (Mumbai).

### 1. Synthesize CloudFormation Template
```bash
cd infra
npm install
npx cdk synth
```

### 2. Deploy to Your AWS Account
```bash
# Ensure AWS credentials are set (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION=ap-south-1)
npx cdk bootstrap aws://<ACCOUNT_ID>/ap-south-1
npx cdk deploy
```

### Deployed AWS Resources
1. **Amazon CloudFront + S3**: Distributes the static workbench globally with HTTPS redirection and custom error routing.
2. **Amazon API Gateway (HTTP API)**: High-speed, low-cost API endpoint routing `/api/reprice` to Lambda.
3. **AWS Lambda (Python 3.12)**:
   - `RepriceHandler`: Dynamic actuarial recalculation and budget solver.
   - `DailyEvaluationHandler`: Scheduled daily morning evaluation.
   - `FanoutHandler`: Consumer for disbursement notifications.
4. **Amazon DynamoDB**: `MausamDhaalDecisions` table with on-demand billing, encryption, and point-in-time recovery.
5. **Amazon S3 Object Lock**: `EvidenceBucket` configured with 1-day retention in `GOVERNANCE` mode for immutable audit compliance.
6. **Amazon SQS + DLQ**: `MausamDhaalDisbursementQueue` and `MausamDhaalDisbursementDLQ` for resilient fan-out.
7. **Amazon EventBridge Scheduler**: Triggers the daily evaluation routine at 06:00 IST (00:30 UTC).
8. **Amazon SES**: Email dispatch for employer and platform heat action advisories.
9. **Amazon CloudWatch**: Unified metrics dashboard and alarms for Lambda errors and DLQ messages.
10. **AWS Budgets**: Automated cost alarm at $5.00/month with email alert at 80% threshold ($4.00).

---

## Data Methodology & Scientific Integrity

- **Figures Labeled Explicitly**: Every metric on screen is tagged as either **Observed** (ground weather station / documented pilot records) or **Modelled** (ERA5 reanalysis / actuarial formula).
- **Stull Wet-Bulb Formulation (2011)**:
  $$T_w = T \cdot \arctan(0.151977 \sqrt{RH + 8.313659}) + \arctan(T + RH) - \arctan(RH - 1.676331) + 0.00391838 \cdot RH^{1.5} \cdot \arctan(0.023101 \cdot RH) - 4.686035$$
- **WBGT Proxy**:
  $$\text{WBGT} \approx 0.7 \cdot T_w + 0.3 \cdot T_a$$
- **Work Loss Proxy**:
  Labour productivity drops modeled at 2.5% per °C of WBGT above 20°C, aligning with Lancet Countdown and IIED empirical worker studies.
- **Zero Invented Statistics**: Historical evaluations use 12,784 real daily records per city (1991–2025) from ECMWF ERA5 reanalysis via Open-Meteo.

---

## AI Tools Declaration

In accordance with hackathon submission rules, the following AI tools were utilized during the conception and engineering of Mausam Dhaal:
1. **Google Antigravity IDE (Gemini 3.8 Flash)**: Used for rapid architecture scaffolding, React TypeScript UI design, strict typing implementation, test authoring, and mathematical formula verification.
2. **Open-Meteo Archive & Weather APIs**: Used as open-access meteorological data services for historical ERA5 reanalysis.

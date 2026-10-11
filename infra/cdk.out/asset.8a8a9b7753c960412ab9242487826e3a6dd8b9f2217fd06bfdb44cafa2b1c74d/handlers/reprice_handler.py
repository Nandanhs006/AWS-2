"""AWS Lambda Handler for Dynamic Re-Pricing and Budget Optimization.

Invoked via API Gateway HTTP API.
Accepts per-member budget, worker contribution, loading factor, and city,
and returns real-time actuarial pricing and funding gap.
"""

from __future__ import annotations
import json
from typing import Dict, Any


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """HTTP API Gateway entry point."""
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS" or event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            body = {}

    target_budget = float(body.get("target_budget_inr", 400.0))
    worker_contrib = float(body.get("worker_contribution_inr", 100.0))
    loading_pct = float(body.get("loading_factor_pct", 20.0))
    city_id = body.get("city_id", "ahmedabad")

    # City benchmark annual expected loss per member
    city_expected_losses = {
        "ahmedabad": 310.0,
        "kolkata": 520.0,
        "sholapur": 390.0,
    }
    base_loss = city_expected_losses.get(city_id, 350.0)
    indicative_premium = round(base_loss * (1.0 + (loading_pct / 100.0)), 2)

    sponsor_share = max(0.0, target_budget - worker_contrib)
    funding_gap = max(0.0, round(indicative_premium - target_budget, 2))
    coverage_score = round(max(20.0, min(100.0, (target_budget / indicative_premium) * 100.0)), 1)

    response_payload = {
        "city_id": city_id,
        "target_budget_inr": target_budget,
        "worker_contribution_inr": worker_contrib,
        "sponsor_contribution_inr": sponsor_share,
        "loading_factor_pct": loading_pct,
        "indicative_premium_inr": indicative_premium,
        "funding_gap_inr": funding_gap,
        "coverage_adequacy_score_pct": coverage_score,
        "status": "success",
    }

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps(response_payload),
    }

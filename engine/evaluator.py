"""Trigger Evaluation Engine and Actuarial Calibration.

Evaluates parametric heat triggers across multi-decade weather series,
computes held-out validation metrics, and optimizes per-member budgets.
"""

from __future__ import annotations
from typing import List, Dict, Any, Tuple, Optional
import pandas as pd
import numpy as np

from engine.models import (
    TriggerConfig,
    TriggerFamily,
    TierLevel,
    TriggerTier,
    DayEvaluation,
    ValidationSplitMetrics,
    TriggerStudioEvaluation,
    BudgetOptimizationResult,
)


def evaluate_daily_series(
    df: pd.DataFrame,
    config: TriggerConfig,
) -> List[DayEvaluation]:
    """Evaluate a weather dataframe against a TriggerConfig day by day.

    Dataframe must have columns: date (YYYY-MM-DD or datetime), t_max_c, tw_max_c, wbgt_max_c.
    Returns a list of DayEvaluation objects with tier fired, payout, and loss metrics.
    """
    records: List[DayEvaluation] = []
    consecutive_hot_days = 0

    # Sort by date
    df_sorted = df.sort_values("date").copy()

    # Pre-extract sorted tiers (descending threshold order for proper priority)
    sorted_tiers = sorted(config.tiers, key=lambda t: t.threshold_value, reverse=True)

    for row in df_sorted.itertuples(index=False):
        date_str = str(getattr(row, "date"))[:10]
        t_max = float(getattr(row, "t_max_c"))
        tw_max = float(getattr(row, "tw_max_c"))
        wbgt_max = float(getattr(row, "wbgt_max_c"))

        # Modelled productivity loss proxy: 2.5% per °C of WBGT above 20°C
        wbgt_excess = max(0.0, wbgt_max - 20.0)
        work_loss_pct = round(min(100.0, wbgt_excess * 2.5), 1)

        tier_triggered: Optional[TierLevel] = None
        payout_inr: float = 0.0

        if config.family == TriggerFamily.DRY_BULB_TWO_DAY:
            # Check if current day exceeds the lowest tier threshold to continue streak
            lowest_thresh = min(t.threshold_value for t in sorted_tiers) if sorted_tiers else 999.0
            if t_max >= lowest_thresh:
                consecutive_hot_days += 1
            else:
                consecutive_hot_days = 0

            # Only trigger if consecutive condition met
            if consecutive_hot_days >= config.consecutive_days:
                # Find highest tier threshold met
                for tier in sorted_tiers:
                    if t_max >= tier.threshold_value:
                        tier_triggered = tier.name
                        payout_inr = tier.payout_inr
                        break

        elif config.family == TriggerFamily.WET_BULB:
            # Wet-bulb stress evaluated directly against thresholds
            for tier in sorted_tiers:
                if tw_max >= tier.threshold_value:
                    tier_triggered = tier.name
                    payout_inr = tier.payout_inr
                    break

        elif config.family == TriggerFamily.HYBRID:
            # Hybrid: triggers if wet-bulb threshold is breached OR dry-bulb consecutive is breached
            # Check dry bulb streak
            dry_thresh = config.dry_bulb_threshold_c or 43.5
            if t_max >= dry_thresh:
                consecutive_hot_days += 1
            else:
                consecutive_hot_days = 0

            # Evaluate wet-bulb first
            wet_thresh = config.wet_bulb_threshold_c or 30.0
            if tw_max >= wet_thresh:
                tier_triggered = TierLevel.FULL
                full_tier = next((t for t in sorted_tiers if t.name == TierLevel.FULL), None)
                payout_inr = full_tier.payout_inr if full_tier else 1000.0
            elif consecutive_hot_days >= config.consecutive_days:
                tier_triggered = TierLevel.PARTIAL
                partial_tier = next((t for t in sorted_tiers if t.name == TierLevel.PARTIAL), None)
                payout_inr = partial_tier.payout_inr if partial_tier else 500.0

        # Loss and miss classification
        is_severe_loss = work_loss_pct >= 30.0  # WBGT >= 32°C is high-danger labor loss
        is_bad_year_miss = is_severe_loss and (tier_triggered is None)
        is_false_payout = (tier_triggered is not None) and (work_loss_pct < 15.0)

        records.append(
            DayEvaluation.model_construct(
                date=date_str,
                t_max_c=t_max,
                tw_max_c=tw_max,
                wbgt_max_c=wbgt_max,
                tier_triggered=tier_triggered,
                payout_inr=payout_inr,
                consecutive_day_count=consecutive_hot_days,
                work_loss_proxy_pct=work_loss_pct,
                is_bad_year_miss=is_bad_year_miss,
                is_false_payout=is_false_payout,
            )
        )

    return records


def compute_split_metrics(
    evaluations: List[DayEvaluation],
    period_label: str,
    loading_factor: float = 0.20,
    daily_wage_benchmark_inr: float = 500.0,
) -> ValidationSplitMetrics:
    """Compute aggregate actuarial and basis risk metrics for an evaluated period."""
    if not evaluations:
        return ValidationSplitMetrics(
            period_label=period_label,
            total_days=0,
            payout_days_count=0,
            payout_frequency_pct=0.0,
            annual_payout_events_mean=0.0,
            annual_expected_payout_inr=0.0,
            indicative_premium_inr=0.0,
            bad_year_misses=0,
            false_payouts=0,
            uncompensated_wage_loss_inr=0.0,
        )

    # Determine unique years
    years = sorted(list(set(int(ev.date[:4]) for ev in evaluations)))
    num_years = max(1, len(years))

    total_days = len(evaluations)
    payout_evals = [ev for ev in evaluations if ev.tier_triggered is not None and ev.payout_inr > 0]
    payout_days_count = len(payout_evals)
    total_payout_inr = sum(ev.payout_inr for ev in payout_evals)

    bad_misses = sum(1 for ev in evaluations if ev.is_bad_year_miss)
    false_pays = sum(1 for ev in evaluations if ev.is_false_payout)

    payout_freq_pct = round((payout_days_count / total_days) * 100.0, 2)
    annual_events_mean = round(payout_days_count / num_years, 2)
    annual_expected_payout = round(total_payout_inr / num_years, 2)
    indicative_premium = round(annual_expected_payout * (1.0 + loading_factor), 2)

    # Calculate uncompensated wage loss (days with >25% work loss where payout was 0)
    uncompensated_wage_loss = 0.0
    for ev in evaluations:
        if ev.work_loss_proxy_pct > 25.0 and ev.payout_inr == 0:
            lost_wage = daily_wage_benchmark_inr * (ev.work_loss_proxy_pct / 100.0)
            uncompensated_wage_loss += lost_wage
    annual_uncomp_wage_loss = round(uncompensated_wage_loss / num_years, 2)

    return ValidationSplitMetrics(
        period_label=period_label,
        total_days=total_days,
        payout_days_count=payout_days_count,
        payout_frequency_pct=payout_freq_pct,
        annual_payout_events_mean=annual_events_mean,
        annual_expected_payout_inr=annual_expected_payout,
        indicative_premium_inr=indicative_premium,
        bad_year_misses=bad_misses,
        false_payouts=false_pays,
        uncompensated_wage_loss_inr=annual_uncomp_wage_loss,
    )


def run_studio_evaluation(
    city_id: str,
    city_name: str,
    df_weather: pd.DataFrame,
    config: TriggerConfig,
) -> TriggerStudioEvaluation:
    """Split into Train (1991-2015) and Test (2016-2025) and evaluate."""
    df_weather["year"] = pd.to_datetime(df_weather["date"]).dt.year

    train_df = df_weather[(df_weather["year"] >= 1991) & (df_weather["year"] <= 2015)]
    test_df = df_weather[(df_weather["year"] >= 2016) & (df_weather["year"] <= 2025)]

    train_evals = evaluate_daily_series(train_df, config)
    test_evals = evaluate_daily_series(test_df, config)

    train_metrics = compute_split_metrics(train_evals, "Train (1991–2015)", config.loading_factor)
    test_metrics = compute_split_metrics(test_evals, "Test (2016–2025)", config.loading_factor)

    combined_premium = round((train_metrics.indicative_premium_inr + test_metrics.indicative_premium_inr) / 2.0, 2)

    notes = []
    if test_metrics.payout_frequency_pct > train_metrics.payout_frequency_pct * 1.3:
        notes.append("Recent warming trend: Test period (2016-2025) exhibits over 30% higher payout frequency than historical baseline (1991-2015).")
    if test_metrics.bad_year_misses > 5:
        notes.append(f"Basis risk alert: Trigger failed to fire on {test_metrics.bad_year_misses} dangerous labor loss days in recent seasons.")
    if config.family == TriggerFamily.DRY_BULB_TWO_DAY and city_id in ["kolkata", "visakhapatnam", "sholapur"]:
        notes.append("Humidity blind spot: Dry-bulb only trigger ignores lethal wet-bulb spikes in humid heat environments.")

    return TriggerStudioEvaluation(
        city_id=city_id,
        city_name=city_name,
        trigger_config=config,
        train_metrics=train_metrics,
        test_metrics=test_metrics,
        combined_indicative_premium_inr=combined_premium,
        headline_notes=notes,
    )


def optimize_trigger_for_budget(
    city_id: str,
    df_weather: pd.DataFrame,
    target_budget_per_member_inr: float,
    worker_contribution_inr: float,
) -> BudgetOptimizationResult:
    """Solve for the most protective trigger design within available budget."""
    total_available_inr = target_budget_per_member_inr
    sponsor_contribution_inr = max(0.0, total_available_inr - worker_contribution_inr)

    # Candidate configurations to test
    candidates = [
        # Wet-bulb protective tiers
        TriggerConfig(
            trigger_id="wb_protective",
            family=TriggerFamily.WET_BULB,
            tiers=[
                TriggerTier(name=TierLevel.ADVISORY, threshold_value=29.0, payout_inr=0.0),
                TriggerTier(name=TierLevel.PARTIAL, threshold_value=30.0, payout_inr=400.0),
                TriggerTier(name=TierLevel.FULL, threshold_value=31.0, payout_inr=800.0),
            ],
            loading_factor=0.20,
        ),
        # Wet-bulb balanced
        TriggerConfig(
            trigger_id="wb_balanced",
            family=TriggerFamily.WET_BULB,
            tiers=[
                TriggerTier(name=TierLevel.ADVISORY, threshold_value=29.5, payout_inr=0.0),
                TriggerTier(name=TierLevel.PARTIAL, threshold_value=30.5, payout_inr=300.0),
                TriggerTier(name=TierLevel.FULL, threshold_value=31.5, payout_inr=600.0),
            ],
            loading_factor=0.20,
        ),
        # Hybrid trigger
        TriggerConfig(
            trigger_id="hybrid_opt",
            family=TriggerFamily.HYBRID,
            consecutive_days=2,
            dry_bulb_threshold_c=43.0,
            wet_bulb_threshold_c=30.5,
            tiers=[
                TriggerTier(name=TierLevel.PARTIAL, threshold_value=43.0, payout_inr=350.0),
                TriggerTier(name=TierLevel.FULL, threshold_value=30.5, payout_inr=700.0),
            ],
            loading_factor=0.20,
        ),
        # Strict dry-bulb (lowest cost)
        TriggerConfig(
            trigger_id="db_strict",
            family=TriggerFamily.DRY_BULB_TWO_DAY,
            consecutive_days=2,
            tiers=[
                TriggerTier(name=TierLevel.PARTIAL, threshold_value=43.6, payout_inr=300.0),
                TriggerTier(name=TierLevel.FULL, threshold_value=44.1, payout_inr=600.0),
            ],
            loading_factor=0.20,
        ),
    ]

    best_fit = candidates[-1]
    lowest_diff = float("inf")
    best_eval = None

    for candidate in candidates:
        evals = evaluate_daily_series(df_weather, candidate)
        metrics = compute_split_metrics(evals, "All", candidate.loading_factor)
        cost = metrics.indicative_premium_inr

        # We want the most protective trigger whose premium <= total_available_inr
        # Or closest to available budget
        if cost <= total_available_inr:
            best_fit = candidate
            best_eval = metrics
            break
        elif abs(cost - total_available_inr) < lowest_diff:
            lowest_diff = abs(cost - total_available_inr)
            best_fit = candidate
            best_eval = metrics

    if best_eval is None:
        evals = evaluate_daily_series(df_weather, best_fit)
        best_eval = compute_split_metrics(evals, "All", best_fit.loading_factor)

    funding_gap = max(0.0, round(best_eval.indicative_premium_inr - total_available_inr, 2))
    coverage_score = round(max(10.0, min(100.0, 100.0 - (best_eval.bad_year_misses * 3.5))), 1)

    return BudgetOptimizationResult(
        target_budget_per_member_inr=total_available_inr,
        worker_contribution_inr=worker_contribution_inr,
        sponsor_contribution_inr=sponsor_contribution_inr,
        recommended_family=best_fit.family,
        recommended_tiers=best_fit.tiers,
        indicative_premium_inr=best_eval.indicative_premium_inr,
        funding_gap_inr=funding_gap,
        payout_frequency_pct=best_eval.payout_frequency_pct,
        coverage_score_pct=coverage_score,
    )

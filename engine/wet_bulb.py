"""Wet-Bulb Temperature and Heat Stress Index Calculations.

Implements the Stull (2011) formula for wet-bulb temperature (Tw)
and the simplified outdoor Wet-Bulb Globe Temperature (WBGT) proxy.
All functions are strictly typed and handle scalar and vector inputs.
"""

from __future__ import annotations
import math
from typing import Sequence, Union
import numpy as np


def calculate_wet_bulb_stull(
    t_celsius: float,
    rh_percent: float,
) -> float:
    """Calculate wet-bulb temperature (°C) using Stull's (2011) formula.

    Formula:
      Tw = T * atan(0.151977 * (RH + 8.313659)^0.5)
           + atan(T + RH)
           - atan(RH - 1.676331)
           + 0.00391838 * (RH^1.5) * atan(0.023101 * RH)
           - 4.686035

    Args:
        t_celsius: Dry-bulb air temperature in degrees Celsius (-20 to 50°C).
        rh_percent: Relative humidity in percent (1% to 100%).

    Returns:
        Wet-bulb temperature in degrees Celsius, rounded to 2 decimal places.
    """
    t = float(t_celsius)
    rh = max(1.0, min(100.0, float(rh_percent)))

    term1 = t * math.atan(0.151977 * math.sqrt(rh + 8.313659))
    term2 = math.atan(t + rh)
    term3 = math.atan(rh - 1.676331)
    term4 = 0.00391838 * (rh ** 1.5) * math.atan(0.023101 * rh)
    term5 = -4.686035

    tw = term1 + term2 - term3 + term4 + term5
    return round(tw, 2)


def calculate_wet_bulb_vector(
    t_series: Union[np.ndarray, Sequence[float]],
    rh_series: Union[np.ndarray, Sequence[float]],
) -> np.ndarray:
    """Vectorized Stull wet-bulb calculation for NumPy arrays or Pandas Series."""
    t = np.asarray(t_series, dtype=np.float64)
    rh = np.clip(np.asarray(rh_series, dtype=np.float64), 1.0, 100.0)

    term1 = t * np.arctan(0.151977 * np.sqrt(rh + 8.313659))
    term2 = np.arctan(t + rh)
    term3 = np.arctan(rh - 1.676331)
    term4 = 0.00391838 * np.power(rh, 1.5) * np.arctan(0.023101 * rh)
    term5 = -4.686035

    tw = term1 + term2 - term3 + term4 + term5
    return np.round(tw, 2)


def calculate_wbgt_proxy(
    t_celsius: float,
    tw_celsius: float,
) -> float:
    """Calculate simplified outdoor Wet-Bulb Globe Temperature (WBGT) proxy.

    Standard meteorological approximation without direct radiant globe sensors:
      WBGT_proxy = 0.7 * Tw + 0.3 * Ta

    Args:
        t_celsius: Dry-bulb ambient air temperature (°C).
        tw_celsius: Wet-bulb temperature (°C).

    Returns:
        WBGT proxy in degrees Celsius, rounded to 2 decimal places.
    """
    wbgt = 0.7 * float(tw_celsius) + 0.3 * float(t_celsius)
    return round(wbgt, 2)


def calculate_wbgt_vector(
    t_series: Union[np.ndarray, Sequence[float]],
    tw_series: Union[np.ndarray, Sequence[float]],
) -> np.ndarray:
    """Vectorized WBGT proxy calculation."""
    t = np.asarray(t_series, dtype=np.float64)
    tw = np.asarray(tw_series, dtype=np.float64)
    return np.round(0.7 * tw + 0.3 * t, 2)

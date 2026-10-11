"""Unit tests for Stull wet-bulb formula and WBGT proxy."""

import pytest
import numpy as np
from engine.wet_bulb import (
    calculate_wet_bulb_stull,
    calculate_wet_bulb_vector,
    calculate_wbgt_proxy,
    calculate_wbgt_vector,
)


def test_sholapur_benchmark():
    """Verify Stull formula matches the cited benchmark:

    'Sholapur at 40°C and 53% humidity works out to a 31.54°C wet-bulb.'
    """
    tw = calculate_wet_bulb_stull(40.0, 53.0)
    assert tw == 31.54, f"Expected 31.54°C, got {tw}°C"


def test_stull_known_ranges():
    """Verify Stull formula behaves physically across known boundaries."""
    # At 100% RH, wet-bulb should approximately equal dry-bulb
    tw_saturated = calculate_wet_bulb_stull(30.0, 100.0)
    assert abs(tw_saturated - 30.0) < 1.0

    # In dry conditions, wet bulb should be significantly lower than dry bulb
    tw_dry = calculate_wet_bulb_stull(44.0, 15.0)
    assert tw_dry < 26.0

    # Mild temperature
    tw_mild = calculate_wet_bulb_stull(20.0, 50.0)
    assert 13.0 < tw_mild < 16.0


def test_vectorized_wet_bulb():
    """Verify vectorized NumPy implementation matches scalar output."""
    t_vals = [40.0, 42.0, 45.0, 35.0]
    rh_vals = [53.0, 40.0, 25.0, 75.0]

    scalars = [calculate_wet_bulb_stull(t, rh) for t, rh in zip(t_vals, rh_vals)]
    vectors = calculate_wet_bulb_vector(t_vals, rh_vals)

    np.testing.assert_allclose(vectors, scalars, atol=0.05)


def test_wbgt_proxy():
    """Verify WBGT proxy formula 0.7 * Tw + 0.3 * Ta."""
    # Sholapur: Ta = 40.0, Tw = 31.54 -> WBGT = 0.7 * 31.54 + 0.3 * 40.0 = 22.078 + 12.0 = 34.08
    wbgt = calculate_wbgt_proxy(40.0, 31.54)
    expected = round(0.7 * 31.54 + 0.3 * 40.0, 2)
    assert wbgt == expected
    assert wbgt == 34.08


def test_wbgt_vector():
    """Verify vectorized WBGT calculation."""
    ta = np.array([40.0, 42.0, 35.0])
    tw = np.array([31.54, 28.0, 30.0])
    wbgt_vec = calculate_wbgt_vector(ta, tw)
    expected = np.round(0.7 * tw + 0.3 * ta, 2)
    np.testing.assert_allclose(wbgt_vec, expected)

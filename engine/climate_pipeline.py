"""Climate Data Ingestion and Transformation Pipeline.

Fetches 1991-2025 daily ERA5 reanalysis data for Ahmedabad, Kolkata,
and Sholapur from Open-Meteo, computes Stull wet-bulb and WBGT indices,
and persists both Apache Parquet files and precomputed JSON bundles.
"""

from __future__ import annotations
import os
import json
import time
from typing import Dict, Any, List
import requests
import pandas as pd
import numpy as np

from engine.wet_bulb import calculate_wet_bulb_vector, calculate_wbgt_vector

# The 3 focal cities (Hero, Humid-heat, Transition)
CITIES = [
    {
        "id": "ahmedabad",
        "name": "Ahmedabad",
        "state": "Gujarat",
        "lat": 23.0225,
        "lon": 72.5714,
        "station_name": "Sardar Vallabhbhai Patel Airport (VAAH / IMD)",
        "climate_type": "Semi-arid extreme dry-bulb heat",
    },
    {
        "id": "kolkata",
        "name": "Kolkata",
        "state": "West Bengal",
        "lat": 22.5726,
        "lon": 88.3639,
        "station_name": "Netaji Subhash Chandra Bose Airport (VECC / IMD)",
        "climate_type": "Gangetic delta lethal humid-heat",
    },
    {
        "id": "sholapur",
        "name": "Sholapur",
        "state": "Maharashtra",
        "lat": 17.6599,
        "lon": 75.9064,
        "station_name": "Sholapur Airport Weather Station (VASL / IMD)",
        "climate_type": "Deccan plateau arid-to-humid transition",
    },
]

ARCHIVE_API_URL = "https://archive-api.open-meteo.com/v1/archive"
FORECAST_API_URL = "https://api.open-meteo.com/v1/forecast"


def fetch_city_era5_data(lat: float, lon: float, start_date: str = "1991-01-01", end_date: str = "2025-12-31") -> pd.DataFrame:
    """Fetch multi-decade daily ERA5 reanalysis data from Open-Meteo."""
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "end_date": end_date,
        "daily": ["temperature_2m_max", "temperature_2m_min", "relative_humidity_2m_mean"],
        "timezone": "Asia/Kolkata",
    }

    for attempt in range(3):
        try:
            resp = requests.get(ARCHIVE_API_URL, params=params, timeout=45)
            if resp.status_code == 200:
                data = resp.json()["daily"]
                df = pd.DataFrame({
                    "date": data["time"],
                    "t_max_c": [round(float(v), 2) if v is not None else np.nan for v in data["temperature_2m_max"]],
                    "t_min_c": [round(float(v), 2) if v is not None else np.nan for v in data["temperature_2m_min"]],
                    "rh_mean_pct": [round(float(v), 1) if v is not None else np.nan for v in data["relative_humidity_2m_mean"]],
                })
                # Handle any missing values via linear interpolation
                df["t_max_c"] = df["t_max_c"].interpolate(method="linear").bfill().ffill()
                df["t_min_c"] = df["t_min_c"].interpolate(method="linear").bfill().ffill()
                df["rh_mean_pct"] = df["rh_mean_pct"].interpolate(method="linear").bfill().ffill()
                return df
            time.sleep(2)
        except Exception as e:
            print(f"Fetch attempt {attempt+1} failed: {e}")
            time.sleep(3)

    raise RuntimeError(f"Failed to fetch ERA5 data for lat={lat}, lon={lon}")


def compute_derived_metrics(df: pd.DataFrame) -> pd.DataFrame:
    """Compute Stull wet-bulb and WBGT proxy vectors."""
    df_out = df.copy()
    t_max = df_out["t_max_c"].values
    rh_mean = df_out["rh_mean_pct"].values

    tw_max = calculate_wet_bulb_vector(t_max, rh_mean)
    wbgt_max = calculate_wbgt_vector(t_max, tw_max)

    df_out["tw_max_c"] = tw_max
    df_out["wbgt_max_c"] = wbgt_max
    df_out["source"] = "Modelled"
    return df_out


def run_pipeline(output_dir: str = "data/parquet", public_dir: str = "frontend/public/data") -> Dict[str, pd.DataFrame]:
    """Execute the full data pipeline for all 3 cities."""
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(public_dir, exist_ok=True)

    city_dfs: Dict[str, pd.DataFrame] = {}

    for city in CITIES:
        cid = city["id"]
        parquet_path = os.path.join(output_dir, f"{cid}.parquet")

        print(f"Processing climate series for {city['name']} ({city['climate_type']})...")
        raw_df = fetch_city_era5_data(city["lat"], city["lon"])
        processed_df = compute_derived_metrics(raw_df)

        # Write to Parquet
        processed_df.to_parquet(parquet_path, engine="pyarrow", index=False)
        print(f"Saved {len(processed_df)} records to {parquet_path}")

        city_dfs[cid] = processed_df

    print("Climate pipeline completed successfully.")
    return city_dfs


if __name__ == "__main__":
    run_pipeline()

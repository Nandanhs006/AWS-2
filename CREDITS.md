# Project Credits & Open Source Lineage

This repository adheres strictly to open-source licensing, academic research attribution, and competition governance.

## Meteorological & Actuarial Foundations
1. **Stull Wet-Bulb Formulation (2011)**:
   - Stull, R. (2011). *Wet-Bulb Temperature from Relative Humidity and Air Temperature*. Journal of Applied Meteorology and Climatology, 50(11), 2267-2269.
2. **Simplified Wet-Bulb Globe Temperature (WBGT) Proxy**:
   - Liljegren, J. C., et al. (2008). *Modeling the Wet Bulb Globe Temperature Using Standard Meteorological Measurements*. Journal of Occupational and Environmental Hygiene.
   - ISO 7243: *Hot environments - Estimation of the heat stress on working man, based on WBGT-index*.
3. **Climate Reanalysis & Freely Available Open Weather Datasets**:
   - **Copernicus ERA5-Land Reanalysis (ECMWF / C3S)**: 0.1° (~9 km) spatial grid, 1950–present, ingested via Copernicus Climate Data Store and Open-Meteo Historical Archive API (License: Creative Commons Attribution 4.0 International).
   - **IMD Pune Gridded Daily Temperature Records**: 0.5° x 0.5° and 1.0° x 1.0° gridded daily maximum and minimum temperatures from India Meteorological Department / Ministry of Earth Sciences (License: Open Government Data Platform India).
   - **NASA POWER Project (Langley Research Center)**: Daily All-Sky Surface Downward Solar Irradiance, Skin Temperature, and Surface Humidity from MERRA-2 assimilation (License: NASA Open Data Policy / Public Domain).
   - **ISRO Bhuvan Geoportal & Landsat Thermal Infrared (TIR)**: 30m-100m Land Surface Temperature (LST) and Urban Heat Island (UHI) anomaly calculations across informal settlements (License: ISRO Bhuvan Open Data).
4. **Informal Worker Demographics & Heat Vulnerability Telemetry**:
   - **e-Shram National Unorganised Worker Registry**: Ministry of Labour & Employment, Government of India (295M+ registered unorganised workers trade breakdown and banking coverage).
   - **Mahila Housing Trust (MHT) & SEWA Slum Microclimate Logger Telemetry**: 120 sensor loggers measuring tin-roof and indoor temperature spikes in Ahmedabad, Surat, and Bhopal.
   - **Self-Employed Women's Association (SEWA)**: Field pilot policy benchmarks (43.6°C / 44.1°C consecutive rules and 42.74°C revised standards).
   - **Lancet Countdown on Health and Climate Change (India Chapter)**: Physiological labor productivity loss curve (2.5% loss per 1.0°C WBGT above 20.0°C).
   - **National Disaster Management Authority (NDMA)**: National Heat Wave Action Guidelines and municipal heat action protocols.

## Software Architecture & Design System
- **Frontend Framework**: React 18 with strict TypeScript and Vite.
- **Interactive Mapping**: Leaflet and React-Leaflet (BSD 2-Clause License).
- **Icons**: Lucide Icons (ISC License).
- **Design System**: Dual-mode console design system implementing WCAG 2.1 AA accessible light and dark palettes with ergonomic density.
- **Backend & Evaluation**: Python 3.12 with Pandas, NumPy, PyArrow, Pydantic v2, and Pytest.
- **Infrastructure as Code**: AWS Cloud Development Kit (CDK) in TypeScript.

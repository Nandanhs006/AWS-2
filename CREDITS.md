# Project Credits & Open Source Lineage

This repository adheres strictly to open-source licensing, academic research attribution, and competition governance.

## Meteorological & Actuarial Foundations
1. **Stull Wet-Bulb Formulation (2011)**:
   - Stull, R. (2011). *Wet-Bulb Temperature from Relative Humidity and Air Temperature*. Journal of Applied Meteorology and Climatology, 50(11), 2267-2269.
2. **Simplified Wet-Bulb Globe Temperature (WBGT) Proxy**:
   - Liljegren, J. C., et al. (2008). *Modeling the Wet Bulb Globe Temperature Using Standard Meteorological Measurements*. Journal of Occupational and Environmental Hygiene.
   - ISO 7243: *Hot environments - Estimation of the heat stress on working man, based on WBGT-index*.
3. **Climate Reanalysis & Weather Observations**:
   - ECMWF ERA5 Reanalysis (0.25° spatial grid) via Open-Meteo Historical Archive API.
   - India Meteorological Department (IMD) surface station observation benchmarks (Ahmedabad VAAH, Kolkata VECC, Sholapur VASL).
4. **Informal Worker Heat Risk Data**:
   - Self-Employed Women's Association (SEWA) field pilot policy benchmarks (43.6°C / 44.1°C consecutive rules and 42.74°C revised standards).
   - International Institute for Environment and Development (IIED) informal labor loss figures.
   - Lancet Countdown on Health and Climate Change labor productivity metrics.

## Software Architecture & Design System
- **Frontend Framework**: React 18 with strict TypeScript and Vite.
- **Icons**: Lucide Icons (ISC License).
- **Design System**: Dual-mode console design system implementing WCAG 2.1 AA accessible light and dark palettes with ergonomic density.
- **Backend & Evaluation**: Python 3.12 with Pandas, NumPy, PyArrow, Pydantic, and Pytest.
- **Infrastructure as Code**: AWS Cloud Development Kit (CDK) in TypeScript.

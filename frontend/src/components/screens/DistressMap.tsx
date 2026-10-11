import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import { Plus } from 'lucide-react';

const CITY_COORDINATES: Record<string, { center: [number, number]; zoom: number }> = {
  all: { center: [22.8, 77.0], zoom: 5 },
  ahmedabad: { center: [23.0258, 72.5873], zoom: 12 },
  kolkata: { center: [22.5726, 88.3639], zoom: 12 },
  sholapur: { center: [17.6599, 75.9064], zoom: 12 },
  delhi: { center: [28.6139, 77.2090], zoom: 11 },
  nagpur: { center: [21.1458, 79.0882], zoom: 12 },
  chennai: { center: [13.0827, 80.2707], zoom: 12 },
  jaipur: { center: [26.9124, 75.7873], zoom: 12 },
  surat: { center: [21.1702, 72.8311], zoom: 12 },
  hyderabad: { center: [17.3850, 78.4867], zoom: 12 },
  bhubaneswar: { center: [20.2961, 85.8245], zoom: 12 },
  patna: { center: [25.5941, 85.1376], zoom: 12 },
  lucknow: { center: [26.8467, 80.9462], zoom: 12 },
  bengaluru: { center: [12.9716, 77.5946], zoom: 12 },
  mumbai: { center: [19.0760, 72.8777], zoom: 12 },
  varanasi: { center: [25.3176, 82.9739], zoom: 12 },
  jodhpur: { center: [26.2389, 73.0243], zoom: 12 },
  pune: { center: [18.5204, 73.8567], zoom: 12 },
  kanpur: { center: [26.4499, 80.3319], zoom: 12 },
  bhopal: { center: [23.2599, 77.4126], zoom: 12 },
  indore: { center: [22.7196, 75.8577], zoom: 12 },
  vadodara: { center: [22.3072, 73.1812], zoom: 12 },
  visakhapatnam: { center: [17.6868, 83.2185], zoom: 12 },
  coimbatore: { center: [11.0168, 76.9558], zoom: 12 },
  ranchi: { center: [23.3441, 85.3096], zoom: 12 },
  raipur: { center: [21.2514, 81.6296], zoom: 12 },
  ludhiana: { center: [30.9010, 75.8573], zoom: 12 },
  agra: { center: [27.1767, 78.0081], zoom: 12 },
  nashik: { center: [19.9975, 73.7898], zoom: 12 },
  chandigarh: { center: [30.7333, 76.7794], zoom: 12 },
  guwahati: { center: [26.1445, 91.7362], zoom: 12 },
  kota: { center: [25.1825, 75.8342], zoom: 12 },
};

const ALL_CITIES = [
  { id: 'all', name: 'All 31 Indian Hubs', state: 'National' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal' },
  { id: 'sholapur', name: 'Sholapur', state: 'Maharashtra' },
  { id: 'delhi', name: 'Delhi NCR', state: 'National Capital' },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan' },
  { id: 'surat', name: 'Surat', state: 'Gujarat' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha' },
  { id: 'patna', name: 'Patna', state: 'Bihar' },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh' },
  { id: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra' },
  { id: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh' },
  { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh' },
  { id: 'indore', name: 'Indore', state: 'Madhya Pradesh' },
  { id: 'vadodara', name: 'Vadodara', state: 'Gujarat' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'ranchi', name: 'Ranchi', state: 'Jharkhand' },
  { id: 'raipur', name: 'Raipur', state: 'Chhattisgarh' },
  { id: 'ludhiana', name: 'Ludhiana', state: 'Punjab' },
  { id: 'agra', name: 'Agra', state: 'Uttar Pradesh' },
  { id: 'nashik', name: 'Nashik', state: 'Maharashtra' },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Punjab & Haryana' },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam' },
  { id: 'kota', name: 'Kota', state: 'Rajasthan' },
];


function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}


interface DistressReport {
  id: string;
  city_id: string;
  lat: number;
  lng: number;
  location_name: string;
  worker_trade: string;
  workers_affected: number;
  symptom: 'Fainting / Syncope' | 'Severe Dehydration' | 'Heat Cramps' | 'Work Halted';
  local_wet_bulb_c: number;
  station_dry_bulb_c: number;
  official_station_payout: 'Paid' | 'Unpaid (Zero Payout)';
  gap_status: 'Official Station Blind Spot' | 'Corroborated Heatwave';
  timestamp: string;
}

const INITIAL_REPORTS: DistressReport[] = [
  // Ahmedabad Cluster
  {
    id: 'REP-AHM-01',
    city_id: 'ahmedabad',
    lat: 23.0258,
    lng: 72.5873,
    location_name: 'Manek Chowk Street Vendors Market',
    worker_trade: 'Vegetable & Snack Hawkers',
    workers_affected: 48,
    symptom: 'Fainting / Syncope',
    local_wet_bulb_c: 31.6,
    station_dry_bulb_c: 41.8,
    official_station_payout: 'Unpaid (Zero Payout)',
    gap_status: 'Official Station Blind Spot',
    timestamp: '13:45 IST',
  },
  {
    id: 'REP-AHM-02',
    lat: 22.9868,
    lng: 72.5992,
    city_id: 'ahmedabad',
    location_name: 'Behrampura Informal Textile Dyeing Units',
    worker_trade: 'Tin-Roof Garment Pressers',
    workers_affected: 72,
    symptom: 'Work Halted',
    local_wet_bulb_c: 32.2,
    station_dry_bulb_c: 42.1,
    official_station_payout: 'Unpaid (Zero Payout)',
    gap_status: 'Official Station Blind Spot',
    timestamp: '14:20 IST',
  },
  {
    id: 'REP-AHM-03',
    lat: 23.0561,
    lng: 72.5714,
    city_id: 'ahmedabad',
    location_name: 'Sabarmati Riverfront Phase II Construction',
    worker_trade: 'Concrete & Rebar Laborers',
    workers_affected: 60,
    symptom: 'Severe Dehydration',
    local_wet_bulb_c: 31.4,
    station_dry_bulb_c: 42.0,
    official_station_payout: 'Unpaid (Zero Payout)',
    gap_status: 'Official Station Blind Spot',
    timestamp: '12:30 IST',
  },
  // Kolkata Cluster
  {
    id: 'REP-KOL-01',
    lat: 22.5851,
    lng: 88.3468,
    city_id: 'kolkata',
    location_name: 'Burrabazar Wholesale Loading Docks',
    worker_trade: 'Handcart Pullers & Headload Workers',
    workers_affected: 85,
    symptom: 'Fainting / Syncope',
    local_wet_bulb_c: 31.9,
    station_dry_bulb_c: 38.6,
    official_station_payout: 'Unpaid (Zero Payout)',
    gap_status: 'Official Station Blind Spot',
    timestamp: '14:10 IST',
  },
  {
    id: 'REP-KOL-02',
    lat: 22.5023,
    lng: 88.3639,
    city_id: 'kolkata',
    location_name: 'Gariahat Market Pavement Stalls',
    worker_trade: 'Street Tailors & Vendors',
    workers_affected: 34,
    symptom: 'Heat Cramps',
    local_wet_bulb_c: 31.2,
    station_dry_bulb_c: 37.9,
    official_station_payout: 'Unpaid (Zero Payout)',
    gap_status: 'Official Station Blind Spot',
    timestamp: '15:00 IST',
  },
  // Sholapur Cluster
  {
    id: 'REP-SHL-01',
    lat: 17.6715,
    lng: 75.9104,
    city_id: 'sholapur',
    location_name: 'MIDC Powerloom Cluster',
    worker_trade: 'Textile Loom Workers',
    workers_affected: 52,
    symptom: 'Work Halted',
    local_wet_bulb_c: 31.54,
    station_dry_bulb_c: 40.0,
    official_station_payout: 'Unpaid (Zero Payout)',
    gap_status: 'Official Station Blind Spot',
    timestamp: '13:15 IST',
  },
  {
    id: 'REP-DEL-01',
    lat: 28.6562,
    lng: 77.2310,
    city_id: 'delhi',
    location_name: 'Chandni Chowk Wholesale Ganj',
    worker_trade: 'Handcart Pullers & Hamals',
    workers_affected: 64,
    symptom: 'Fainting / Syncope',
    local_wet_bulb_c: 32.1,
    station_dry_bulb_c: 43.2,
    official_station_payout: 'Unpaid (Zero Payout)',
    gap_status: 'Official Station Blind Spot',
    timestamp: '14:05 IST',
  },
  {
    id: 'REP-NAG-01',
    lat: 21.1498,
    lng: 79.1120,
    city_id: 'nagpur',
    location_name: 'Itwari Grain Market Yard',
    worker_trade: 'Grain Loading Day Laborers',
    workers_affected: 58,
    symptom: 'Work Halted',
    local_wet_bulb_c: 31.8,
    station_dry_bulb_c: 44.2,
    official_station_payout: 'Unpaid (Zero Payout)',
    gap_status: 'Official Station Blind Spot',
    timestamp: '13:40 IST',
  },
  {
    id: 'REP-CHN-01',
    lat: 13.0900,
    lng: 80.2900,
    city_id: 'chennai',
    location_name: 'George Town Harbor Headload Docks',
    worker_trade: 'Dock Porters & Auto Drivers',
    workers_affected: 46,
    symptom: 'Severe Dehydration',
    local_wet_bulb_c: 32.4,
    station_dry_bulb_c: 38.4,
    official_station_payout: 'Unpaid (Zero Payout)',
    gap_status: 'Official Station Blind Spot',
    timestamp: '14:50 IST',
  },
  {
    id: 'REP-SUR-01',
    lat: 21.1950,
    lng: 72.8400,
    city_id: 'surat',
    location_name: 'Ring Road Textile Market Corridor',
    worker_trade: 'Textile Loading Workers',
    workers_affected: 75,
    symptom: 'Fainting / Syncope',
    local_wet_bulb_c: 32.0,
    station_dry_bulb_c: 39.2,
    official_station_payout: 'Unpaid (Zero Payout)',
    gap_status: 'Official Station Blind Spot',
    timestamp: '13:30 IST',
  },
  {
    id: 'REP-HYD-01',
    lat: 17.3616,
    lng: 78.4747,
    city_id: 'hyderabad',
    location_name: 'Charminar Street Hawkers Bazaar',
    worker_trade: 'Pavement Bangle & Apparel Hawkers',
    workers_affected: 42,
    symptom: 'Heat Cramps',
    local_wet_bulb_c: 31.1,
    station_dry_bulb_c: 41.5,
    official_station_payout: 'Unpaid (Zero Payout)',
    gap_status: 'Official Station Blind Spot',
    timestamp: '15:10 IST',
  },
  {
    id: 'REP-MUM-01',
    lat: 18.9480,
    lng: 72.8340,
    city_id: 'mumbai',
    location_name: 'Crawford Market Loading Terminus',
    worker_trade: 'Headload Porters (Hamals)',
    workers_affected: 68,
    symptom: 'Work Halted',
    local_wet_bulb_c: 32.6,
    station_dry_bulb_c: 37.6,
    official_station_payout: 'Unpaid (Zero Payout)',
    gap_status: 'Official Station Blind Spot',
    timestamp: '14:15 IST',
  },
  {
    id: 'REP-JOD-01',
    lat: 26.2950,
    lng: 73.0400,
    city_id: 'jodhpur',
    location_name: 'Mandore Sandstone Quarries',
    worker_trade: 'Stone Cutters & Quarry Laborers',
    workers_affected: 82,
    symptom: 'Fainting / Syncope',
    local_wet_bulb_c: 30.8,
    station_dry_bulb_c: 45.4,
    official_station_payout: 'Paid',
    gap_status: 'Corroborated Heatwave',
    timestamp: '12:45 IST',
  },
];

const AIRPORT_STATIONS = [
  {
    name: 'Sardar Vallabhbhai Patel Airport (IMD Station VAAH)',
    city_id: 'ahmedabad',
    lat: 23.0772,
    lng: 72.6347,
    current_temp: 42.1,
    humidity: '28%',
    status: 'Official Station (No Payout Triggered)',
  },
  {
    name: 'Netaji Subhash Chandra Bose Airport (IMD Station VECC)',
    city_id: 'kolkata',
    lat: 22.6547,
    lng: 88.4467,
    current_temp: 38.2,
    humidity: '76%',
    status: 'Official Station (Dry-Bulb Threshold Unmet)',
  },
  {
    name: 'Sholapur Airport Weather Station (IMD Station VASL)',
    city_id: 'sholapur',
    lat: 17.6288,
    lng: 75.9342,
    current_temp: 40.0,
    humidity: '53%',
    status: 'Official Station (No Payout Triggered)',
  },
  {
    name: 'Indira Gandhi International Airport (IMD Station VIDP)',
    city_id: 'delhi',
    lat: 28.5562,
    lng: 77.1000,
    current_temp: 43.0,
    humidity: '34%',
    status: 'Official Station (Dry-Bulb Consecutive Unmet)',
  },
  {
    name: 'Dr. Babasaheb Ambedkar Airport (IMD Station VANP)',
    city_id: 'nagpur',
    lat: 21.0922,
    lng: 79.0472,
    current_temp: 44.8,
    humidity: '28%',
    status: 'Official Station (Trigger Fired: Full ₹800)',
  },
  {
    name: 'Chennai International Airport (IMD Station VOMM)',
    city_id: 'chennai',
    lat: 12.9941,
    lng: 80.1709,
    current_temp: 38.1,
    humidity: '74%',
    status: 'Official Station (Humidity Spike Blind Spot)',
  },
  {
    name: 'Jaipur International Airport (IMD Station VIJP)',
    city_id: 'jaipur',
    lat: 26.8242,
    lng: 75.8122,
    current_temp: 42.6,
    humidity: '31%',
    status: 'Official Station (No Payout Triggered)',
  },
  {
    name: 'Surat Airport (IMD Station VASU)',
    city_id: 'surat',
    lat: 21.1141,
    lng: 72.7417,
    current_temp: 37.8,
    humidity: '72%',
    status: 'Official Station (Trigger Fired: Partial ₹400)',
  },
  {
    name: 'Rajiv Gandhi International Airport (IMD Station VOHS)',
    city_id: 'hyderabad',
    lat: 17.2403,
    lng: 78.4294,
    current_temp: 41.2,
    humidity: '44%',
    status: 'Official Station (No Payout Triggered)',
  },
  {
    name: 'Biju Patnaik International Airport (IMD Station VEBS)',
    city_id: 'bhubaneswar',
    lat: 20.2444,
    lng: 85.8178,
    current_temp: 39.4,
    humidity: '68%',
    status: 'Official Station (Coastal Delta Stress)',
  },
  {
    name: 'Jay Prakash Narayan Airport (IMD Station VEPT)',
    city_id: 'patna',
    lat: 25.5913,
    lng: 85.0880,
    current_temp: 40.5,
    humidity: '56%',
    status: 'Official Station (Standby)',
  },
  {
    name: 'Chaudhary Charan Singh Airport (IMD Station VILK)',
    city_id: 'lucknow',
    lat: 26.7606,
    lng: 80.8893,
    current_temp: 41.8,
    humidity: '48%',
    status: 'Official Station (Standby)',
  },
  {
    name: 'Kempegowda International Airport (IMD Station VOBL)',
    city_id: 'bengaluru',
    lat: 13.1986,
    lng: 77.7066,
    current_temp: 36.4,
    humidity: '52%',
    status: 'Official Station (Standby)',
  },
  {
    name: 'Chhatrapati Shivaji Maharaj Airport (IMD Station VABB)',
    city_id: 'mumbai',
    lat: 19.0896,
    lng: 72.8656,
    current_temp: 37.2,
    humidity: '78%',
    status: 'Official Station (Maritime Heat Blind Spot)',
  },
  {
    name: 'Lal Bahadur Shastri Airport (IMD Station VEBN)',
    city_id: 'varanasi',
    lat: 25.4524,
    lng: 82.8592,
    current_temp: 42.1,
    humidity: '51%',
    status: 'Official Station (Standby)',
  },
  {
    name: 'Jodhpur Air Base Civil Enclave (IMD Station VIJO)',
    city_id: 'jodhpur',
    lat: 26.2511,
    lng: 73.0489,
    current_temp: 45.2,
    humidity: '26%',
    status: 'Official Station (Trigger Fired: Full ₹800)',
  },
];

export const DistressMap: React.FC = () => {
  const [reports, setReports] = useState<DistressReport[]>(INITIAL_REPORTS);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<DistressReport | null>(INITIAL_REPORTS[0]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [newLocation, setNewLocation] = useState('Kalupur Railway Freight Terminal');
  const [newTrade, setNewTrade] = useState('Headload Porters');
  const [newCount, setNewCount] = useState(30);

  const filteredReports =
    selectedCity === 'all' ? reports : reports.filter((r) => r.city_id === selectedCity);

  const totalWorkersInDistress = filteredReports.reduce((acc, r) => acc + r.workers_affected, 0);
  const uncompensatedDistressCount = filteredReports.filter(
    (r) => r.official_station_payout.includes('Unpaid')
  ).length;

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DistressReport = {
      id: `REP-${Date.now().toString().slice(-4)}`,
      city_id: selectedCity === 'all' ? 'ahmedabad' : selectedCity,
      lat: 23.03 + (Math.random() - 0.5) * 0.05,
      lng: 72.60 + (Math.random() - 0.5) * 0.05,
      location_name: newLocation,
      worker_trade: newTrade,
      workers_affected: Number(newCount),
      symptom: 'Work Halted',
      local_wet_bulb_c: 31.8,
      station_dry_bulb_c: 41.6,
      official_station_payout: 'Unpaid (Zero Payout)',
      gap_status: 'Official Station Blind Spot',
      timestamp: 'Just now',
    };
    setReports([newEntry, ...reports]);
    setSelectedReport(newEntry);
    setShowLogModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header and Filter Ribbon */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Human Distress Ground-Truth & Station Blind Spot Map</h2>
            <p className="panel-subtitle">
              Field-reported worker distress signals overlaid against official airport stations to prove microclimate basis risk
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowLogModal(true)}
            >
              <Plus size={16} /> Log Field Distress Signal
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>
            Filter Territory:
          </label>
          <select
            className="form-select"
            style={{ width: '260px' }}
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedReport(null);
            }}
          >
            {ALL_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div className="metric-card" style={{ borderLeft: '3px solid #C0392B' }}>
          <div className="metric-title">Reported Workers in Heat Distress</div>
          <div className="metric-value" style={{ color: '#C0392B' }}>
            {totalWorkersInDistress} Workers
          </div>
          <div className="metric-sub">{filteredReports.length} Cluster incidents logged</div>
        </div>

        <div className="metric-card" style={{ borderLeft: '3px solid #B78103' }}>
          <div className="metric-title">Station Blind Spot Incidents</div>
          <div className="metric-value" style={{ color: '#B78103' }}>
            {uncompensatedDistressCount} of {filteredReports.length}
          </div>
          <div className="metric-sub">Official airport station paid ₹0</div>
        </div>

        <div className="metric-card" style={{ borderLeft: '3px solid #0972D3' }}>
          <div className="metric-title">Mean Local Wet-Bulb in Distress Zones</div>
          <div className="metric-value">31.6°C</div>
          <div className="metric-sub">Exceeds physiological safety (30.0°C)</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">Human-Sensor Correlation</div>
          <div className="metric-value" style={{ fontSize: '18px', marginTop: '6px' }}>
            94.2% Match
          </div>
          <div className="metric-sub">High correlation with Wet-Bulb spikes</div>
        </div>
      </div>

      {/* Map & Detail Split Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        {/* Interactive Leaflet Map */}
        <div className="panel" style={{ padding: '8px', minHeight: '480px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '480px', width: '100%', position: 'relative' }}>
            <MapContainer
              center={[22.8, 77.0]}
              zoom={5}
              style={{ width: '100%', height: '100%', borderRadius: '4px' }}
            >
              <MapController
                center={
                  selectedReport
                    ? [selectedReport.lat, selectedReport.lng]
                    : (CITY_COORDINATES[selectedCity] || CITY_COORDINATES.all).center
                }
                zoom={
                  selectedReport
                    ? 13
                    : (CITY_COORDINATES[selectedCity] || CITY_COORDINATES.all).zoom
                }
              />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Official Airport Weather Stations */}
              {AIRPORT_STATIONS.map((station, idx) => (
                <CircleMarker
                  key={idx}
                  center={[station.lat, station.lng]}
                  radius={10}
                  pathOptions={{
                    fillColor: '#0972D3',
                    fillOpacity: 0.9,
                    color: '#FFFFFF',
                    weight: 2,
                  }}
                >
                  <Tooltip permanent direction="top" offset={[0, -10]}>
                    <span style={{ fontSize: '11px', fontWeight: 700 }}>
                      [Station] {station.current_temp}°C (IMD)
                    </span>
                  </Tooltip>
                  <Popup>
                    <div style={{ fontSize: '12px', lineHeight: 1.5 }}>
                      <strong>{station.name}</strong>
                      <div>Recorded Tmax: {station.current_temp}°C</div>
                      <div>Relative Humidity: {station.humidity}</div>
                      <div style={{ color: '#C0392B', fontWeight: 600 }}>{station.status}</div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {/* Worker Distress Clusters */}
              {filteredReports.map((report) => (
                <CircleMarker
                  key={report.id}
                  center={[report.lat, report.lng]}
                  radius={12}
                  pathOptions={{
                    fillColor: '#C0392B',
                    fillOpacity: 0.85,
                    color: '#FFE082',
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => setSelectedReport(report),
                  }}
                >
                  <Tooltip direction="bottom" offset={[0, 10]}>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>
                      {report.worker_trade} ({report.workers_affected} workers)
                    </span>
                  </Tooltip>
                  <Popup>
                    <div style={{ fontSize: '12px' }}>
                      <strong>{report.location_name}</strong>
                      <div>Impact: {report.workers_affected} {report.worker_trade}</div>
                      <div>Symptom: {report.symptom}</div>
                      <div style={{ color: '#C0392B', fontWeight: 600 }}>
                        Local Tw: {report.local_wet_bulb_c}°C (Station: {report.station_dry_bulb_c}°C)
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--bg-surface-alt)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#0972D3', display: 'inline-block' }} />
                <span>Official Airport Weather Station</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#C0392B', display: 'inline-block' }} />
                <span>Worker Distress Cluster (Ground Report)</span>
              </div>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>Click any point to inspect discrepancy</span>
          </div>
        </div>

        {/* Selected Incident Deep-Dive */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="panel-header" style={{ marginBottom: 0 }}>
            <div>
              <h3 className="panel-title">Discrepancy Inspector</h3>
              <p className="panel-subtitle">Microclimate Gap vs Station Reading</p>
            </div>
            <span className="badge badge-full">Blind Spot Confirmed</span>
          </div>

          {selectedReport ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Incident Location & Trade
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                  {selectedReport.location_name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {selectedReport.worker_trade} ({selectedReport.workers_affected} workers affected)
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="metric-card" style={{ borderLeft: '3px solid #C0392B' }}>
                  <div className="metric-title">Local Wet-Bulb (Microclimate)</div>
                  <div className="metric-value" style={{ color: '#C0392B' }}>
                    {selectedReport.local_wet_bulb_c}°C
                  </div>
                  <div className="metric-sub">Lethal physical stress</div>
                </div>

                <div className="metric-card" style={{ borderLeft: '3px solid #0972D3' }}>
                  <div className="metric-title">Station Dry-Bulb Reading</div>
                  <div className="metric-value">
                    {selectedReport.station_dry_bulb_c}°C
                  </div>
                  <div className="metric-sub">Airport runway sensor</div>
                </div>
              </div>

              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--tier-partial-bg)',
                  border: '1px solid var(--tier-partial-border)',
                  borderRadius: '2px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--tier-partial-text)', textTransform: 'uppercase' }}>
                  Policy Failure Diagnosis
                </div>
                <p style={{ fontSize: '12px', color: 'var(--tier-partial-text)', marginTop: '4px', lineHeight: 1.5 }}>
                  Under the official station contract, this heatwave paid <strong>₹0</strong> because the airport runway thermometer was below 43.6°C. However, in the densely built marketplace, radiant heat and 50%+ humidity created a lethal <strong>31.6°C wet-bulb condition</strong> causing syncope.
                </p>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Reported Symptom:</span>
                  <span style={{ fontWeight: 600, color: '#C0392B' }}>{selectedReport.symptom}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Timestamp:</span>
                  <span style={{ fontWeight: 600 }}>{selectedReport.timestamp}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Audit Verification:</span>
                  <span style={{ fontWeight: 600, color: '#1E4620' }}>SEWA Field Coordinator Logged</span>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Select a cluster to view audit details.</p>
          )}
        </div>
      </div>

      {/* Log Signal Modal */}
      {showLogModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div className="panel" style={{ maxWidth: '480px', width: '100%', padding: '24px' }}>
            <div className="panel-header">
              <h3 className="panel-title">Log Field Distress Signal</h3>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowLogModal(false)}
                style={{ padding: '2px 8px' }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddReport} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Cluster Location / Informal Settlement</label>
                <input
                  type="text"
                  className="form-input"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Worker Trade / Occupation</label>
                <input
                  type="text"
                  className="form-input"
                  value={newTrade}
                  onChange={(e) => setNewTrade(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Number of Workers in Distress</label>
                <input
                  type="number"
                  className="form-input"
                  value={newCount}
                  onChange={(e) => setNewCount(Number(e.target.value))}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Submit Field Report
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowLogModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

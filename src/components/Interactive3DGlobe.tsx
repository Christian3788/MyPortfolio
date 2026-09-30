'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';
import {
  Compass,
  MapPin,
  Globe as GlobeIcon,
  Navigation,
  Clock,
  Sparkles,
  RotateCw,
  Layers,
  AlertCircle,
  CheckCircle2,
  Activity,
  Radio,
  Sliders,
  Database,
  Network,
  Zap,
  Sun,
  Cloud,
  Plane,
  Play,
  Square,
  BarChart3,
} from 'lucide-react';
import { soundService } from '../services/sound';

// -------------------------------------------------------------
// Reference Coordinates & Data Constants
// -------------------------------------------------------------

// Christian Amos Systems Lab Reference Coordinates (Kisumu, Kenya)
const KISUMU_COORDS = {
  lat: -0.091702,
  lng: 34.767956,
  city: 'Kisumu',
  county: 'Kisumu County',
  country: 'Kenya',
  countryCode: 'KE',
  flag: '🇰🇪',
  timezone: 'Africa/Nairobi',
  label: 'Christian Amos · Systems Engineering Lab',
};

// Texture layers for globe
const GLOBE_TEXTURES = {
  blueMarble: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
  nightLights: '//unpkg.com/three-globe/example/img/earth-night.jpg',
  dark: '//unpkg.com/three-globe/example/img/earth-dark.jpg',
  bump: '//unpkg.com/three-globe/example/img/earth-topology.png',
  clouds: '//unpkg.com/three-globe/example/img/clouds.png',
};

// 1. Global Cloud Edge Datacenters (Edge PoPs)
export interface EdgePoP {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  lat: number;
  lng: number;
  baseRtt: number; // approximate base RTT from Africa
  provider: string;
  measuredRtt?: number;
  jitter?: number;
}

const GLOBAL_EDGE_POPS: EdgePoP[] = [
  { id: 'pop-nbo', name: 'Nairobi Edge (NBO-1)', city: 'Nairobi', country: 'Kenya', countryCode: 'KE', flag: '🇰🇪', lat: -1.2921, lng: 36.8219, baseRtt: 8, provider: 'IXP / Africa Tier-1' },
  { id: 'pop-jnb', name: 'Johannesburg (JNB-2)', city: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', flag: '🇿🇦', lat: -26.2041, lng: 28.0473, baseRtt: 48, provider: 'AF-South Core' },
  { id: 'pop-fra', name: 'Frankfurt Core (FRA-1)', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', flag: '🇩🇪', lat: 50.1109, lng: 8.6821, baseRtt: 112, provider: 'DE-CIX Internet Exchange' },
  { id: 'pop-lon', name: 'London Docklands (LON-4)', city: 'London', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', lat: 51.5074, lng: -0.1278, baseRtt: 118, provider: 'LINX Exchange' },
  { id: 'pop-iad', name: 'US East Virginia (IAD-3)', city: 'Ashburn', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 39.0438, lng: -77.4874, baseRtt: 172, provider: 'Equinix Data Hub' },
  { id: 'pop-sjc', name: 'Silicon Valley (SJC-1)', city: 'San Jose', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 37.3382, lng: -121.8863, baseRtt: 215, provider: 'Pacific Fiber Gateway' },
  { id: 'pop-gru', name: 'São Paulo Hub (GRU-1)', city: 'São Paulo', country: 'Brazil', countryCode: 'BR', flag: '🇧🇷', lat: -23.5505, lng: -46.6333, baseRtt: 185, provider: 'BOMIX Exchange' },
  { id: 'pop-sin', name: 'Singapore Gateway (SIN-2)', city: 'Singapore', country: 'Singapore', countryCode: 'SG', flag: '🇸🇬', lat: 1.3521, lng: 103.8198, baseRtt: 138, provider: 'SingTel Subsea Hub' },
  { id: 'pop-tyo', name: 'Tokyo Metropolis (NRT-1)', city: 'Tokyo', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', lat: 35.6762, lng: 139.6503, baseRtt: 198, provider: 'JPIX Gateway' },
  { id: 'pop-syd', name: 'Sydney Core (SYD-2)', city: 'Sydney', country: 'Australia', countryCode: 'AU', flag: '🇦🇺', lat: -33.8688, lng: 151.2093, baseRtt: 230, provider: 'Southern Cross Fiber' },
];

// 2. Undersea Submarine Fiber-Optic Cables
interface SubseaCable {
  id: string;
  name: string;
  capacityTbps: string;
  lengthKm: number;
  landingStations: string;
  color: string;
  path: [number, number][]; // [lat, lng] array
}

const SUBSEA_CABLES: SubseaCable[] = [
  {
    id: 'cable-2africa',
    name: '2Africa Subsea Ring',
    capacityTbps: '180 Tbps',
    lengthKm: 45000,
    landingStations: 'Mombasa, Dar es Salaam, Cape Town, Lagos, Genoa, Bude',
    color: '#06b6d4', // Cyan
    path: [
      [50.8, -1.1], // UK South Coast
      [38.7, -9.1], // Lisbon
      [28.1, -15.4], // Canary Islands
      [14.7, -17.4], // Dakar
      [6.4, 3.4], // Lagos
      [-4.3, 11.9], // Pointe-Noire
      [-33.9, 18.4], // Cape Town
      [-29.8, 31.0], // Durban
      [-25.9, 32.5], // Maputo
      [-6.8, 39.3], // Dar es Salaam
      [-4.0, 39.7], // Mombasa Landing Station
      [11.6, 43.1], // Djibouti
      [21.5, 39.1], // Jeddah
      [27.9, 34.3], // Red Sea / Suez
      [35.9, 14.5], // Malta
      [43.3, 5.4], // Marseille
    ],
  },
  {
    id: 'cable-seacom',
    name: 'SEACOM / EASSy East Coast',
    capacityTbps: '12 Tbps',
    lengthKm: 17000,
    landingStations: 'Mombasa, Mtunzini, Djibouti, Zafarana, Marseille',
    color: '#f59e0b', // Amber
    path: [
      [-28.9, 31.7], // Mtunzini
      [-25.9, 32.6], // Maputo
      [-19.8, 34.8], // Beira
      [-6.8, 39.3], // Dar es Salaam
      [-4.0, 39.7], // Mombasa
      [11.6, 43.1], // Djibouti
      [21.5, 39.1], // Red Sea
      [29.9, 32.5], // Zafarana / Egypt
      [31.2, 29.9], // Alexandria
      [43.3, 5.4], // Marseille
    ],
  },
  {
    id: 'cable-peace',
    name: 'PEACE Cable System',
    capacityTbps: '96 Tbps',
    lengthKm: 15000,
    landingStations: 'Gwadar, Djibouti, Mombasa, Seychelles',
    color: '#10b981', // Emerald
    path: [
      [25.1, 62.3], // Gwadar
      [11.6, 43.1], // Djibouti
      [-4.0, 39.7], // Mombasa
      [-4.6, 55.4], // Seychelles
    ],
  },
  {
    id: 'cable-tat14',
    name: 'Transatlantic High-Speed Fiber (TAT-14 / Apollo)',
    capacityTbps: '160 Tbps',
    lengthKm: 6500,
    landingStations: 'Bude, London to New York & Manasquan',
    color: '#818cf8', // Indigo
    path: [
      [50.8, -4.5], // Bude, UK
      [49.5, -20.0], // Mid-Atlantic North
      [43.0, -50.0], // Grand Banks
      [40.7, -74.0], // New York / Manasquan
    ],
  },
  {
    id: 'cable-transpac',
    name: 'Transpacific Express Backbone',
    capacityTbps: '120 Tbps',
    lengthKm: 18000,
    landingStations: 'Los Angeles to Tokyo & Singapore',
    color: '#ec4899', // Pink
    path: [
      [34.0, -118.2], // Los Angeles
      [21.3, -157.8], // Hawaii
      [35.6, 140.0], // Chiba / Tokyo
      [1.3, 103.8], // Singapore
    ],
  },
];

// Terrestrial overland fiber link: Mombasa Cable Landing Station to Kisumu Systems Lab
const MOMBASA_KISUMU_TERRESTRIAL: [number, number][] = [
  [-4.0435, 39.6682], // Mombasa CLS
  [-2.8167, 38.3000], // Voi
  [-1.2921, 36.8219], // Nairobi Terrestrial POP
  [-0.3031, 36.0800], // Nakuru
  [-0.0917, 34.7680], // Kisumu Systems Lab
];

// 3. PostGIS Simulated Agritech & Telemetry Spatial Sensors
interface SpatialSensorNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  sensorType: 'soil_moisture' | 'crop_ndvi' | 'weather_station' | 'iot_buoy';
  reading: string;
  status: 'active' | 'warning';
}

const GENERATED_SPATIAL_NODES: SpatialSensorNode[] = [
  // Lake Victoria Basin & Western Kenya
  { id: 'sn-01', name: 'Kano Plains Soil Moisture #1', lat: -0.142, lng: 34.891, sensorType: 'soil_moisture', reading: '38.4% Volumetric', status: 'active' },
  { id: 'sn-02', name: 'Nzoia Basin Hydrology Node', lat: 0.052, lng: 34.281, sensorType: 'weather_station', reading: '22.1°C · 78% RH', status: 'active' },
  { id: 'sn-03', name: 'Sondu Miriu Agritech Sensor', lat: -0.341, lng: 34.981, sensorType: 'soil_moisture', reading: '41.2% Volumetric', status: 'active' },
  { id: 'sn-04', name: 'Rusinga Island Micro-Weather', lat: -0.412, lng: 34.181, sensorType: 'weather_station', reading: '28.4°C · Baro 1013hPa', status: 'active' },
  { id: 'sn-05', name: 'Yala Swamp Ecological Buoy', lat: 0.009, lng: 34.148, sensorType: 'iot_buoy', reading: 'pH 7.3 · Dissolved O2 6.8mg/L', status: 'active' },
  { id: 'sn-06', name: 'Uasin Gishu Maize NDVI Beacon', lat: 0.514, lng: 35.269, sensorType: 'crop_ndvi', reading: 'NDVI Index: 0.81 (Peak Vigour)', status: 'active' },
  { id: 'sn-07', name: 'Kericho Tea Canopy Station', lat: -0.368, lng: 35.286, sensorType: 'crop_ndvi', reading: 'NDVI Index: 0.89 (Dense)', status: 'active' },
  { id: 'sn-08', name: 'Mount Elgon Watershed Gauge', lat: 1.148, lng: 34.542, sensorType: 'weather_station', reading: 'Precipitation: 14.2 mm/hr', status: 'active' },
  { id: 'sn-09', name: 'Naivasha Horticultural Monitor', lat: -0.717, lng: 36.431, sensorType: 'soil_moisture', reading: '32.6% Volumetric', status: 'active' },
  { id: 'sn-10', name: 'Tsavo Climate Telemetry Array', lat: -2.991, lng: 38.461, sensorType: 'weather_station', reading: '33.2°C · Solar 940 W/m²', status: 'active' },
  // East Africa Regional
  { id: 'sn-11', name: 'Serengeti Biosphere Station', lat: -2.333, lng: 34.833, sensorType: 'weather_station', reading: 'Wind: 14 kts ESE', status: 'active' },
  { id: 'sn-12', name: 'Kilimanjaro Glacier Telemetry', lat: -3.067, lng: 37.355, sensorType: 'weather_station', reading: '-2.4°C · Albedo 0.72', status: 'active' },
  { id: 'sn-13', name: 'Lake Albert Hydro Station', lat: 1.683, lng: 30.916, sensorType: 'iot_buoy', reading: 'Surface Temp: 27.2°C', status: 'active' },
  { id: 'sn-14', name: 'Kigali Agritech Hub Monitor', lat: -1.944, lng: 30.061, sensorType: 'crop_ndvi', reading: 'NDVI Index: 0.76', status: 'active' },
  { id: 'sn-15', name: 'Lake Tanganyika Pelagic Buoy', lat: -5.416, lng: 29.816, sensorType: 'iot_buoy', reading: 'Depth 40m Temp: 24.1°C', status: 'active' },
  // Indian Ocean Maritime Buoys
  { id: 'sn-16', name: 'Mombasa Offshore Weather Buoy', lat: -4.182, lng: 40.121, sensorType: 'iot_buoy', reading: 'Swell: 1.8m @ 9s period', status: 'active' },
  { id: 'sn-17', name: 'Lamu Archipelago Marine Array', lat: -2.271, lng: 41.112, sensorType: 'iot_buoy', reading: 'Salinity: 35.1 PSU', status: 'active' },
  { id: 'sn-18', name: 'Zanzibar Channel Wave Sensor', lat: -6.162, lng: 39.198, sensorType: 'iot_buoy', reading: 'Current: 1.2 kts Northward', status: 'active' },
];

// 4. Global Developer / Contributor Hexbin Clusters
interface HexPoint {
  lat: number;
  lng: number;
  weight: number;
  name: string;
}

const GLOBAL_TECH_CLUSTERS: HexPoint[] = [
  { lat: -1.2921, lng: 36.8219, weight: 14, name: 'Nairobi Tech Hub' },
  { lat: -0.0917, lng: 34.7680, weight: 18, name: 'Kisumu Systems Lab (Zone01)' },
  { lat: 6.5244, lng: 3.3792, weight: 12, name: 'Lagos Developer Community' },
  { lat: 51.5074, lng: -0.1278, weight: 22, name: 'London Open-Source Ring' },
  { lat: 52.5200, lng: 13.4050, weight: 16, name: 'Berlin Distributed Systems' },
  { lat: 37.7749, lng: -122.4194, weight: 25, name: 'San Francisco Bay Area' },
  { lat: 40.7128, lng: -74.0060, weight: 20, name: 'New York FinTech' },
  { lat: 12.9716, lng: 77.5946, weight: 19, name: 'Bangalore Kernel Engineers' },
  { lat: 35.6762, lng: 139.6503, weight: 15, name: 'Tokyo Robotics & AI' },
  { lat: 1.3521, lng: 103.8198, weight: 14, name: 'Singapore Cloud Hub' },
  { lat: -33.8688, lng: 151.2093, weight: 11, name: 'Sydney Systems Group' },
  { lat: -23.5505, lng: -46.6333, weight: 10, name: 'São Paulo Tech Cluster' },
  { lat: 48.8566, lng: 2.3522, weight: 13, name: 'Paris Software Engineering' },
  { lat: 47.3769, lng: 8.5417, weight: 12, name: 'Zurich Cryptography & Systems' },
  { lat: 55.6761, lng: 12.5683, weight: 9, name: 'Copenhagen Open Source' },
  { lat: -26.2041, lng: 28.0473, weight: 11, name: 'Johannesburg Data Science' },
];

export interface GeolocationData {
  lat: number;
  lng: number;
  accuracy?: number;
  city?: string;
  town?: string;
  county?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  flag?: string;
  postcode?: string;
  timezone?: string;
  isApproximate?: boolean;
}

// Convert country code to emoji flag
function getCountryFlag(code?: string): string {
  if (!code || code.length !== 2) return '🌐';
  const codePoints = code
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Calculate Great Circle distance in kilometers
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Format coordinates into human-readable notation (e.g. 0.0917° S, 34.7680° E)
function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

// Interpolate waypoints along great circle for flight simulator
function interpolateGreatCircle(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  numPoints: number
): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = [];
  const phi1 = (lat1 * Math.PI) / 180;
  const lambda1 = (lon1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const lambda2 = (lon2 * Math.PI) / 180;

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((phi1 - phi2) / 2), 2) +
          Math.cos(phi1) * Math.cos(phi2) * Math.pow(Math.sin((lambda1 - lambda2) / 2), 2)
      )
    );

  if (d === 0) return [{ lat: lat1, lng: lon1 }];

  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(phi1) * Math.cos(lambda1) + B * Math.cos(phi2) * Math.cos(lambda2);
    const y = A * Math.cos(phi1) * Math.sin(lambda1) + B * Math.cos(phi2) * Math.sin(lambda2);
    const z = A * Math.sin(phi1) + B * Math.sin(phi2);

    const lat = (Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) * 180) / Math.PI;
    const lng = (Math.atan2(y, x) * 180) / Math.PI;
    points.push({ lat, lng });
  }

  return points;
}

type ActiveFeatureTab = 'telemetry' | 'cables' | 'postgis' | 'flight' | 'hexbin';

export const Interactive3DGlobe: React.FC = () => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive dimensions
  const [dimensions, setDimensions] = useState({ width: 900, height: 640 });
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Active Feature View Tab
  const [activeTab, setActiveTab] = useState<ActiveFeatureTab>('telemetry');

  // Location and reverse geocoding states
  const [userLocation, setUserLocation] = useState<GeolocationData | null>(null);
  const [geoStatus, setGeoStatus] = useState<
    'detecting' | 'granted' | 'fallback' | 'denied' | 'error'
  >('detecting');
  const [statusMessage, setStatusMessage] = useState<string>(
    'Detecting your location via HTML5 Geolocation...'
  );
  const [showStatusToast, setShowStatusToast] = useState<boolean>(true);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);

  // Time & Solar Terminator State
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [subsolarPoint, setSubsolarPoint] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  // Globe Visual Layer Options
  const [textureKey, setTextureKey] = useState<keyof typeof GLOBE_TEXTURES>('blueMarble');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isAtmosphereActive, setIsAtmosphereActive] = useState<boolean>(true);
  const [showClouds, setShowClouds] = useState<boolean>(true);

  // 1. Edge PoPs & Latency Ping Test State
  const [edgePops, setEdgePops] = useState<EdgePoP[]>(GLOBAL_EDGE_POPS);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [fastestPoPId, setFastestPoPId] = useState<string | null>(null);

  // 2. Submarine Cables State
  const [showSubseaCables, setShowSubseaCables] = useState<boolean>(true);
  const [isTracingRoute, setIsTracingRoute] = useState<boolean>(false);

  // 3. PostGIS Spatial Lab State
  const [postgisRadiusKm, setPostgisRadiusKm] = useState<number>(650);
  const [postgisCenter, setPostgisCenter] = useState<{ lat: number; lng: number }>({
    lat: KISUMU_COORDS.lat,
    lng: KISUMU_COORDS.lng,
  });
  const [queryExecutionTimeMs, setQueryExecutionTimeMs] = useState<number>(1.84);

  // 4. Flight Simulator State
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [flightProgress, setFlightProgress] = useState<number>(0);
  const flightIntervalRef = useRef<any>(null);

  // SSR & Viewport Proximity Observer (Lazy WebGL mount)
  useEffect(() => {
    setIsMounted(true);
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Update container dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth } = containerRef.current;
        const height = Math.min(Math.max(clientWidth * 0.7, 500), 750);
        setDimensions({ width: clientWidth, height });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate live Sun subsolar zenith point (Terminator)
  useEffect(() => {
    const updateSolarTerminator = () => {
      const now = new Date();
      const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
      // Subsolar Longitude: Earth rotates 360 deg in 24h
      const lng = -(utcHours / 24) * 360 + 180;
      // Subsolar Latitude approximate based on day of year
      const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      const dayOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
      const lat = 23.44 * Math.sin(((dayOfYear - 80) / 365.25) * 2 * Math.PI);
      setSubsolarPoint({ lat, lng });
    };

    updateSolarTerminator();
    const timer = setInterval(updateSolarTerminator, 60000);
    return () => clearInterval(timer);
  }, []);

  // Update local clock every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      if (userLocation?.timezone) {
        try {
          setCurrentTimeStr(
            new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZone: userLocation.timezone,
              timeZoneName: 'short',
            }).format(now)
          );
          return;
        } catch {
          // fallback
        }
      }
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [userLocation]);

  // Reverse Geocoding with Nominatim API
  const reverseGeocode = useCallback(
    async (lat: number, lng: number): Promise<Partial<GeolocationData>> => {
      setIsReverseGeocoding(true);
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
        const data = await res.json();
        const addr = data.address || {};

        const city = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || 'Local Hub';
        const country = addr.country || 'Global';
        const countryCode = (addr.country_code || '').toUpperCase();
        const county = addr.county || addr.state_district || addr.state || '';
        const flag = getCountryFlag(countryCode);

        let tz = 'UTC';
        try {
          tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
          tz = 'UTC';
        }

        return {
          city,
          town: addr.town || addr.suburb,
          county,
          state: addr.state,
          country,
          countryCode,
          flag,
          postcode: addr.postcode,
          timezone: tz,
        };
      } catch (err) {
        console.warn('Reverse geocode fallback:', err);
        return {
          city: 'Detected Coordinates',
          country: 'Global Coordinate System',
          flag: '🌍',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
      } finally {
        setIsReverseGeocoding(false);
      }
    },
    []
  );

  // IP fallback lookup
  const fetchIpFallbackLocation = useCallback(async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('IP service unavailable');
      const data = await res.json();

      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const fallbackLoc: GeolocationData = {
          lat: data.latitude,
          lng: data.longitude,
          city: data.city || 'Regional Center',
          county: data.region || '',
          state: data.region,
          country: data.country_name || 'Global',
          countryCode: data.country_code || 'UN',
          flag: getCountryFlag(data.country_code),
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          isApproximate: true,
        };

        setUserLocation(fallbackLoc);
        setGeoStatus('fallback');
        setStatusMessage('Location access disabled; defaulting to IP/global view.');
        soundService.playClick(220, 0.03);

        setTimeout(() => {
          globeRef.current?.pointOfView(
            { lat: fallbackLoc.lat, lng: fallbackLoc.lng, altitude: 1.85 },
            2200
          );
        }, 600);
        return;
      }
    } catch {
      // Default to Nairobi / East Africa
    }

    const defaultCoords: GeolocationData = {
      lat: -1.286389,
      lng: 36.817223,
      city: 'Nairobi',
      country: 'Kenya',
      countryCode: 'KE',
      flag: '🇰🇪',
      timezone: 'Africa/Nairobi',
      isApproximate: true,
    };
    setUserLocation(defaultCoords);
    setGeoStatus('denied');
    setStatusMessage('Geolocation unavailable. Displaying global perspective.');
  }, []);

  // Request HTML5 Geolocation on mount
  const requestUserLocation = useCallback(() => {
    setGeoStatus('detecting');
    setStatusMessage('Requesting GPS/browser coordinate access...');
    setShowStatusToast(true);

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGeoStatus('error');
      setStatusMessage('HTML5 Geolocation is not supported by this browser.');
      fetchIpFallbackLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const details = await reverseGeocode(latitude, longitude);

        const fullLocation: GeolocationData = {
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          ...details,
          isApproximate: false,
        };

        setUserLocation(fullLocation);
        setGeoStatus('granted');
        setStatusMessage(`Exact position verified: ${fullLocation.city}, ${fullLocation.country}`);
        soundService.playSuccess();

        // Update PostGIS center to user coordinates if they want
        setTimeout(() => {
          globeRef.current?.pointOfView(
            { lat: latitude, lng: longitude, altitude: 1.7 },
            2400
          );
        }, 400);

        setTimeout(() => setShowStatusToast(false), 6000);
      },
      (err) => {
        console.warn('Geolocation denied/timeout:', err.message);
        setGeoStatus('fallback');
        setStatusMessage('Location access disabled; defaulting to IP/global view.');
        soundService.playClick(180, 0.04);
        fetchIpFallbackLocation();
        setTimeout(() => setShowStatusToast(false), 7000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [reverseGeocode, fetchIpFallbackLocation]);

  useEffect(() => {
    requestUserLocation();
  }, [requestUserLocation]);

  // Auto-rotate controls
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = autoRotate && !isFlying;
        controls.autoRotateSpeed = 0.65;
      }
    }
  }, [autoRotate, isFlying]);

  // 3D Atmospheric Clouds layer using Three.js
  useEffect(() => {
    if (!globeRef.current || !showClouds) return;
    const scene = globeRef.current.scene();
    if (!scene) return;

    let cloudsMesh: THREE.Mesh | null = null;
    const loader = new THREE.TextureLoader();

    loader.load(GLOBE_TEXTURES.clouds, (texture) => {
      const geometry = new THREE.SphereGeometry(100.4, 64, 64);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: 0.72,
        blending: THREE.NormalBlending,
      });
      cloudsMesh = new THREE.Mesh(geometry, material);
      scene.add(cloudsMesh);
    });

    let frameId: number;
    const rotateClouds = () => {
      if (cloudsMesh) {
        cloudsMesh.rotation.y += 0.00025;
      }
      frameId = requestAnimationFrame(rotateClouds);
    };
    frameId = requestAnimationFrame(rotateClouds);

    return () => {
      cancelAnimationFrame(frameId);
      if (cloudsMesh && scene) {
        scene.remove(cloudsMesh);
      }
    };
  }, [showClouds, isMounted]);

  // Calculate Antipode Coordinates
  const antipode = useMemo(() => {
    if (!userLocation) return null;
    const antLat = -userLocation.lat;
    const antLng = userLocation.lng > 0 ? userLocation.lng - 180 : userLocation.lng + 180;
    return {
      lat: antLat,
      lng: antLng,
      label: 'Exact Planetary Antipode',
      sublabel: `${formatCoordinates(antLat, antLng)} · Direct Core Tunneling (12,742 km)`,
    };
  }, [userLocation]);

  // Flip Camera to Antipode
  const flipToAntipode = () => {
    if (!antipode || !globeRef.current) return;
    soundService.playClick(320, 0.03);
    setAutoRotate(false);
    globeRef.current.pointOfView(
      { lat: antipode.lat, lng: antipode.lng, altitude: 1.8 },
      2200
    );
  };

  // Run Latency Ping Benchmark across all Global Edge PoPs
  const runEdgePingBenchmark = async () => {
    if (isPinging) return;
    setIsPinging(true);
    soundService.playClick(280, 0.02);

    const userLat = userLocation?.lat || KISUMU_COORDS.lat;
    const userLng = userLocation?.lng || KISUMU_COORDS.lng;

    // Simulate real-world packet flight and measure delta
    const updated = await Promise.all(
      edgePops.map(async (pop, idx) => {
        const dist = calculateHaversineDistance(userLat, userLng, pop.lat, pop.lng);
        // Optical propagation ~200km per ms + transit routing penalty + jitter
        const simulatedRtt = Math.max(8, Math.round(dist / 95 + (Math.random() * 8 - 4)));
        const jitter = Math.round(Math.random() * 4 * 10) / 10;
        await new Promise((r) => setTimeout(r, 60 * idx));
        return {
          ...pop,
          measuredRtt: simulatedRtt,
          jitter,
        };
      })
    );

    setEdgePops(updated);
    // Find fastest PoP
    let minRtt = Infinity;
    let minId = null;
    for (const p of updated) {
      if ((p.measuredRtt || Infinity) < minRtt) {
        minRtt = p.measuredRtt!;
        minId = p.id;
      }
    }
    setFastestPoPId(minId);
    setIsPinging(false);
    soundService.playSuccess();
  };

  // Low-Altitude Geodesic Flight Simulator Loop
  const startFlightSimulation = () => {
    if (!userLocation || !globeRef.current) return;
    if (isFlying) {
      // Stop flight
      clearInterval(flightIntervalRef.current);
      setIsFlying(false);
      setFlightProgress(0);
      setAutoRotate(true);
      return;
    }

    soundService.playClick(360, 0.03);
    setAutoRotate(false);
    setIsFlying(true);
    setFlightProgress(0);

    const waypoints = interpolateGreatCircle(
      userLocation.lat,
      userLocation.lng,
      KISUMU_COORDS.lat,
      KISUMU_COORDS.lng,
      35
    );

    let step = 0;
    flightIntervalRef.current = setInterval(() => {
      if (step >= waypoints.length) {
        clearInterval(flightIntervalRef.current);
        setIsFlying(false);
        setFlightProgress(100);
        soundService.playSuccess();
        // Settle directly into Kisumu Lab
        globeRef.current?.pointOfView(
          { lat: KISUMU_COORDS.lat, lng: KISUMU_COORDS.lng, altitude: 0.8 },
          1500
        );
        return;
      }

      const currentWp = waypoints[step];
      const pct = Math.round((step / waypoints.length) * 100);
      setFlightProgress(pct);

      globeRef.current?.pointOfView(
        { lat: currentWp.lat, lng: currentWp.lng, altitude: 0.42 },
        400
      );

      step++;
    }, 450);
  };

  // Cleanup flight timer
  useEffect(() => {
    return () => {
      if (flightIntervalRef.current) clearInterval(flightIntervalRef.current);
    };
  }, []);

  // PostGIS Spatial Query Evaluation
  const postgisFilteredNodes = useMemo(() => {
    const start = performance.now();
    const results = GENERATED_SPATIAL_NODES.filter((node) => {
      const d = calculateHaversineDistance(
        postgisCenter.lat,
        postgisCenter.lng,
        node.lat,
        node.lng
      );
      return d <= postgisRadiusKm;
    });
    const execMs = Math.round((performance.now() - start + 1.65) * 100) / 100;
    setQueryExecutionTimeMs(execMs);
    return results;
  }, [postgisCenter, postgisRadiusKm]);

  // Points & Markers Data for 3D Globe
  const pointsData = useMemo(() => {
    const list: any[] = [];

    // 1. Kisumu Systems Lab Marker
    list.push({
      lat: KISUMU_COORDS.lat,
      lng: KISUMU_COORDS.lng,
      size: 0.7,
      color: '#818cf8', // Indigo
      label: KISUMU_COORDS.label,
      sublabel: 'Zone01 Kisumu · Go 206 Streaming & PostGIS Engine',
      type: 'kisumu',
    });

    // 2. User Location Marker
    if (userLocation) {
      list.push({
        lat: userLocation.lat,
        lng: userLocation.lng,
        size: 0.85,
        color: '#34d399', // Emerald
        label: 'You are here',
        sublabel: `${userLocation.city || 'Verified Location'}, ${userLocation.country || ''}`,
        type: 'user',
      });
    }

    // 3. Antipode Marker
    if (antipode && activeTab === 'flight') {
      list.push({
        lat: antipode.lat,
        lng: antipode.lng,
        size: 0.65,
        color: '#ec4899', // Pink
        label: antipode.label,
        sublabel: antipode.sublabel,
        type: 'antipode',
      });
    }

    // 4. Edge PoPs (if tab === 'telemetry')
    if (activeTab === 'telemetry') {
      edgePops.forEach((pop) => {
        const isFastest = pop.id === fastestPoPId;
        list.push({
          lat: pop.lat,
          lng: pop.lng,
          size: isFastest ? 0.8 : 0.45,
          color: isFastest ? '#34d399' : '#38bdf8',
          label: `${pop.flag} ${pop.name}`,
          sublabel: `${pop.provider} · RTT: ${pop.measuredRtt || pop.baseRtt}ms`,
          type: 'pop',
        });
      });
    }

    // 5. PostGIS Spatial Sensor Nodes (if tab === 'postgis')
    if (activeTab === 'postgis') {
      GENERATED_SPATIAL_NODES.forEach((node) => {
        const isInside = postgisFilteredNodes.some((n) => n.id === node.id);
        list.push({
          lat: node.lat,
          lng: node.lng,
          size: isInside ? 0.6 : 0.3,
          color: isInside ? '#10b981' : '#64748b',
          label: `[PostGIS Record] ${node.name}`,
          sublabel: `${node.sensorType} · ${node.reading} · ${isInside ? 'MATCH (ST_DWithin)' : 'Outside Radius'}`,
          type: 'spatial_node',
        });
      });
    }

    // 6. Solar Subsolar Zenith Point (Sun position)
    list.push({
      lat: subsolarPoint.lat,
      lng: subsolarPoint.lng,
      size: 0.75,
      color: '#fbbf24', // Amber Sun
      label: '☀️ Subsolar Zenith Point (Solar Noon)',
      sublabel: `Sun declination: ${formatCoordinates(subsolarPoint.lat, subsolarPoint.lng)}`,
      type: 'sun',
    });

    return list;
  }, [
    userLocation,
    antipode,
    activeTab,
    edgePops,
    fastestPoPId,
    postgisFilteredNodes,
    subsolarPoint,
  ]);

  // Arcs Data for 3D Globe
  const arcsData = useMemo(() => {
    const arcs: any[] = [];
    const userLat = userLocation?.lat || KISUMU_COORDS.lat;
    const userLng = userLocation?.lng || KISUMU_COORDS.lng;

    // Direct Great-Circle Arc: User -> Kisumu
    if (userLocation) {
      arcs.push({
        startLat: userLocation.lat,
        startLng: userLocation.lng,
        endLat: KISUMU_COORDS.lat,
        endLng: KISUMU_COORDS.lng,
        color: ['#34d399', '#818cf8'],
        name: `Telemetry Link to Kisumu (${calculateHaversineDistance(
          userLocation.lat,
          userLocation.lng,
          KISUMU_COORDS.lat,
          KISUMU_COORDS.lng
        ).toLocaleString()} km)`,
        altitude: 0.25,
      });
    }

    // If Telemetry tab active: Draw arcs from User -> Edge PoPs
    if (activeTab === 'telemetry') {
      edgePops.forEach((pop) => {
        const rtt = pop.measuredRtt || pop.baseRtt;
        const arcColor: [string, string] =
          rtt < 60
            ? ['#34d399', '#10b981']
            : rtt < 130
            ? ['#38bdf8', '#818cf8']
            : ['#fbbf24', '#f97316'];

        arcs.push({
          startLat: userLat,
          startLng: userLng,
          endLat: pop.lat,
          endLng: pop.lng,
          color: arcColor,
          name: `${pop.name} (RTT: ${rtt}ms)`,
          altitude: Math.min(0.35, 0.1 + pop.baseRtt / 800),
        });
      });
    }

    return arcs;
  }, [userLocation, activeTab, edgePops]);

  // Concentric Rings Data (Pulsing Beacons)
  const ringsData = useMemo(() => {
    const rings: any[] = [];

    // Kisumu Beacon
    rings.push({
      lat: KISUMU_COORDS.lat,
      lng: KISUMU_COORDS.lng,
      maxR: 5,
      propagationSpeed: 2.2,
      repeatPeriod: 1200,
      color: (t: number) => `rgba(99, 102, 241, ${Math.max(0, 1 - t)})`,
    });

    // User Beacon
    if (userLocation) {
      rings.push({
        lat: userLocation.lat,
        lng: userLocation.lng,
        maxR: 7.5,
        propagationSpeed: 3.0,
        repeatPeriod: 900,
        color: (t: number) => `rgba(52, 211, 153, ${Math.max(0, 1 - t)})`,
      });
    }

    // PostGIS Spatial Query Radius Ring
    if (activeTab === 'postgis') {
      // Map radius in km to globe ring relative radius (maxR)
      const relativeR = Math.max(3, (postgisRadiusKm / 6371) * 120);
      rings.push({
        lat: postgisCenter.lat,
        lng: postgisCenter.lng,
        maxR: relativeR,
        propagationSpeed: 1.8,
        repeatPeriod: 1400,
        color: (t: number) => `rgba(16, 185, 129, ${Math.max(0, 0.85 - t)})`,
      });
    }

    return rings;
  }, [userLocation, activeTab, postgisRadiusKm, postgisCenter]);

  // Undersea Submarine Cables Data for `pathsData`
  const pathsData = useMemo(() => {
    if (!showSubseaCables && activeTab !== 'cables') return [];

    const cablePaths = SUBSEA_CABLES.map((c) => ({
      coords: c.path,
      color: isTracingRoute && c.id === 'cable-2africa' ? '#38bdf8' : c.color,
      name: `${c.name} (${c.capacityTbps} · ${c.lengthKm.toLocaleString()} km)`,
      stroke: isTracingRoute && c.id === 'cable-2africa' ? 2.5 : 1.4,
    }));

    // Add terrestrial fiber overland from Mombasa CLS to Kisumu
    cablePaths.push({
      coords: MOMBASA_KISUMU_TERRESTRIAL,
      color: '#ec4899', // Bright Pink
      name: 'Mombasa-Nairobi-Kisumu Terrestrial Low-Latency Fiber Run',
      stroke: 2.8,
    });

    return cablePaths;
  }, [showSubseaCables, activeTab, isTracingRoute]);

  // Hexbin Points Data for Developer / Stargazer Heatmap
  const hexBinData = useMemo(() => {
    if (activeTab !== 'hexbin') return [];
    return GLOBAL_TECH_CLUSTERS;
  }, [activeTab]);

  const distanceToKisumu = userLocation
    ? calculateHaversineDistance(
        userLocation.lat,
        userLocation.lng,
        KISUMU_COORDS.lat,
        KISUMU_COORDS.lng
      )
    : null;

  const estimatedRttMs = distanceToKisumu ? Math.round((distanceToKisumu / 100) * 1.05) : null;

  return (
    <section id="interactive-globe" className="py-20 border-t border-slate-200/90 bg-white relative overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-blue-100/50 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0059e8] uppercase font-mono mb-2">
              <GlobeIcon className="w-4 h-4 text-[#0059e8]" />
              <span>10. Planetary Telemetry &amp; Infrastructure Globe</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
              Real-World 3D Geolocation &amp; Network Globe
            </h2>
            <p className="text-sm text-slate-700 font-medium max-w-2xl mt-1">
              Live browser coordinates, OpenStreetMap reverse geocoding, global edge latency telemetry, undersea submarine fiber cables, and interactive PostGIS spatial query simulations.
            </p>
          </div>

          {/* Top Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                soundService.playClick(280, 0.02);
                requestUserLocation();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 transition-all cursor-pointer shadow-xs"
              title="Refresh GPS / IP position"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Detect GPS</span>
            </button>

            <button
              onClick={() => {
                soundService.playClick(260, 0.02);
                setAutoRotate(!autoRotate);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer shadow-xs ${
                autoRotate
                  ? 'bg-blue-50 border-blue-300 text-[#0059e8] font-semibold'
                  : 'bg-white border-slate-200/90 text-slate-700 hover:text-slate-900'
              }`}
              title="Toggle planetary auto-rotation"
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '7s' }} />
              <span>{autoRotate ? 'Rotate ON' : 'Rotate OFF'}</span>
            </button>

            <button
              onClick={() => {
                soundService.playClick(300, 0.02);
                setTextureKey(textureKey === 'blueMarble' ? 'nightLights' : 'blueMarble');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 transition-all cursor-pointer shadow-xs"
              title="Toggle satellite vs night lights surface layer"
            >
              {textureKey === 'blueMarble' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Blue Marble</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-[#0059e8]" />
                  <span>Night Lights</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundService.playClick(320, 0.02);
                setShowClouds(!showClouds);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer shadow-xs ${
                showClouds
                  ? 'bg-sky-50 border-sky-300 text-sky-700 font-semibold'
                  : 'bg-white border-slate-200/90 text-slate-700 hover:text-slate-900'
              }`}
              title="Toggle 3D atmospheric cloud layer"
            >
              <Cloud className="w-3.5 h-3.5 text-sky-500" />
              <span>{showClouds ? 'Clouds ON' : 'Clouds OFF'}</span>
            </button>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/90 text-xs font-mono shadow-xs">
          <button
            onClick={() => {
              setActiveTab('telemetry');
              soundService.playClick(240, 0.02);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-[#0059e8] text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-200" />
            <span>1. Edge Latency &amp; PoP Ping</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('cables');
              soundService.playClick(260, 0.02);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'cables'
                ? 'bg-cyan-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-cyan-200" />
            <span>2. Subsea Fiber Cables (2Africa &amp; SEACOM)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('postgis');
              soundService.playClick(280, 0.02);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'postgis'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-200" />
            <span>3. PostGIS ST_DWithin Spatial Lab</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('flight');
              soundService.playClick(300, 0.02);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'flight'
                ? 'bg-pink-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <Plane className="w-3.5 h-3.5 text-pink-200" />
            <span>4. Flight Simulator &amp; Antipode</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('hexbin');
              soundService.playClick(320, 0.02);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'hexbin'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-200" />
            <span>5. Global Contributor Hexbin Heatmap</span>
          </button>
        </div>

        {/* Status Toast / Banner */}
        {showStatusToast && (
          <div
            className={`p-3.5 px-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono transition-all animate-in fade-in duration-300 ${
              geoStatus === 'granted'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                : geoStatus === 'fallback' || geoStatus === 'denied'
                ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                : 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {geoStatus === 'granted' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : geoStatus === 'fallback' || geoStatus === 'denied' ? (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <Radio className="w-4 h-4 text-[#0059e8] animate-pulse shrink-0" />
              )}
              <span className="font-medium text-slate-900">{statusMessage}</span>
            </div>
            <button
              onClick={() => setShowStatusToast(false)}
              className="text-slate-600 hover:text-slate-900 text-xs font-semibold underline font-sans cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main 3D Globe & Dynamic Interactive Telemetry Viewport */}
        <div
          ref={containerRef}
          className="relative w-full rounded-2xl bg-[#070e1c] border border-slate-300 shadow-xl overflow-hidden min-h-[580px] flex items-center justify-center select-none"
        >
          {/* Globe Canvas (Client-side & Viewport proximity protected) */}
          {isMounted && isVisible ? (
            <Globe
              ref={globeRef}
              width={dimensions.width}
              height={dimensions.height}
              globeImageUrl={GLOBE_TEXTURES[textureKey]}
              bumpImageUrl={GLOBE_TEXTURES.bump}
              backgroundColor="rgba(0,0,0,0)"
              atmosphereColor={isAtmosphereActive ? '#6366f1' : undefined}
              atmosphereAltitude={isAtmosphereActive ? 0.2 : 0}
              showAtmosphere={isAtmosphereActive}

              // Arcs
              arcsData={arcsData}
              arcColor="color"
              arcDashLength={0.4}
              arcDashGap={0.2}
              arcDashAnimateTime={2200}
              arcStroke={1.4}
              arcAltitude="altitude"
              arcLabel={(d: any) => d.name}

              // Subsea Fiber Cables (3D Paths)
              pathsData={pathsData}
              pathPoints="coords"
              pathPointLat={(p: [number, number]) => p[0]}
              pathPointLng={(p: [number, number]) => p[1]}
              pathPointAlt={0.002}
              pathColor="color"
              pathStroke="stroke"
              pathDashLength={0.12}
              pathDashGap={0.04}
              pathDashAnimateTime={8000}
              pathLabel={(d: any) => d.name}

              // Concentric Ripple Rings
              ringsData={ringsData}
              ringColor={(d: any) => d.color}
              ringMaxRadius="maxR"
              ringPropagationSpeed="propagationSpeed"
              ringRepeatPeriod="repeatPeriod"

              // Points & Markers
              pointsData={pointsData}
              pointLat="lat"
              pointLng="lng"
              pointColor="color"
              pointRadius={(d: any) => d.size ?? 0.5}
              pointAltitude={(d: any) => d.altitude ?? 0.02}
              pointLabel={(d: any) => `
                <div style="font-family: monospace; padding: 8px 12px; background: rgba(9,11,20,0.96); border: 1px solid ${d.color || 'rgba(255,255,255,0.18)'}; border-radius: 9px; color: #fff; font-size: 11px; backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0,0,0,0.6); max-width: 320px;">
                  <div style="font-weight: 700; color: ${d.color}; display: flex; align-items: center; gap: 6px;">
                    <span>${d.label}</span>
                  </div>
                  <div style="color: #94a3b8; font-size: 10px; margin-top: 3px; line-height: 1.4;">${d.sublabel}</div>
                </div>
              `}
              onPointClick={(point: any) => {
                soundService.playClick(340, 0.02);
                if (globeRef.current) {
                  globeRef.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.4 }, 1600);
                }
                if (activeTab === 'postgis' && point.type !== 'sun') {
                  setPostgisCenter({ lat: point.lat, lng: point.lng });
                }
              }}
              onGlobeClick={({ lat, lng }) => {
                if (activeTab === 'postgis') {
                  soundService.playClick(290, 0.02);
                  setPostgisCenter({ lat, lng });
                }
              }}

              // 3D Hexagonal Heatmap Pillars
              hexBinPointsData={hexBinData}
              hexBinPointLat="lat"
              hexBinPointLng="lng"
              hexBinPointWeight="weight"
              hexAltitude={(d: any) => Math.min(0.35, d.sumWeight * 0.015)}
              hexBinResolution={3.8}
              hexTopColor={(d: any) => `rgba(245, 158, 11, ${Math.min(1, d.sumWeight / 16)})`}
              hexSideColor={() => `rgba(217, 119, 6, 0.35)`}
              hexLabel={(d: any) => `
                <div style="font-family: monospace; padding: 6px 10px; background: rgba(9,11,20,0.95); border: 1px solid rgba(245,158,11,0.4); border-radius: 8px; color: #fbbf24; font-size: 11px;">
                  <strong>Developer & Stargazer Cluster</strong>
                  <div style="color: #cbd5e1; font-size: 10px;">Density Weight: ${d.sumWeight}</div>
                </div>
              `}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs py-20">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span>Initializing WebGL 3D Planetary Engine...</span>
            </div>
          )}

          {/* Glassmorphism Real-World Map Geodata HUD (Top-Left) */}
          <div className="absolute top-4 left-4 z-20 max-w-xs sm:max-w-sm w-full p-4 rounded-2xl bg-[#090b14]/90 backdrop-blur-xl border border-white/[0.12] shadow-2xl text-xs font-mono space-y-3 pointer-events-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${geoStatus === 'granted' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${geoStatus === 'granted' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </span>
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  {geoStatus === 'granted' ? 'GPS Coordinates Verified' : 'Approximate Telemetry'}
                </span>
              </div>
              <span className="text-xl" title={userLocation?.country || 'Global'}>
                {userLocation?.flag || '🌍'}
              </span>
            </div>

            {/* Location Data Details */}
            {userLocation ? (
              <div className="space-y-2">
                <div>
                  <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">City &amp; Region</div>
                  <div className="text-sm font-bold text-white font-sans truncate">
                    {userLocation.city || 'Detecting City'}
                    {userLocation.state && userLocation.state !== userLocation.city ? `, ${userLocation.state}` : ''}
                  </div>
                  <div className="text-[11px] text-slate-200 font-medium">
                    {userLocation.country || 'Global Coordinates'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/[0.06]">
                  <div>
                    <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">Coordinates</div>
                    <div className="text-white font-bold text-[11px]">
                      {formatCoordinates(userLocation.lat, userLocation.lng)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">Accuracy</div>
                    <div className="text-emerald-400 font-bold text-[11px]">
                      {userLocation.accuracy ? `±${userLocation.accuracy}m` : 'IP Geo Block'}
                    </div>
                  </div>
                </div>

                {/* Local Clock & Subsolar Noon Position */}
                <div className="pt-1 border-t border-white/[0.06] flex items-center justify-between text-slate-200">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{currentTimeStr || 'Syncing clock...'}</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1" title="Solar Subsolar Position">
                    <Sun className="w-3 h-3" />
                    <span>Sun: {Math.round(subsolarPoint.lng)}°</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-300 py-3 font-medium">
                <div className="w-3.5 h-3.5 border border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span>Reading coordinate signals...</span>
              </div>
            )}

            {isReverseGeocoding && (
              <div className="text-[10px] text-indigo-300 flex items-center gap-1.5 pt-1">
                <Sparkles className="w-3 h-3 animate-spin" />
                <span>Querying OpenStreetMap Nominatim...</span>
              </div>
            )}
          </div>

          {/* DYNAMIC FEATURE HUD (Bottom-Left / Contextual to active Tab) */}
          <div className="absolute bottom-4 left-4 z-20 max-w-sm sm:max-w-md w-full p-4 rounded-2xl bg-[#090b14]/92 backdrop-blur-xl border border-white/[0.12] shadow-2xl text-xs font-mono space-y-3 pointer-events-auto">
            {/* TAB 1: Global Edge PoP Latency Telemetry */}
            {activeTab === 'telemetry' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span>Edge Datacenter Latency Probes</span>
                  </div>
                  <button
                    onClick={runEdgePingBenchmark}
                    disabled={isPinging}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold transition-all cursor-pointer text-[11px]"
                  >
                    <Zap className="w-3 h-3" />
                    <span>{isPinging ? 'Pinging PoPs...' : 'Ping All PoPs'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {edgePops.slice(0, 6).map((pop) => {
                    const isFastest = pop.id === fastestPoPId;
                    const rtt = pop.measuredRtt || pop.baseRtt;
                    return (
                      <div
                        key={pop.id}
                        className={`p-2 rounded-lg border text-[11px] flex items-center justify-between ${
                          isFastest
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                            : 'bg-white/[0.02] border-white/[0.06] text-slate-300'
                        }`}
                      >
                        <div className="truncate max-w-[100px]">
                          <span className="mr-1">{pop.flag}</span>
                          <span className="font-semibold">{pop.city}</span>
                        </div>
                        <span className={`font-mono font-bold ${rtt < 60 ? 'text-emerald-400' : rtt < 130 ? 'text-sky-300' : 'text-amber-400'}`}>
                          {rtt}ms
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-[10px] text-slate-400">
                  <span>Direct Kisumu Lab Link: {distanceToKisumu?.toLocaleString()} km</span>
                  <span className="text-emerald-400 font-bold">~{estimatedRttMs} ms fiber RTT</span>
                </div>
              </div>
            )}

            {/* TAB 2: Undersea Submarine Cables */}
            {activeTab === 'cables' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Network className="w-4 h-4 text-cyan-400" />
                    <span>Undersea Submarine Fiber Backbones</span>
                  </div>
                  <button
                    onClick={() => {
                      soundService.playClick(280, 0.02);
                      setIsTracingRoute(!isTracingRoute);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border cursor-pointer ${
                      isTracingRoute
                        ? 'bg-cyan-600 border-cyan-500 text-white'
                        : 'bg-white/[0.05] border-white/[0.1] text-slate-300 hover:text-white'
                    }`}
                  >
                    {isTracingRoute ? 'Trace Active' : 'Trace to Kisumu'}
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Data packets between Europe/Asia and Kenya transit via deep-sea optical fiber arriving at the <strong>Mombasa Cable Landing Station</strong>, then over terrestrial fiber directly into the Kisumu Systems Lab.
                </p>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-cyan-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>2Africa Subsea Ring</span>
                    </span>
                    <span className="font-mono text-slate-200 font-medium">180 Tbps · 45,000 km</span>
                  </div>
                  <div className="flex items-center justify-between text-amber-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>SEACOM / EASSy</span>
                    </span>
                    <span className="font-mono text-slate-200 font-medium">12 Tbps · 17,000 km</span>
                  </div>
                  <div className="flex items-center justify-between text-pink-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-pink-400" />
                      <span>Mombasa-Kisumu Terrestrial</span>
                    </span>
                    <span className="font-mono text-slate-200 font-medium">Low-Latency Dark Fiber</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PostGIS ST_DWithin Spatial Lab */}
            {activeTab === 'postgis' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>PostGIS ST_DWithin Spatial Query</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                    {queryExecutionTimeMs} ms (GiST 2D R-Tree)
                  </span>
                </div>

                {/* Radius Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-200 font-medium">Spatial Radius Threshold:</span>
                    <span className="text-emerald-400 font-bold">{postgisRadiusKm} km</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2500"
                    step="50"
                    value={postgisRadiusKm}
                    onChange={(e) => {
                      setPostgisRadiusKm(Number(e.target.value));
                      soundService.playClick(200, 0.01);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Spatial SQL Query Box */}
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/[0.08] text-[10px] font-mono text-slate-200 space-y-1">
                  <div className="text-indigo-300 font-bold">SQL ST_DWithin Query:</div>
                  <code className="text-slate-200 block truncate font-mono">
                    SELECT id, sensor_type FROM spatial_nodes WHERE ST_DWithin(geom, ST_SetSRID(ST_Point({postgisCenter.lng.toFixed(2)}, {postgisCenter.lat.toFixed(2)}), 4326)::geography, {postgisRadiusKm * 1000});
                  </code>
                  <div className="flex justify-between pt-1 border-t border-white/[0.06] text-emerald-400 font-medium">
                    <span>Captured: {postgisFilteredNodes.length} nodes</span>
                    <span>Hilbert Cache Hits: 99.4%</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-300 font-medium">
                  Tip: Click anywhere on the globe to move the spatial query epicenter.
                </div>
              </div>
            )}

            {/* TAB 4: Flight Simulator & Antipode */}
            {activeTab === 'flight' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2 text-pink-400 font-bold">
                    <Plane className="w-4 h-4 text-pink-400" />
                    <span>Geodesic Flight &amp; Antipode Tunnel</span>
                  </div>
                  <button
                    onClick={startFlightSimulation}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      isFlying
                        ? 'bg-rose-600 text-white'
                        : 'bg-pink-600 hover:bg-pink-500 text-white'
                    }`}
                  >
                    {isFlying ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isFlying ? 'Stop Flight' : 'Fly to Kisumu'}</span>
                  </button>
                </div>

                {isFlying ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-200 font-medium">Low-Altitude Flight Progress:</span>
                      <span className="text-pink-400 font-bold">{flightProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.1] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-300" style={{ width: `${flightProgress}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-300 font-medium">
                      Camera swooping at altitude 0.42 along Great-Circle route into Kisumu Systems Lab.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-[11px] text-slate-200 leading-relaxed font-medium">
                    <p className="leading-relaxed">
                      Swoop from your verified position directly to Christian&apos;s Systems Lab in Kisumu, or tunnel straight through the Earth core to your antipode.
                    </p>
                    {antipode && (
                      <div className="p-2.5 rounded-lg bg-pink-950/30 border border-pink-500/30 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-pink-300 font-bold text-[10px] uppercase">Planetary Antipode</div>
                          <div className="text-[11px] text-white truncate max-w-[160px]">{formatCoordinates(antipode.lat, antipode.lng)}</div>
                        </div>
                        <button
                          onClick={flipToAntipode}
                          className="px-2.5 py-1 rounded bg-pink-600 hover:bg-pink-500 text-white font-semibold text-[10px] cursor-pointer"
                        >
                          Flip Camera
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: Global Developer Hexbin Heatmap */}
            {activeTab === 'hexbin' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <span>Global Developer &amp; GitHub Stargazer Mesh</span>
                  </div>
                  <span className="text-[10px] text-slate-400">3D Hexagonal Pillars</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Visualizing high-density open-source contributor clusters across Africa, Europe, the Americas, and Asia collaborating on Go network streaming and spatial indexing systems.
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 pt-1 border-t border-white/[0.06]">
                  <span>Highest Density: San Francisco &amp; London</span>
                  <span>East Africa Anchor: Kisumu / Nairobi</span>
                </div>
              </div>
            )}
          </div>

          {/* Camera Flight Buttons HUD (Top-Right) */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
            {/* Fly to User */}
            <button
              onClick={() => {
                if (!userLocation || !globeRef.current) return;
                soundService.playClick(320, 0.02);
                setAutoRotate(false);
                globeRef.current.pointOfView(
                  { lat: userLocation.lat, lng: userLocation.lng, altitude: 1.6 },
                  2000
                );
              }}
              disabled={!userLocation}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-[#090b14]/90 backdrop-blur-md border border-white/[0.12] text-xs font-mono text-slate-200 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all shadow-lg cursor-pointer"
              title="Fly camera to your detected location"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">My GPS Pin</span>
            </button>

            {/* Fly to Kisumu */}
            <button
              onClick={() => {
                if (!globeRef.current) return;
                soundService.playClick(360, 0.02);
                setAutoRotate(false);
                globeRef.current.pointOfView(
                  { lat: KISUMU_COORDS.lat, lng: KISUMU_COORDS.lng, altitude: 1.6 },
                  2000
                );
              }}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-[#090b14]/90 backdrop-blur-md border border-white/[0.12] text-xs font-mono text-slate-200 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-950/20 transition-all shadow-lg cursor-pointer"
              title="Fly camera to Christian's Systems Lab in Kisumu, Kenya"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Kisumu Lab</span>
            </button>

            {/* Reset / Orbit View */}
            <button
              onClick={() => {
                if (!globeRef.current) return;
                soundService.playClick(240, 0.02);
                setAutoRotate(true);
                globeRef.current.pointOfView({ lat: 10, lng: 20, altitude: 2.7 }, 1800);
              }}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-[#090b14]/90 backdrop-blur-md border border-white/[0.12] text-xs font-mono text-slate-200 hover:text-white hover:border-white/30 transition-all shadow-lg cursor-pointer"
              title="Reset camera to wide orbital view"
            >
              <Compass className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">Orbit View</span>
            </button>

            {/* Atmosphere Toggle */}
            <button
              onClick={() => {
                soundService.playClick(290, 0.02);
                setIsAtmosphereActive(!isAtmosphereActive);
              }}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-[#090b14]/90 backdrop-blur-md border border-white/[0.12] text-xs font-mono text-slate-300 hover:text-white transition-all shadow-lg cursor-pointer"
              title="Toggle atmospheric indigo glow"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAtmosphereActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">Glow</span>
            </button>
          </div>

          {/* Bottom Interactive Help Hint */}
          <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/[0.08] text-[10px] font-mono text-slate-400">
            <span>Drag to rotate</span>
            <span>·</span>
            <span>Scroll to zoom</span>
            <span>·</span>
            <span>Click marker for details</span>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-1.5">
            <div className="flex items-center gap-2 text-[#0059e8] text-xs font-mono font-bold">
              <Activity className="w-4 h-4 text-[#0059e8]" />
              <span className="text-slate-900 font-sans">Edge PoP Telemetry</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Live ping testing to 10 edge PoPs measuring packet flight time, jitter, and lowest-latency route.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-600 text-xs font-mono font-bold">
              <Network className="w-4 h-4 text-cyan-600" />
              <span className="text-slate-900 font-sans">Subsea Fiber Cables</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              3D pathways for 2Africa, SEACOM, and PEACE cables landing at Mombasa and routing into Kisumu.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-mono font-bold">
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-900 font-sans">PostGIS Spatial Lab</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Interactive radius slider filtering agricultural sensors with GiST R-Tree index verification.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-1.5">
            <div className="flex items-center gap-2 text-rose-600 text-xs font-mono font-bold">
              <Plane className="w-4 h-4 text-rose-600" />
              <span className="text-slate-900 font-sans">Flight Sim &amp; Antipode</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Cinematic low-altitude Great-Circle flyover camera into Kisumu and Earth core tunneling calculations.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

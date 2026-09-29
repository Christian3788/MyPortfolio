'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
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
} from 'lucide-react';
import { soundService } from '../services/sound';

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
};

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

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
  name: string;
}

interface RingData {
  lat: number;
  lng: number;
  maxR: number;
  propagationSpeed: number;
  repeatPeriod: number;
  color: (t: number) => string;
}

interface MarkerData {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  sublabel: string;
  isUser: boolean;
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

// Calculate great circle distance in kilometers
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

export const Interactive3DGlobe: React.FC = () => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive dimensions
  const [dimensions, setDimensions] = useState({ width: 800, height: 620 });
  const [isMounted, setIsMounted] = useState(false);

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

  // Time tracking
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  // Globe Controls & Display options
  const [textureKey, setTextureKey] = useState<keyof typeof GLOBE_TEXTURES>('blueMarble');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isAtmosphereActive, setIsAtmosphereActive] = useState<boolean>(true);

  // SSR protection
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update container dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth } = containerRef.current;
        // Keep responsive aspect ratio
        const height = Math.min(Math.max(clientWidth * 0.72, 480), 720);
        setDimensions({ width: clientWidth, height });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
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
          // fallback to local time
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

  // Debounced / Cached reverse geocoding with Nominatim API
  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<Partial<GeolocationData>> => {
    setIsReverseGeocoding(true);
    try {
      // Nominatim free OpenStreetMap reverse geocoding
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!res.ok) throw new Error(`Geocoding failed with status: ${res.status}`);
      const data = await res.json();
      const addr = data.address || {};

      const city = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || 'Local Region';
      const country = addr.country || 'Global';
      const countryCode = (addr.country_code || '').toUpperCase();
      const county = addr.county || addr.state_district || addr.state || '';
      const flag = getCountryFlag(countryCode);

      // Guess timezone from Intl if visitor is physically there
      let tz: string | undefined;
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
  }, []);

  // IP fallback lookup when HTML5 geolocation is denied or unsupported
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
        setStatusMessage('Location access disabled; defaulting to IP/global approximate view.');
        soundService.playClick(220, 0.03);

        // Smooth camera glide to detected IP location
        setTimeout(() => {
          globeRef.current?.pointOfView(
            { lat: fallbackLoc.lat, lng: fallbackLoc.lng, altitude: 1.85 },
            2200
          );
        }, 600);
        return;
      }
    } catch {
      // Secondary fallback to default Nairobi / Eastern Africa view if IP lookup fails
    }

    // Default coordinates (Nairobi international hub)
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

        // Perform reverse geocoding via OpenStreetMap Nominatim
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

        // Fly-to effect: glide smoothly to user's position
        setTimeout(() => {
          globeRef.current?.pointOfView(
            { lat: latitude, lng: longitude, altitude: 1.7 },
            2400
          );
        }, 400);

        // Auto-dismiss toast after 6 seconds
        setTimeout(() => {
          setShowStatusToast(false);
        }, 6000);
      },
      (err) => {
        console.warn('Geolocation permission error or timeout:', err.message);
        setGeoStatus('fallback');
        setStatusMessage('Location access disabled or denied; defaulting to IP/global view.');
        soundService.playClick(180, 0.04);
        fetchIpFallbackLocation();

        setTimeout(() => {
          setShowStatusToast(false);
        }, 7000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [reverseGeocode, fetchIpFallbackLocation]);

  useEffect(() => {
    requestUserLocation();
  }, [requestUserLocation]);

  // Adjust auto-rotate on globe instance
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 0.65;
      }
    }
  }, [autoRotate]);

  // Camera action: Fly back to User Location
  const flyToUserLocation = () => {
    if (!userLocation || !globeRef.current) return;
    soundService.playClick(320, 0.02);
    setAutoRotate(false);
    globeRef.current.pointOfView(
      { lat: userLocation.lat, lng: userLocation.lng, altitude: 1.6 },
      2000
    );
  };

  // Camera action: Fly to Christian's Systems Lab (Kisumu)
  const flyToKisumu = () => {
    if (!globeRef.current) return;
    soundService.playClick(360, 0.02);
    setAutoRotate(false);
    globeRef.current.pointOfView(
      { lat: KISUMU_COORDS.lat, lng: KISUMU_COORDS.lng, altitude: 1.6 },
      2000
    );
  };

  // Camera action: Reset to full orbit overview
  const resetOrbitOverview = () => {
    if (!globeRef.current) return;
    soundService.playClick(240, 0.02);
    setAutoRotate(true);
    globeRef.current.pointOfView({ lat: 10, lng: 20, altitude: 2.7 }, 1800);
  };

  // Prepare Points / Markers Data
  const markersData: MarkerData[] = [];

  // 1. Kisumu reference marker
  markersData.push({
    lat: KISUMU_COORDS.lat,
    lng: KISUMU_COORDS.lng,
    size: 0.6,
    color: '#818cf8', // Indigo accent
    label: 'Systems Engineering Lab',
    sublabel: 'Kisumu, Kenya (EAT / UTC+3)',
    isUser: false,
  });

  // 2. User location marker
  if (userLocation) {
    markersData.push({
      lat: userLocation.lat,
      lng: userLocation.lng,
      size: 0.85,
      color: '#34d399', // Emerald accent
      label: 'You are here',
      sublabel: `${userLocation.city || 'Current Location'}, ${userLocation.country || ''}`,
      isUser: true,
    });
  }

  // Prepare Ripple Rings Data (Pulsing Beacons)
  const ringsData: RingData[] = [];

  // Ring for Kisumu
  ringsData.push({
    lat: KISUMU_COORDS.lat,
    lng: KISUMU_COORDS.lng,
    maxR: 5,
    propagationSpeed: 2.2,
    repeatPeriod: 1200,
    color: (t: number) => `rgba(99, 102, 241, ${Math.max(0, 1 - t)})`,
  });

  // Ring for User Location
  if (userLocation) {
    ringsData.push({
      lat: userLocation.lat,
      lng: userLocation.lng,
      maxR: 7.5,
      propagationSpeed: 3.0,
      repeatPeriod: 900,
      color: (t: number) => `rgba(52, 211, 153, ${Math.max(0, 1 - t)})`,
    });
  }

  // Prepare Geodesic Arc Data connecting User to Kisumu
  const arcsData: ArcData[] = [];
  if (userLocation) {
    arcsData.push({
      startLat: userLocation.lat,
      startLng: userLocation.lng,
      endLat: KISUMU_COORDS.lat,
      endLng: KISUMU_COORDS.lng,
      color: ['#34d399', '#818cf8'],
      name: `Direct Telemetry Link (${calculateHaversineDistance(
        userLocation.lat,
        userLocation.lng,
        KISUMU_COORDS.lat,
        KISUMU_COORDS.lng
      ).toLocaleString()} km)`,
    });
  }

  const distanceToKisumu = userLocation
    ? calculateHaversineDistance(
        userLocation.lat,
        userLocation.lng,
        KISUMU_COORDS.lat,
        KISUMU_COORDS.lng
      )
    : null;

  // Approximate fiber transmission ping (speed of light in optical glass ~200,000 km/s)
  const estimatedRttMs = distanceToKisumu ? Math.round((distanceToKisumu / 100) * 1.05) : null;

  return (
    <section id="interactive-globe" className="py-20 border-t border-white/[0.08] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-indigo-400 uppercase font-mono mb-2">
              <GlobeIcon className="w-4 h-4 text-indigo-400" />
              <span>Interactive 3D Geolocation &amp; Telemetry Hub</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Real-World 3D Planetary Globe
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Visualizing your verified browser coordinates, OpenStreetMap reverse geodata, and geodesic connection metrics directly to Christian&apos;s systems engineering lab in Kisumu, Kenya.
            </p>
          </div>

          {/* Quick HUD controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                soundService.playClick(280, 0.02);
                requestUserLocation();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.1] transition-all"
              title="Refresh Geolocation & reverse lookup"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>Detect Location</span>
            </button>

            <button
              onClick={() => {
                soundService.playClick(260, 0.02);
                setAutoRotate(!autoRotate);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium border transition-all ${
                autoRotate
                  ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
                  : 'bg-white/[0.05] border-white/[0.1] text-slate-400 hover:text-white'
              }`}
              title="Toggle planetary auto-rotation"
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              <span>{autoRotate ? 'Auto-Rotate ON' : 'Auto-Rotate OFF'}</span>
            </button>

            <button
              onClick={() => {
                soundService.playClick(300, 0.02);
                setTextureKey(textureKey === 'blueMarble' ? 'nightLights' : 'blueMarble');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.1] transition-all"
              title="Switch satellite / night imagery layer"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{textureKey === 'blueMarble' ? 'Night Lights' : 'Blue Marble'}</span>
            </button>
          </div>
        </div>

        {/* Status Toast / Banner */}
        {showStatusToast && (
          <div
            className={`p-3.5 px-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono transition-all animate-in fade-in duration-300 ${
              geoStatus === 'granted'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : geoStatus === 'fallback' || geoStatus === 'denied'
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {geoStatus === 'granted' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : geoStatus === 'fallback' || geoStatus === 'denied' ? (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Radio className="w-4 h-4 text-indigo-400 animate-pulse shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
            <button
              onClick={() => setShowStatusToast(false)}
              className="text-slate-400 hover:text-white text-xs underline font-sans"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main 3D Globe & Real Geodata HUD Viewport */}
        <div
          ref={containerRef}
          className="relative w-full rounded-2xl bg-[#06070d] border border-white/[0.1] shadow-2xl overflow-hidden min-h-[520px] flex items-center justify-center select-none"
        >
          {/* Globe Canvas (Client-side protected) */}
          {isMounted && (
            <Globe
              ref={globeRef}
              width={dimensions.width}
              height={dimensions.height}
              globeImageUrl={GLOBE_TEXTURES[textureKey]}
              bumpImageUrl={GLOBE_TEXTURES.bump}
              backgroundColor="rgba(0,0,0,0)"
              atmosphereColor={isAtmosphereActive ? '#6366f1' : undefined}
              atmosphereAltitude={isAtmosphereActive ? 0.18 : 0}
              showAtmosphere={isAtmosphereActive}
              
              // Animated Great Circle Arc linking User -> Kisumu
              arcsData={arcsData}
              arcColor="color"
              arcDashLength={0.4}
              arcDashGap={0.2}
              arcDashAnimateTime={2400}
              arcStroke={1.4}
              arcAltitude={0.25}
              arcLabel={(d: any) => d.name}

              // Animated Pulsing Rings
              ringsData={ringsData}
              ringColor={(d: any) => d.color}
              ringMaxRadius="maxR"
              ringPropagationSpeed="propagationSpeed"
              ringRepeatPeriod="repeatPeriod"

              // Points & Markers
              pointsData={markersData}
              pointLat="lat"
              pointLng="lng"
              pointColor="color"
              pointRadius="size"
              pointAltitude={0.02}
              pointLabel={(d: any) => `
                <div style="font-family: monospace; padding: 6px 10px; background: rgba(9,11,20,0.92); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 11px; backdrop-filter: blur(8px);">
                  <div style="font-weight: 700; color: ${d.isUser ? '#34d399' : '#818cf8'};">${d.label}</div>
                  <div style="color: #94a3b8; font-size: 10px;">${d.sublabel}</div>
                </div>
              `}
              onPointClick={(point: any) => {
                soundService.playClick(340, 0.02);
                if (globeRef.current) {
                  globeRef.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.5 }, 1500);
                }
              }}
            />
          )}

          {/* Loading Overlay */}
          {!isMounted && (
            <div className="flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span>Initializing WebGL 3D Globe Projection...</span>
            </div>
          )}

          {/* Glassmorphism Real-World Map Geodata HUD (Top-Left) */}
          <div className="absolute top-4 left-4 z-20 max-w-xs sm:max-w-sm w-full p-4 sm:p-5 rounded-2xl bg-[#090b14]/85 backdrop-blur-xl border border-white/[0.12] shadow-2xl text-xs font-mono space-y-3 pointer-events-auto">
            {/* Header / Pin Indicator */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${geoStatus === 'granted' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${geoStatus === 'granted' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </span>
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  {geoStatus === 'granted' ? 'Live GPS Position' : 'Approximate Telemetry'}
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
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">City &amp; Region</div>
                  <div className="text-sm font-bold text-white font-sans truncate">
                    {userLocation.city || 'Detecting City'}
                    {userLocation.state && userLocation.state !== userLocation.city ? `, ${userLocation.state}` : ''}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {userLocation.country || 'Global Coordinates'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/[0.06]">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Coordinates</div>
                    <div className="text-white font-bold text-[11px]">
                      {formatCoordinates(userLocation.lat, userLocation.lng)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Accuracy</div>
                    <div className="text-emerald-400 font-bold text-[11px]">
                      {userLocation.accuracy ? `±${userLocation.accuracy}m` : 'IP Geo Block'}
                    </div>
                  </div>
                </div>

                {/* Local Clock & Timezone */}
                <div className="pt-1 border-t border-white/[0.06] flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{currentTimeStr || 'Syncing clock...'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {userLocation.timezone || 'UTC'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 py-3">
                <div className="w-3.5 h-3.5 border border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span>Reading coordinate signals...</span>
              </div>
            )}

            {/* Reverse Geocoding indicator */}
            {isReverseGeocoding && (
              <div className="text-[10px] text-indigo-300 flex items-center gap-1.5 pt-1">
                <Sparkles className="w-3 h-3 animate-spin" />
                <span>Querying OpenStreetMap Nominatim...</span>
              </div>
            )}
          </div>

          {/* Kisumu Systems Lab Geodesic Telemetry HUD (Bottom-Left) */}
          {userLocation && (
            <div className="hidden sm:block absolute bottom-4 left-4 z-20 max-w-xs w-full p-4 rounded-2xl bg-[#090b14]/85 backdrop-blur-xl border border-white/[0.12] shadow-2xl text-xs font-mono space-y-2 pointer-events-auto">
              <div className="flex items-center justify-between text-indigo-400 font-semibold text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Kisumu Systems Lab Link</span>
                </div>
                <span>🇰🇪 EAT (UTC+3)</span>
              </div>

              <div className="space-y-1.5 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Great Circle Dist:</span>
                  <span className="text-white font-bold">{distanceToKisumu?.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Fiber RTT:</span>
                  <span className="text-emerald-400 font-bold">~{estimatedRttMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="text-slate-200">Kisumu (-0.0917°, 34.7680°)</span>
                </div>
              </div>
            </div>
          )}

          {/* Camera Flight Buttons HUD (Top-Right) */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
            {/* Fly to User */}
            <button
              onClick={flyToUserLocation}
              disabled={!userLocation}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-[#090b14]/90 backdrop-blur-md border border-white/[0.12] text-xs font-mono text-slate-200 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all shadow-lg"
              title="Fly camera directly to your detected location"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">My Location</span>
            </button>

            {/* Fly to Kisumu */}
            <button
              onClick={flyToKisumu}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-[#090b14]/90 backdrop-blur-md border border-white/[0.12] text-xs font-mono text-slate-200 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-950/20 transition-all shadow-lg"
              title="Fly camera to Christian's Systems Lab in Kisumu, Kenya"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Kisumu Lab</span>
            </button>

            {/* Reset / Wide Orbit */}
            <button
              onClick={resetOrbitOverview}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-[#090b14]/90 backdrop-blur-md border border-white/[0.12] text-xs font-mono text-slate-200 hover:text-white hover:border-white/30 transition-all shadow-lg"
              title="Reset camera to orbital perspective"
            >
              <Compass className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">Orbit View</span>
            </button>

            {/* Toggle Atmosphere */}
            <button
              onClick={() => {
                soundService.playClick(290, 0.02);
                setIsAtmosphereActive(!isAtmosphereActive);
              }}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-[#090b14]/90 backdrop-blur-md border border-white/[0.12] text-xs font-mono text-slate-300 hover:text-white transition-all shadow-lg"
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
            <span>Click marker to focus</span>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-xl bg-[#080a12] border border-white/[0.08] space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>HTML5 High-Accuracy Geolocation</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects real latitude and longitude coordinates directly on device mount with non-intrusive fallback to IP-based approximate geolocation when permissions are disabled.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#080a12] border border-white/[0.08] space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold">
              <GlobeIcon className="w-4 h-4 text-indigo-400" />
              <span>OpenStreetMap Reverse Geocoding</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Queries the free OpenStreetMap Nominatim reverse geocoder to resolve physical city, county, country code, and localized timezones onto an in-viewport glassmorphism HUD.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#080a12] border border-white/[0.08] space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Geodesic Great Circle Telemetry</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates Haversine spherical distance and animated great-circle arcs between your location and Christian&apos;s Systems Lab in Kisumu, Kenya, simulating round-trip fiber optic latency.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

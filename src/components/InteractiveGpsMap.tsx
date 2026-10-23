import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Layers,
  Crosshair,
  ExternalLink,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Navigation,
  Globe2
} from 'lucide-react';
import { Language } from '../types';

interface InteractiveGpsMapProps {
  latitude: number;
  longitude: number;
  accuracy?: number;
  label?: string;
  isEditable?: boolean;
  onLocationChange?: (coords: { latitude: number; longitude: number; accuracy?: number }) => void;
  height?: string;
  variant?: 'meter' | 'incident' | 'utility';
  lang?: Language;
}

type MapLayerType = 'satellite' | 'street' | 'topo';

export const InteractiveGpsMap: React.FC<InteractiveGpsMapProps> = ({
  latitude,
  longitude,
  accuracy,
  label,
  isEditable = false,
  onLocationChange,
  height = '320px',
  variant = 'meter',
  lang = 'am'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('satellite');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: latitude || 9.0105,
    lng: longitude || 38.7612
  });
  const [isLocating, setIsLocating] = useState(false);
  const isEthiopic = lang === 'am' || lang === 'om' || lang === 'ti';

  // Tile layer URL providers
  const getTileUrl = (type: MapLayerType) => {
    switch (type) {
      case 'satellite':
        // Esri World Imagery (High-res satellite photography)
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'topo':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      case 'street':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getTileAttribution = (type: MapLayerType) => {
    switch (type) {
      case 'satellite':
        return 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      case 'topo':
        return 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap';
      default:
        return '&copy; OpenStreetMap contributors';
    }
  };

  // Custom marker pin HTML
  const createCustomMarkerIcon = (v: 'meter' | 'incident' | 'utility', title: string) => {
    const colorClasses =
      v === 'incident'
        ? 'bg-red-600 text-white ring-red-300'
        : v === 'utility'
        ? 'bg-cyan-700 text-white ring-cyan-300'
        : 'bg-emerald-600 text-white ring-emerald-300';

    const pulseColor = v === 'incident' ? 'bg-red-500' : 'bg-cyan-500';

    return L.divIcon({
      className: 'custom-gps-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="background-color: white; border: 1.5px solid #0f172a; border-radius: 9999px; padding: 2px 8px; font-size: 10px; font-weight: bold; color: #0f172a; white-space: nowrap; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 9999px; background-color: ${v === 'incident' ? '#ef4444' : '#06b6d4'};"></span>
            ${title || (v === 'incident' ? 'የብልሽት ቦታ' : 'የውሃ ቆጣሪ መገኛ')}
          </div>
          <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
            <span style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;" class="${pulseColor}"></span>
            <div style="width: 32px; height: 32px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); border: 2px solid white;" class="${colorClasses}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
          <div style="width: 2px; height: 8px; background-color: #0f172a;"></div>
        </div>
      `,
      iconSize: [36, 60],
      iconAnchor: [18, 56],
      popupAnchor: [0, -56]
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialLat = latitude || 9.0105;
    const initialLng = longitude || 38.7612;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 17,
      zoomControl: false,
      attributionControl: false
    });

    const tiles = L.tileLayer(getTileUrl(activeLayer), {
      maxZoom: 19,
      attribution: getTileAttribution(activeLayer)
    }).addTo(map);

    tileLayerRef.current = tiles;

    // Add marker
    const marker = L.marker([initialLat, initialLng], {
      draggable: isEditable,
      icon: createCustomMarkerIcon(variant, label || '')
    }).addTo(map);

    markerRef.current = marker;

    // Accuracy Circle
    if (accuracy && accuracy > 0) {
      const circle = L.circle([initialLat, initialLng], {
        radius: Math.min(accuracy, 100),
        color: variant === 'incident' ? '#ef4444' : '#0284c7',
        fillColor: variant === 'incident' ? '#f87171' : '#38bdf8',
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '4 4'
      }).addTo(map);
      accuracyCircleRef.current = circle;
    }

    // Editable marker drag
    if (isEditable) {
      marker.on('dragend', (e) => {
        const newLatLng = e.target.getLatLng();
        setCurrentCoords({ lat: Number(newLatLng.lat.toFixed(6)), lng: Number(newLatLng.lng.toFixed(6)) });
        if (accuracyCircleRef.current) {
          accuracyCircleRef.current.setLatLng(newLatLng);
        }
        if (onLocationChange) {
          onLocationChange({
            latitude: Number(newLatLng.lat.toFixed(6)),
            longitude: Number(newLatLng.lng.toFixed(6)),
            accuracy: accuracy || 10
          });
        }
      });

      // Click on map to move pin
      map.on('click', (e) => {
        const newLatLng = e.latlng;
        marker.setLatLng(newLatLng);
        if (accuracyCircleRef.current) {
          accuracyCircleRef.current.setLatLng(newLatLng);
        }
        setCurrentCoords({ lat: Number(newLatLng.lat.toFixed(6)), lng: Number(newLatLng.lng.toFixed(6)) });
        if (onLocationChange) {
          onLocationChange({
            latitude: Number(newLatLng.lat.toFixed(6)),
            longitude: Number(newLatLng.lng.toFixed(6)),
            accuracy: accuracy || 10
          });
        }
      });
    }

    mapInstanceRef.current = map;

    // Invalidate size on initial mount
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync coords from parent
  useEffect(() => {
    if (latitude && longitude && mapInstanceRef.current && markerRef.current) {
      const lat = Number(latitude);
      const lng = Number(longitude);
      setCurrentCoords({ lat, lng });

      markerRef.current.setLatLng([lat, lng]);
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setLatLng([lat, lng]);
        if (accuracy) {
          accuracyCircleRef.current.setRadius(Math.min(accuracy, 100));
        }
      }
      mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom(), { animate: true });
    }
  }, [latitude, longitude, accuracy]);

  // Handle Layer Switch
  const switchLayer = (type: MapLayerType) => {
    setActiveLayer(type);
    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const newTiles = L.tileLayer(getTileUrl(type), {
        maxZoom: 19,
        attribution: getTileAttribution(type)
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newTiles;
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([currentCoords.lat, currentCoords.lng], 18, { animate: true });
    }
  };

  // Locate me
  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          const acc = Math.round(pos.coords.accuracy);

          setCurrentCoords({ lat, lng });
          setIsLocating(false);

          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([lat, lng], 18, { animate: true });
            markerRef.current.setLatLng([lat, lng]);
            if (accuracyCircleRef.current) {
              accuracyCircleRef.current.setLatLng([lat, lng]);
              accuracyCircleRef.current.setRadius(Math.min(acc, 100));
            }
          }

          if (onLocationChange) {
            onLocationChange({ latitude: lat, longitude: lng, accuracy: acc });
          }
        },
        (err) => {
          console.warn('GPS location error:', err);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentCoords.lat},${currentCoords.lng}`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-900 group">
      {/* Map Tile Canvas */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10" />

      {/* Top Floating Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        {/* Layer Mode Switcher */}
        <div className="pointer-events-auto flex items-center bg-slate-900/85 backdrop-blur-md rounded-xl p-1 border border-white/20 shadow-lg text-[11px] font-bold text-white">
          <button
            type="button"
            onClick={() => switchLayer('satellite')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeLayer === 'satellite'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>{isEthiopic ? 'ሳተላይት ምስል' : 'Satellite'}</span>
          </button>

          <button
            type="button"
            onClick={() => switchLayer('street')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeLayer === 'street'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isEthiopic ? 'የመንገድ ካርታ' : 'Street'}</span>
          </button>

          <button
            type="button"
            onClick={() => switchLayer('topo')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 hidden sm:flex ${
              activeLayer === 'topo'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{isEthiopic ? 'መሬት አቀማመጥ' : 'Terrain'}</span>
          </button>
        </div>

        {/* Live GPS Re-locate & External Map */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          {isEditable && (
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocating}
              title={isEthiopic ? 'የአሁኑን ትክክለኛ መገኛዬን ፈልግ' : 'Find My Precise Location'}
              className="p-2 bg-slate-900/85 backdrop-blur-md hover:bg-cyan-700 text-white rounded-xl border border-white/20 shadow-lg transition flex items-center gap-1 text-[11px] font-bold"
            >
              <Crosshair className={`w-4 h-4 text-cyan-400 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isEthiopic ? 'የኔ መገኛ' : 'My Location'}</span>
            </button>
          )}

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={isEthiopic ? 'በGoogle Maps ካርታ ላይ ክፈት' : 'Open in Google Maps'}
            className="p-2 bg-slate-900/85 backdrop-blur-md hover:bg-slate-800 text-white rounded-xl border border-white/20 shadow-lg transition flex items-center gap-1 text-[11px]"
          >
            <ExternalLink className="w-4 h-4 text-cyan-300" />
            <span className="hidden sm:inline">Google Maps</span>
          </a>
        </div>
      </div>

      {/* Bottom Floating Info Badge */}
      <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        {/* Coordinates readout */}
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 text-white shadow-lg space-y-0.5 max-w-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
              {isEthiopic ? 'ትክክለኛ የጂፒኤስ መገኛ' : 'Precise GPS Coordinates'}
            </span>
            {accuracy && (
              <span className="text-[9px] px-1.5 py-0.2 bg-white/10 rounded text-slate-300">
                ±{accuracy}m
              </span>
            )}
          </div>
          <div className="font-mono text-xs font-bold text-slate-100 flex items-center gap-2">
            <span>{currentCoords.lat.toFixed(6)}° N, {currentCoords.lng.toFixed(6)}° E</span>
          </div>
          {isEditable && (
            <p className="text-[10px] text-cyan-200/90 pt-0.5">
              {isEthiopic
                ? '💡 ካርታው ላይ ጠቅ በማድረግ ወይም ምልክቱን በማንቀሳቀስ የቆጣሪውን/የቧንቧውን ትክክለኛ ቦታ ማስተካከል ይችላሉ።'
                : '💡 Click anywhere on map or drag pin to adjust exact meter location.'}
            </p>
          )}
        </div>

        {/* Zoom & Recenter controls */}
        <div className="pointer-events-auto flex items-center gap-1 self-end bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-lg">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 text-white hover:bg-white/20 rounded-lg transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 text-white hover:bg-white/20 rounded-lg transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRecenter}
            className="p-1.5 text-cyan-300 hover:bg-white/20 rounded-lg transition"
            title="Recenter Pin"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

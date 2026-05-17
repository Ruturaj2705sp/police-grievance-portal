/**
 * IncidentMap — Leaflet map for incident location
 * Safe: lazy-loaded, fails gracefully if Leaflet not available
 * Add leaflet CSS to your index.html:
 * <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
 */

import React, { useState, useEffect } from 'react';

// Lazy import to avoid SSR issues
let MapComponents = null;

const loadLeaflet = async () => {
  if (MapComponents) return MapComponents;
  try {
    const { MapContainer, TileLayer, Marker, Popup, useMapEvents } = await import('react-leaflet');
    const L = await import('leaflet');

    // Fix default marker icon (common Leaflet/Webpack issue)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    MapComponents = { MapContainer, TileLayer, Marker, Popup, useMapEvents, L };
    return MapComponents;
  } catch {
    return null;
  }
};

// ── Location Picker (for complaint submission) ─────────────────────────────
const LocationPicker = ({ onLocationSelect }) => {
  const { useMapEvents } = MapComponents;
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
};

// ── View-Only Map ──────────────────────────────────────────────────────────
const IncidentMap = ({
  lat = 20.5937,      // Default: India center
  lng = 78.9629,
  locationName = '',
  interactive = false,  // true = allow clicking to set location
  onLocationSelect,     // callback(latlng) when user clicks (interactive mode)
  height = '240px',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [markerPos, setMarkerPos] = useState({ lat, lng });
  const [error, setError] = useState(false);

  useEffect(() => {
    loadLeaflet()
      .then(comps => {
        if (comps) setLoaded(true);
        else setError(true);
      })
      .catch(() => setError(true));
  }, []);

  const handleClick = (latlng) => {
    setMarkerPos(latlng);
    onLocationSelect?.(latlng);
  };

  if (error) {
    return (
      <div
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-sm"
        style={{ height }}
      >
        Map unavailable. Please describe location in text field.
      </div>
    );
  }

  if (!loaded) {
    return (
      <div
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 animate-pulse"
        style={{ height }}
      />
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700" style={{ height }}>
      <MapContainer
        center={[markerPos.lat, markerPos.lng]}
        zoom={interactive ? 5 : 13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[markerPos.lat, markerPos.lng]}>
          <Popup>
            {locationName || `${markerPos.lat.toFixed(4)}, ${markerPos.lng.toFixed(4)}`}
          </Popup>
        </Marker>
        {interactive && <LocationPicker onLocationSelect={handleClick} />}
      </MapContainer>
      {interactive && (
        <p className="text-xs text-center text-slate-400 py-1.5 bg-slate-50 dark:bg-slate-800">
          📍 Click on the map to pin the incident location
        </p>
      )}
    </div>
  );
};

// ── Geocoder: text → coordinates (using free Nominatim API) ───────────────
export const geocodeLocation = async (locationText) => {
  if (!locationText || locationText.trim().length < 3) return null;
  try {
    const encoded = encodeURIComponent(locationText + ', India');
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
};

export default IncidentMap;
import React, { useState, useEffect } from 'react';

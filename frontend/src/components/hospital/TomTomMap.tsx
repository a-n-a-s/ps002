import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

const BLOOD_COLORS: Record<string, string> = {
  'O-': '#FF003C',
  'O+': '#FF4D79',
  'A+': '#FF6B35',
  'A-': '#FF8C42',
  'B+': '#C44EFF',
  'B-': '#9B59FF',
  'AB+': '#00E5FF',
  'AB-': '#00FF66',
};

export function TomTomMap({ 
  hospitalLocation, 
  emergencyLocation 
}: { 
  hospitalLocation?: { lat: number; lng: number };
  emergencyLocation?: { lat: number; lng: number };
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    if (!MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: hospitalLocation ? [hospitalLocation.lng, hospitalLocation.lat] : [78.486, 17.385],
      zoom: 13,
      attributionControl: false,
    });

    mapInstanceRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    mapInstanceRef.current.on('load', () => {
      addVisualElements();
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const addVisualElements = () => {
    if (!mapInstanceRef.current) return;

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes emergencyRing {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
      }
      @keyframes donorPulse {
        0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
        70% { box-shadow: 0 0 0 12px rgba(34, 197, 94, 0); }
        100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
      }
      @keyframes hospitalPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.1); }
      }
      @keyframes markerBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .emergency-ring {
        position: absolute;
        width: 60px;
        height: 60px;
        border: 3px solid #FF003C;
        border-radius: 50%;
        animation: emergencyRing 2s ease-out infinite;
        pointer-events: none;
      }
      .emergency-ring-2 {
        animation-delay: 0.5s;
      }
      .emergency-ring-3 {
        animation-delay: 1s;
      }
      .donor-marker-container {
        position: relative;
      }
      .donor-marker-dot {
        width: 18px;
        height: 18px;
        background: #22C55E;
        border: 3px solid white;
        border-radius: 50%;
        animation: donorPulse 2s ease-in-out infinite;
        box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
      }
      .hospital-marker-container {
        position: relative;
      }
      .hospital-icon {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #3B82F6, #1D4ED8);
        border: 3px solid white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
        animation: hospitalPulse 2s ease-in-out infinite;
      }
      .emergency-marker-container {
        position: relative;
      }
      .emergency-center {
        width: 28px;
        height: 28px;
        background: #FF003C;
        border: 4px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 20px rgba(255, 0, 60, 0.6);
      }
      .blood-label {
        position: absolute;
        top: -18px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: bold;
        white-space: nowrap;
        pointer-events: none;
      }
      .donor-name-label {
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 9px;
        color: rgba(255,255,255,0.7);
        white-space: nowrap;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    // Hospital marker with icon
    if (hospitalLocation) {
      const container = document.createElement('div');
      container.className = 'hospital-marker-container';
      container.innerHTML = `
        <div class="hospital-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <path d="M9 22V12h6v10"/>
          </svg>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: [0, -20], closeButton: false })
        .setHTML(`
          <div style="padding: 12px; background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 8px; min-width: 160px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div style="width: 8px; height: 8px; background: #3B82F6; border-radius: 50%;"></div>
              <strong style="color: white; font-size: 14px;">KIMS Hospital</strong>
            </div>
            <div style="color: rgba(255,255,255,0.7); font-size: 12px; margin-bottom: 4px;">
              📍 Jubilee Hills, Hyderabad
            </div>
            <div style="color: rgba(255,255,255,0.7); font-size: 12px;">
              🛏️ ICU Bed Available
            </div>
          </div>
        `);

      const marker = new mapboxgl.Marker({ element: container, anchor: 'center' })
        .setLngLat([hospitalLocation.lng, hospitalLocation.lat])
        .setPopup(popup)
        .addTo(mapInstanceRef.current!);
      
      markersRef.current.push(marker);
    }

    // Emergency marker with pulsing rings
    if (emergencyLocation) {
      const container = document.createElement('div');
      container.className = 'emergency-marker-container';
      container.innerHTML = `
        <div class="emergency-ring"></div>
        <div class="emergency-ring emergency-ring-2"></div>
        <div class="emergency-ring emergency-ring-3"></div>
        <div class="emergency-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          </svg>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: [0, -30], closeButton: false })
        .setHTML(`
          <div style="padding: 12px; background: linear-gradient(135deg, #450a0a, #1f0000); border-radius: 8px; min-width: 180px; border: 1px solid #FF003C;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div style="width: 8px; height: 8px; background: #FF003C; border-radius: 50%; animation: pulse 1s infinite;"></div>
              <strong style="color: #FF003C; font-size: 14px;">EMERGENCY</strong>
            </div>
            <div style="color: white; font-size: 13px; margin-bottom: 4px;">
              <strong>Blood Type: O-</strong>
            </div>
            <div style="color: rgba(255,255,255,0.7); font-size: 12px;">
              ⏱️ Response needed urgently
            </div>
          </div>
        `);

      const marker = new mapboxgl.Marker({ element: container, anchor: 'center' })
        .setLngLat([emergencyLocation.lng, emergencyLocation.lat])
        .setPopup(popup)
        .addTo(mapInstanceRef.current!);
      
      markersRef.current.push(marker);
    }

    // Donor markers with blood type labels
    const donors = [
      { lng: 78.486, lat: 17.385, name: 'Ravi K.', bloodType: 'O-', status: 'online' },
      { lng: 78.492, lat: 17.395, name: 'Sarah M.', bloodType: 'A+', status: 'online' },
      { lng: 78.480, lat: 17.375, name: 'Arjun P.', bloodType: 'B+', status: 'online' },
      { lng: 78.495, lat: 17.390, name: 'Priya S.', bloodType: 'O-', status: 'standby' },
    ];

    donors.forEach((donor, index) => {
      const container = document.createElement('div');
      const color = BLOOD_COLORS[donor.bloodType] || '#22C55E';
      
      container.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="position: relative;">
            <div class="donor-marker-dot" style="background: ${color}; box-shadow: 0 0 15px ${color}80; animation-delay: ${index * 0.2}s;"></div>
            ${donor.status === 'online' ? `
              <div style="position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: #22C55E; border: 2px solid #0f172a; border-radius: 50%;"></div>
            ` : ''}
          </div>
          <div class="blood-label" style="background: ${color}99; border: 1px solid ${color};">
            ${donor.bloodType}
          </div>
          <div class="donor-name-label">${donor.name}</div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: [0, -15], closeButton: false })
        .setHTML(`
          <div style="padding: 12px; background: linear-gradient(135deg, #052e16, #0a1f0f); border-radius: 8px; min-width: 140px; border: 1px solid ${color};">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <div style="width: 10px; height: 10px; background: ${color}; border-radius: 50%;"></div>
              <strong style="color: white; font-size: 14px;">${donor.name}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: rgba(255,255,255,0.6); font-size: 11px;">Blood Type:</span>
              <span style="color: ${color}; font-size: 12px; font-weight: bold;">${donor.bloodType}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: rgba(255,255,255,0.6); font-size: 11px;">Distance:</span>
              <span style="color: white; font-size: 12px;">${(Math.random() * 3 + 1).toFixed(1)} km</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: rgba(255,255,255,0.6); font-size: 11px;">Match Score:</span>
              <span style="color: #22C55E; font-size: 12px; font-weight: bold;">${90 - index * 5}%</span>
            </div>
          </div>
        `);

      const marker = new mapboxgl.Marker({ element: container, anchor: 'bottom' })
        .setLngLat([donor.lng, donor.lat])
        .setPopup(popup)
        .addTo(mapInstanceRef.current!);
      
      markersRef.current.push(marker);
    });

    // Add route line from nearest donor to hospital
    if (hospitalLocation && donors.length > 0) {
      const nearestDonor = donors[0];
      
      mapInstanceRef.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [nearestDonor.lng, nearestDonor.lat],
              [hospitalLocation.lng, hospitalLocation.lat]
            ]
          }
        }
      });

      mapInstanceRef.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#22C55E',
          'line-width': 3,
          'line-opacity': 0.7,
          'line-dasharray': [2, 2]
        }
      });
    }

    // Add emergency zone circle
    if (emergencyLocation) {
      mapInstanceRef.current.addSource('emergency-zone', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [emergencyLocation.lng, emergencyLocation.lat]
          }
        }
      });

      mapInstanceRef.current.addLayer({
        id: 'emergency-zone',
        type: 'circle',
        source: 'emergency-zone',
        paint: {
          'circle-radius': 50,
          'circle-color': '#FF003C',
          'circle-opacity': 0.15,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FF003C',
          'circle-stroke-opacity': 0.5
        }
      });
    }
  };

  return (
    <div className="relative w-full h-full" style={{ minHeight: '400px' }}>
      <div 
        ref={mapRef} 
        className="absolute inset-0 rounded-lg overflow-hidden" 
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Map overlay labels */}
      <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded bg-black/70 backdrop-blur-sm z-10">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-xs font-semibold text-white">LIVE MAP</span>
        <span className="text-xs text-gray-400">·</span>
        <span className="text-xs text-gray-400">Hyderabad</span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 text-xs z-10">
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-300">Donors Online</span>
          <span className="text-green-500 font-bold ml-1">4</span>
        </div>
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-gray-300">Hospital</span>
        </div>
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded border border-red-500/30">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-gray-300">Emergency</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded text-right">
          <div className="text-xs text-gray-400">Nearest Donor</div>
          <div className="text-sm font-bold text-green-500">2.1 km</div>
        </div>
        <div className="bg-red-500/20 backdrop-blur-sm px-3 py-1.5 rounded border border-red-500/40 text-right">
          <div className="text-xs text-red-300">Emergency Zone</div>
          <div className="text-sm font-bold text-red-500">500m radius</div>
        </div>
      </div>
    </div>
  );
}

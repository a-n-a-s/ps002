import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LiveMapProps {
  hospitalLocation?: { lat: number; lng: number };
  emergencyLocation?: { lat: number; lng: number };
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNtN2FwemNyMjA4OWgycXBhbDk4aGgycmcifQ.demo';

export function LiveMap({ hospitalLocation, emergencyLocation }: LiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [78.486, 17.385],
        zoom: 12,
        attributionControl: false,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      map.current.on('load', () => {
        addDonorMarkers();
        if (hospitalLocation) addHospitalMarker();
        if (emergencyLocation) addEmergencyRing();
      });
    } catch (e) {
      console.warn('Mapbox initialization failed (demo mode):', e);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const addDonorMarkers = () => {
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    const sampleDonors = [
      { id: '1', name: 'Ravi K.', bloodType: 'O-', location: { lat: 17.385, lng: 78.486 } },
      { id: '2', name: 'Sarah M.', bloodType: 'O-', location: { lat: 17.395, lng: 78.492 } },
      { id: '3', name: 'Arjun P.', bloodType: 'O-', location: { lat: 17.375, lng: 78.480 } },
    ];

    sampleDonors.forEach((donor) => {
      const el = document.createElement('div');
      el.className = 'donor-marker';
      el.style.cssText = `
        width: 12px;
        height: 12px;
        background: #22C55E;
        border-radius: 50%;
        box-shadow: 0 0 8px #22C55E, 0 0 16px rgba(34,197,94,0.5);
        animation: pulse 2s ease-in-out infinite;
      `;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([donor.location.lng, donor.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="color:#0a0a0a;padding:4px;">
              <strong>${donor.name}</strong><br/>
              <span>${donor.bloodType}</span>
            </div>
          `)
        )
        .addTo(map.current!);

      markers.current.push(marker);
    });
  };

  const addHospitalMarker = () => {
    if (!hospitalLocation || !map.current) return;

    const el = document.createElement('div');
    el.style.cssText = `
      width: 20px;
      height: 20px;
      background: #3B82F6;
      border: 2px solid white;
      border-radius: 4px;
    `;

    new mapboxgl.Marker({ element: el })
      .setLngLat([hospitalLocation.lng, hospitalLocation.lat])
      .setPopup(new mapboxgl.Popup().setHTML('<div style="color:#0a0a0a;"><strong>KIMS Hospital</strong></div>'))
      .addTo(map.current);
  };

  const addEmergencyRing = () => {
    if (!emergencyLocation || !map.current) return;

    const el = document.createElement('div');
    el.style.cssText = `
      width: 40px;
      height: 40px;
      border: 3px solid #FF3B3B;
      border-radius: 50%;
      animation: emergencyExpand 2s ease-out infinite;
    `;

    new mapboxgl.Marker({ element: el })
      .setLngLat([emergencyLocation.lng, emergencyLocation.lat])
      .addTo(map.current);
  };

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />
      <div className="absolute top-3 left-3 px-3 py-1 rounded bg-bg-primary/80 backdrop-blur text-xs font-semibold text-text-muted">
        LIVE MAP · HYDERABAD
      </div>
      <div className="absolute bottom-3 left-3 flex gap-3 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success" /> Donors
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-info" /> Hospitals
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full border border-blood" /> Emergency
        </span>
      </div>
    </div>
  );
}
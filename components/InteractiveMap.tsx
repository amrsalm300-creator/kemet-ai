'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import 'leaflet/dist/leaflet.css';

interface DestinationBase {
  id: string;
  slug: string;
  lat: number;
  lng: number;
  rating: string;
}

interface Destination extends DestinationBase {
  name: string;
  city: string;
  location: string;
  era: string;
  category: string;
  description: string;
}

const DESTINATIONS_BASE: DestinationBase[] = [
  { id: 'pyramids', slug: 'giza-pyramids', lat: 29.9792, lng: 31.1342, rating: '5.0 ★' },
  { id: 'luxor_karnak', slug: 'karnak-temple', lat: 25.7188, lng: 32.6573, rating: '4.9 ★' },
  { id: 'abu_simbel', slug: 'abu-simbel', lat: 22.3372, lng: 31.6258, rating: '5.0 ★' },
  { id: 'siwa', slug: 'siwa-oasis', lat: 29.2032, lng: 25.5195, rating: '4.8 ★' },
  { id: 'dahab_bluehole', slug: 'dahab-blue-hole', lat: 28.5722, lng: 34.5372, rating: '4.9 ★' },
  { id: 'philae', slug: 'philae-temple', lat: 24.0258, lng: 32.8842, rating: '4.9 ★' },
  { id: 'nmec', slug: 'nmec-cairo', lat: 30.0081, lng: 31.2483, rating: '4.9 ★' },
  { id: 'khan_el_khalili', slug: 'khan-el-khalili', lat: 30.0478, lng: 31.2622, rating: '4.7 ★' },
  { id: 'ras_mohamed', slug: 'ras-mohamed', lat: 27.7381, lng: 34.2382, rating: '4.9 ★' },
  { id: 'white_desert', slug: 'white-desert', lat: 27.3275, lng: 28.1884, rating: '4.9 ★' },
  { id: 'st_catherine', slug: 'st-catherine-monastery', lat: 28.5559, lng: 33.9761, rating: '4.8 ★' },
  { id: 'vally_of_kings', slug: 'valley-of-the-kings', lat: 25.7402, lng: 32.6014, rating: '5.0 ★' },
  { id: 'qaitbay', slug: 'qaitbay-citadel', lat: 31.2140, lng: 29.8853, rating: '4.6 ★' },
  { id: 'alex_library', slug: 'bibliotheca-alexandrina', lat: 31.2089, lng: 29.9092, rating: '4.8 ★' },
  { id: 'giftun_island', slug: 'giftun-island', lat: 27.2305, lng: 33.9485, rating: '4.8 ★' },
  { id: 'dendera', slug: 'dendera-temple', lat: 26.1413, lng: 32.6701, rating: '4.9 ★' },
  { id: 'saqqara', slug: 'saqqara-pyramid', lat: 29.8713, lng: 31.2163, rating: '4.8 ★' },
  { id: 'kom_ombo', slug: 'kom-ombo-temple', lat: 24.4522, lng: 32.9284, rating: '4.7 ★' },
  { id: 'wadi_el_hitan', slug: 'wadi-el-hitan', lat: 29.2711, lng: 30.0438, rating: '4.8 ★' },
  { id: 'marsa_alam', slug: 'marsa-alam-hankorab', lat: 24.8385, lng: 34.9811, rating: '4.9 ★' },
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

function MapFlyTo({ destination }: { destination: Destination }) {
  const [useMap, setUseMap] = useState<any>(null);

  useEffect(() => {
    import('react-leaflet').then((m) => setUseMap(() => m.useMap));
  }, []);

  if (!useMap) return null;

  return <FlyToHandler destination={destination} useMapHook={useMap} />;
}

function FlyToHandler({ destination, useMapHook }: { destination: Destination; useMapHook: any }) {
  const map = useMapHook();
  useEffect(() => {
    if (map && destination) {
      map.flyTo([destination.lat, destination.lng], 11, {
        duration: 1.8,
        easeLinearity: 0.25,
      });
    }
  }, [destination, map]);

  return null;
}

export default function InteractiveMap() {
  const t = useTranslations('InteractiveMap');

  const DESTINATIONS: Destination[] = DESTINATIONS_BASE.map((item) => ({
    ...item,
    name: t(`destinations.${item.id}.name`),
    city: t(`destinations.${item.id}.city`),
    location: t(`destinations.${item.id}.location`),
    era: t(`destinations.${item.id}.era`),
    category: t(`destinations.${item.id}.category`),
    description: t(`destinations.${item.id}.description`),
  }));

  const [selectedDestination, setSelectedDestination] = useState<Destination>(DESTINATIONS[0]);
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [customIcon, setCustomIcon] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    Promise.all([
      import('react-leaflet'),
      import('leaflet')
    ]).then(([{ MapContainer, TileLayer, Marker, Popup }, L]) => {
      const icon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center w-7 h-7 cursor-pointer">
            <span class="absolute w-full h-full bg-red-600 rounded-full animate-ping opacity-75"></span>
            <span class="relative w-4 h-4 bg-red-600 border-2 border-amber-400 rounded-full shadow-[0_0_12px_rgba(220,38,38,1)]"></span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      setCustomIcon(icon);
      setMapComponents({ MapContainer, TileLayer, Marker, Popup });
    });
  }, []);

  useEffect(() => {
    if (userLocation) {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        selectedDestination.lat,
        selectedDestination.lng
      );
      setDistance(dist);
    }
  }, [selectedDestination, userLocation]);

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestination(dest);
    const marker = markerRefs.current[dest.id];
    if (marker) {
      marker.openPopup();
    }
  };

  const handleGetUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        setUserLocation({ lat: uLat, lng: uLng });

        const dist = calculateDistance(
          uLat,
          uLng,
          selectedDestination.lat,
          selectedDestination.lng
        );
        setDistance(dist);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      }
    );
  };

  if (!MapComponents || !customIcon) {
    return (
      <div className="w-full h-[680px] bg-white border border-gray-100 flex items-center justify-center text-red-600 font-bold animate-pulse shadow-sm">
        {t('loading')}
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedDestination.lat},${selectedDestination.lng}`;

  return (
    <div className="w-full bg-white py-12 px-4 flex flex-col items-center">
      {/* عنوان الخريطة الموحد والمنظم الذي يتغير تلقائياً حسب لغة الصفحة */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100 uppercase tracking-wider">
          {t('badge')}
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-3">
          {t('title')}
        </h2>
        <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div 
        ref={mapContainerRef}
        className="w-full max-w-7xl relative h-[700px] rounded-3xl overflow-hidden border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.06)] font-sans bg-white select-none"
      >
        <MapContainer
          center={[selectedDestination.lat, selectedDestination.lng]}
          zoom={6}
          scrollWheelZoom={true}
          className="w-full h-full z-0 bg-white"
        >
          <MapFlyTo destination={selectedDestination} />

          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

          <TileLayer
            url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          />

          {DESTINATIONS.map((dest) => (
            <Marker
              key={dest.id}
              position={[dest.lat, dest.lng]}
              icon={customIcon}
              ref={(ref: any) => {
                if (ref) markerRefs.current[dest.id] = ref;
              }}
              eventHandlers={{
                click: () => setSelectedDestination(dest),
              }}
            >
              <Popup minWidth={220} maxWidth={280}>
                <div className="text-right p-1 font-sans space-y-1.5 text-gray-900">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-1">
                    <h4 className="font-bold text-red-600 text-sm m-0">{dest.name}</h4>
                    <span className="text-[10px] bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded border border-red-100">
                      {dest.rating}
                    </span>
                  </div>

                  <div className="text-[11px] leading-tight">
                    <strong className="text-gray-700">{t('popup.era')} </strong>
                    <span className="text-red-700 font-semibold">{dest.era}</span>
                  </div>

                  <div className="text-[11px] leading-tight">
                    <strong className="text-gray-700">{t('popup.category')} </strong>
                    <span className="text-blue-600 font-semibold">{dest.category}</span>
                  </div>

                  <div className="text-[11px] leading-tight">
                    <strong className="text-gray-700">{t('popup.location')} </strong>
                    <span className="text-gray-800">{dest.location}</span>
                  </div>

                  <p className="text-[11px] text-gray-600 pt-1 border-t border-gray-100 m-0 leading-snug">
                    {dest.description}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* القائمة الجانبية */}
        <motion.div 
          drag
          dragConstraints={mapContainerRef}
          dragElastic={0.05}
          dragMomentum={false}
          className="absolute top-5 right-5 z-[1000] w-72 md:w-80 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.08)] space-y-3 cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">⋮⋮</span>
              <h3 className="text-gray-900 font-bold text-sm flex items-center gap-2 pointer-events-none">
                <span>{t('sidebarTitle')}</span>
                <span className="text-[10px] text-red-600 font-mono bg-red-50 px-1.5 py-0.5 rounded border border-red-100">20</span>
              </h3>
            </div>
            <span className="text-[9px] text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
              {t('dragToPan')} ✥
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar pointer-events-auto">
            {DESTINATIONS.map((dest) => (
              <button
                key={dest.id}
                onClick={() => handleSelectDestination(dest)}
                className={`w-full text-right p-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  selectedDestination.id === dest.id
                    ? 'bg-red-600 text-white shadow-[0_4px_15px_rgba(220,38,38,0.3)] border border-red-500'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200/60'
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold">{dest.name}</span>
                  <span className={`text-[10px] ${selectedDestination.id === dest.id ? 'text-red-100' : 'text-gray-500'}`}>{dest.city}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                  selectedDestination.id === dest.id
                    ? 'bg-white/10 text-white border-white/20'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}>
                  {dest.category.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* كارت التفاصيل بالأسفل */}
        <div className="absolute bottom-5 left-5 right-5 md:right-auto md:max-w-md z-[1000] bg-white/95 border border-gray-200 backdrop-blur-md p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] space-y-3 pointer-events-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                {selectedDestination.city}
              </span>
              <h4 className="text-lg font-black text-gray-900 mt-1">
                {selectedDestination.name}
              </h4>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
              {selectedDestination.rating}
            </span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            {selectedDestination.description}
          </p>

          <div className="pt-2 space-y-2.5 border-t border-gray-100 text-xs">
            <div className="flex items-center justify-between">
              <button 
                onClick={handleGetUserLocation}
                disabled={isLocating}
                className="text-red-600 font-semibold text-[11px] hover:underline flex items-center gap-1 transition-all"
              >
                <span>{isLocating ? t('calculating') : t('calculateDistance')}</span>
              </button>

              {distance && (
                <span className="text-[11px] font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  {t('distanceResult').replace('{distance}', distance)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a 
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 font-bold py-2 px-3 rounded-xl text-center transition-all text-[11px] flex items-center justify-center gap-1 shadow-sm"
              >
                <span>🧭 {t('directions')}</span>
              </a>

              <Link 
                href={`#/${selectedDestination.slug}`}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-xl text-center transition-all shadow-[0_4px_15px_rgba(220,38,38,0.3)] text-[11px] flex items-center justify-center gap-1"
              >
                <span>{t('viewPlan')}</span>
                <span>←</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
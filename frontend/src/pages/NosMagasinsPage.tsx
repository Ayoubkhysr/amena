import React, { useEffect, useState, useMemo } from 'react';
import { storesService, StoreResponse } from '../services/openapi';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon issue
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl
});

// Helper for Haversine distance
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Component to dynamically adjust map center when selectedStore changes
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

// Component to handle map clicks for manual geolocation
function MapClickHandler({ setUserLocation }: { setUserLocation: (loc: {lat: number, lng: number}) => void }) {
  useMapEvents({
    click(e) {
      setUserLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

// Component to dynamically scale markers based on zoom level
function DynamicMarkers({ stores, userLocation, handleStoreClick }: { stores: StoreResponse[], userLocation: {lat: number, lng: number} | null, handleStoreClick: (store: StoreResponse) => void }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({
    zoom() {
      setZoom(map.getZoom());
    }
  });

  // Calculate dynamic size: smaller when zoomed out
  const size = Math.max(15, Math.min(50, zoom * 4 - 8)); 
  const userSize = size * 0.8;

  const dynamicLogoIcon = new L.Icon({
    iconUrl: '/loc.png',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });

  const dynamicUserIcon = new L.Icon({
    iconUrl: '/ma position.png',
    iconSize: [userSize, userSize],
    iconAnchor: [userSize / 2, userSize],
    popupAnchor: [0, -userSize]
  });

  return (
    <>
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={dynamicUserIcon}>
          <Popup>
            <strong>Votre position</strong>
          </Popup>
        </Marker>
      )}

      {stores.map(store => store.latitude && store.longitude && (
        <Marker 
          key={store.id} 
          position={[store.latitude, store.longitude]} 
          icon={dynamicLogoIcon}
          eventHandlers={{ click: () => handleStoreClick(store) }}
        >
          <Popup>
            <div className="font-bold text-brand-blue">{store.name}</div>
            <div className="text-xs text-slate-600 mt-1">{store.address}</div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

function NosMagasinsPage() {
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [selectedStore, setSelectedStore] = useState<StoreResponse | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([33.8869, 9.5375]); // Tunisia Center
  const [mapZoom, setMapZoom] = useState(6);

  useEffect(() => {
    storesService.getStores().then(data => {
      setStores(data || []);
      if (data && data.length > 0) {
        setSelectedStore(data[0]); // Default to first store if no geolocation
      }
    }).catch(err => console.error("Failed to fetch stores", err));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
        },
        (error) => {
          console.warn("Geolocation denied or error", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && stores.length > 0) {
      let closest = stores[0];
      let minDistance = Infinity;
      
      stores.forEach(store => {
        if (store.latitude && store.longitude) {
          const dist = getDistance(userLocation.lat, userLocation.lng, store.latitude, store.longitude);
          if (dist < minDistance) {
            minDistance = dist;
            closest = store;
          }
        }
      });

      setSelectedStore(closest);
      if (closest.latitude && closest.longitude) {
        setMapCenter([closest.latitude, closest.longitude]);
        setMapZoom(12);
      }
    }
  }, [userLocation, stores]);

  const handleStoreClick = (store: StoreResponse) => {
    setSelectedStore(store);
    if (store.latitude && store.longitude) {
      setMapCenter([store.latitude, store.longitude]);
      setMapZoom(15);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-brand-blue mb-3" style={{ fontFamily: 'cursive' }}>
          Nos Magasins
        </h1>
        <p className="text-slate-600 text-sm max-w-lg mx-auto">
          Découvrez nos magasins et trouvez la boutique El Amine la plus proche de chez vous.
        </p>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Side - Store Information */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:col-span-1 shadow-sm">
            <h2 className="text-xl font-extrabold text-brand-blue mb-6">Informations</h2>
            {selectedStore ? (
              <div className="space-y-6">
                <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4">
                  📍 <strong>Astuce :</strong> Clickez sur votre position pour afficher la plus proche point de vente !
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">Boutique</h3>
                  <p className="text-brand-blue font-bold text-lg">{selectedStore.name}</p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">Adresse</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedStore.address}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">Horaires</h3>
                  <p className="text-slate-600 text-sm font-medium">
                    {selectedStore.hours || 'Non spécifié'}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">Téléphone</h3>
                  <p className="text-slate-600 text-sm font-medium">
                    {selectedStore.phone || 'Non spécifié'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-sm py-8 text-center">
                Veuillez sélectionner un point de vente sur la carte ou autoriser la géolocalisation.
              </div>
            )}
          </div>

          {/* Right Side - Map */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 lg:col-span-2 relative min-h-[350px] md:min-h-[450px] lg:min-h-[550px]">
            <MapContainer 
              center={mapCenter} 
              zoom={mapZoom} 
              style={{ height: '100%', width: '100%', zIndex: 0 }}
              minZoom={6}
              maxBounds={[
                [30.0, 7.0], // South-West Tunisia
                [38.0, 12.0] // North-East Tunisia
              ]}
              maxBoundsViscosity={1.0}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <MapController center={mapCenter} zoom={mapZoom} />
              <MapClickHandler setUserLocation={setUserLocation} />
              
              <DynamicMarkers 
                stores={stores} 
                userLocation={userLocation} 
                handleStoreClick={handleStoreClick} 
              />
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="text-center py-12 bg-slate-50">
        <p className="text-brand-red font-bold text-lg mb-3">
          Vous ne trouvez pas votre boutique ?
        </p>
        <div className="flex items-center justify-center gap-2 text-slate-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-brand-blue"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>
          <span className="font-medium">
            Service Client : <span className="font-bold text-brand-blue">(+216) 28 305 400</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default NosMagasinsPage;

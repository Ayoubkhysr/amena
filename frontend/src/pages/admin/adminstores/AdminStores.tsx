import React, { useEffect, useState } from 'react';
import { storesService, StoreResponse } from '../../../services/openapi';

export const AdminStores: React.FC = () => {
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [coordinatesInput, setCoordinatesInput] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState('');

  const fetchStores = async () => {
    try {
      const data = await storesService.getStores();
      setStores(data || []);
    } catch (err) {
      console.error('Failed to fetch stores', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const parseCoordinates = async (input: string): Promise<{ lat?: number; lng?: number }> => {
    if (!input.trim()) return {};

    // 1. Direct coordinates (ex: 35.6172, 10.9891)
    const directMatch = input.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
    if (directMatch) {
      return { lat: parseFloat(directMatch[1]), lng: parseFloat(directMatch[2]) };
    }

    // 2. Plus Code with Locality (ex: "JXCV+7W4, Bekalta")
    if (input.includes('+') && input.includes(',')) {
      const parts = input.split(',');
      const code = parts[0].trim();
      const locality = parts.slice(1).join(',').trim();
      
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locality)}&format=json`);
        const data = await response.json();
        if (data && data.length > 0) {
          const refLat = parseFloat(data[0].lat);
          const refLng = parseFloat(data[0].lon);
          
          const OpenLocationCode = (await import('open-location-code')).OpenLocationCode;
          const olc = new OpenLocationCode();
          const fullCode = olc.recoverNearest(code, refLat, refLng);
          const decoded = olc.decode(fullCode);
          return { lat: decoded.latitudeCenter, lng: decoded.longitudeCenter };
        }
      } catch (e) {
        console.error("Geocoding failed", e);
      }
    }

    // 3. Google Maps URL (ex: .../@35.6172,10.9891,...)
    const urlMatch = input.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (urlMatch) {
      return { lat: parseFloat(urlMatch[1]), lng: parseFloat(urlMatch[2]) };
    }

    return {};
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { lat, lng } = await parseCoordinates(coordinatesInput);

      await storesService.createStore({
        name,
        address,
        latitude: lat,
        longitude: lng,
        phone,
        hours
      });
      // Reset form
      setName(''); setAddress(''); setCoordinatesInput(''); setPhone(''); setHours('');
      await fetchStores();
    } catch (err) {
      console.error('Failed to create store', err);
      alert('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce magasin ?')) return;
    try {
      await storesService.deleteStore(id);
      fetchStores();
    } catch (err) {
      console.error('Failed to delete store', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Magasins (Points de vente)</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Ajouter un nouveau magasin</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
            <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Coordonnées / Code Plus (Google Maps)</label>
            <input type="text" value={coordinatesInput} onChange={e => setCoordinatesInput(e.target.value)} placeholder="Ex: JXCV+7W4, Bekalta ou 35.617, 10.989" className="w-full px-3 py-2 border rounded-lg focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horaires</label>
            <input type="text" value={hours} onChange={e => setHours(e.target.value)} placeholder="ex: Lun-Sam 9h-19h" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Ajouter le magasin</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPS</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center">Chargement...</td></tr>
            ) : stores.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center">Aucun magasin</td></tr>
            ) : stores.map(store => (
              <tr key={store.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{store.name}</td>
                <td className="px-6 py-4">{store.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {store.latitude}, {store.longitude}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(store.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

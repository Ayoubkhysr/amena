export interface StoreResponse {
  id: number;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  hours?: string;
}

export type StoreRequest = Omit<StoreResponse, 'id'>;

export const storesService = {
  getStores: async (): Promise<StoreResponse[]> => {
    const data = localStorage.getItem('amena_stores');
    if (data) {
      return JSON.parse(data);
    }
    // Default initial stores
    const defaultStores: StoreResponse[] = [
      { 
        id: 1, 
        name: "Tunis Centre", 
        address: "Tunis Centre ville, Bab Bhar, Rue mongi slim", 
        latitude: 36.8065, 
        longitude: 10.1815, 
        hours: "Lundi - Dimanche : 9:00 - 20:00", 
        phone: "(+216) 28 305 400\n(+216) 29 004 444" 
      }
    ];
    localStorage.setItem('amena_stores', JSON.stringify(defaultStores));
    return defaultStores;
  },
  createStore: async (store: StoreRequest): Promise<StoreResponse> => {
    const data = localStorage.getItem('amena_stores');
    const stores: StoreResponse[] = data ? JSON.parse(data) : [];
    const newStore = { ...store, id: Date.now() };
    stores.push(newStore);
    localStorage.setItem('amena_stores', JSON.stringify(stores));
    return newStore;
  },
  deleteStore: async (id: number): Promise<void> => {
    const data = localStorage.getItem('amena_stores');
    const stores: StoreResponse[] = data ? JSON.parse(data) : [];
    const filtered = stores.filter(s => s.id !== id);
    localStorage.setItem('amena_stores', JSON.stringify(filtered));
  }
};

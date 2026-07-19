import { Banner } from '../pages/admin/admincontenu/AdminContenu';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081';

async function parseError(res: Response): Promise<never> {
  const message = await res.text().catch(() => res.statusText);
  throw new Error(message || `Erreur API (${res.status})`);
}

export const fetchBanners = async (): Promise<Banner[]> => {
  const response = await fetch(`${API_BASE}/api/bannieres`);
  if (!response.ok) await parseError(response);
  const data = await response.json();
  return data.map((b: any) => ({
    id: b.id.toString(),
    title: b.title,
    imageUrl: b.imageUrl || '',
    targetUrl: b.targetUrl || '',
    position: b.position,
    status: b.status,
  }));
};

export const createBanner = async (banner: Omit<Banner, 'id'>): Promise<Banner> => {
  const payload = {
    title: banner.title,
    imageUrl: banner.imageUrl,
    targetUrl: banner.targetUrl,
    position: banner.position,
    status: banner.status,
  };
  const response = await fetch(`${API_BASE}/api/bannieres`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) await parseError(response);
  const data = await response.json();
  return {
    id: data.id.toString(),
    title: data.title,
    imageUrl: data.imageUrl || '',
    targetUrl: data.targetUrl || '',
    position: data.position,
    status: data.status,
  };
};

export const updateBanner = async (id: string, banner: Omit<Banner, 'id'>): Promise<Banner> => {
  const payload = {
    title: banner.title,
    imageUrl: banner.imageUrl,
    targetUrl: banner.targetUrl,
    position: banner.position,
    status: banner.status,
  };
  const response = await fetch(`${API_BASE}/api/bannieres/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) await parseError(response);
  const data = await response.json();
  return {
    id: data.id.toString(),
    title: data.title,
    imageUrl: data.imageUrl || '',
    targetUrl: data.targetUrl || '',
    position: data.position,
    status: data.status,
  };
};

export const deleteBanner = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/api/bannieres/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) await parseError(response);
};

export const uploadBannerImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE}/api/bannieres/upload-image`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) await parseError(response);
  const data = await response.json();
  return data.imageUrl;
};

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081';

async function parseError(res: Response): Promise<never> {
  const message = await res.text().catch(() => res.statusText);
  throw new Error(message || `Erreur API (${res.status})`);
}

export const getConfig = async (id: string): Promise<any> => {
  const response = await fetch(`${API_BASE}/api/config/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    await parseError(response);
  }
  const data = await response.json();
  try {
    return JSON.parse(data.value);
  } catch (e) {
    return data.value;
  }
};

export const updateConfig = async (id: string, value: any): Promise<any> => {
  const payload = {
    value: typeof value === 'string' ? value : JSON.stringify(value),
  };
  const response = await fetch(`${API_BASE}/api/config/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) await parseError(response);
  const data = await response.json();
  try {
    return JSON.parse(data.value);
  } catch (e) {
    return data.value;
  }
};

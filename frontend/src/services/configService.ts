import { ConfigService } from '../generated';

export const getConfig = async (id: string): Promise<any> => {
  try {
    const data = await ConfigService.getConfigById({ id });
    try {
      return JSON.parse(data.value);
    } catch {
      return data.value;
    }
  } catch (error: any) {
    if (error?.status === 404) return null;
    throw error;
  }
};

export const updateConfig = async (id: string, value: any): Promise<any> => {
  const payload = {
    value: typeof value === 'string' ? value : JSON.stringify(value),
  };
  const data = await ConfigService.updateConfig({ id, requestBody: payload });
  try {
    return JSON.parse(data.value);
  } catch {
    return data.value;
  }
};

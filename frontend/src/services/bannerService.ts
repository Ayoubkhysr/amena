import { Banner } from '../pages/admin/admincontenu/AdminContenu';
import { BannieresService } from '../generated';

export const fetchBanners = async (): Promise<Banner[]> => {
  const data = await BannieresService.getBannieres();
  return (data ?? []).map((b) => ({
    id: b.id.toString(),
    title: b.title,
    imageUrl: b.imageUrl || '',
    targetUrl: b.targetUrl || '',
    position: b.position ?? 0,
    status: b.status as unknown as Banner['status'],
  }));
};

export const createBanner = async (banner: Omit<Banner, 'id'>): Promise<Banner> => {
  const data = await BannieresService.createBanniere({
    requestBody: {
      title: banner.title,
      imageUrl: banner.imageUrl,
      targetUrl: banner.targetUrl,
      position: banner.position,
      status: banner.status as any,
    },
  });
  return {
    id: data.id.toString(),
    title: data.title,
    imageUrl: data.imageUrl || '',
    targetUrl: data.targetUrl || '',
    position: data.position ?? 0,
    status: data.status as unknown as Banner['status'],
  };
};

export const updateBanner = async (id: string, banner: Omit<Banner, 'id'>): Promise<Banner> => {
  const data = await BannieresService.updateBanniere({
    banniereId: Number(id),
    requestBody: {
      title: banner.title,
      imageUrl: banner.imageUrl,
      targetUrl: banner.targetUrl,
      position: banner.position,
      status: banner.status as any,
    },
  });
  return {
    id: data.id.toString(),
    title: data.title,
    imageUrl: data.imageUrl || '',
    targetUrl: data.targetUrl || '',
    position: data.position ?? 0,
    status: data.status as unknown as Banner['status'],
  };
};

export const deleteBanner = async (id: string): Promise<void> => {
  await BannieresService.deleteBanniere({ banniereId: Number(id) });
};

export const uploadBannerImage = async (file: File): Promise<string> => {
  const data = await BannieresService.uploadBanniereImage({
    formData: { file: file as unknown as Blob },
  });
  return data.imageUrl ?? '';
};

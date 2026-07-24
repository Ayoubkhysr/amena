import { Client } from '../pages/admin/adminclients/AdminClients';
import { UserResponse, UserPage as GeneratedUserPage, UsersService } from '../generated';

export type ApiUser = UserResponse;

export type UserPage = GeneratedUserPage;

export function toUiClient(api: UserResponse): Client {
  return {
    id: api.id.toString(),
    name: `${api.firstName} ${api.lastName}`.trim() || api.email,
    email: api.email,
    phone: api.phone || '—',
    registrationDate: formatDate(api.createdAt),
    totalOrders: 0,
    totalSpent: 0,
    status: 'Actif',
  };
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toISOString().slice(0, 10);
}

export async function fetchUsersPage(
  page = 0,
  size = 20,
  search?: string,
  role?: string,
  sortBy = 'createdAt',
  sortOrder = 'desc'
): Promise<UserPage> {
  const result = await UsersService.getUsers({
    page,
    size,
    search,
    role,
    sortBy,
    sortOrder,
  });
  return result;
}
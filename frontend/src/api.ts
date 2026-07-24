// This file initializes the OpenAPI configuration with the base URL from environment variables
// Import this file early in your application (e.g., in main.tsx)

import { OpenAPI } from './generated/core/OpenAPI';

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8081';

OpenAPI.BASE = baseUrl;

export { OpenAPI };
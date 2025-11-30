export const API_URL = 'https://gorest.co.in/public/v2/users';

export const STORAGE_KEYS = {
  USERS: 'users',
} as const;

export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  DEFAULT_PAGE: 1
} as const;

export const GENDER_MAP = {
  male: 'hombre',
  female: 'mujer'
} as const;

export const STATUS_MAP = {
  active: 'activo',
  inactive: 'inactivo'
} as const;

export const PAGINATION_CONSTANTS = {
  MAX_VISIBLE_PAGES: 5,
  ELLIPSIS: '...'
} as const;


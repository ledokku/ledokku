import dotenv from 'dotenv';
import { throwError } from './utils';
dotenv.config();

export const HOME =
  process.env.HOME ?? throwError('Variable de entorno HOME es requerido');

export const JWT_SECRET =
  process.env.JWT_SECRET ??
  throwError('Variable de entorno JWT_SECRET es requerido');

export const GITHUB_APP_ID =
  process.env.GITHUB_APP_ID ??
  throwError('Variable de entorno GITHUB_APP_ID es requerido');
export const GITHUB_APP_NAME =
  process.env.GITHUB_APP_NAME ??
  throwError('Variable de entorno GITHUB_APP_NAME es requerido');
export const GITHUB_APP_CLIENT_ID =
  process.env.GITHUB_APP_CLIENT_ID ??
  throwError('Variable de entorno GITHUB_APP_CLIENT_ID es requerido');
export const GITHUB_APP_CLIENT_SECRET =
  process.env.GITHUB_APP_CLIENT_SECRET ??
  throwError('Variable de entorno GITHUB_APP_CLIENT_SECRET es requerido');
export const GITHUB_APP_WEBHOOK_SECRET =
  process.env.GITHUB_APP_WEBHOOK_SECRET ??
  throwError('Variable de entorno GITHUB_APP_WEBHOOK_SECRET es requerido');
export const GITHUB_APP_PEM =
  process.env.GITHUB_APP_PEM ??
  throwError('Variable de entorno GITHUB_APP_PEM es requerido');

export const DATABASE_URL =
  process.env.DATABASE_URL ??
  throwError('Variable de entorno DATABASE_URL es requerido');
export const REDIS_URL =
  process.env.REDIS_URL ??
  throwError('Variable de entorno REDIS_URL es requerido');

export const DOKKU_SSH_HOST =
  process.env.DOKKU_SSH_HOST ??
  throwError('Variable de entorno DOKKU_SSH_HOST es requerido');
export const DOKKU_SSH_PORT = Number(process.env.DOKKU_SSH_PORT) ?? 3022;

export const NUMBER_USERS_ALLOWED = process.env.NUMBER_USERS_ALLOWED ?? 1;

export const TELEMETRY_DISABLED = process.env.TELEMETRY_DISABLED ?? 1;
export let WEBHOOK_PROXY_URL =
  process.env.WEBHOOK_PROXY_URL ?? 'https://smee.io/dW2WX9OSa1AnFpN';

export const NODE_ENV = process.env.NODE_ENV ?? 'development';
export const PORT = process.env.PORT ?? 4000;
export const IS_PRODUCTION = NODE_ENV === 'production';

export function changeWebhookProxyUrl(url: string) {
  WEBHOOK_PROXY_URL = url;

  return WEBHOOK_PROXY_URL;
}

export const CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*';

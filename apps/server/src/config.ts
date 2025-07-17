if (process.env.NODE_ENV !== 'production') {
  process.loadEnvFile();
}

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
export const ALLOWED_ORIGINS: string[] = [
  'http://localhost:3000',
  'http://192.168.1.66:3000',
];
export const CYPHER_KEY = process.env.CYPHER_KEY!;
export const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

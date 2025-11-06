export const config = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (typeof window === 'undefined'
      ? 'http://localhost:3001'
      : window.location.origin),
};

export default config;



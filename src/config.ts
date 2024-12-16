export const config = {
  telegramApi: process.env.NODE_ENV === "production" ? "https://" : "http://localhost:3005",
  backendApi: process.env.NODE_ENV === "production" ? "https://" : "http://localhost:3000",
};

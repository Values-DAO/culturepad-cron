export const config = {
  telegramApi:
    process.env.ENV === "prod"
      ? "https://api.valuesdao.io"
      : process.env.ENV === "staging"
      ? "https://staging-api.valuesdao.io"
      : "http://localhost:3005",
  backendApi: process.env.ENV === "prod" 
      ? "https://api.valuesdao.io" 
      : process.env.ENV === "staging" 
      ? "https://staging-api.valuesdao.io" 
      : "http://localhost:3000",
};

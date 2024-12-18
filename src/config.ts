export const config = {
  telegramApi:
    process.env.ENV === "prod"
      ? "http://localhost:3006"
      : process.env.ENV === "staging"
      ? "http://localhost:3005"
      : "http://localhost:3005",
  backendApi: // TODO: FIX THIS SHIT
    process.env.ENV === "prod"
      ? "https://api.valuesdao.io"
      : process.env.ENV === "staging"
      ? "https://staging-api.valuesdao.io"
      : "http://localhost:3000",
};

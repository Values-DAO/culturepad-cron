import dotenv from "dotenv";
import axios from "axios"
import { config } from "./config";
import cron from "node-cron";

dotenv.config();

let isValuesJobRunning = false;
let isOnchainJobRunning = false;

const cron_service_values = async () => {
  // Skip if another job is already running
  if (isValuesJobRunning) {
    console.log("Previous values job still running, skipping...");
    return;
  }

  try {
    isValuesJobRunning = true;
    console.log("Running values cron service...", new Date().toISOString());

    const _responseTelegramBot = await axios.post(
      `${config.telegramApi}/api/process-messages`,
      {},
      {
        headers: {
          "x-api-key": process.env.CRON_API_KEY,
        },
        timeout: 180000, // 180 second timeout
      }
    );

    console.log(`Bot service working fine`);
  } catch (error) {
    // Just log the error and continue - no retry
    console.error("Bot service call failed:", error);
  } finally {
    isValuesJobRunning = false;
  }
};

const cron_service_onchain = async () => {
  if (isOnchainJobRunning) {
    console.log("Previous onchain job still running, skipping...");
    return;
  }

  try {
    isOnchainJobRunning = true;
    console.log("Running onchain cron service...", new Date().toISOString());

    const _response = await axios.post(
      `${config.backendApi}/cultureBook/post-onchain`,
      {},
      {
        // TODO: Add this header to the backend API
        headers: {
          "x-api-key": process.env.CRON_API_KEY,
        },
        timeout: 300000, // 5 min timeout
      }
    );

    console.log(`Onchain service working fine`);
  } catch (error) {
    // Just log the error and continue - no retry
    console.error("Onchain service call failed:", error);
  } finally {
    isOnchainJobRunning = false;
  }
};

// cron_service()

cron_service_onchain();

// run every min
// cron.schedule("* * * * *", cron_service_values)

// run every 2 min
// cron.schedule("*/2 * * * *", cron_service)

// run every 2 sec
// cron.schedule("*/2 * * * * *", cron_service)

// run every 30 sec
// cron.schedule("*/30 * * * * *", cron_service)

// // run every 10 sec
// cron.schedule("*/10 * * * * *", cron_service)

// run every friday at 5 pm GMT
// cron.schedule("0 17 * * 5", cron_service)

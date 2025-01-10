import dotenv from "dotenv";
import axios from "axios"
import { config } from "./config";
import cron from "node-cron";

dotenv.config();

let isValuesJobRunning = false;
let isOnchainJobRunning = false;

const combinedCronService = async () => {
  // Skip if another job is already running
  if (isValuesJobRunning) {
    console.log("Previous values job still running, skipping...");
    return;
  }

  try {
    isValuesJobRunning = true;
    console.log("Running values cron service...", new Date().toISOString());

    const responseTelegramBot = await axios.post(
      `${config.telegramApi}/api/process-messages`,
      {},
      {
        headers: {
          "x-api-key": process.env.CRON_API_KEY,
        },
      }
    );

    if (responseTelegramBot.status !== 200) {
      throw new Error(`Telegram bot service failed`);
    }

    console.log(`Bot service working fine`);
  } catch (error) {
    console.error("Bot service call failed:", error);
  } finally {
    isValuesJobRunning = false;
  }
  
  if (isOnchainJobRunning) {
    console.log("Previous onchain job still running, skipping...");
    return;
  }

  try {
    isOnchainJobRunning = true;
    console.log("Running onchain cron service...", new Date().toISOString());

    const response = await axios.post(
      `${config.backendApi}/cultureBook/post-onchain`,
      {},
      {
        // TODO: Add this header to the backend API
        headers: {
          "x-api-key": process.env.CRON_API_KEY,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Onchain service failed`);
    }

    console.log(`Onchain service working fine`);
  } catch (error) {
    console.error("Onchain service call failed:", error);
  } finally {
    isOnchainJobRunning = false;
  }
}

// const cron_service_values = async () => {
//   // Skip if another job is already running
//   if (isValuesJobRunning) {
//     console.log("Previous values job still running, skipping...");
//     return;
//   }

//   try {
//     isValuesJobRunning = true;
//     console.log("Running values cron service...", new Date().toISOString());

//     const responseTelegramBot = await axios.post(
//       `${config.telegramApi}/api/process-messages`,
//       {},
//       {
//         headers: {
//           "x-api-key": process.env.CRON_API_KEY,
//         },
//         // timeout: 180000, // 180 second timeout
//       }
//     );
    
//     if (responseTelegramBot.status !== 200) {
//       throw new Error(`Telegram bot service failed`);
//     }
    
//     console.log(`Bot service working fine`);
//   } catch (error) {
//     // Just log the error and continue - no retry
//     console.error("Bot service call failed:", error);
//   } finally {
//     isValuesJobRunning = false;
//   }
// };

// const cron_service_onchain = async () => {
//   if (isOnchainJobRunning) {
//     console.log("Previous onchain job still running, skipping...");
//     return;
//   }

//   try {
//     isOnchainJobRunning = true;
//     console.log("Running onchain cron service...", new Date().toISOString());

//     const response = await axios.post(
//       `${config.backendApi}/cultureBook/post-onchain`,
//       {},
//       {
//         // TODO: Add this header to the backend API
//         headers: {
//           "x-api-key": process.env.CRON_API_KEY,
//         },
//         // timeout: 300000, // 5 min timeout
//       }
//     );
    
//     if (response.status !== 200) {
//       throw new Error(`Onchain service failed`);
//     }

//     console.log(`Onchain service working fine`);
//   } catch (error) {
//     // Just log the error and continue - no retry
//     console.error("Onchain service call failed:", error);
//   } finally {
//     isOnchainJobRunning = false;
//   }
// };

// cron_service_values();

// cron_service_onchain();

// combinedCronService()

// run every min
// cron.schedule("*/3 * * * *", combinedCronService)

// run every 2 min
// cron.schedule("*/2 * * * *", cron_service_onchain);

// run every 2 sec
// cron.schedule("*/2 * * * * *", cron_service)

// run every 30 sec
// cron.schedule("*/30 * * * * *", cron_service)

// // run every 10 sec
// cron.schedule("*/10 * * * * *", cron_service)

// run every friday at 17:30 IST
// cron.schedule("0 17 * * 5", cron_service_values)

// run every saturday at 17:35 IST
// cron.schedule("0 17 * * 6", cron_service_onchain)

// Run every Friday at 17:30 IST (12:00 UTC)
// cron.schedule("0 12 * * 5", cron_service_values);

// Run every Saturday at 17:35 IST (12:05 UTC)
// cron.schedule("5 12 * * 6", cron_service_onchain);

// Run every Friday at 6:10 IST (12:40 UTC)
// cron.schedule("5 13 * * *", combinedCronService);

// Run every Friday at 12 noon IST (6:30 UTC)
// cron.schedule("30 6 * * 5", combinedCronService);

// Run every Friday at 17:30 IST (12:00 UTC)
// cron.schedule("30 17 * * 5", combinedCronService);
  
// combinedCronService();

// run every monday at 17:35 IST
// cron.schedule("38 17 * * 1", cron_service_values)

// run cron_service_values every 5 min, run cron_service_onchain every 5 min but after 2.5 min of cron_service_values
// cron.schedule("*/5 * * * *", () => {
//   console.log("Triggering values job...");
//   cron_service_values();
// });

// // Schedule cron_service_onchain to run 2.5 minutes (150 seconds) after cron_service_values
// cron.schedule("*/5 * * * *", () => {
//   console.log("Scheduling onchain job with 2.5-minute delay...");
//   setTimeout(() => {
//     cron_service_onchain();
//   }, 150000); // 150,000 milliseconds = 2.5 minutes
// });

// run at every friday at 12 noon
// cron.schedule("0 12 * * 5", combinedCronService);
cron.schedule("25 12 * * 5", combinedCronService); // run at every friday at 12:25

// run at every saturday at 21:00
// cron.schedule("0 21 * * 6", combinedCronService);
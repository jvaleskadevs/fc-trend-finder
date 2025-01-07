import dotenv from 'dotenv';
import cron from 'node-cron';
import { handleCron } from './lib/cron'; 
dotenv.config();

async function main() {
  // starting the cron task
  await handleCron();
}
main();
// uncomment to set the cron task 
/*
cron.schedule(`0 17 * * *`, async () => {
  await handleCron();
});
*/

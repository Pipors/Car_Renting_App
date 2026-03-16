import { app } from "./app";
import { env } from "./config/env";
import { startReviewReminderJob } from "./jobs/reviewReminder.job";

app.listen(env.PORT, () => {
  startReviewReminderJob();
  console.log(`Car rental API listening on http://localhost:${env.PORT}`);
});

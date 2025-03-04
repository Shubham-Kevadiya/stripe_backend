import config from "../../config/config.js";
import webhookService from "./webhook.service.js";

const listenToWebhook = async (req, res, next) => {
  try {
    const rowData = req.body;
    const signature = req.headers["stripe-signature"];
    const event = await webhookService.listenToWebhook({
      rowData,
      signature,
      endpointSecret: config.stipe.webhook_secret,
    });
    console.log({ event: event.type });
    return res.json({ received: true });
  } catch (error) {
    console.log("error", "error in webhook event", error);
    next(error);
  }
};

export default {
  listenToWebhook,
};

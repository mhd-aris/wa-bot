import { create, Client } from "@open-wa/wa-automate";
import HandleMessages from "./HandleMessages.js";
const start = async (client = new Client()) => {
  console.log("[SERVER] Server Started!");
  // Force it to keep the current session
  client.onStateChanged((state) => {
    console.log("[Client State]", state);
    if (state === "CONFLICT" || state === "UNLAUNCHED") client.forceRefocus();
  });
  // listening on message
  client.onMessage(async (message) => {
    client.getAmountOfLoadedMessages().then((msg) => {
      if (msg >= 3000) {
        client.cutMsgCache();
      }
    });
    HandleMessages(client, message);
  });
};
const options = (headless, start) => {
  const options = {
    sessionId: "mhdaris",
    headless: headless,
    qrTimeout: 0,
    authTimeout: 0,
    restartOnCrash: start,
    cacheEnabled: false,
    useChrome: true,
    killProcessOnBrowserClose: true,
    throwErrorOnTosBlock: false,
    chromiumArgs: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--aggressive-cache-discard",
      "--disable-cache",
      "--disable-application-cache",
      "--disable-offline-load-stale-cache",
      "--disk-cache-size=0",
    ],
  };
  return options;
};
create(options(true, start))
  .then((client) => start(client))
  .catch((error) => console.log(error));

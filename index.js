import { create, Client } from "@open-wa/wa-automate";
import { insertLink, getLinks } from "./lib/postLink.js";

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
    const { from, body } = message;
    const commands = body;
    const command = commands.toLowerCase().split(" ")[0] || "";
    const args = commands.split(" ");

    const isUrl = new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi
    );

    switch (command) {
      case "/test":
        await client.sendText(from, " Hello " + message.notifyName + "!");
        break;
      case "/link":
        let url = args[1];
        if (url.match(isUrl)) {
          const response = await insertLink(url);
          if (response) {
            await client.sendText(from, `${url} saved!`);
          } else {
            await client.sendText(from, "Failed to save!");
          }
        }
        break;

      case "/getLinks":
        const response = await getLinks();
        if (!response.link) {
          const links = "";
          response.forEach((data) => {
            links = `- ${data.link}\n`;
          });
          await client.sendText(from, `List links : \n ${links} saved!`);
        } else {
          await client.sendText(from, "Failed to get links!");
        }
        break;
      default:
        await client.sendText(from, "Command tidak tersedia!");
        break;
    }
  });
};
const options = (headless, start) => {
  console.log(headless, start);
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

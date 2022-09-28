import { insertLink, getLinks } from "./lib/postLink.js";

const HandleMessages = async (client, message) => {
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
};
export default HandleMessages;

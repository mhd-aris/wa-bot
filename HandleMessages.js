import axios from "axios";
import { insertLink, getLinks } from "./lib/postLink.js";

const HandleMessages = async (client, message) => {
  const { from, body } = message;
  const commands = body;
  const command = commands.toLowerCase().split(" ")[0] || "";
  const args = commands.split(" ");

  const isUrl = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi
  );

  console.log(command);

  switch (command) {
    case "/test":
      await client.sendText(from, " Hello " + message.notifyName + "!");
      break;

    case "/tiktok":
      try {
        let linkVt = args[1];
        if (!linkVt.match(isUrl)) {
          return await client.sendText(from, "Link not valid!");
        }
        let response = await axios.get(
          `https://api.douyin.wtf/api?url=${linkVt}`
        );
        let urlVideo = await response.data.nwm_video_url;
        await client.sendFileFromUrl(
          from,
          urlVideo,
          "result.mp4",
          `Download success! \n   by: @xryvq`
        );
      } catch (error) {
        await client.sendText(from, "Failed to download video! :(");
      }
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

    case "/getlinks":
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

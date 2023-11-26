const server = require("./server.js");
const mineflayer = require("mineflayer");
const antiafk = require("mineflayer-antiafk");
const translatte = require("translatte");
const axios = require("axios");
const LanguageDetect = require("languagedetect");

const lngDetector = new LanguageDetect();

const botArgs = {
  host: "MCserverExZD.aternos.me",
  port: "64545",
  username: "B-AI",
  version: "1.20.1",
};

const formatTime = () => {
  const options = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Manila",
  };
  return new Date().toLocaleTimeString("en-US", options);
};

const initBot = () => {
  let bot = mineflayer.createBot(botArgs);
  bot.loadPlugin(antiafk);

  bot.on("login", () => {
    let botSocket = bot._client.socket;
    console.log(
      `Logged in \nServer: ${
        botSocket.server ? botSocket.server : botSocket._host
      } \nTime: ${formatTime()}`,
    );
  });

  bot.on("end", () => {
    console.log(`Disconnected \nTime: ${formatTime()}\n`);
    setTimeout(initBot, Math.floor(Math.random() * 60000 + 30000));
  });

  bot.on("spawn", async () => {
    console.log("Spawned in\n");
    bot.afk.setOptions({ fishing: false, chatting: false });
    bot.afk.start();
    await bot.waitForTicks(Math.floor(Math.random() * 24000 + 12000));
    bot.quit();
  });

  bot.on("error", (err) => {
    if (err.code === "ECONNREFUSED") {
      console.log(`Failed to connect to ${err.address}:${err.port} `);
    } else {
      console.log(`Unhandled error: ${err} `);
    }
  });

  bot.on("chat", async (username, message) => {
    let called = false;
    var question = "";
    if (message.includes("Bai shut down")) {
      bot.chat("Bai bai");
      process.exit(0);
    }
    if (username !== bot.username) {
      if (message.includes("Bai")) {
        question = message.split("Bai")[1]?.trim();
        called = true;
      } else if (message.includes("bai")) {
        question = message.split("bai")[1]?.trim();
        called = true;
      }

      if (message.includes("katulog nalang" && called)) {
        process.exit(0);
      }

      var language = lngDetector.detect(question, 5);
      var detect = language.toString();

      if (detect.includes("cebuano") && called) {
        console.log("Cebuano: True");
        console.log("Question: " + question);

        if (question) {
          bot.chat("Loading bai");
          const gptResponse = await getChatGptResponse(question);
          await bot.waitForTicks(Math.floor(Math.random() * 20 + 10));
          translatte(gptResponse, { to: "ceb" }, { google_free: true })
            .then((res) => {
              console.log("Answer: " + res.text + "\n");
              bot.chat(res.text);
            })
            .catch((err) => {
              console.error(err);
              console.log("Answer: " + gptResponse + "\n");
              bot.chat(gptResponse);
            });
        }
      } else if (called) {
        console.log("Cebuano: False\n");
        bot.chat("Wala ko kasabot, magbisaya lng ta bai");
      }
    }
    called = false;
  });
};

const getChatGptResponse = async (question) => {
  try {
    const apiKey = "YOUR_API_KEY";
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: question },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey} `,
        },
      },
    );

    return (
      response.data.choices[0]?.message?.content || "Sorry, wala nako nasabtan."
    );
  } catch (error) {
    console.error("Error calling ChatGPT API:", error.message);
    return "Sorry, naay error";
  }
};

initBot();

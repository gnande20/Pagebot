import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = "EAA5sBZBCAgmEBPZA25oXGOzA9CeRSvHCnIZBT9mXBZCZB3zg1ZAqjkDzA39zg3oARhFK5FD6wdXU4MFrJtCRsJB5owE6snTiZBWSUnZBPvv7J6H9J8Am29wvMvqZC4m2nEGYbzXTCL48DeLNCMDkmV9d5p7Vrw8K4qTpMFZBnS6S7wE8e29f7ftmRuVVWDDd4L3zc9ZCslmtwZDZD";

// Vérification du webhook
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "Kouakou123";

  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Réception des messages
app.post("/webhook", (req, res) => {
  let body = req.body;

  if (body.object === "page") {
    body.entry.forEach(entry => {
      let event = entry.messaging[0];
      let sender_psid = event.sender.id;

      if (event.message) {
        handleMessage(sender_psid, event.message.text);
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// Fonction pour répondre
async function handleMessage(sender_psid, received_message) {
  let response = { text: `Tu as dit: ${received_message}` };

  await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: sender_psid },
      message: response
    })
  });
}

app.listen(3000, () => console.log("Bot en ligne 🚀"));

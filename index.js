const express = require('express');
const app = express();
app.use(express.json());

let users = {};

app.get('/', (req, res) => {
  res.send('Rimokta Bot is Running!');
});

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === 'rimokta123') {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', (req, res) => {
  const body = req.body;
  if (body.object) {
    const entry = body.entry[0];
    const msg = entry.changes[0].value.messages ? entry.changes[0].value.messages[0] : null;
    if (msg) {
      const from = msg.from;
      const text = msg.text ? msg.text.body.toLowerCase() : "";
      if (!users[from]) {
        users[from] = { lang: null, points: 0 };
        console.log(`SEND to ${from}: Welcome to Rimokta! Choose 1 Bangla 2 English`);
      } else if (!users[from].lang) {
        if (text == "1") {
          users[from].lang = "bn";
          console.log(`SEND to ${from}: Bangla Menu`);
        } else {
          users[from].lang = "en";
          console.log(`SEND to ${from}: English Menu`);
        }
      }
    }
    res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on ' + PORT));

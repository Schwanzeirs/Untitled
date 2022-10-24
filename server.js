require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const ChatGrant = AccessToken.ChatGrant;
const express = require("express");
const app = express();
const port = 5000;
const MAX_ALLOWED_SESSION_DURATION = 86400;
const pushCredentialSid = process.env.PUSH_CREDENTIAL_SID


// use the Express JSON middleware
app.use(express.json());

// create the twilioClient
const twilioClient = require("twilio")(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

// create client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.conversations.v1.conversations
                       .create({friendlyName: 'Friendly Conversation'})
                       .then(conversation => CONVERSATIONS_SERVICE_SID = conversation.sid);



const findOrCreateRoom = async (roomName) => {
  let room;
    try {
      // see if the room exists already. If it doesn't, this will throw
      // error 20404.
      room = await twilioClient.video.rooms(roomName).fetch();
      console.log(room);
    } catch (error) {
      // the room was not found, so create it
      if (error.code == 20404) {
        room = await twilioClient.video.rooms.create({
          uniqueName: roomName,
          type: "group",
        });
        console.log(room);
      } else {
        // let other errors bubble up
        throw error;
      }
    }
  };
  
const getAccessToken = (roomName) => {
  // create an access token
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    // generate a random unique identity for this participant
    { ttl: MAX_ALLOWED_SESSION_DURATION,
      identity: uuidv4() }
  );
  // create a video grant for this specific room
  const videoGrant = new VideoGrant({
    room: roomName,
  });
  // add the video grant
  token.addGrant(videoGrant);

  // add the chat grant
  const chatGrant = new ChatGrant({ 
    serviceSid: CONVERSATIONS_SERVICE_SID,
    pushCredentialSid: pushCredentialSid
  })
  token.addGrant(chatGrant);
  console.log(chatGrant);
  console.log(videoGrant);

  // serialize the token and return it
  return token.toJwt();
};

app.post("/join-room", async (req, res) => {
  // return 400 if the request has an empty body or no roomName
  if (!req.body || !req.body.roomName) {
    return res.status(400).send("Must include roomName argument.");
  }
  const roomName = req.body.roomName;
  // find or create a room with the given roomName
  findOrCreateRoom(roomName);
  // generate an Access Token for a participant in this room
  const token = getAccessToken(roomName);
  res.send({
    token: token,
  });
});

// serve static files from the public directory
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("public/index.html");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});


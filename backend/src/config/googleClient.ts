import { google } from "googleapis";
import env from "./env";

const oauth2Client = new google.auth.OAuth2(
    env.googleClientId,
    env.googleClientSecret,
    "postmessage"
);

export default oauth2Client;
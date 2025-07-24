import { AccessToken } from "livekit-server-sdk";
import dotenv from "dotenv";
dotenv.config();

const { LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;

export function generateLivekitToken({
  identity,
  name,
  roomName,
  expiration,
  isMentor,
}) {
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
    name,
    ttl: expiration,
    role: isMentor ? "moderator" : "participant",
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
  });
  const jwt = token.toJwt();
  return jwt;
}

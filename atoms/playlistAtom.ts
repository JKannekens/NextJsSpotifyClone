import { atom } from "recoil";

export const playlistIdState = atom({
  key: "playlistIdState",
  default: "15lF8LvL2Hl7kURT5puoUm",
});

export const playlistState = atom({
  key: "playlistState",
  default: <SpotifyApi.SinglePlaylistResponse>{},
});

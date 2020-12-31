import { sha256 } from "js-sha256";

export default function (password: string): string {
  // TODO password salt in env file
  return sha256("pachisochamlapasswordsalt" + password);
}

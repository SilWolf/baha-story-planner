import { UserSchemaV1 } from "@/schemas/User";

export type AuthProviderType = {
  login: () => Promise<AuthProviderCredentials>;
  logout: () => Promise<boolean>;
};

export type AuthProviderCredentials = {
  identification: string;
  user: UserSchemaV1;
};

export const hashIdentification = async (identification: string) => {
  const msgUint8 = new TextEncoder().encode(identification); // encode as (utf-8) Uint8Array
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex.substring(0, 16);
};

import { createAutoDriveApi } from "@autonomys/auto-drive";
import { createConnection } from "@autonomys/auto-utils";

export async function getAutoDriveApi() {
  return createAutoDriveApi({ apiKey: process.env.AUTONOMYS_API_KEY || "" });
}

export async function getApiInstance() {
  const endpoint = "wss://auto-evm-0.taurus.subspace.network/ws";
  const api = await createConnection(endpoint);
  return api;
}

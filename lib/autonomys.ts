import { createAutoDriveApi } from '@autonomys/auto-drive';

export function getAutoDriveApi() {
  return createAutoDriveApi({ apiKey: process.env.AUTONOMYS_API_KEY });
}

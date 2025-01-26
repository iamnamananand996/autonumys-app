import type { WalletAccount } from "@subwallet/wallet-connect/types";
import type { WalletType } from "constants/wallet";

export interface WalletAccountWithType extends WalletAccount {
  type: WalletType;
}

export type AddressBookEntry = {
  address: string;
  label: string;
  type: WalletType;
};

export interface User {
  _id: string;
  userId: string;
  agentName: string;
  autoId: string;
  reward: number;
  createdAt: string;
  updatedAt: string;
}

export type ExtendedWalletAccount = WalletAccountWithType & {
  user?: User;
};

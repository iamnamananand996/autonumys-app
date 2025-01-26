"use client";

import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createConnection, ApiPromise } from "@autonomys/auto-utils";
import { getWalletBySource } from "@subwallet/wallet-connect/dotsama/wallets";
import type { InjectedExtension } from "@polkadot/extension-inject/types";
import { WalletType } from "constants/wallet";
import { useSafeLocalStorage } from "hooks/useSafeLocalStorage";
import { sendGAEvent } from "@next/third-parties/google";
import type { WalletAccountWithType } from "types/wallet";
import toast from "react-hot-toast";

export interface WalletContextValue {
  api: ApiPromise | undefined;
  isReady: boolean;
  accounts: WalletAccountWithType[] | null | undefined;
  actingAccount: WalletAccountWithType | undefined;
  injector: InjectedExtension | null;
  error: Error | null;
  isLogIn: boolean;
  isRegistered: boolean;
  setIsLogIn: Dispatch<SetStateAction<boolean>>;
  disconnectWallet: () => void;
  changeAccount: (account: WalletAccountWithType) => void;
  handleSelectFirstWalletFromExtension: (source: string) => Promise<void>;
}

export const WalletContext = createContext<WalletContextValue>(
  {} as WalletContextValue
);

type Props = {
  children?: ReactNode;
};

export const WalletProvider: FC<Props> = ({ children }) => {
  const [api, setApi] = useState<ApiPromise>();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [accounts, setAccounts] = useState<
    WalletAccountWithType[] | null | undefined
  >(undefined);
  const [actingAccount, setActingAccount] = useState<
    WalletAccountWithType | undefined
  >(undefined);
  const [injector, setInjector] = useState<InjectedExtension | null>(null);
  const [isLogIn, setIsLogIn] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [preferredAccount, setPreferredAccount] = useSafeLocalStorage(
    "localAccount",
    null
  );
  const [preferredExtension, setPreferredExtension] = useSafeLocalStorage(
    "extensionSource",
    null
  );

  const EVM_ENDPOINT = process.env.EVM_ENDPOINT || "";

  const connectToEvmNode = useCallback(async () => {
    try {
      console.log("Connecting to Autonomys EVM domain:", EVM_ENDPOINT);
      const evmApi = await createConnection(EVM_ENDPOINT);
      console.log("Connection established. isConnected:", evmApi.isConnected);
      setApi(evmApi);
    } catch (err) {
      console.error("Failed to connect to Autonomys EVM domain:", err);
      setError(err as Error);
    }
  }, []);

  const handleLogin = async (
    userId: string | undefined,
    agentName: string | undefined
  ) => {
    if (!userId || !agentName) {
      setIsLogIn(false);
      toast.error("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch("/api/agents/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, agentName }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsLogIn(true);
        toast.success(`Login successful: Welcome ${result.user.agentName}!`);
      } else {
        setIsLogIn(false);
        toast.error(result.message || "Login failed.");
      }
    } catch (error) {
      setIsLogIn(false);
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const changeAccount = useCallback(
    (account: WalletAccountWithType) => {
      try {
        const type =
          account.type === WalletType.subspace ||
          (account as { type: string }).type === "sr25519"
            ? WalletType.subspace
            : WalletType.ethereum;

        setActingAccount({ ...account, type });
        handleLogin(account.address, account.name);
        setPreferredAccount(account.address);
        setIsReady(true);

        // track event (optional)
        sendGAEvent({
          event: "wallet_select_account",
          value: `source:${account.source}`,
        });
      } catch (err) {
        console.error("Failed to change account:", err);
      }
    },
    [setPreferredAccount]
  );

  const disconnectWallet = useCallback(() => {
    setInjector(null);
    setAccounts([]);
    setActingAccount(undefined);
    setIsLogIn(false);
    setIsReady(false);
    setPreferredAccount(null);
    setPreferredExtension(null);
    sendGAEvent("event", "wallet_disconnect");
  }, [setPreferredAccount, setPreferredExtension]);

  const handleSelectFirstWalletFromExtension = useCallback(
    async (source: string) => {
      // subwallet-js, polkadot-js, talisman, etc.
      const wallet = getWalletBySource(source);
      if (!wallet) {
        console.warn("Wallet extension not found for source:", source);
        return;
      }
      await wallet.enable();
      if (wallet.extension) {
        setInjector(wallet.extension);
      }
      const walletAccounts =
        (await wallet.getAccounts()) as WalletAccountWithType[];
      setAccounts(walletAccounts);
      setPreferredExtension(source);

      // Optionally pick the first account
      if (walletAccounts.length > 0) {
        changeAccount(walletAccounts[0]);
      }

      sendGAEvent({
        event: "wallet_get_wallet",
        value: `source:${source}`,
      });
    },
    [changeAccount, setPreferredExtension]
  );

  useEffect(() => {
    connectToEvmNode();
  }, [connectToEvmNode]);

  // Optionally auto-reconnect to a previously selected account
  useEffect(() => {
    async function maybeReconnect() {
      if (!actingAccount && preferredExtension && preferredAccount) {
        // e.g. if user had subwallet previously
        const wallet = getWalletBySource(preferredExtension);
        if (!wallet) return;
        await wallet.enable();
        if (wallet.extension) {
          setInjector(wallet.extension);
        }
        const all = (await wallet.getAccounts()) as WalletAccountWithType[];
        setAccounts(all);
        // find the previously used address
        const mainAccount = all.find((acc) => acc.address === preferredAccount);
        if (mainAccount) changeAccount(mainAccount);
      }
    }
    maybeReconnect();
  }, [actingAccount, preferredAccount, preferredExtension, changeAccount]);

  return (
    <WalletContext.Provider
      value={{
        api,
        isReady,
        accounts,
        actingAccount,
        injector,
        error,
        isLogIn,
        isRegistered,
        disconnectWallet,
        setIsLogIn,
        changeAccount,
        handleSelectFirstWalletFromExtension,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

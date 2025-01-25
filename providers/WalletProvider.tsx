"use client";

import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createConnection, ApiPromise } from "@autonomys/auto-utils";
import { getWalletBySource } from "@subwallet/wallet-connect/dotsama/wallets";
import type { InjectedExtension } from "@polkadot/extension-inject/types";
import { WalletType } from "constants/wallet";
import { useSafeLocalStorage } from "hooks/useSafeLocalStorage";
import { formatAddress } from "utils/formatAddress";

import { sendGAEvent } from "@next/third-parties/google";
import type { WalletAccountWithType } from "types/wallet";

// ---------------------------------------------------------
// 1. Context Types
// ---------------------------------------------------------
export interface WalletContextValue {
  /** The single Polkadot.js-style API connected to wss://auto-evm-0.taurus.subspace.network/ws */
  api: ApiPromise | undefined;

  /** True once we've selected an account or completed setup */
  isReady: boolean;

  /** All fetched accounts from the Polkadot extension */
  accounts: WalletAccountWithType[] | null | undefined;

  /** Currently acting account */
  actingAccount: WalletAccountWithType | undefined;

  /** Polkadot extension injector for signing */
  injector: InjectedExtension | null;

  /** Any error encountered during setup */
  error: Error | null;

  /** Disconnect everything (clear accounts, etc.) */
  disconnectWallet: () => void;

  /** Change the active account from `accounts` */
  changeAccount: (account: WalletAccountWithType) => void;

  /** If you want to fetch from a certain extension automatically */
  handleSelectFirstWalletFromExtension: (source: string) => Promise<void>;
}

// ---------------------------------------------------------
// 2. Create Context
// ---------------------------------------------------------
export const WalletContext = createContext<WalletContextValue>(
  {} as WalletContextValue
);

// ---------------------------------------------------------
// 3. Provider Implementation
// ---------------------------------------------------------
type Props = {
  children?: ReactNode;
};

export const WalletProvider: FC<Props> = ({ children }) => {
  // State for the Polkadot.js-style API (connected to EVM domain)
  const [api, setApi] = useState<ApiPromise>();

  // Basic flags and references
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Accounts from extension
  const [accounts, setAccounts] = useState<
    WalletAccountWithType[] | null | undefined
  >(undefined);
  const [actingAccount, setActingAccount] = useState<
    WalletAccountWithType | undefined
  >(undefined);
  const [injector, setInjector] = useState<InjectedExtension | null>(null);

  // Local storage for remembering chosen account across page reloads
  const [preferredAccount, setPreferredAccount] = useSafeLocalStorage(
    "localAccount",
    null
  );
  const [preferredExtension, setPreferredExtension] = useSafeLocalStorage(
    "extensionSource",
    null
  );

  // -------------------------------------------------------
  // 3.1. Connect to wss://auto-evm-0.taurus.subspace.network/ws
  // -------------------------------------------------------
  const EVM_ENDPOINT = "wss://auto-evm-0.taurus.subspace.network/ws";

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

  // -------------------------------------------------------
  // 3.2. Changing the selected account
  // -------------------------------------------------------
  const changeAccount = useCallback(
    (account: WalletAccountWithType) => {
      try {
        // Distinguish Substrate vs. EVM if needed
        // but typically subwallet provides sr25519 accounts
        const type =
          account.type === WalletType.subspace ||
          (account as { type: string }).type === "sr25519"
            ? WalletType.subspace
            : WalletType.ethereum;

        setActingAccount({ ...account, type });

        // Format for UI if you want to display it in short form
        const formatted = formatAddress(account.address);
        console.log("Selected account:", formatted);

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

  // -------------------------------------------------------
  // 3.3. Disconnect
  // -------------------------------------------------------
  const disconnectWallet = useCallback(() => {
    setInjector(null);
    setAccounts([]);
    setActingAccount(undefined);
    setIsReady(false);
    setPreferredAccount(null);
    setPreferredExtension(null);
    sendGAEvent("event", "wallet_disconnect");
  }, [setPreferredAccount, setPreferredExtension]);

  // -------------------------------------------------------
  // 3.4. Connect to an extension & select first account
  // -------------------------------------------------------
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

  // -------------------------------------------------------
  // 4. On mount, connect to the EVM domain
  // -------------------------------------------------------
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

  // -------------------------------------------------------
  // 5. Return the provider
  // -------------------------------------------------------
  return (
    <WalletContext.Provider
      value={{
        api,
        isReady,
        accounts,
        actingAccount,
        injector,
        error,
        disconnectWallet,
        changeAccount,
        handleSelectFirstWalletFromExtension,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

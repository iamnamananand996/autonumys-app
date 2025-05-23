"use client";

import { shortString } from "@autonomys/auto-utils";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { WalletType } from "constants/wallet";
import useMediaQuery from "hooks/useMediaQuery";
import useWallet from "hooks/useWallet";
import { Fragment, useCallback, useMemo } from "react";
import { formatAddress } from "utils/formatAddress";
import { limitText } from "utils/string";

function AccountListDropdown() {
  const { actingAccount, accounts, changeAccount, disconnectWallet } =
    useWallet();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const walletList = useMemo(
    () =>
      accounts
        ? accounts.map((account, chainIdx) => (
            <Listbox.Option
              key={chainIdx}
              className={({ active }) =>
                `w-120 relative cursor-pointer select-none py-2 text-gray-900 dark:text-white ${
                  active && "bg-gray-100 dark:bg-blueDarkAccent"
                }`
              }
              value={account}
            >
              {({ selected }) => {
                const subAccount =
                  account.type === WalletType.subspace ||
                  (account as { type: string }).type === "sr25519"
                    ? formatAddress(account.address)
                    : account.address;
                const formattedAccount = subAccount && shortString(subAccount);
                return (
                  <div className="px-2">
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {account.name
                        ? limitText(account.name, 16)
                        : "Account " + chainIdx}
                    </span>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {formattedAccount}
                    </span>
                  </div>
                );
              }}
            </Listbox.Option>
          ))
        : null,
    [accounts]
  );

  const handleDisconnectWallet = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      disconnectWallet();
    },
    [disconnectWallet]
  );

  return (
    <Listbox value={actingAccount} onChange={changeAccount}>
      <div className="relative">
        <Listbox.Button
          className={`relative w-full cursor-default font-["Montserrat"] ${
            isDesktop
              ? "dark:bg-buttonLightTo rounded-full pr-10"
              : "rounded-l-full pr-6 dark:bg-primaryAccent"
          } bg-white py-2 pl-3 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:text-white sm:text-sm md:mt-3`}
        >
          <div className="flex items-center justify-center">
            <span className="ml-2 hidden w-5 truncate text-sm sm:block md:w-full ">
              {actingAccount ? shortString(actingAccount.address) : ""}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className={`size-5 text-gray-400 ui-open:rotate-180${
                  isDesktop ? "dark:text-primaryAccent" : "dark:text-white"
                }`}
                aria-hidden="true"
              />
            </span>
          </div>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute right-0 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-blueAccent dark:text-white sm:text-sm">
            {walletList}
            <button
              onClick={handleDisconnectWallet}
              className="relative cursor-pointer select-none py-2 pr-4 text-gray-900 dark:bg-blueDarkAccent dark:text-white"
            >
              <span className="block truncate px-2 font-normal">
                Disconnect wallet
              </span>
            </button>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export default AccountListDropdown;

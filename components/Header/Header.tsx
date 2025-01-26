import React from "react";
import { WalletButton } from "../WalletButton";
import AccountListDropdown from "../WalletButton/AccountListDropdown";
import useWallet from "@/hooks/useWallet";

export default function Header() {
  const { actingAccount } = useWallet();
  return (
    <div className="flex justify-end px-4">
      {!actingAccount ? (
        <WalletButton />
      ) : (
        <div className="flex gap-2">
          <div className="flex gap-2">
            <span className="border my-auto p-2 font-sans font-semibold">
              {" "}
              Welcome {actingAccount.name}!
            </span>
            <span className="my-auto border p-2 font-sans font-semibold">
              {" "}
              Reward : {actingAccount.user?.reward}
            </span>
          </div>
          <AccountListDropdown />
        </div>
      )}
    </div>
  );
}

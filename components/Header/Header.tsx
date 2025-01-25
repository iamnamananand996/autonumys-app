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
        <div className="flex">
          <AccountListDropdown />
        </div>
      )}
    </div>
  );
}

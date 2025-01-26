import React, { useEffect, useState } from "react";
import { WalletButton } from "../WalletButton";
import AccountListDropdown from "../WalletButton/AccountListDropdown";
import useWallet from "@/hooks/useWallet";
import { balance } from "@autonomys/auto-consensus";
import { getApiInstance } from "@/lib/autonomys";

export default function Header() {
  const { actingAccount } = useWallet();
  const [walletBalance, setWalletBalance] = useState(0);

  const getBalance = async () => {
    const api = await getApiInstance();
    const accountBalance = await balance(api, actingAccount?.address || "");
    setWalletBalance(Number(accountBalance.free));
  };

  useEffect(() => {
    getBalance();
  }, []);

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

            <span className="my-auto border p-2 font-sans font-semibold">
              {" "}
              Wallet Balance : {walletBalance}
            </span>
          </div>
          <AccountListDropdown />
        </div>
      )}
    </div>
  );
}

"use client";

import { WalletButton } from "@/components/WalletButton";
import AccountListDropdown from "@/components/WalletButton/AccountListDropdown";
import useWallet from "@/hooks/useWallet";
// import { account, block } from "@autonomys/auto-consensus";
// import { address, createConnection } from "@autonomys/auto-utils";

// async function getApiInstance() {
//   const endpoint = "wss://rpc.taurus.subspace.foundation/ws";
//   const api = await createConnection(endpoint);
//   return api;
// }

export default function Home() {
  const { actingAccount } = useWallet();
  // const connection = getApiInstance();

  // const accountData = await account(await connection, '0x12e4D8cD81Cf6599accDdE44abAbC699f58fB743')

  // const blockData = await block(await connection)
  // const addressData = await address('0x12e4D8cD81Cf6599accDdE44abAbC699f58fB743')

  // console.log({ accountData, blockData, addressData });

  return (
    <div>
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

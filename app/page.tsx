"use client";

import { FC } from "react";
import Header from "@/components/Header";
import FileUploader from "@/components/FileUpload";
import DataTable from "@/components/Table";
import useWallet from "@/hooks/useWallet";
import Registration from "@/components/Registration";

const Home: FC = () => {
  const { actingAccount, isLogIn } = useWallet();

  return (
    <div>
      <Header />
      {actingAccount && isLogIn ? (
        <>
          <FileUploader />
          <DataTable />
        </>
      ) : (
        actingAccount && <Registration />
      )}
    </div>
  );
};

export default Home;

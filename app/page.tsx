"use client";

import { FC } from "react";
import Header from "@/components/Header";
import FileUploader from "@/components/FileUpload";
import DataTable from "@/components/Table";
import useWallet from "@/hooks/useWallet";
import Registration from "@/components/Registration";
import Spinner from "@/components/Spinner";
import TaskTable from "@/components/Table/TaskTable";

const Home: FC = () => {
  const { actingAccount, isLogIn, isLoading } = useWallet();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" color="text-blue-500 my-auto" />
      </div>
    );
  }

  return (
    <div>
      <Header />
      {actingAccount && isLogIn ? (
        <>
          <FileUploader />
          <div className="flex gap-y-10">
            <TaskTable />
            <DataTable />
          </div>
        </>
      ) : (
        actingAccount && <Registration />
      )}
    </div>
  );
};

export default Home;

"use client";

import { FC } from "react";
import Header from "@/components/Header";
import FileUploader from "@/components/FileUpload";
import DataTable from "@/components/Table";
import useWallet from "@/hooks/useWallet";
import Registration from "@/components/Registration";
import Spinner from "@/components/Spinner";
import TaskTable from "@/components/Table/TaskTable";
import Hero from "@/components/Hero";
import LetsConnect from "@/components/LetsConnect";

const Home: FC = () => {
  const { actingAccount, isLogIn, isLoading } = useWallet();

  const renderComponent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" color="text-blue-500 my-auto" />
        </div>
      );
    }
    if (actingAccount && isLogIn) {
      return (
        <>
          <FileUploader />
          <div className="flex flex-col gap-10">
            <TaskTable />
            <DataTable />
          </div>
        </>
      );
    }
    if (actingAccount) {
      return <Registration />;
    }
    return (
      <>
        <Hero />
        <LetsConnect />
      </>
    );
  };

  return (
    <div className="mb-20">
      <Header />
      {renderComponent()}
    </div>
  );
};

export default Home;

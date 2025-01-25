"use client";

import { FC } from "react";
import Header from "@/components/Header";
import FileUploader from "@/components/FileUpload";
import DataTable from "@/components/Table";

const Home: FC = () => {
  return (
    <div>
      <Header />
      <FileUploader />
      <DataTable />
    </div>
  );
};

export default Home;

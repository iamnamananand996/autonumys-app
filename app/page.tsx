"use client";

import { FC, useEffect, useState } from "react";
import Header from "@/components/Header";
import FileUploader from "@/components/FileUpload";
import DataTable from "@/components/Table";
import { Task } from "@/components/Table/DataTable";

const Home: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tasks/list");
      const data = await response.json();
      console.log({ data });
      setTasks(data.tasks.rows);
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <Header />
      <FileUploader />
      <DataTable data={tasks} isLoading={loading} refresh={fetchTasks} />
    </div>
  );
};

export default Home;

"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";
import { RefreshCcw } from "lucide-react";
import Button from "../Button";
import Skeleton from "../Skeleton";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TaskStatusSelect from "./TaskStatusSelect";
import useWallet from "@/hooks/useWallet";

export interface Task {
  _id: string;
  taskName: string;
  taskDescription: string;
  fileName: string;
  cid: string;
  status: string;
  rewardPoints: number;
  createdAt: string;
}

export default function DataTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { actingAccount } = useWallet();
  console.log({ actingAccount });

  const fetchTasks = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/tasks/list?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      if (response.ok) {
        setTasks(
          data.tasks.map((task: Task) => ({
            _id: task._id,
            taskName: task.taskName,
            taskDescription: task.taskDescription,
            fileName: task.fileName,
            cid: task.cid,
            status: task.status,
            rewardPoints: task.rewardPoints,
            createdAt: new Date(task.createdAt).toLocaleString(),
          }))
        );
        setTotalPages(data.pagination.totalPages);
        setLoading(false);
      } else {
        throw new Error(data.error || "Failed to fetch tasks.");
      }
    } catch (error) {
      toast.error(error || "Failed to fetch tasks.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page whenever rows per page changes
  };

  return (
    <div className="flex justify-center">
      <div className="p-6 space-y-6 container border rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Here’s a list of your tasks</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              className="h-7"
              variant="outline"
              onClick={() => fetchTasks(currentPage, rowsPerPage)}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Task Name</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">File Name</TableHead>
              <TableHead className="font-semibold">CID</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Reward Points</TableHead>
              <TableHead className="font-semibold">Created At</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                  </TableRow>
                ))
              : tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell className="font-medium">
                      {task.taskName}
                    </TableCell>
                    <TableCell>{task.taskDescription}</TableCell>
                    <TableCell>{task.fileName}</TableCell>
                    <TableCell className="text-blue-500 underline cursor-pointer">
                      {task.cid}
                    </TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{task.rewardPoints}</TableCell>
                    <TableCell>{task.createdAt}</TableCell>
                    <TableCell>
                      <TaskStatusSelect
                        taskId={task._id}
                        userId={
                          actingAccount?.user ? actingAccount?.user._id : ""
                        }
                        initialStatus={task.status}
                      />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <label htmlFor="rowsPerPage" className="mr-2 text-sm">
              Rows per page:
            </label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border rounded px-2 py-1 text-sm"
            >
              {[5, 10, 15, 20].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                {"<<"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {"<"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {">"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                {">>"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

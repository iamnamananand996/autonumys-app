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
import DownloadButton from "./DownloadButton";
import { useEffect, useState } from "react";

export interface Owner {
  oauthProvide: string;
  oauthUserId: string;
  role: string;
}

export interface Task {
  headCid: string;
  mimeType: string;
  name: string;
  owners: Owner[];
  size: string;
  type: string;
}

export default function DataTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async (page: number) => {
    try {
      setLoading(true);
      const limit = 5;
      const offset = (page - 1) * limit;
      const response = await fetch(
        `/api/tasks/list?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();
      setTasks(data.rows);
      setTotalPages(Math.ceil(data.totalCount / limit));
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="p-6 space-y-6 container border rounded-lg">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">
              Here’s a list of your tasks for this month!
            </p>
          </div>
          <div>
            <Button
              size="sm"
              className="h-7"
              variant="outline"
              onClick={() => fetchTasks(currentPage)}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">CID</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Size</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-[600px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[50px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[30px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[30px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px]" />
                    </TableCell>
                  </TableRow>
                ))
              : tasks.map((task) => (
                  <TableRow key={task.headCid}>
                    <TableCell>
                      <div className="font-medium text-blue-500 underline cursor-pointer">
                        {task.headCid}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{task.name}</TableCell>
                    <TableCell>{task.size} bytes</TableCell>
                    <TableCell>{task.type}</TableCell>
                    <TableCell>
                      <DownloadButton
                        cid={task.headCid}
                        fileName={task.name}
                        fileType={task.mimeType}
                      />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        <div className="flex justify-end">
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

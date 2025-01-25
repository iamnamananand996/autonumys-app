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
import Badge from "../Badge";
import DownloadButton from "./DownloadButton";

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

export interface DataTableProps {
  data: Task[];
  isLoading: boolean;
  refresh: () => void;
}

export default function DataTable({
  data,
  isLoading,
  refresh,
}: DataTableProps) {
  return (
    <div className="flex justify-center">
      <div className="p-6 space-y-6 container border rounded-lg">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">
              Heres a list of your tasks for this month!
            </p>
          </div>
          <div>
            <Button
              size="sm"
              className="h-7"
              variant="outline"
              onClick={() => refresh()}
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
            {isLoading
              ? // Skeleton loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[300px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  </TableRow>
                ))
              : data.map((task) => (
                  <TableRow key={task.headCid}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-blue-500 underline cursor-pointer">
                          {task.headCid}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{task.name}</TableCell>
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
              Page 1 of 10
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                {"<<"}
              </Button>
              <Button variant="outline" size="icon">
                {"<"}
              </Button>
              <Button variant="outline" size="icon">
                {">"}
              </Button>
              <Button variant="outline" size="icon">
                {">>"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants: any = {
    "In Progress": "default",
    Backlog: "secondary",
    Todo: "outline",
    Done: "success",
    Canceled: "destructive",
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Badge variant={variants[status] as any}>{status}</Badge>;
}

function PriorityBadge({ priority }: { priority: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants: any = {
    Low: "outline",
    Medium: "secondary",
    High: "destructive",
  };
  return (
    <div className="flex items-center gap-2">
      {priority === "High" && "↑"}
      {priority === "Low" && "↓"}
      {priority === "Medium" && "→"}
      <Badge variant={variants[priority]}>{priority}</Badge>
    </div>
  );
}

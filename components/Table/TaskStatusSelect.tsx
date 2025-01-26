"use client";

import { useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Select";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react"; // Import a spinner icon

interface TaskStatusSelectProps {
  taskId: string;
  userId: string;
  initialStatus: string;
}

const statusOptions = [{ value: "Completed", label: "Completed" }];

export default function TaskStatusSelect({
  taskId,
  userId,
  initialStatus,
}: TaskStatusSelectProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false); // State to track loading

  const handleStatusChange = useCallback(
    async (newStatus: string) => {
      setLoading(true); // Set loading to true when API call starts
      try {
        await updateTaskStatus({ taskId, userId, status: newStatus });
        setStatus(newStatus);
      } catch (error) {
        console.error("Failed to update task status:", error);
      } finally {
        setLoading(false); // Set loading to false when API call finishes
      }
    },
    [taskId, userId]
  );

  return (
    <Select
      onValueChange={handleStatusChange}
      value={status}
      disabled={loading} // Disable the select when loading
    >
      <SelectTrigger className="w-[180px]">
        {loading ? (
          <div className="flex items-center">
            <Loader2 className="animate-spin mr-2" size={18} />
            <span>Updating...</span>
          </div>
        ) : (
          <SelectValue placeholder="Select status" />
        )}
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

async function updateTaskStatus({
  taskId,
  userId,
  status,
}: {
  taskId: string;
  userId: string;
  status: string;
}) {
  try {
    const response = await fetch("/api/tasks/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId, userId, status }),
    });

    const result = await response.json();
    if (response.ok) {
      toast.success("Task and user updated successfully");
      return result;
    } else {
      toast.error(`Failed to update task or user: ${result.error}`);
      throw new Error(result.error);
    }
  } catch (error) {
    toast.error(`Error updating task or user: ${error}`);
    throw error;
  }
}

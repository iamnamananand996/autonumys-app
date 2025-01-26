"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../Card";
import { AlertCircle } from "lucide-react";
import Input from "../Input";
import Button from "../Button";
import useWallet from "@/hooks/useWallet";
import toast from "react-hot-toast";
import Spinner from "../Spinner";

const Registration = () => {
  const { actingAccount, setIsLogIn } = useWallet();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = async (
    userId: string | undefined,
    agentName: string | undefined
  ) => {
    setIsLoading(true);
    if (!userId || !agentName) {
      toast.error("Please provide both User ID and Agent Name.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/agents/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, agentName }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Registration successful. Auto ID: ${data.user.autoId}`);
        setIsLogIn(true);
        setIsLoading(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Registration failed.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error registering Auto ID:", error);
      toast.error("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-32">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-xl text-red-500">Not Registered</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          You need to register to access this account
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Account ID</label>
          <Input value={actingAccount?.address} disabled className="bg-muted" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Account Name</label>
          <Input value={actingAccount?.name} disabled className="bg-muted" />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant="default"
          onClick={() =>
            handleRegister(actingAccount?.address, actingAccount?.name)
          }
        >
          {isLoading ? <Spinner size="md" /> : "Register Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Registration;

import { NextResponse } from "next/server";
import User from "@/models/User";
import Task from "@/models/Task";
import { connectToDatabase } from "@/lib/mongoose";
// import { activateWallet } from "@autonomys/auto-utils";
// import { transfer } from "@autonomys/auto-consensus";
// import { getApiInstance } from "@/lib/autonomys";

export async function POST(req: Request) {
  await connectToDatabase();

  const { taskId, userId, status, senderAddress } = await req.json();

  if (!taskId || !userId || !status) {
    return NextResponse.json(
      { error: "Task ID, User ID, and Status are required." },
      { status: 400 }
    );
  }

  try {
    // 1. Update the task status
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    task.status = status;
    await task.save();

    // 2. Find the user and update the reward points
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // const api = await getApiInstance();
    // const transferTx = await transfer(api, user.userId, task.rewardPoints);

    // // Sign and send the transaction
    // await transferTx.signAndSend(
    //   senderAddress,
    //   ({ status, txHash, events }) => {
    //     if (status.isInBlock) {
    //       console.log(`Transaction included at blockHash ${status.asInBlock}`);
    //       console.log(`Transaction hash: ${txHash}`);
    //     } else if (status.isFinalized) {
    //       console.log(
    //         `Transaction finalized at blockHash ${status.asFinalized}`
    //       );
    //     }
    //   }
    // );

    const rewardPoints = task.rewardPoints; // Reward points from the task object
    user.reward = (user.reward || 0) + rewardPoints; // Add reward points to the existing reward

    await user.save();

    return NextResponse.json({
      message: "Task status and user reward updated successfully.",
      task,
      user,
    });
  } catch (error) {
    console.error("Error updating task or user:", error);
    return NextResponse.json(
      { error: "Failed to update task or user." },
      { status: 500 }
    );
  }
}

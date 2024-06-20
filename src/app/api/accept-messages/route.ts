import { getServerSession, User } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import userModel from "@/models/User";
export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(AuthOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "You must be logged in to accept messages.",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    return Response.json(
      {
        success: true,
        message: "Messages accepted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "An error occurred while accepting messages.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(AuthOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "You must be logged in to accept messages.",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  try {
    const foundUser = await userModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Messages accepted successfully.",
        isAcceptingMessages: foundUser.isAcceptingMessage,
        // isVerified: foundUser.isVerified
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "An error occurred while accepting messages.",
      },
      { status: 500 }
    );
  }
}

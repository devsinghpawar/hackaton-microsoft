import { NextResponse } from "next/server";
import connect from "../../../../server/database";

export const GET = async () => {
  // send a simple message to test the db connection
  try {
    await connect();
    return new NextResponse ((JSON.stringify({ message: "Connected to MongoDB!" })), {
      status: 200,
    });
  }
  catch(error) {
    console.log(error);
  }
}
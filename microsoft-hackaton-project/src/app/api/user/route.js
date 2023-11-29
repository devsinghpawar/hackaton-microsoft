// next imports
import { NextResponse } from "next/server";

// db imports
import connect from "../../../../server/database";
import User from "../../../../server/models/user";

// get user with email and password
export const GET = async (request) => {
  const url = new URL(request.nextUrl);
  const email = url.searchParams.get("email");
  const password = url.searchParams.get("password");

  try {
    await connect();
    const user = await User.findOne({ email, password });

    if (user) {
      return new NextResponse(JSON.stringify(user), {
        status: 200,
      });
    } else {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);

    return new NextResponse(
      JSON.stringify({ error: "Error retrieving user" }),
      {
        status: 500,
      }
    );
  }
};

// post a new user to the db
export const POST = async (request) => {
  try {
    const { name, email, password, folders } = await request.json();

    await connect();
    const newUser = new User({
      name,
      email,
      password,
      folders,
    });

    await newUser.save();

    return new NextResponse(JSON.stringify(newUser), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
  }
};

// add a folder to a user's folders array
export const PUT = async (request) => {
  const url = new URL(request.nextUrl);
  const email = url.searchParams.get("email");
  const folderId = url.searchParams.get("folderId");

  try {
    await connect();
    const user = await User.findOne({ email });

    if (user) {
      user.folders.push(folderId);
      await user.save();

      return new NextResponse(JSON.stringify(user), {
        status: 200,
      });
    } else {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);

    return new NextResponse(
      JSON.stringify({ error: "Error retrieving user" }),
      {
        status: 500,
      }
    );
  }
};

// delete a user
export const DELETE = async (request) => {
  const url = new URL(request.nextUrl);
  const email = url.searchParams.get("email");

  try {
    await connect();
    const user = await User.findOne({ email });

    if (user) {
      await user.deleteOne({ email });

      return new NextResponse(JSON.stringify(user), {
        status: 200,
      });
    } else {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);

    return new NextResponse(
      JSON.stringify({ error: "Error retrieving user" }),
      {
        status: 500,
      }
    );
  }
};

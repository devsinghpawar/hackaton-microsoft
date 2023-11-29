// next imports
import { NextResponse } from "next/server";

// db imports
import connect from "../../../../server/database";
import User from "../../../../server/models/user";
import Folder from "../../../../server/models/folder";

// get folders by user id
export const GET = async (request) => {
  const url = new URL(request.nextUrl);
  const userId = url.searchParams.get("userId");

  try {
    await connect();
    const user = await User.findOne({ _id: userId });

    if (user) {
      // get all folders that belong to the user
      const folders = await Folder.find({ user: userId });
      return new NextResponse(JSON.stringify(folders), {
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
      JSON.stringify({ error: "Error retrieving the folder" }),
      {
        status: 500,
      }
    );
  }
};

// post a new folder to the db
export const POST = async (request) => {
  try {
    const { name, user, classes } = await request.json();

    await connect();
    const newFolder = new Folder({
      name,
      user,
      classes,
    });

    await newFolder.save();

    return new NextResponse(JSON.stringify(newFolder), {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return new NextResponse(
      JSON.stringify({ error: "Error posting the folder" }),
      {
        status: 500,
      }
    );
  }
};

// add a class to a folder's classes array
export const PUT = async (request) => {
  const url = new URL(request.nextUrl);
  const folderId = url.searchParams.get("folderId");
  const { classId } = await request.json();

  try {
    await connect();
    // find the folder by id
    const folder = await Folder.findOne({ _id: folderId });

    if (folder) {
      // add the classId to the folder's classes array
      folder.classes.push(classId);
      await folder.save();

      return new NextResponse(JSON.stringify(folder), {
        status: 200,
      });
    } else {
      return new NextResponse(JSON.stringify({ error: "Folder not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error adding classes" }), {
      status: 500,
    });
  }
};

// delete a folder by id
export const DELETE = async (request) => {
  const url = new URL(request.nextUrl);
  const folderId = url.searchParams.get("folderId");

  try {
    await connect();
    const folder = await Folder.findOne({ _id: folderId });
    if (folder) {
      await folder.deleteOne({ _id: folderId });

      return new NextResponse(JSON.stringify(folder), {
        status: 200,
      });
    }
  } catch (error) {
    console.error(error);

    return new NextResponse(
      JSON.stringify({ error: "Error deleting folder" }),
      {
        status: 500,
      }
    );
  }
};

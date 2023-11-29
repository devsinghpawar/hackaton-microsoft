// next imports
import { NextResponse } from "next/server";

// db imports
import connect from "../../../../server/database";
import User from "../../../../server/models/user";
import Folder from "../../../../server/models/folder";
import Class from "../../../../server/models/class";

// get classes by folder id
export const GET = async (request) => {
  const url = new URL(request.nextUrl);
  const folderId = url.searchParams.get("folderId");

  try {
    await connect();
    const folder = await Folder.findOne({ _id: folderId });

    if (folder) {
      // get all classes that belong to the folder
      const classes = await Class.find({ folder: folderId });
      return new NextResponse(JSON.stringify(classes), {
        status: 200,
      });
    } else {
      return new NextResponse(JSON.stringify({ error: "Folder not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);

    return new NextResponse(
      JSON.stringify({ error: "Error retrieving the class" }),
      {
        status: 500,
      }
    );
  }
};

// post a new class to the db
export const POST = async (request) => {
  try {
    const { name, folder, transcript } = await request.json();

    await connect();
    const newClass = new Class({
      name,
      folder,
      textTranscript: transcript,
    });

    await newClass.save();

    return new NextResponse(JSON.stringify(newClass), {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return new NextResponse(
      JSON.stringify({ error: "Error saving the class" }),
      {
        status: 500,
      }
    );
  }
};

// update a class text transcript in the db
export const PUT = async (request) => {
  try {
    const { id, transcript } = await request.json();

    await connect();
    const updatedClass = await Class.findOneAndUpdate(
      { _id: id },
      { textTranscript: transcript },
      { new: true }
    );

    return new NextResponse(JSON.stringify(updatedClass), {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return new NextResponse(
      JSON.stringify({ error: "Error updating the class" }),
      {
        status: 500,
      }
    );
  }
};

// delete a class from the db
export const DELETE = async (request) => {
  const url = new URL(request.nextUrl);
  const classId = url.searchParams.get("classId");

  try {
    await connect();
    const deletedClass = await Class.findOneAndDelete({ _id: classId });

    return new NextResponse(JSON.stringify(deletedClass), {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return new NextResponse(
      JSON.stringify({ error: "Error deleting the class" }),
      {
        status: 500,
      }
    );
  }
};

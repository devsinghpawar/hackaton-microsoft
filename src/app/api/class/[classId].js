import connect from "../../../../server/database";
import Class from "../../../../server/models/class";

// get class by id
export const GET = async (request) => {
    const url = new URL(request.nextUrl);
    const classId = url.searchParams.get("classId");


    try {
        await connect();
        const classObject  = await Class.findOne({ _id: classId });
console.log("from class/[classId].js ", classObject);
        if (classObject) {
            return new NextResponse(JSON.stringify(classObject), {
                status: 200,
            });
        } else {
            return new NextResponse(JSON.stringify({ error: "Class not found" }), {
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
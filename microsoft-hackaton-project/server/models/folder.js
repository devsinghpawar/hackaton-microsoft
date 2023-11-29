import { Schema, model, models } from "mongoose";

const folderSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  classes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
});

const Folder = models.Folder || model("Folder", folderSchema);
export default Folder;
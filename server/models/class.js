import { Schema, models, model } from "mongoose";

const classSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
  },
  folder: {
    type: Schema.Types.ObjectId,
    ref: "Folder",
  },
  textTranscript: {
    type: String,
    required: true,
  },
});

const Class = models.Class || model("Class", classSchema);
export default Class;

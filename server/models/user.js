import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  folders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Folder",
    },
  ],
});

const User = models.User || model("User", userSchema);
export default User;

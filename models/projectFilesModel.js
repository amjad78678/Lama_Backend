import mongoose from "mongoose";
const Schema = mongoose.Schema;

const projectFileSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
  },
  { timestamps: true }
);

const ProjectFile = mongoose.model("ProjectFile", projectFileSchema);

export default ProjectFile;

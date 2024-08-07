import ProjectFile from "../models/projectFilesModel.js";

const createProjectFile = async (req, res) => {
  try {
    const projectFile = new ProjectFile({
      fileName: req.body.fileName,
      description: req.body.description,
      projectId: req.body.projectId,
    });

    const fileData = await projectFile.save();

    if (fileData) {
      res.status(200).json({ success: true,message: "File created" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { createProjectFile };

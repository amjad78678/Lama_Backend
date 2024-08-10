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
      res.status(200).json({ success: true, message: "File created" });
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
const getProjectFilesData = async (req, res) => {
  try {
    const { id } = req.params;
    const fileProjectDatas = await ProjectFile.find({ projectId: id });

    if (fileProjectDatas) {
      res.status(200).json({ success: true, files: fileProjectDatas });
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
const getFileData = async (req, res) => {
  try {
    const { fileId } = req.params;
    const fileData = await ProjectFile.findOne({
      _id: fileId,
    });

    if (fileData) {
      res.status(200).json({ success: true, file: fileData });
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
const editFileData = async (req, res) => {
  try {
    const { fileId, description } = req.body;

    console.log("i am in edit file body", req.body);
    const fileData = await ProjectFile.updateOne(
      {
        _id: fileId,
      },
      { $set: { description: description } }
    );

    if (fileData) {
      res
        .status(200)
        .json({ success: true, file: fileData, message: "File edited" });
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
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.body;
    console.log('fileid',fileId)
    const data = await ProjectFile.deleteOne({ _id: fileId });
    console.log("i am in delete file", data);
    if (!data.acknowledged) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }
    res.status(200).json({ success: true, message: "File deleted" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export {
  createProjectFile,
  getProjectFilesData,
  getFileData,
  editFileData,
  deleteFile,
};

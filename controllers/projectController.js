import Project from "../models/projectModel.js";

const createProject = async (req, res) => {
  try {
    const { projectName } = req.body;

    const newProject = new Project({
      projectName,
      userId: req.userId,
    });
    const projectData = await newProject.save();
    if (projectData) {
      res.status(200).json({ success: true, message: "Project created" });
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
const getProjects = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("iam userId in projects", userId);
    const projects = await Project.find({ userId: userId });
    console.log("iam projects", projects);
    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getProjectData = async (req, res) => {
  try {
    console.log("iam userId in projects data", req.params.id);
    const project = await Project.findOne({ _id: req.params.id });
    console.log("iam projects", project);
    res.status(200).json({ success: true, project });
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

  createProject,
  getProjects,
  getProjectData,
};

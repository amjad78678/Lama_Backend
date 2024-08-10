/* eslint-disable no-undef */
import Project from "../models/projectModel.js";
import Widget from "../models/widgetModel.js";
import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
const addWidgetConfigurations = async (req, res) => {
  try {
    const { projectId, ...rest } = req.body;
    const s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_KEY,
      },
      region: process.env.BUCKET_REGION,
    });

    const uploadFile = async (file) => {
      const fileStream = fs.createReadStream(file.path);
      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: file.filename,
        Body: fileStream,
      };
      const result = await s3.send(new PutObjectCommand(uploadParams));
      fs.unlinkSync(file.path);
      return result;
    };

    if (req.file) {
      const result = await uploadFile(req.file);
      if (result) {
        await Widget.updateOne(
          { projectId: projectId },
          { $set: { ...rest, botIcon: req.file.filename } },
          { upsert: true }
        );
      }
    } else {
      await Widget.updateOne(
        { projectId: projectId },
        { $set: rest },
        { upsert: true }
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Widget configurations added" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getWidgetData = async (req, res) => {
  try {
    const s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_KEY,
      },
      region: process.env.BUCKET_REGION,
    });
    let widgetData = await Widget.findOne({ projectId: req.params.id });

    if (widgetData) {
      if (widgetData.botIcon) {
        const getObjectParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: widgetData.botIcon,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        console.log("iam widgetData", url);
        res
          .status(200)
          .json({ success: true, widget: widgetData, iconUrl: url });
      } else {
        res.status(200).json({ success: true, widget: widgetData });
      }
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

export {
  createProject,
  getProjects,
  getProjectData,
  addWidgetConfigurations,
  getWidgetData,
};

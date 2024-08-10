import mongoose from "mongoose";
const Schema = mongoose.Schema;

const widgetSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  chatbotName: { type: String, required: true },
  welcomeMessage: { type: String, required: true },
  inputPlaceholder: { type: String, required: true },
  primaryColor: { type: String, required: true },
  fontColor: { type: String, required: true },
  fontSize: { type: Number, required: true },
  chatHeight: { type: String, required: true },
  showSources: { type: Boolean, required: true },
  chatIconSize: {
    type: String,
    required: true,
    enum: ["Small (48x 48px)", "Medium", "Large"],
  },
  positionOnScreen: {
    type: String,
    required: true,
    enum: ["Bottom Right", "Bottom Left", "Top Right", "Top Left"],
  },
  distanceFromBottom: { type: Number, required: true },
  horizontalDistance: { type: Number, required: true },
  botIcon: { type: String },
});

const Widget = mongoose.model("Widget", widgetSchema);

export default Widget;

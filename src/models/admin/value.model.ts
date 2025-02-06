import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Value document
interface IValue extends Document {
  attribute_id: mongoose.Types.ObjectId;
  name: string;
}

// Define the Value schema
const valueSchema: Schema = new mongoose.Schema(
  {
    attribute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attribute",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Define the Value model
const Value: Model<IValue> = mongoose.model<IValue>("Value", valueSchema);

export default Value;

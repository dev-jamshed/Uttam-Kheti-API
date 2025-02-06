import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Attribute document
interface IAttribute extends Document {
  productType: mongoose.Types.ObjectId;
  name: string;
  type: string;
  values: string[];
}

// Define the Attribute schema
const attributeSchema: Schema = new mongoose.Schema(
  {
    productType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    // type: {
    //   type: String,
    //   required: true,
    // },
    // values: {
    //   type: [String],
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

// Define the Attribute model
const Attribute: Model<IAttribute> = mongoose.model<IAttribute>("Attribute", attributeSchema);

export default Attribute;

import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the ProductType document
interface IProductType extends Document {
  name: string;
}

// Define the ProductType schema
const productTypeSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Define the ProductType model
const ProductType: Model<IProductType> = mongoose.model<IProductType>("ProductType", productTypeSchema);

export default ProductType;

import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the ProductAttributeValue document
interface IProductAttributeValue extends Document {
  product_id: mongoose.Types.ObjectId;
  value_id: mongoose.Types.ObjectId;
}

// Define the ProductAttributeValue schema
const productAttributeValueSchema: Schema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    value_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Value",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Define the ProductAttributeValue model
const ProductAttributeValue: Model<IProductAttributeValue> = mongoose.model<IProductAttributeValue>(
  "ProductAttributeValue",
  productAttributeValueSchema
);

export default ProductAttributeValue;

import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the ProductImage document
interface IProductImage extends Document {
  product: mongoose.Types.ObjectId;
  url: string;
}

// Define the ProductImage schema
const productImageSchema: Schema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Define the ProductImage model
const ProductImage: Model<IProductImage> = mongoose.model<IProductImage>('ProductImage', productImageSchema);

export default ProductImage;

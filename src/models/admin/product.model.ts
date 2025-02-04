import mongoose, { Schema, Document, Model } from "mongoose";
import urlSlug from "url-slug";
import { v4 as uuidv4 } from 'uuid';

// Define the interface for the Product document
interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  category: mongoose.Types.ObjectId;
  brand?: mongoose.Types.ObjectId;
  attributes?: {
    weight: number;
    price: number;
  }[];
  mainImage: string;
}

// Define the Product schema
const productSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  },
  attributes: [
    {
      weight: {
        type: Number,
      },
      price: {
        type: Number,
      },
    },
  ],
  mainImage: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to generate slug
productSchema.pre<IProduct>('save', async function (next) {
  if (this.isModified('name') || !this.slug) {
    let slug = urlSlug.convert(this.name);
    const existingProduct = await mongoose.models.Product.findOne({ slug });
    if (existingProduct) {
      slug = `${slug}-${uuidv4()}`;
    }
    this.slug = slug;
  }
  next();
});

// Virtual field for product images
productSchema.virtual('productImages', {
  ref: 'ProductImage',
  localField: '_id',
  foreignField: 'product',
});

// Ensure virtual fields are serialized
productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

// Define the Product model
const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

export default Product;

import mongoose, { Schema, Document, Model } from "mongoose";
import urlSlug from "url-slug";
import { v4 as uuidv4 } from "uuid";

// Define the interface for the Product document
interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  category: mongoose.Types.ObjectId;
  brand?: mongoose.Types.ObjectId;
  attributes?: {
    attribute: mongoose.Types.ObjectId;
    value: string;
    price: number;
  }[];
  mainImage: string;
  image?: string; // Add the image property
  attributeValues?: any[]; // Add the attributeValues property
  track_qty: boolean;
  qty?: number; // Add the qty property
}

// Define the Product schema
const productSchema: Schema = new mongoose.Schema(
  {
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
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    mainImage: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    crossPrice: {
      type: Number,
      required: false,
    },
    track_qty: {
      type: Boolean,
      required: true,
    },
    qty: {
      type: Number,
      required: function (this: IProduct) {
        return this.track_qty;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate slug
productSchema.pre<IProduct>("save", async function (next) {
  if (this.isModified("name") || !this.slug) {
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
productSchema.virtual("productImages", {
  ref: "ProductImage",
  localField: "_id",
  foreignField: "product",
});

// Virtual field for product attribute values
productSchema.virtual("attributeValues", {
  ref: "ProductAttributeValue",
  localField: "_id",
  foreignField: "product_id",
});

// Ensure virtual fields are serialized
productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

// Define the Product model
const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);

export default Product;

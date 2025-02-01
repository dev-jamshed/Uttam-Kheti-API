import mongoose, { Schema, Document, Model } from "mongoose";
import urlSlug from "url-slug";

// Define the interface for the Brand document
interface IBrand extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

// Define the Brand schema
const brandSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate slug
brandSchema.pre<IBrand>("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = urlSlug.convert(this.name);
  }
  next();
});

// Define the Brand model
const Brand: Model<IBrand> = mongoose.model<IBrand>("Brand", brandSchema);

export default Brand;

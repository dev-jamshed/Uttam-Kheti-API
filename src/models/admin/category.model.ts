import mongoose, { Schema, Document, Model } from "mongoose";
import urlSlug from "url-slug";

// Define the interface for the Category document
interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parent?: mongoose.Types.ObjectId;
  image?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  is_featured?: boolean;
  feature_in_banner?: boolean;
}

// Define the Category schema
const categorySchema: Schema = new mongoose.Schema({
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
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  image: {
    type: String,
  },
  meta_title: {
    type: String,
  },
  meta_description: {
    type: String,
  },
  meta_keywords: {
    type: [String],
  },
  is_featured: {
    type: Boolean,
    default: false,
  },
  feature_in_banner: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to generate slug
categorySchema.pre<ICategory>('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = urlSlug.convert(this.name);
  }
  next();
});

// Virtual field for child categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

// Ensure virtual fields are serialized
categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });

// Define the Category model
const Category: Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
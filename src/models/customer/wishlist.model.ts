import mongoose, { Schema, Document, Model } from "mongoose";

interface IWishlist extends Document {
  customer_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
}

const wishlistSchema: Schema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;

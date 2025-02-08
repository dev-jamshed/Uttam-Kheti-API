import bcrypt from "bcrypt";
import mongoose, { Schema, Document, Model } from "mongoose";
import jwt from "jsonwebtoken";
import { SALTROUNDS, JWT_SECRET, JWT_EXPIRES_IN } from "../../config/env.config.js";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

interface ICustomer extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  generateAuthToken(): string;
}

const CustomerSchema: Schema<ICustomer> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

CustomerSchema.pre<ICustomer>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(SALTROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

CustomerSchema.methods.generateAuthToken = function (): string {
  const token = jwt.sign({ _id: this._id, email: this.email }, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRES_IN,
  });
  return token;
};
export type { ICustomer };
const Customer: Model<ICustomer> = mongoose.model<ICustomer>("Customer", CustomerSchema);

export default Customer;

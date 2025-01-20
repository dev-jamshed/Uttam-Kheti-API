import { model, Schema, Document } from "mongoose";

export interface IOtpVerification extends Document {
  userId: Schema.Types.ObjectId;
  userType: "customer" | "rider" | "admin";
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const otpSchema = new Schema<IOtpVerification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "userType",
    },
    userType: {
      type: String,
      required: true,
      enum: ["customer", "rider", "admin"],
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    timestamps: true,
    collection: 'otpVerifications' 
  }
);

export const OtpVerification = model<IOtpVerification>("OtpVerification", otpSchema);
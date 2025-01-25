import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtpVerification extends Document {
  userId: Schema.Types.ObjectId;
  userType: "customer" | "rider" | "admin";
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

interface OtpVerificationModel extends Model<IOtpVerification> {
  createOTP(userId: Schema.Types.ObjectId, userType: string, otp: string, expiryMinutes: number): Promise<IOtpVerification>;
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
    collection: "otpVerifications",
  }
);

// Static method to create OTP
otpSchema.statics.createOTP = async function(userId: Schema.Types.ObjectId, userType: string, otp: string, expiryMinutes: number) {
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  return this.create({
    userId,
    userType,
    otp,
    expiresAt
  });
};

export const OtpVerification: OtpVerificationModel = mongoose.model<IOtpVerification, OtpVerificationModel>("OtpVerification", otpSchema);
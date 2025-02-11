import { Schema, model, Document } from 'mongoose';

interface IManualPaymentGateway extends Document {
  gatewayName: string;
  paymentInstruction: string;
  status: boolean; // true for active, false for inactive
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ManualPaymentGatewaySchema = new Schema<IManualPaymentGateway>({
  gatewayName: {
    type: String,
    required: true,
  },
  paymentInstruction: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

export default model<IManualPaymentGateway>('ManualPaymentGateway', ManualPaymentGatewaySchema);

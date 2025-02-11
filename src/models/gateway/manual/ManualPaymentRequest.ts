import { Schema, model, Document } from 'mongoose';

interface IManualPaymentRequest extends Document {
  trxId: string;
  gatewayId: Schema.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ManualPaymentRequestSchema = new Schema<IManualPaymentRequest>({
  trxId: {
    type: String,
    required: true,
  },
  gatewayId: {
    type: Schema.Types.ObjectId,
    ref: 'ManualPaymentGateway',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

export default model<IManualPaymentRequest>('ManualPaymentRequest', ManualPaymentRequestSchema);

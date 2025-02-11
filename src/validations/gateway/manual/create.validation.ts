import { z } from 'zod';

export const createManualPaymentGatewaySchema = z.object({
  gatewayName: z.string().nonempty("Gateway name is required"),
  paymentInstruction: z.string().nonempty("Payment instruction is required"),
  status: z.boolean().optional(),
});
import { z } from 'zod';

export const updateManualPaymentGatewaySchema = z.object({
  gatewayName: z.string().nonempty("Gateway name is required").optional(),
  paymentInstruction: z.string().nonempty("Payment instruction is required").optional(),
  status: z.boolean().optional(),
});
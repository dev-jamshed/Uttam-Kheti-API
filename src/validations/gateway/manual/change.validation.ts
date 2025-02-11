import { z } from 'zod';

export const changePaymentStatusSchema = z.object({
  trxId: z.string().nonempty("Transaction ID is required"),
  gatewayId: z.string().nonempty("Gateway ID is required"),
  status: z.enum(['pending', 'approved', 'rejected']),
});

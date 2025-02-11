import { Router } from 'express';
import { createManualPaymentGateway, getManualPaymentGateways, getManualPaymentGatewayById, changePaymentStatus, updateManualPaymentGateway ,deleteManualPaymentGateway} from '../../../../controllers/gateway/manual/manualPaymentController.js';
import validate from "../../../../middlewares/validation/validation.middleware.js";
import { createManualPaymentGatewaySchema } from '../../../../validations/gateway/manual/create.validation.js';
import { updateManualPaymentGatewaySchema } from '../../../../validations/gateway/manual/update.validation.js';
import { changePaymentStatusSchema } from '../../../../validations/gateway/manual/change.validation.js';
import multerMiddleware from '../../../../middlewares/upload/multer.middleware.js';
const router = Router();

router.post('/manual',multerMiddleware.single("image"), validate(createManualPaymentGatewaySchema), createManualPaymentGateway);

router.put('/manual/:id',multerMiddleware.single("image"), validate(updateManualPaymentGatewaySchema),updateManualPaymentGateway );

router.get('/manual', getManualPaymentGateways);
router.get('/manual/:id', getManualPaymentGatewayById);
router.post('/change-payment-status', validate(changePaymentStatusSchema), changePaymentStatus);
router.delete('/manual/:id', deleteManualPaymentGateway);
export default router;

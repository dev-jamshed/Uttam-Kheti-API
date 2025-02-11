import { Request, Response } from 'express';
import ManualPaymentGateway from '../../../models/gateway/manual/ManualPaymentGateway.js';
import ManualPaymentRequest from '../../../models/gateway/manual/ManualPaymentRequest.js';
import sendResponse from '../../../utils/global/responseHandler.util.js';
import { STATUS_CODES } from '../../../constants/global/statusCodes.constants.js';
import { CREATE_SUCCESS, GET_SUCCESS, UPDATE_SUCCESS, DELETE_SUCCESS, NOT_FOUND } from '../../../constants/global/message.constants.js';
import asyncHandler from '../../../utils/global/asyncHandler.util.js';
import uploadFileToS3 from '../../../utils/global/s3Upload.util.js';
import deleteFileFromS3 from '../../../utils/global/s3Delete.util.js';


// Create a new manual payment gateway
export const createManualPaymentGateway = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { gatewayName, paymentInstruction, status } = req.body;
    let imagePath;
    if (req.file) {
        imagePath = await uploadFileToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
    }
    const newGateway = new ManualPaymentGateway({ gatewayName, paymentInstruction, status, image: imagePath });
    await newGateway.save();
    sendResponse(res, STATUS_CODES.CREATED, CREATE_SUCCESS("PaymentGateway"), newGateway);
});

// Get all manual payment gateways
export const getManualPaymentGateways = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const gateways = await ManualPaymentGateway.find();
    sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("PaymentGateways"), gateways);
});

// Get a single manual payment gateway by ID
export const getManualPaymentGatewayById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const gateway = await ManualPaymentGateway.findById(id);
    if (!gateway) {
        return sendResponse(res, STATUS_CODES.NOT_FOUND, NOT_FOUND("PaymentGateway"));
    }
    sendResponse(res, STATUS_CODES.OK, GET_SUCCESS("PaymentGateway"), gateway);
});

// Update a manual payment gateway
export const updateManualPaymentGateway = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const gateway = await ManualPaymentGateway.findById(id);
    if (!gateway) {
        return sendResponse(res, STATUS_CODES.NOT_FOUND, NOT_FOUND("PaymentGateway"));
    }

    let imagePath;
    if (req.file) {
        imagePath = await uploadFileToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
        if (gateway.image) {
            await deleteFileFromS3(gateway.image);
        }
    }

    const updatedGateway = await ManualPaymentGateway.findByIdAndUpdate(id, { ...req.body, image: imagePath }, { new: true });
    if (!updatedGateway) {
        return sendResponse(res, STATUS_CODES.NOT_FOUND, NOT_FOUND("PaymentGateway"));
    }
    sendResponse(res, STATUS_CODES.OK, UPDATE_SUCCESS("PaymentGateway"), updatedGateway);
});

// Delete a manual payment gateway
export const deleteManualPaymentGateway = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const deletedGateway = await ManualPaymentGateway.findByIdAndDelete(id);
    if (!deletedGateway) {
        return sendResponse(res, STATUS_CODES.NOT_FOUND, NOT_FOUND("PaymentGateway"));
    }
    if (deletedGateway.image) {
        await deleteFileFromS3(deletedGateway.image);
    }
    sendResponse(res, STATUS_CODES.OK, DELETE_SUCCESS("PaymentGateway"));
});

export const changePaymentStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { trxId, gatewayId, status } = req.body;
    const gateway = await ManualPaymentGateway.findById(gatewayId);
    if (!gateway) {
        return sendResponse(res, STATUS_CODES.NOT_FOUND, NOT_FOUND("PaymentGateway"));
    }
    const payment = await ManualPaymentRequest.findOneAndUpdate(
        { trxId, gatewayId },
        { status },
        { new: true }
    );
    if (!payment) {
        return sendResponse(res, STATUS_CODES.NOT_FOUND, NOT_FOUND("PaymentGateway"));
    }
    sendResponse(res, STATUS_CODES.OK, UPDATE_SUCCESS("PaymentGateway"), payment);
});
    
import { Request, Response } from 'express';
import Admin from '../../../models/admin/admin.model.js';
import asyncHandler from '../../../utils/global/asyncHandler.util.js';
import ApiError from '../../../utils/global/ApiError.util.js';
import { STATUS_CODES } from '../../../constants/global/statusCodes.constants.js';
import sendResponse from '../../../utils/global/responseHandler.util.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../config/env.config.js';
import { PASSWORD_CHANGED_SUCCESSFULLY, TOKEN_INVALID, USER_NOT_FOUND } from '../../../constants/global/message.constants.js';

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { tempToken, newPassword } = req.body;

    // Verify the temporary token
    let decoded;
    try {
        decoded = jwt.verify(tempToken, JWT_SECRET as string) as { email: string };
    } catch (error) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, TOKEN_INVALID);
    }

    // Find admin user
    const user = await Admin.findOne({ email: decoded.email });
    if (!user) {
        throw new ApiError(STATUS_CODES.NOT_FOUND, USER_NOT_FOUND);
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    sendResponse(
        res,
        STATUS_CODES.OK,
        PASSWORD_CHANGED_SUCCESSFULLY
    );
});

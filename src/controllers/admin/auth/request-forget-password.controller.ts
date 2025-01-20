// import { Request, Response } from 'express';
// import Admin from '../../../models/admin/admin.model.js';
// import asyncHandler from '../../../utils/global/asyncHandler.util.js';
// import ApiError from '../../../utils/global/ApiError.util.js';
// import { STATUS_CODES } from '../../../constants/global/statusCodes.constants.js';
// import { NOT_FOUND_ERROR, OTP_SENT_SUCCESS, OTP_INVALID_ERROR } from '../../../constants/global/message.constants.js';
// import { OTP_EXPIRES_IN } from '../../../config/env.config.js';
// import { OtpVerification } from '../../../models/otp.model.js';
// import sendResponse from '../../../utils/global/responseHandler.util.js';
// import { sendEmail } from '../../../utils/global/emailService.util.js';

// // Request new OTP
// export const requestOtp = asyncHandler(async (req: Request, res: Response) => {
//     const { email } = req.body;

//     // Validate email presence
//     if (!email) {
//         throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email is required');
//     }

//     // Find admin user
//     const user = await Admin.findOne({ email });
//     if (!user) {
//         throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND_ERROR);
//     }

//     // Delete any existing OTP for this user
//     await OtpVerification.deleteMany({
//         userId: user._id,
//         userType: 'admin'
//     });

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiryMinutes = parseInt(OTP_EXPIRES_IN || '5', 10);

//     // Create new OTP record
//     const otpVerification = await OtpVerification.createOTP(
//         user._id,
//         'admin',
//         otp,
//         otpExpiryMinutes
//     );

//     // Prepare email content
//     const emailContent = {
//         to: email,
//         subject: 'Your OTP Code',
//         html: `
//             <h1>OTP Verification</h1>
//             <p>Your OTP code is: <strong>${otp}</strong></p>
//             <p>This code will expire in ${otpExpiryMinutes} minutes.</p>
//             <p>If you didn't request this code, please ignore this email.</p>
//         `
//     };

//     // Send OTP via email
//     try {
//         await sendEmail(emailContent);
//     } catch (error) {
//         // Delete OTP record if email fails
//         await otpVerification.delete();
//         throw new ApiError(
//             STATUS_CODES.INTERNAL_SERVER_ERROR,
//             'Failed to send OTP email'
//         );
//     }

//     // In development, send OTP in response
//     const otpResponse = process.env.NODE_ENV === 'development' ? { otp } : {};

//     sendResponse(
//         res,
//         STATUS_CODES.OK,
//         otpResponse,
//         OTP_SENT_SUCCESS
//     );
// });

// // Verify OTP
// export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
//     const { email, otp } = req.body;

//     // Validate required fields
//     if (!email || !otp) {
//         throw new ApiError(
//             STATUS_CODES.BAD_REQUEST,
//             'Email and OTP are required'
//         );
//     }

//     // Find admin user
//     const user = await Admin.findOne({ email });
//     if (!user) {
//         throw new ApiError(STATUS_CODES.NOT_FOUND, NOT_FOUND_ERROR);
//     }

//     // Find and validate OTP
//     const otpRecord = await OtpVerification.findOne({
//         userId: user._id,
//         userType: 'admin',
//         otp,
//         expiresAt: { $gt: new Date() }
//     });

//     if (!otpRecord) {
//         throw new ApiError(
//             STATUS_CODES.BAD_REQUEST,
//             OTP_INVALID_ERROR
//         );
//     }

//     // Delete the used OTP
//     await otpRecord.delete();

//     // Generate authentication token if needed
//     const token = user.generateAuthToken?.() || '';

//     sendResponse(
//         res,
//         STATUS_CODES.OK,
//         { token },
//         'OTP verified successfully'
//     );
// });

// // Resend OTP
// export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
//     const { email } = req.body;

//     // Check for rate limiting
//     const lastOtp = await OtpVerification.findOne({
//         userType: 'admin',
//         'userId.email': email
//     }).sort({ createdAt: -1 });

//     if (lastOtp) {
//         const timeSinceLastOtp = Date.now() - lastOtp.createdAt.getTime();
//         const MIN_RESEND_TIME = 60 * 1000; // 1 minute

//         if (timeSinceLastOtp < MIN_RESEND_TIME) {
//             throw new ApiError(
//                 STATUS_CODES.TOO_MANY_REQUESTS,
//                 `Please wait ${Math.ceil((MIN_RESEND_TIME - timeSinceLastOtp) / 1000)} seconds before requesting a new OTP`
//             );
//         }
//     }

//     // Reuse requestOtp logic
//     return requestOtp(req, res);
// });
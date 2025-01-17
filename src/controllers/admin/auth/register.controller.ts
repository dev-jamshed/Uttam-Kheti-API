import Admin from "../../../models/admin/admin.model.js";
import asyncHandler from "../../../utils/global/asyncHandler.util.js";
import ApiError from "../../../utils/global/ApiError.util.js";
import { STATUS_CODES } from "../../../constants/global/statusCodes.js";
import sendResponse from "../../../utils/global/responseHandler.util.js";

const registerController = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const userExist = await Admin.findOne({ email });
  if (userExist) {
    throw new ApiError(
      STATUS_CODES.CONFLICT,
      "A user with this email already exists"
    );
  }

  const user = await Admin.create({
    name,
    email,
    phone,
    password,
  });

  if (!user) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      "Something went wrong while User Registration"
    );
  }

  const { password: _, ...userWithoutPassword } = user.toObject();

  sendResponse(
    res,
    STATUS_CODES.CREATED,
    userWithoutPassword,
    "User Registered Successfully"
  );
});

export default registerController;
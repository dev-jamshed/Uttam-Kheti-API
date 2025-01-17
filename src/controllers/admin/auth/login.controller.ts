import bcrypt from "bcrypt";
import Admin from "../../../models/admin/admin.model.js";
import asyncHandler from "../../../utils/global/asyncHandler.util.js";
import ApiError from "../../../utils/global/ApiError.util.js";
import { STATUS_CODES } from "../../../constants/global/statusCodes.js";
import sendResponse from "../../../utils/global/responseHandler.util.js";
import { INVALID_CREDENTIALS } from "../../../constants/global/message.js";

const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await Admin.findOne({ email }).select("_id name email");
    if(!user){
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, INVALID_CREDENTIALS);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new ApiError(STATUS_CODES.UNAUTHORIZED,INVALID_CREDENTIALS);
    }
    

});

export default loginController;
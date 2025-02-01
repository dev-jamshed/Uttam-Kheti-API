// Server and Connection Messages
export const INTERNAL_SERVER_ERROR = "Internal Server Error";
export const NOT_FOUND_ERROR = "Resource Not Found";
export const UNAUTHORIZED_ERROR = "Unauthorized";
export const FORBIDDEN_ERROR = "Forbidden Access";
export const BAD_REQUEST_ERROR = "Bad Request";
export const CONNECTION_ESTABLISHED = "Connection established";
export const CONNECTION_ERROR = "Error while connecting";

// Authentication Messages
export const LOGIN_SUCCESS = "Logged in successfully";
export const LOGOUT_SUCCESS = "Logged out successfully";
export const PRODUCTION = "production";
export const INVALID_CREDENTIALS = "Invalid email or password";

// CRUD Operation Messages
export const CREATE_SUCCESS = (entity: string) => `${entity} created successfully`;
export const UPDATE_SUCCESS = (entity: string) => `${entity} updated successfully`;
export const DELETE_SUCCESS = (entity: string) => `${entity} deleted successfully`;
export const GET_SUCCESS = (entity: string) => `${entity} retrieved successfully`;
export const NOT_FOUND = (entity: string) => `${entity} not found`;
export const ALREADY_EXISTS = (entity: string) => `${entity} already exists`;

// OTP Related Messages
export const OTP_SENT_SUCCESS = "OTP has been sent to your email";
export const OTP_VERIFIED_SUCCESS = "OTP verified successfully";
export const OTP_EXPIRED_ERROR = "OTP has expired";
export const OTP_INVALID_ERROR = "Invalid OTP";
export const OTP_REQUIRED_ERROR = "OTP is required";
export const OTP_ALREADY_SENT = "OTP already sent. Please wait before requesting a new one";
export const OTP_MAX_ATTEMPTS_ERROR = "Maximum OTP verification attempts reached";
export const OTP_EMAIL_SEND_ERROR = "Failed to send OTP email";

// Validation Messages
export const VALIDATION_ERROR = "Validation Error";
export const EMAIL_REQUIRED = "Email is required";
export const INVALID_EMAIL_FORMAT = "Invalid email format";
export const INVALID_EMAIL = "Invalid email";
export const PASSWORD_REQUIRED = "Password is required";
export const PASSWORD_LENGTH_ERROR = "Password must be at least 6 characters";
export const CONFIRM_PASSWORD_ERROR = "Passwords do not match";

// User Related Messages
export const USER_NOT_FOUND = "No account found with this email address.";
export const USER_ALREADY_EXISTS = "User already exists";
export const USER_CREATED_SUCCESS = "User created successfully";
export const USER_UPDATED_SUCCESS = "User updated successfully";
export const USER_DELETED_SUCCESS = "User deleted successfully";
export const PROFILE_UPDATE_SUCCESS = "Profile updated successfully";
export const EMAIL_ALREADY_EXISTS = "Email already exists";

// Session Messages
export const SESSION_EXPIRED = "Session has expired";
export const SESSION_INVALID = "Invalid session";
export const TOKEN_EXPIRED = "Token has expired";
export const TOKEN_INVALID = "Invalid token";
export const TOKEN_REQUIRED = "Token is required";

// Rate Limiting Messages
export const TOO_MANY_REQUESTS = "Too many requests. Please try again later";
export const RATE_LIMIT_EXCEEDED = "Rate limit exceeded. Please try again in a few minutes";

// File Upload Messages
export const FILE_UPLOAD_SUCCESS = "File uploaded successfully";
export const FILE_UPLOAD_ERROR = "Error uploading file";
export const INVALID_FILE_TYPE = "Invalid file type";
export const FILE_SIZE_ERROR = "File size exceeds limit";
export const FILE_REQUIRED = "File is required";

// Generic Action Messages
export const ACTION_SUCCESS = (action: string) => `${action} successful`;
export const ACTION_FAILED = (action: string) => `${action} failed`;
export const ITEM_NOT_FOUND = (item: string) => `${item} not found`;
export const ITEM_ALREADY_EXISTS = (item: string) => `${item} already exists`;
export const INVALID_FORMAT = (item: string) => `Invalid ${item} format`;

// Permission Messages
export const PERMISSION_DENIED = "Permission denied";
export const INSUFFICIENT_PRIVILEGES = "Insufficient privileges";
export const ACCESS_DENIED = "Access denied";
export const ADMIN_ACCESS_REQUIRED = "Admin access required";

// Error Status Messages
export const CONFLICT_ERROR = "Resource conflict";
export const SERVICE_UNAVAILABLE = "Service temporarily unavailable";
export const MAINTENANCE_MODE = "System is under maintenance";
export const DATABASE_ERROR = "Database operation failed";

// Success Status Messages
export const REQUEST_SUCCESS = "Request processed successfully";
export const OPERATION_SUCCESS = "Operation completed successfully";
export const DATA_FETCHED_SUCCESS = "Data fetched successfully";

export const PASSWORD_CHANGED_SUCCESSFULLY = "Password changed successfully";

class ApiResponse {
  statusCode: number;
  message: string;
  data?: object;

  constructor(statusCode: number, message: string, data?: object) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;

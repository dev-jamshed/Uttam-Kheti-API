class ApiResponse {
  statusCode: number;
  data: object;
  message: string;

  constructor(statusCode: number, data: object, message: string) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}

export default ApiResponse;

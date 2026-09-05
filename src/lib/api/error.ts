export class ApiError extends Error {
  readonly status: number;
  readonly isGatewayError: boolean;

  constructor(message: string, status: number, isGatewayError = false) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.isGatewayError = isGatewayError;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
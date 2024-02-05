export const STANDARD = {
  CREATED: 201,
  SUCCESS: 200,
  NOCONTENT: 204,
}

export const ERROR400 = {
  statusCode: 400,
  message: 'BAD_REQUEST',
}

export const ERROR401 = {
  statusCode: 401,
  message: 'UNAUTHORIZED',
}

export const ERROR403 = {
  statusCode: 403,
  message: 'FORBIDDEN_ACCESS',
}

export const ERROR404 = {
  statusCode: 404,
  message: 'NOT_FOUND',
}

export const ERROR409 = {
  statusCode: 409,
  message: 'DUPLICATE_FOUND',
}

export const ERROR500 = {
  statusCode: 500,
  message: 'TRY_AGAIN',
}

export const ERROR_MESSAGES = {
  invalidToken: new Error('Token is invalid.'),
  userExists: new Error('User already exists'),
  userNotExists: new Error('User not exists'),
  userCredError: new Error('Invalid credential'),
  roleError: new Error('Unauthorized operation'),
  tokenError: new Error('Invalid Token'),
  postNotExists: new Error('Post not found'),
  postError: new Error('Unauthorized operation'),
}
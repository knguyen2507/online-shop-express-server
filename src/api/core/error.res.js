'use strict'

// utils
const {
    ReasonPhrases,
    StatusCodes
} = require('../constants/httpStatusCode');

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }   
};

class BadRequestError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.BAD_REQUEST,
        statusCode = StatusCodes.BAD_REQUEST
    ) {
        super(message, statusCode)
    }
};

class UnauthorizedError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.UNAUTHORIZED,
        statusCode = StatusCodes.UNAUTHORIZED
    ) {
        super(message, statusCode)
    }
};

class ForbiddenRequestError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.FORBIDDEN,
        statusCode = StatusCodes.FORBIDDEN
    ) {
        super(message, statusCode)
    }
};

class InternalServerError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.INTERNAL_SERVER_ERROR,
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super(message, statusCode)
    }
};

class TooManyRequest extends ErrorResponse {
    constructor(
        message = ReasonPhrases.TOO_MANY_REQUESTS,
        statusCode = StatusCodes.TOO_MANY_REQUESTS
    ) {
        super(message, statusCode)
    }
}

// export module
module.exports = {
    BadRequestError,
    UnauthorizedError,
    ForbiddenRequestError,
    InternalServerError,
    TooManyRequest
}

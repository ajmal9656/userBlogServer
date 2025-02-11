const HTTP_statusCode = {
    OK: 200,
    UPDATED: 201,
    NO_CHANGE: 301,
    TASK_FAILED: 304,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NO_ACCESS: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    EXPIRED: 410,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  };
  
  Object.freeze(HTTP_statusCode); 
  
  export default HTTP_statusCode;
  
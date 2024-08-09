const asyncHandler = (requestHandler) => {
  return (req, resp, next) => {
    Promise.resolve(requestHandler(req, resp, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// const asyncHandler = () => { }
// const asyncHandler = (func) => () => { }
// const asyncHandler = (func) => async () => { }

/*

// production codebases

const asyncHandler = (fn) => async (req, resp, next) => {
    try {
        await fn(req, resp, next)
    } catch (error) {
        resp.status(err.code || 500).json({
            success: true,
            message: err.message
        })
    }
}

*/

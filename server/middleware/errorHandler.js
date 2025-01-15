const errorHandler = (err, req, res, next) => {
  console.log("You've got an error:",err.message);
  res.status(err.statusCode||500).json({ message: err.message || "Something went wrong...", success: false, statusCode: err.statusCode || 500})
}

export default errorHandler;
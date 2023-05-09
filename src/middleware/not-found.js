const notFoundMiddleware = (req, res) => {
  res.status(404).json({ error: "Resource Not Found!" });
};

export default notFoundMiddleware;

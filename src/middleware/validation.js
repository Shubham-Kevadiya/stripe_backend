const validateBodySchema = (validateSchema) => {
  return async (req, res, next) => {
    try {
      const payloadValue = await validateSchema.validateAsync(req.body, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      console.log("Error from body validation");
      const errorMsg = error.details.map((err) => {
        return err.message;
      });
      return res.status(400).json({ error: errorMsg });
    }
  };
};

const validateParamSchema = (validateSchema) => {
  return async (req, res, next) => {
    try {
      const payloadValue = await validateSchema.validateAsync(req.params, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      console.log("Error from param validation");
      const errorMsg = error.details.map((err) => {
        return err.message;
      });
      return res.status(400).json({ error: errorMsg });
    }
  };
};

const validateQuerySchema = (validateSchema) => {
  return async (req, res, next) => {
    try {
      const payloadValue = await validateSchema.validateAsync(req.query, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      console.log("Error from query validation");
      const errorMsg = error.details.map((err) => {
        return err.message;
      });
      return res.status(400).json({ error: errorMsg });
    }
  };
};

export default {
  validateBodySchema,
  validateParamSchema,
  validateQuerySchema,
};

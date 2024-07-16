import { v4 as uuidv4 } from 'uuid';

export const generateUniqueId = (req, res, next) => {
  req.uniqueId = uuidv4();
  next();
};

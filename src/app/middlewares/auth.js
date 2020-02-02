import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';
export default async (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).json({ arror: "Token não encontrado!" });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    request.userId = decoded.id;
  } catch (err) {
    return response.status(401).json({ arror: "Token não encontrado!" });

  }
  return next();

}

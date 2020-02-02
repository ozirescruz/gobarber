import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/Users';
import authConfig from '../../config/auth';

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required()
    });

    if (!(await schema.isValid(request.body))) {
      response.status(400).json({ error: "Usuário inválido!" });
    }

    const { email, password } = request.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return response.status(401).json({ error: "Usuário não encontrado!" })
    }

    if (!(await (await user).checkPassword(password))) {
      return response.status(401).json({ error: "Password não bate!" });

    }

    const { id, name } = user;
    const { secret, expiresIn } = authConfig;

    return response.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, secret, {
        expiresIn: expiresIn

      }),
    });

  }

}

export default new SessionController();

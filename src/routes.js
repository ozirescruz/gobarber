import { Router } from 'express';
import User from './app/models/Users';

const routes = new Router();

routes.get('/', async (request, response) => {

  const user = await User.create({
    name: 'maria',
    email: 'maria@email.com',
    password_hash: '1234667',
    provider: false
  });


  return response.json(user);
});

export default routes;

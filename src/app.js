// Adiciona módulo do express
import express from 'express';
import routes from './routes';
import './database';

class App {
  constructor() {
    // Servidor para as requisições
    this.server = express();

    this.midlewares();
    this.routes();
  }

  midlewares() {
    // Habilita json como resposta da requisições
    this.server.use(express.json());
  }

  routes() {
    // Carrega route do sistema
    this.server.use(routes);
  }
}

export default new App().server;

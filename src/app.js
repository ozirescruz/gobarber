// Adiciona módulo do express
import express from 'express';
import routes from './routes';
import path from 'path';
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
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
  }

  routes() {
    // Carrega route do sistema
    this.server.use(routes);
  }
}

export default new App().server;

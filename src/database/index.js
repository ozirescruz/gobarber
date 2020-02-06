import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/Users';
import databaseConfig from '../config/database';
import File from '../app/models/Files';
import Appoitment from '../app/models/Appoitments';

const models = [User, File, Appoitment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
      }
    )
  }
}

export default new Database();
import File from '../models/Files';

class FileController {
  async store(request, response) {
    const { originalname: name, filename: path } = request.file;
    const file = await File.create({
      name,
      path
    });

    return response.json(file);
  }
}

export default new FileController();

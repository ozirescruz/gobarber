import User from "../models/Users";
import File from "../models/Files";

class ProviderController {
  async index(request, response) {
    const providers = await User.findAll({
      where: {
        provider: "true"
      },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [{
        model: File,
        as: 'avatar',
        attributes: ['name', 'path', 'url']
      }]
    });

    return response.json({ providers });
  }

}

export default new ProviderController();

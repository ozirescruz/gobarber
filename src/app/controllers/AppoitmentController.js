import Appoitment from "../models/Appoitments";
import * as Yup from 'yup';
import User from "../models/Users";

class AppoitmentController {
  async store(request, response) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Appoitment inválido!" });
    }

    const { provider_id, date } = request.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: 'true' }
    });

    if (!isProvider) {
      return response.status(401).json({ error: "not a provider!" });
    }

    const appoitment = await Appoitment.create({ date, provider_id });

    return response.json({ appoitment: appoitment });
  }

}

export default new AppoitmentController();
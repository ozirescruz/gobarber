import { parseISO, startOfDay, endOfDay } from "date-fns";
import { Op } from 'sequelize';

import Appoitment from "../models/Appoitments";
import User from "../models/Users";

class ScheduleController {
  async index(request, response) {
    const checkUserProvider = await User.findOne({
      where: {
        id: request.userId, provider: true
      }
    });

    if (!checkUserProvider) {
      response.status(401).json({ message: "User is not a provider" });
    }

    const { date } = request.query;
    const parsedDate = parseISO(date);

    const appoitments = await Appoitment.findAll({
      where: {
        provider_id: request.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
        }
      },
      order: ['date']
    });


    return response.json(appoitments);

  }
}

export default new ScheduleController();
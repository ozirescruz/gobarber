import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from "../models/Users";
import Appoitment from "../models/Appoitments";
import File from '../models/Files';
import Notification from '../schemas/notifications'
import Queue from '../lib/Queue';
import CancellationEmail from '../jobs/CancellationMail';

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

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return response.status(401).json({ error: "Past dates are not permitted!" });
    }


    const checkAvailability = await Appoitment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });

    if (checkAvailability) {
      return response.status(401).json({ error: "Appoitment date not available!" });
    }

    const appoitment = await Appoitment.create(
      {
        user_id: request.user_id,
        date,
        provider_id
      });

    const user = User.findByPk(request.userId);
    const formattDate = format(
      hourStart,
      "'dia' dd 'de' MMMM ', às' H:mm'h'",
      { locale: pt });

    await Notification.create({
      content: `Agendamento de: ${user.name} para o ${formattDate}.`,
      user: provider_id
    })
    return response.json({ appoitment: appoitment });
  }

  async index(request, response) {
    const { page = 1 } = request.query;

    const prestadores = await Appoitment.findAll({
      where: {
        user_id: request.userId, canceled_at: null
      },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [{
            model: File,
            as: 'avatar',
            attributes: ['id', 'url', 'path']
          }]
        }
      ]
    });

    return response.json(prestadores);

  }

  async delete(request, response) {
    const appoitment = await Appoitment.findByPk(request.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email']
        }
      ]
    });

    if (appoitment.user_id !== request.userId) {
      return response.status(401).json({
        error: 'You cant cancel the appoitment'
      });

    }


    const limitTimeToCancel = subHours(appoitment.date);
    if (isBefore(limitTimeToCancel, new Date())) {
      return response.status(401).json({
        error: 'You cant cancel 2 hours in advance'
      });
    }

    appoitment.canceled_at = new Date();
    await appoitment.save();

    await Queue.add(CancellationEmail.key, {
      appoitment
    });

    return response.json(appoitment);
  }
}

export default new AppoitmentController();




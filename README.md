# AI Farming 👩‍🌾 | Server Side

## ⚡ Setup

1. `npm install` to install dependencies
2. `npm run dev` to start server.

## ❓ General

Exposes API to interact with machine learning model. Model is able to classify fruits/vegetables along with plant diseases based on pictures of their leaves.

## 📑 Documentation

Server starts on localhost port 5000. POST request using URLs below. Key for file in request body must be `file`.

### 🍇 Fruit/Vegetable Classification

http://localhost:5000/api/classify

### 🍁 Disease Classification Using Leaves

http://localhost:5000/api/leaves

### Dependencies 
Fruit/vegetable and leaves model should be located in `./model` directory at root level.

## ⚙️ Technologies Used

- Python, Tensorflow
- TypeScript, Express

## Other

Check out the [client](https://github.com/blueputty01/ai-farming-client)!

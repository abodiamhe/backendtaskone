import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";

const app = express();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));

const query = "New York";
const appKey = process.env.API_KEY;
const unit = "metric";
const url =
  "https://api.openweathermap.org/data/2.5/weather?q=" +
  query +
  "&appid=" +
  appKey +
  "2&units=" +
  unit;

app.get("/api/hello", async (req, res) => {
  const visitor = req.query.visitor_name;
  try {
    const response = await axios.get(url);
    const resData = await response.data;
    res.json({
      client_ip: "127.0.0.1",
      location: query,
      greeting: `Hello, ${visitor}!, the temperature is ${resData.main.temp} degrees Celcius in ${query}`,
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`app listening in port ${port}`);
});

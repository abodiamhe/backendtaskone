import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";

const app = express();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));

const query = "New York";
const appKey = process.env.API_KEY;

app.get("/api/hello", async (req, res) => {
  const visitor = req.query.visitor_name;

  const clientIp = await axios.get("http://ip-api.com/json");
  const lat = clientIp.data.lat;
  const lon = clientIp.data.lon;
  const city = clientIp.data.city;
  const query = clientIp.data.query;

  http: try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appKey}&units=metric`
    );
    const resData = await response.data;
    res.json({
      client_ip: query,
      location: city,
      greeting: `Hello, ${visitor}!, the temperature is ${resData.main.temp} degrees Celcius in ${city}`,
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`app listening in port ${port}`);
});

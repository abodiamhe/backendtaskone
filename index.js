import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";

const app = express();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));

const appKey = process.env.API_KEY;

app.get("/api/hello", async (req, res) => {
  const visitor = req.query.visitor_name;

  // const clientIp = await axios.get(
  //   "https://ipinfo.io/json?token=84cc58a73301ae"
  // ); //http://ip-api.com/json/
  // const clientIpData = await clientIp.data;

  const request = await fetch("https://ipinfo.io/json?token=84cc58a73301ae");
  const clientIpData = await request.json();

  const city = clientIpData.city;
  const ip = clientIpData.ip;

  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appKey}&units=metric`
  );
  const resData = await response.data;
  res.json({
    client_ip: ip,
    location: city,
    greeting: `Hello, ${visitor}!, the temperature is ${resData.main.temp} degrees Celcius in ${city}`,
  });
});

app.listen(port, () => {
  console.log(`app listening in port ${port}`);
});

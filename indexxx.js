import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";
import geoip from "geoip-lite";
import requestIp from "request-ip";

const app = express();
const port = process.env.PORT;
app.use(requestIp.mw());
app.set("trust proxy", true);
app.use(bodyParser.urlencoded({ extended: true }));

const appKey = process.env.API_KEY;
const token = process.env.TOKEN;

app.get("/api/hello", async (req, res) => {
  const ip = req.clientIp;
  const geo = geoip.lookup(ip);
  console.log(geo);
  // console.log(req.headers);
  const visitor = req.query.visitor_name;
  try {
    const clientIp = await axios.get(`https://ipinfo.io/json?token=${token}`); //http://ip-api.com/json/
    const clientIpData = await clientIp.data;

    const city = clientIpData.city;
    const ip = clientIpData.ip;

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appKey}&units=metric`
      );
      const resData = await response.data;
      res.json({
        client_ip: ip,
        location: city,
        greeting: `Hello, ${visitor}!, the temperature is ${resData.main.temp} degrees Celcius in ${city}`,
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`app listening in port ${port}`);
});

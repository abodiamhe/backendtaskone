import dotenv from "dotenv";
import express from "express";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.API_KEY;

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // console.log(`Client IP: ${clientIp}`);

  try {
    const locationData = await getLocation(clientIp);
    // console.log(`Location Data: ${JSON.stringify(locationData)}`);

    const temperature = await getTemperature(locationData.city);
    // console.log(`Temperature: ${temperature}`);

    res.json({
      client_ip: clientIp,
      location: locationData.city,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${locationData.city}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

async function getLocation(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    // console.log(`IP-API Response: ${JSON.stringify(response.data)}`);

    return {
      city: response.data.city || "Unknown",
    };
  } catch (error) {
    console.error(`Failed to retrieve location: ${error.message}`);
    throw new Error("Failed to retrieve location");
  }
}

async function getTemperature(city) {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
    );
    return response.data.main.temp;
  } catch (error) {
    console.error(`Failed to retrieve temperature: ${error.message}`);
    throw new Error("Failed to retrieve temperature");
  }
}

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

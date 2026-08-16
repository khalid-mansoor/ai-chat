import { tool } from "ai";
import { z } from "zod";

//TOOLS 
export const getWeather = tool({
    description:
        "Get the current weather for a city.",

    inputSchema: z.object({
        city: z
            .string()
            .describe("The city name"),
    }),

    execute: async ({ city }) => {
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                city
            )}&count=1&language=en&format=json`
        );

        const geoData =
            await geoResponse.json();

        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {
            throw new Error(
                `Could not find city: ${city}`
            );
        }

        const location =
            geoData.results[0];

        const latitude =
            location.latitude;

        const longitude =
            location.longitude;

        const weatherResponse =
            await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
            );

        const weatherData =
            await weatherResponse.json();

        return {
            city: location.name,
            country: location.country,

            temperature:
                weatherData.current
                    .temperature_2m,

            humidity:
                weatherData.current
                    .relative_humidity_2m,

            apparentTemperature:
                weatherData.current
                    .apparent_temperature,

            weatherCode:
                weatherData.current
                    .weather_code,

            windSpeed:
                weatherData.current
                    .wind_speed_10m,
        };
    },
});

export const getTime = tool({
    description:
        "Get the current time for a specific city.",

    inputSchema: z.object({
        city: z
            .string()
            .describe("The city name"),
    }),

    execute: async ({ city }) => {
        return {
            city,
            time: new Date().toLocaleTimeString(),
        };
    },
});
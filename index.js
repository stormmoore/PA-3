const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: "35.164.243.54",
    user: "admin",
    password: "Greggs704#",
    database: "pa_3"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err);
        return;
    }

    console.log("Connected to MySQL database.");
});

app.post("/api/sensor", (req, res) => {

    console.log("Received sensor data:", req.body);

    const {
        temperature_f,
        temperature_c,
        humidity
    } = req.body;

    const sql = `
        INSERT INTO sensor_data
        (temperature_f, temperature_c, humidity)
        VALUES (?, ?, ?)
    `;

    const values = [
        temperature_f,
        temperature_c,
        humidity
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error("Error inserting sensor data:", err);

            return res.status(500).json({
                message: "Failed to insert sensor data"
            });
        }

        console.log("Sensor data inserted successfully.");

        res.json({
            message: "Sensor data received and inserted",
            id: result.insertId
        });
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
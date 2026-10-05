const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());

const db = mysql.createPool({
    host: "arduino-sensor-data.cdki4ei6mh95.us-west-2.rds.amazonaws.com",
    user: "admin",
    password: "Greggs704#",
    database: "pa_3",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.query("SELECT 1", (err) => {
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
        INSERT INTO sensor_readings
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
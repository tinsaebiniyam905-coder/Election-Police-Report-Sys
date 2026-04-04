// ================= BACKEND (Node.js + Express + SQLite) =================

import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("reports.db");

// Create table
db.prepare(`
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region TEXT,
  zone TEXT,
  wereda TEXT,
  station TEXT,
  crime_type TEXT,
  weapon_type TEXT,
  injured_light INTEGER,
  injured_serious INTEGER,
  deaths INTEGER,
  male INTEGER,
  female INTEGER,
  suspects_caught TEXT,
  suspects_count INTEGER,
  description TEXT,
  date TEXT,
  officer_name TEXT,
  seen INTEGER DEFAULT 0
)
`).run();

// Login (simple)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "wereda" && password === "1234") {
    return res.json({ role: "wereda" });
  }

  if (username === "police" && password === "1234") {
    return res.json({ role: "police" });
  }

  res.status(401).json({ message: "Invalid" });
});

// Submit report
app.post("/reports", (req, res) => {
  const data = req.body;

  const stmt = db.prepare(`
    INSERT INTO reports (
      region, zone, wereda, station, crime_type, weapon_type,
      injured_light, injured_serious, deaths, male, female,
      suspects_caught, suspects_count, description, date, officer_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    data.region, data.zone, data.wereda, data.station,
    data.crime_type, data.weapon_type,
    data.injured_light, data.injured_serious, data.deaths,
    data.male, data.female,
    data.suspects_caught, data.suspects_count,
    data.description, data.date, data.officer_name
  );

  res.json({ message: "Report saved" });
});

// Get all reports
app.get("/reports", (req, res) => {
  const reports = db.prepare("SELECT * FROM reports").all();
  res.json(reports);
});

// Mark as seen
app.put("/reports/:id/seen", (req, res) => {
  db.prepare("UPDATE reports SET seen=1 WHERE id=?").run(req.params.id);
  res.json({ message: "Updated" });
});

// Simple AI summary (basic)
app.get("/analytics", (req, res) => {
  const total = db.prepare("SELECT COUNT(*) as count FROM reports").get();
  const deaths = db.prepare("SELECT SUM(deaths) as total FROM reports").get();

  res.json({
    total_reports: total.count,
    total_deaths: deaths.total || 0
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));


// ================= FRONTEND (Simple HTML) =================

/* Save this as index.html */

<!DOCTYPE html>
<html>
<head>
  <title>Police Report System</title>
</head>
<body>

<h2>Login</h2>
<input id="username" placeholder="username" />
<input id="password" placeholder="password" type="password" />
<button onclick="login()">Login</button>

<div id="wereda" style="display:none">
  <h3>Submit Report</h3>
  <input id="region" placeholder="Region"><br>
  <input id="zone" placeholder="Zone"><br>
  <input id="weredaInput" placeholder="Wereda"><br>
  <input id="station" placeholder="Station"><br>
  <input id="crime" placeholder="Crime Type"><br>
  <input id="weapon" placeholder="Weapon"><br>
  <input id="light" placeholder="Light Injured"><br>
  <input id="serious" placeholder="Serious Injured"><br>
  <input id="deaths" placeholder="Deaths"><br>
  <input id="male" placeholder="Male"><br>
  <input id="female" placeholder="Female"><br>
  <input id="caught" placeholder="Caught? yes/no"><br>
  <input id="count" placeholder="Suspects Count"><br>
  <input id="desc" placeholder="Description"><br>
  <input id="date" placeholder="Date"><br>
  <input id="officer" placeholder="Officer Name"><br>
  <button onclick="submitReport()">Send</button>
</div>

<div id="police" style="display:none">
  <h3>Reports</h3>
  <button onclick="loadReports()">Load</button>
  <ul id="list"></ul>
</div>

<script>
let role = "";

function login() {
  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(res => res.json())
  .then(data => {
    role = data.role;
    if (role === "wereda") {
      document.getElementById("wereda").style.display = "block";
    } else {
      document.getElementById("police").style.display = "block";
    }
  });
}

function submitReport() {
  fetch("http://localhost:3000/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      region: region.value,
      zone: zone.value,
      wereda: weredaInput.value,
      station: station.value,
      crime_type: crime.value,
      weapon_type: weapon.value,
      injured_light: light.value,
      injured_serious: serious.value,
      deaths: deaths.value,
      male: male.value,
      female: female.value,
      suspects_caught: caught.value,
      suspects_count: count.value,
      description: desc.value,
      date: date.value,
      officer_name: officer.value
    })
  })
  .then(() => alert("Sent"));
}

function loadReports() {
  fetch("http://localhost:3000/reports")
  .then(res => res.json())
  .then(data => {
    list.innerHTML = "";
    data.forEach(r => {
      const li = document.createElement("li");
      li.innerText = r.region + " - " + r.crime_type + " (" + (r.seen ? "Seen" : "New") + ")";
      list.appendChild(li);
    });
  });
}
</script>

</body>
</html>

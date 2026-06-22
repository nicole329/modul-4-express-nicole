const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hallo Nicole!");
});

app.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});
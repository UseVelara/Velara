const express = require("express");
const http = require("http");
const { createBareServer } = require("@tomphttp/bare-server-node");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const routes = [
    { path: "/", file: "index.html" },
    { path: "/g", file: "games.html" },
    { path: "/a", file: "apps.html" },
    { path: "/r", file: "ai.html" },
    { path: "/s", file: "settings.html" },
    { path: "/m", file: "media.html" },
    { path: "/!", file: "search.html" },
    { path: "/404", file: "404.html" },
];

routes.forEach(route => {
    app.get(route.path, (req, res) => {
        res.sendFile(path.join(__dirname, "public", route.file));
    });
});

app.use((req, res) => {
    res.redirect("/404");
});

const bareServer = createBareServer("/bare/");
const server = http.createServer((req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

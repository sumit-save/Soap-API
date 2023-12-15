const express = require("express");
const PORT = 8000;

const app = express();

// Routes
const routes = require("./routes");
app.use("/", routes);

// Create Server On Localhost:8000
(async () => {
    try {
        app.listen(PORT);
        console.log(`Server Started On Localhost:${PORT}`);
    } catch (error) {
        console.log(`Unable To Create Server On Localhost:${PORT}`);
        console.log(error);
    }
})();
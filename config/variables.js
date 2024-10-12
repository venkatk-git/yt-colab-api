const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

module.exports = {
    PORT: process.env.PORT || 4000,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
};

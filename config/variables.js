const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

module.exports = {
    PORT: process.env.PORT || 4000,
};

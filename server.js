const app = require("./app");
const { PORT } = require("./config/variables");

app.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
});

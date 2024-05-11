const express = require("express");
const morgan = require("morgan");

const nftsRouter = require("./routes/nftsRoute");
const usersRouter = require("./routes/usersRoute");

const app = express();
app.use(express.json())

if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}

// SERVING TEMPLATE DEMO
app.use(express.static(`${__dirname}/nft-data/img`));

// CUSTOM MIDDLE WARE
app.use((req, res, next)=> {
    console.log("Hey i am from middleware function 👋");
    next();
});

app.use((req, res, next)=> {
    req.requestTime = new Date().toISOString();
    next();
})


app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);

module.exports = app;
const fs = require("fs")
const express = require("express");

const app = express();
app.use(express.json())

const nfts = JSON.parse(
    fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)
);

// GET METHOD

const getAllNfts = (req, res) => {
    res.status(200).json({
        status: "success",
        results: nfts.length,
        data: {
            nfts,
        },
    })
}


// POST METHOD

const createNFT = (req, res) => {

    const newId = nfts[nfts.length - 1].id + 1;
    const newNFTs = Object.assign({ id: newId }, req.body)

    nfts.push(newNFTs);

    fs.writeFile(`${__dirname}/nft-data/data/nft-simple.json`, JSON.stringify(nfts), err => {
        res.status(201).json({
            status: "success",
            nft: newNFTs,
        })
    })
}


// GET SINGLE NFT

const getSingleNFT = (req, res)=> {
    
    const id = req.params.id * 1;
    const nft = nfts.find((el) => (el.id === id));

    if(!nft){
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            nft,
        },
    })
}

// PATCH METHOD

const updateNFT = (req, res)=> {

    if(req. params.id * 1 > nfts.length){
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }
    res.status(200).json({
        status: "success",
        data: {
            nft: "Updating nft"
        }
    })
}

// DELETE METHOD

const deleteNFT = (req, res)=> {

    if(req. params.id * 1 > nfts.length){
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }
    res.status(204).json({
        status: "success",
        data: null,
    })
}


// app.get('/api/v1/nfts', getAllNfts)
// app.post("/api/v1/nfts", createNFT)
// app.get("/api/v1/nfts/:id", getSingleNFT)
// app.patch("/api/v1/nfts/:id", updateNFT)
// app.delete("/api/v1/nfts/:id", deleteNFT)

app.route("/api/v1/nfts").get(getAllNfts).post(createNFT);

app.route("/api/v1/nfts/:id").get(getSingleNFT).patch(updateNFT).delete(deleteNFT);

const port = 4000;
app.listen(port, () => {
    console.log(`App running on port ${port}....`);
});
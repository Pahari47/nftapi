

const NFT = require("./../models/nftModel");

exports.aliasTopNFTs = (req, res, next)=>{
    req.query.limit = '5',
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,difficulty";
    next();
};


exports.getAllNfts = async (req, res) => {
    try {
        // BUILD QUERY  

        const queryObj = {...req.query}
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((eL) => delete queryObj[eL]);

        // console.log(req.query, queryObj);


        // ADVANCE FILTERING QUERY
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        // console.log(JSON.parse(queryStr));

        let query = NFT.find(JSON.parse(queryStr));
        // {difficulty: "easy", duration: {$gte: 5}}
        // { difficulty: 'easy', duration: { gte: '5' } }
        // { difficulty: 'easy', duration: { '$gte': '5' } }

        // SORTING METHOD
        if (req.query.sort){
            const sortBy = req.query.sort.split(',').join(" ");
            console.log(sortBy);
            query = query.sort(sortBy);
        } else{
            query = query.sort("-createdAt");
        }

        // FIELD LIMITS
        if(req.query.fields){
            const fields = req.query.fields.split(",").join(' ');
            query = query.select(fields);
        } else{
            query = query.select("-__v");
        }

        // PAGINATIONS FUNCTION
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 10
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if(req.query.page){
            const newNFTs = await NFT.countDocuments();
            if (skip >= newNFTs) throw new Error("This page doesn't exist");
        }

        const nfts = await query;

        // console.log(req.query);
        // const nfts = await NFT.find({
        //     difficulty: "easy",
        //     duration: 5
        // });

        // const nfts = await NFT.find().where('duration').equals(5).where("difficulty").equals("easy");

        // SEND QUERY
        res.status(200).json({
            status: "success",
            results: nfts.length,
            data: {
                nfts,
            },
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: "error",
        })
    }

}


// POST METHOD

exports.createNFT = async (req, res) => {

    try {
        const newNFT = await NFT.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                nft: newNFT,
            },
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: "Invalid data send for NFT",
        });
    }
}


// GET SINGLE NFT

exports.getSingleNFT = async (req, res) => {

    try {

        const nft = await NFT.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data: {
                nft
            }
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: "error",
        })
    }
}

// PATCH METHOD

exports.updateNFT = async (req, res) => {
    try {
        const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: "success",
            data: {
                nft,
            },
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: "error",
        })
    }

}

// DELETE METHOD

exports.deleteNFT = async (req, res) => {
    try {
        await NFT.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: "success",
            data: null,
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: "error",
        })
    }

}
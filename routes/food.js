const foods = require("../models/food");
const router = require("express").Router();

// Get all foods without pagination
router.get("/get/all", async(req, res) => {
    const food_data = await foods.find();
    if(food_data.length) {
        res.json({
            success: true,
            message: "Foods Found",
            data: food_data,
        });
        return;
    }
    res.json({
        success: false,
        message: "Foods Not Found",
        data: [],
    })
});

// Get all foods by pagination
router.post('/find/all', async(req, res) => {
    const {pageNumber, nPerPage} = req.body;
    // console.log({pageNumber, nPerPage});
    const food_data = await foods.find()
                    .sort( { createdAt: -1 } )
                    .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
                    .limit( nPerPage );
    if(food_data.length) {
        const data_length = await foods.find().count();
        res.json({
            success: true,
            data_length,
            message: "Food Item Founds",
            data: food_data,
        });
        return;
    }
    res.json({
        success: true,
        message: "Food Item Didn't Found",
        data: [],
    })
});

// create food
router.post('/create', async(req, res) => {
    const {body} = req;
    // console.log({body});
    const food = new foods(body);
    const save_res = await food.save();
    if(save_res) {
        res.status(200).json({
            success: true,
            message: "Food Item Created",
            data: save_res?._doc
        });
        return;
    }
    res.status(400).json({
        success: false,
        message: "Food Item Did Not Created",
        data: null
    });
});

// update food
router.post('/update', async(req, res) => {
    const {body} = req;
    const {id} = body;
    delete body.id;
    const query = {_id: id};
    const update_res = await foods.updateOne(query, {
        $set: req.body,
    });
    if(update_res?.modifiedCount) {
        const result = await foods.findOne(query);
        res.status(200).json({
            success: true,
            message: "Food Item Updated",
            data: result?._doc
        });
        return;
    }
    res.status(400).json({
        success: false,
        message: "Food Item Did Not Updated",
        data: null
    });
});

// delete a food
router.delete('/delete/:id', async(req, res) => {
    const delete_res = await foods.findByIdAndRemove(req.params.id);
    if(delete_res) {
        res.status(200).json({
            success: true,
            message: "Food Item Is Deleted",
        });
        return;
    }
    res.status(400).json({
        success: false,
        message: "Food Item Is Not Deleted",
        data: null
    });
});

module.exports = router;
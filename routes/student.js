const students = require('../models/student');
const router = require('express').Router();

// Check Duplicate Roll
router.post('/check-duplicate', async(req, res) => {
    const { _id, roll } = req.body;
    const query = { roll };
    _id && (query._id = _id );
    if(_id){
        const student = await students.findOne(query);
        // console.log("====11====",student);
        if(student){
            res.status(200).json({
                status: true,
                message: 'Roll is already exist and you can update it.'
            });
            return;
        }
        res.status(404).json({
            status: false,
            message: 'Roll is already exist and you can update it.'
        });
    }else{
        const student = await students.findOne(query);
        // console.log("====25====",student);
        if(student?._id){
            res.status(200).json({
                status: false,
                message: 'Roll is already exist.'
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Roll is already exist.'
        });

    }

});

// Get student by roll
router.get('/:roll', async(req, res) => { 
    const {roll} = req.params;
    const student_data = await students.findOne({roll});
    if(student_data) {
        res.json({
            success: true,
            message: "Student Found",
            data: student_data?._doc,
        });
        return;
    }
    res.json({
        success: false,
        message: "Student Not Found",
        data: null,
    })
});

// Update Bulk Data Status 
router.post('/bulk_update_status', async(req, res) => {
    const {bulk_ids, status} = req.body;
    // console.log({bulk_ids_len: bulk_ids.length, status});
    if(bulk_ids.length) {
        await bulk_ids.map(async(id, idx) => {
            await students.updateOne({_id: id}, {
                $set: {
                    status,
                },
            });
            if((idx+1) === bulk_ids.length) {
                res.status(200).json({
                    success: true,
                    message: "Bulk Data Updated",
                });
                return;
            }
        });
    }else{
        res.status(400).json({
            success: false,
            message: "Bulk Data Not Updated",
        });
    }
});

// Get all students by pagination
router.post('/find/all', async(req, res) => {
    const {pageNumber, nPerPage} = req.body;
    // console.log({pageNumber, nPerPage});
    const student_data = await students.find()
                        .sort( { createdAt: -1 } )
                        .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
                        .limit( nPerPage );

    if(student_data.length) {
        const data_length = await students.find().count();
        res.json({
            success: true,
            data_length,
            message: "Student Found",
            data: student_data,
        });
        return;
    }
    res.json({
        success: true,
        message: "Student Not Found",
        data: [],
    })
});

// create student
router.post('/create', async(req, res) => {
    const {body} = req;
    // console.log({body});
    const student = new students(body);
    try {
        const save_res = await student.save();
        // console.log({save_res});
        if(save_res) {
            res.status(200).json({
                success: true,
                message: "Student Created",
                data: save_res?._doc
            });
            return;
        }
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "The Student of this roll number is already exist",
            data: null,
        });
        return;
    }
});

// update student
router.post('/update', async(req, res) => {
    const {body} = req;
    const {_id} = body;
    const query = {_id};
    delete body._id;
    console.log({body});
    try {
        const update_res = await students.updateOne(query, {
            $set: body, 
        });
        if(update_res?.modifiedCount) {
            const result = await students.findOne(query);
            res.status(200).json({
                success: true,
                message: "Student Updated",
                data: result?._doc
            });
            return;
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "The Student of this roll number is already exist",
            data: null,
        });
    }
});


// delete a student
router.delete('/delete/:id', async(req, res) => {
    const {id} = req.params;
    const delete_res = await students.findByIdAndRemove(id);
    if(delete_res) {
        res.status(200).json({
            success: true,
            message: "Student Deleted",
        });
        return;
    }
    res.status(400).json({
        success: false,
        message: "Student Did Not Deleted",
    });
});

module.exports = router;
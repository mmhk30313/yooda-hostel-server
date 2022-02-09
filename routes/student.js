const students = require('../models/student');
const router = require('express').Router();

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
        success: true,
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
    const save_res = await student.save();
    if(save_res) {
        res.status(200).json({
            success: true,
            message: "Student Created",
            data: save_res?._doc
        });
        return;
    }
    res.status(400).json({
        success: false,
        message: "The Student of this roll number is already exist",
        data: null
    });
});

// update student
router.post('/update', async(req, res) => {
    const {body} = req;
    const {_id} = body;
    const query = {_id};
    delete body._id;
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
    res.status(400).json({
        success: false,
        message: "Student Did Not Updated",
        data: null
    });
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
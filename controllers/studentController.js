const Students = require('../models/studentModel');

exports.list = async (req, res, next) => {
    try {
        const students = await Students.findAll();
        res.render('students', { title: 'Student Database', students });
    } catch (err) {
        next(err);
    }
};


exports.show = async (req, res, next) => {
    try{
        const student = await Students.findById(req.params.id);
        res.render('student', { title: 'Student', student });
    }catch (err){next(err);}
}
exports.newForm = (req, res, next) => {
    res.render('studentForm', {
        title: 'Add Student',
        mode: 'create',
        student: { StudentID: '', FirstName: '', LastName: '', Major: '', GPA: ''},
        action: '/student?_method=POST',
        submitLabel: 'Create'
    });
}
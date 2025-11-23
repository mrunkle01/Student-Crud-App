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
        submitLabel: 'Create',
    });
}

exports.create = async (req, res, next) => {
    try {
        const errors = validate(req.body);
        const {FirstName, LastName, Major, GPA} = req.body;
        if (Object.keys(errors).length > 0) {
            return res.status(400).render('studentForm', {
                title: 'Add Student',
                mode: 'create',
                student: { FirstName, LastName, Major, GPA},
                action: '/student?_method=POST',
                submitLabel: 'Create',
                errors
            });
        }

        const id = await Students.create({FirstName, LastName, Major, GPA});
        res.redirect(`/students/${id}`);
    } catch (err) {
        next(err);
    }
}
exports.editForm = async (req, res, next) => {
    try{
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {return res.status(400).send('Invalid ID');}

        const student = await Students.findById(id);
        if (!student) {return res.status(400).send('Student Not Found');}

        res.render('studentForm', {
            title: 'Edit Student',
            mode: 'edit',
            student,
            action: `/students/${id}?_method=PUT`,
            submitLabel: 'Update',
        })
    }
    catch(err){
        next(err);
    }
}
exports.update = async (req, res, next) => {
    try{
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {return res.status(400).send('Invalid ID');}

        const { FirstName, LastName, Major, GPA } = scrub(req.body);
        const errors = validate({ FirstName, LastName, Major, GPA });
        if (Object.keys(errors).length > 0) {
            return res.status(400).render('studentForm', {
                title: 'Edit Student',
                mode: 'edit',
                student: { FirstName, LastName, Major, GPA },
                action: `/students/${id}?_method=PUT`,
                submitLabel: 'Update',
                errors
            });
        }
        const updated = await Students.updateById(id, {FirstName, LastName, Major, GPA});
        if (!updated) {return res.status(400).send('Student Not Found');}

        res.redirect(`/students/${id}`);
    }catch (err){
        next(err);
    }
}
const validate = ({FirstName, LastName, Major, GPA}) => {
    const errors = {}
    if (!FirstName || !FirstName.trim() || !String(FirstName)) errors.firstName = 'First Name is required.';
    if (!LastName || !LastName.trim() || !String(LastName)) errors.lastName = 'Last Name is required.';
    if (!Major || !Major.trim() || !String(Major)) errors.major = 'Major is required.';
    if (!GPA || !GPA.trim()
        || Number.isNaN(GPA) || Number(GPA) > 5.0 || Number(GPA) < 0){
        errors.gpa = 'GPA needs to be a valid number between 0 and 5.0';
    }

    return errors;
}
function scrub({ FirstName, LastName, Major, GPA }) {
    return {
        FirstName : String(FirstName ?? '').trim(),
        LastName : String(LastName ?? '').trim(),
        Major : String(Major ?? '').trim(),
        GPA : String(GPA ?? '').trim()
    };
}


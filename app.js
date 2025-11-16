require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');

const app = express();

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    res.locals.year = new Date().getFullYear();
    next();
});

const routes = require('./routes');
app.use('/', routes);

// app.use((req, res) => {
//     res.status(404).render('404', { title: 'Not Found' });
// });
//
// app.use((err, req, res, next) => {
//     console.error(err);
//     res.status(500).render('500', { title: 'Server Error' });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

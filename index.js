const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const banksRoutes = require('./routes/banks');

const PORT = process.env.PORT || 3000;

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(banksRoutes);

async function start() {
    try {
        await mongoose.connect(
            'mongodb+srv://alex:123321@cluster0.vuf2z.mongodb.net/banks',
            {
                useNewUrlParser: true,
            }
        );

        app.listen(PORT, () => {
            console.log("Server has been started...");
        });
    } catch (e) {
        console.log(e);
    }
}

start();
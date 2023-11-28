import express from "express";
import { engine } from "express-handlebars";

const app = express();
const port = 3000;
const mapAPIkey = 'AIzaSyD6ALcSgO0gSbi49A6J0njXYvwatQ-7kf0';

//Setup handlebars view engine
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main'
}))

app.set('view engine', 'hbs');
app.set('views', './views');


// Basic setup
app.set('title', 'Ads Management');

app.get('/', (req, res) => {
    res.render('home');
})


//Static setup
app.use('/static', express.static('static'))

// Connection setup
app.listen(port, () =>{
    console.log('Ads Management server is running at http://localhost:' + port);
})
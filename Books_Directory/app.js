const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const Book = require('./models/book');
const { escapeRegExpChars } = require('ejs/lib/utils');

mongoose.connect('mongodb://localhost:27017/books-deepthought');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Data Base Connected to App JS Book-Repository !!!');
});


app.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.render('allBooks', {books});
    } catch(err) {
        console.log(error);
        res.render('error', {error});
    }
});

app.get('/addBook', async (req, res) => {
    try {
        res.render('newBook');
    } catch(error) {
        res.render('error', {error});
    }
});

app.post('/addBook', async (req, res) => {
    try {
        const newBook = req.body.newBook;
        //check to see if book already exists
        const tempBook = await Book.exists({title : newBook.title, author : newBook.author});
        if(tempBook == false) {
            const bookToBeAdded = new Book(newBook);
            await bookToBeAdded.save();
            const bookSaved = await Book.findOne(bookToBeAdded);
            res.redirect(`/book/${bookSaved._id}`);
        } else {
            res.render('error', {error : 'book already exists in the repository'});
        }
    } catch(error) {
        res.render('error', {error});
    }
});

app.get('/book/:id', async (req, res) => {
    try {
        const bookSearched = await Book.findById({_id : req.params.id});
        if(bookSearched) {
            res.render('book', {bookSearched});
        } else {
            res.render('error', {error : 'book not found'});
        }
    } catch(error) {
        res.render('error', {error});
    }
});

app.get('/editBook/:id', async (req, res) => {
    try {
        const bookToBeEdited = await Book.findById(req.params.id);
        res.render('editBook', {bookToBeEdited});
    } catch(error) {
        res.render('error', {error});
    }
});

app.patch('/editBook/:id', async (req, res) => {
    try {
        const bookToBeEdited = await Book.findById(req.params.id);
        bookToBeEdited.title = req.body.title;
        bookToBeEdited.author = req.body.author;
        bookToBeEdited.description = req.body.description;
        bookToBeEdited.save();
        res.redirect(`/book/${req.params.id}`);
    } catch(error) {
        res.render('error', {error});
    }
});

app.delete('/deleteBook/:id', async (req, res) => {
    try{
        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/');
    }catch(error) {
        res.render('error', {error});
    }
})

app.get('*', (req, res) => {
    res.render('error', {error: "404 Not Found"});
})

app.listen(PORT, () => {
    console.log(`Server on PORT ${PORT}`);
});
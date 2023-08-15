const express = require("express");
const router = express.Router();
const Book = require("../models/books");
const multer = require("multer");
const fs=require('fs')

// pdf uploading
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("pdf");

// insert books to database route
router.post('/add', async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.json({ message: err.message, type: 'danger' });
      }

      const book = new Book({
        title: req.body.title,
        author: req.body.author,
        email: req.body.email,
        phone: req.body.phone,
        pdf: req.file.filename
      });

      await book.save();

      req.session.message = {
        type: 'success',
        message: "Book added successfully"
      };
      res.redirect('/');
    });
  } catch (err) {
    res.json({
      message: err.message,
      type: 'danger'
    });
  }
});



//fetch to add books rout
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().exec();
    res.render('index', {
      title: 'Home Page',
      books: books,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});


router.get("/add", (req, res) => {
  res.render("add_books", { title: "Add Book", message: req.session.message });
});

// Edit user route
router.get('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id).exec();

    if (book === null) {
      return res.redirect('/');
    }

    res.render("edit_books", {
      title: "Edit Book",
      book: book,
    });
  } catch (err) {
    res.redirect('/');
  }
});
// Update users
router.post('/update/:id', upload, async (req, res) => {
  try {
    const id = req.params.id;
    let new_pdf = '';

    if (req.file) {
      new_pdf = req.file.filename;
      try {
        fs.unlinkSync("./uploads/" + req.body.old_pdf);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_pdf = req.body.old_pdf;
    }

    await Book.findByIdAndUpdate(id, {
      title: req.body.title,
      author: req.body.author,
      email: req.body.email,
      phone: req.body.phone,
      pdf: new_pdf,
    });

    req.session.message = {
      type: 'success',
      message: 'Updated successfully',
    };
    res.redirect('/');
  } catch (err) {
    res.json({
      message: err.message,
      type: 'danger',
    });
  }
}); 

// Delete book route
router.get('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findByIdAndRemove(id);

    if (book === null) {
      return res.redirect('/');
    }

    // Also, remove the pdf file associated with the deleted book
    try {
      fs.unlinkSync("./uploads/" + book.pdf);
    } catch (err) {
      console.log(err);
    }

    req.session.message = {
      type: 'success',
      message: 'Book deleted successfully',
    };
    res.redirect('/');
  } catch (err) {
    res.redirect('/');
  }
});




// contact  
router.post('/contact', async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.json({ message: err.message, type: 'danger' });
      }

      const book = new Book({
        title: req.body.title,
        author: req.body.author,
        email: req.body.email,
        phone: req.body.phone,
        pdf: req.file.filename
      });

      await book.save();

      req.session.message = {
        type: 'success',
        message: "Book Added Successfully"
      };
      res.redirect('/');
    });
  } catch (err) {
    res.json({
      message: err.message,
      type: 'danger'
    });
  }
});



//fetch to add book rout
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().exec();
    res.render('index', {
      title: 'Home Page',
      books: books,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});


router.get("/contact", (req, res) => {
  res.render("contact_us", { title: "Contact Us page", message: req.session.message });
});





module.exports = router;

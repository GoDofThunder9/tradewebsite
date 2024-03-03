const express = require('express');
const path = require('path');
const port = 8000;
const mongoose = require('mongoose');
const app = express();
const form = require('./models/Form')
app.set('view engine', 'ejs');
const nodemailer = require('nodemailer');
const Form = require('./models/Form');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));
app.get('/', async function(req, res) {
    try {
        return res.render('trade', {
        });
    } catch (err) {
        console.error("Error in fetching data from the database:", err);
        return res.status(500).send("Error in fetching data from the database");
    }
});
app.post('/Join-us', async function(req, res){
    try {
        const Form = await form.create({
            First_name: req.body.First_name,
            Last_name: req.body.Last_name,
            Username: req.body.Username,
            City: req.body.City,
            State: req.body.State,
            Zip: req.body.Zip,
          });
          // Create a transporter using your email credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '21bit048@ietdavv.edu.in',
    pass: 'RAJtiwari9165',
  },
});
// Define the email options
const mailOptions = {
  from: '21bit048@ietdavv.edu.in',
  to: Form.Username,
  subject: 'Welcome To Stock',
  text: 'Thank you for choosing to be a part of our community at Stock-O-Learn! We are delighted to welcome you aboard. Your decision to join us means a lot, and we are excited about the journey ahead. Feel free to explore the features and offerings on our platform. If you have any questions or need assistance, our team is here to help. Once again, thank you for joining us—we look forward to providing you with a valuable and enjoyable experience. Best regards Stock-O-Learn Team'
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
        // Handle successful creation (e.g., send a success message or redirect)
        console.log("success");
        return res.redirect('back');
    } catch (error){
        // Handle the error (e.g., display an error message or log the error)
        console.error('Error creating form:', error);
        return res.status(500).send('Error creating contact');
    }
});
app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
})
// connecting our database with mongodb server//
  mongoose.connect("mongodb://127.0.0.1:27017/game", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((err) => {
      console.error("Error in connecting to DB");
      console.error(err);
      process.exit(1);
    });

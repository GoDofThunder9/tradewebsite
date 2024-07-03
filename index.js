const express = require('express');
const path = require('path');
const port = 8000;
const mongoose = require('mongoose');
const env = require('dotenv').config();
const Razorpay = require('razorpay');
const app = express();
const Form = require('./models/Form');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { time } = require('console');
const { render } = require('ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));
app.use(express.json());
var instance = new Razorpay({
  key_id: "rzp_test_V0kLTQqsYwa8cT",
  key_secret: "AVBbBBo2Sc6vLo8UAvT7kTqg" , 
});
var instance = new Razorpay({ key_id:"rzp_test_V0kLTQqsYwa8cT", key_secret:"AVBbBBo2Sc6vLo8UAvT7kTqg"})
var options = {
  amount: 50,  // amount in the smallest currency unit
  currency: "INR",
  receipt: "order_rcptid_11"
};
instance.orders.create(options, function(err, order) {
  console.log(order);
});


app.get('/', async function(req, res) {
    try {
      const apiKey = 'D58OB1FVC4P4X5B4'; // Replace with your own API key
      const url3 = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`;
      const response3 = await axios.get(url3);
      const gainer = response3.data["top_gainers"];
      const loser = response3.data["top_losers"];
      console.log(response3.status);
        return res.render('trade', {
            gainer: gainer,
            loser: loser,
        });
    } catch (err) {
        console.error("Error in fetching data from the database:", err);
        return res.status(500).send("Error in fetching data from the database");
    }
});
app.get('/stock', async (req, res) => {
  try {
    const symbol = req.query.symbol;
    const interval = req.query.interval;
    const apiKey = 'D58OB1FVC4P4X5B4'; // Replace with your own API key
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;
    const url1 = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
    const response = await axios.get(url);
    const response1 = await axios.get(url1);
    console.log(response.status);
    console.log(response1.status);
    const lastrefreshed = response.data["Meta Data"]["3. Last Refreshed"];
    const timestamp = response.data[`Time Series (${interval})`];
    const value = timestamp[lastrefreshed];
    const description = response1.data["Description"];
    const Symbol = response1.data["Symbol"];
    return res.render('stock_data', {stockData: response.data,
      lastrefresh: lastrefreshed,
      values: value,
      Description: description,
      symbol:Symbol,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Please use correct name for the data ');
  }
});
app.post('/Join-us', async (req, res) => {
  try {
    // Create form entry in the database
    const form = await Form.create({
      First_name: req.body.First_name,
      Last_name: req.body.Last_name,
      Username: req.body.Username,
      City: req.body.City,
      State: req.body.State,
      Zip: req.body.Zip,
    });

    // Create a transporter using your email credentials
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: 'rishupatil0807@gmail.com',
        pass: 'nrsa axlo ojuz scqv'
      },
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: '21bit048@ietdavv.edu.in',
      to: form.Username,
      subject: 'Welcome To Stock',
      text: 'Thank you for choosing to be a part of our community at Stock-O-Learn! We are delighted to welcome you aboard. Your decision to join us means a lot, and we are excited about the journey ahead. Feel free to explore the features and offerings on our platform. If you have any questions or need assistance, our team is here to help. Once again, thank you for joining us—we look forward to providing you with a valuable and enjoyable experience. Best regards Stock-O-Learn Team'
    });

    console.log("Message sent: %s", info.messageId);
    
    // Send response to the client
    return res.render("trade");

  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
});
app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
})
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


const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

const exphbs = require('express-handlebars');

const express = require('express');
const app = express ();
const stripe = require("stripe")(keySecret);

app.use(express.static('public'))
app.use(require("body-parser").urlencoded({extended: false}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')


app.get("/", (req, res) =>
  res.render('home', {title: "Pay", key: keyPublishable}));

app.post("/charge", (req, res) => {
  let amount = 500;

  stripe.customers.create({
    email: req.body.email,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: "SGD",
         customer: customer.id
    }))
  .then(charge => res.render('success', {title: "Success!"}));
});

app.listen(4567);

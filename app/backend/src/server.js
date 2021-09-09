const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const nodemailer = require('nodemailer');
const requestVulkan = require('request');
const requestDelfi = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const { UserModel } = require('./models/userModel.js');
const { RequestModel } = require('./models/requestModel.js');
const { BookModel } = require('./models/bookModel.js');
const { WishlistModel } = require('./models/wishlistModel.js');
const { OrderModel } = require('./models/orderModel.js');

const { SendmailTransport } = require('nodemailer/lib/sendmail-transport');
const { defaultMaxListeners } = require('nodemailer/lib/mailer');
const { Console, timeLog } = require('console');

mongoose.connect('mongodb://localhost:27017/bazaDiplomski', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
const port = 4000

const URLvulkan = "https://www.knjizare-vulkan.rs/klasici";
const URLdelfi = "https://www.delfi.rs/pretraga?c=1&zanr%5B0%5D=88&stanje=1";

const router = express.Router();

app.use(cors())
app.use(bodyParser.json())

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('mongo open');
});

/*app.get('/', (req, res) => {
  res.send('Hello World!')
})*/

/*app.post('/', (req, res) => {
    res.json({ poruka : req.body.ime });
})*/

function readFromVulkanPage(currentPage) {
  let url = URLvulkan + "/page-" + currentPage;
  requestVulkan(url, function (err, res, body) {
    if (err) {
      console.log(err, "error occured while hitting URL " + url);
    } else {

      let $ = cheerio.load(body);  //loading of complete HTML body

      $('div.wrapper-gridalt-view > div.row > div.item-data').each(function (index) {
        const link = $(this).find('div.img-wrapper > a').attr('href');
        const imgSrc = "https://www.knjizare-vulkan.rs" + $(this).find('div.img-wrapper > a > img').attr('src');
        const title = ($(this).find('div.text-wrapper > div.title > a').attr('title')).toUpperCase();
        const author = $(this).find('div.text-wrapper > div.atributs-wrapper > div.item > span.value > a').attr('title');
        //const description = $(this).find('div.text-wrapper > div.product-description').text();
        let priceLong = $(this).find('div.text-wrapper > div.prices-wrapper > div.current-price').text();
        let price = "";

        for (let i = 0; i < priceLong.length; i++) {
          if (priceLong.charAt(i) >= 0 || priceLong.charAt(i) <= 9) {
            price += priceLong.charAt(i);
            continue;
          }
          if (price.length > 0 && (priceLong.charAt(i) == ',' || priceLong.charAt(i) == '.')) {
            price += priceLong.charAt(i);
            continue;
          }
          if (price.length > 0) {
            break;
          }
        }

        let book = new BookModel({
          link: link,
          imgSrc: imgSrc,
          title: title,
          author: author,
          price: price,
          bookstore: "Vulkan"
        });
        book.save();
      });
    }
  });
}

function readFromDelfiPage(currentPage) {
  let url = URLdelfi + "&page=" + currentPage;
  requestDelfi(url, function (err, res, body) {
    if (err) {
      console.log(err, "error occured while hitting URL " + url);
    } else {
      let $ = cheerio.load(body);  //loading of complete HTML body

      $('div.content-holder > div.col > div.listing-item').each(function (index) {
        const link = $(this).find('div.overlay-container > a').attr('href');
        const imgSrc = $(this).find('div.overlay-container > a > img').attr('src');
        const title = ($(this).find('div.body > div.carousel-book-info > h3 > a').attr('title')).toUpperCase();
        const author = $(this).find('div.body > div.carousel-book-info > p').text();
        //const description = $(this).find('div.text-wrapper > div.product-description').text();
        let priceLong = $(this).find('div.body > div.elements-list > span.price').text();
        let price = "";

        for (let i = 0; i < priceLong.length; i++) {
          if (priceLong.charAt(i) >= 0 || priceLong.charAt(i) <= 9) {
            price += priceLong.charAt(i);
            continue;
          }
          if (price.length > 0 && (priceLong.charAt(i) == ',' || priceLong.charAt(i) == '.')) {
            price += priceLong.charAt(i);
            continue;
          }
          if (price.length > 0) {
            break;
          }
        }

        let book = new BookModel({
          link: link,
          imgSrc: imgSrc,
          title: title,
          author: author,
          price: price,
          bookstore: "Delfi"
        });
        book.save();
      });
    }
  });
}

requestVulkan(URLvulkan, async function (err, res, body) {
  if (err) {
    console.log(err, "error occured while hitting URL");
  } else {
    await BookModel.deleteMany({});

    let $ = cheerio.load(body);  //loading of complete HTML body

    let numOfPages = parseInt($('ul.pagination > li.number > a[rel="last"]').text());

    for (let i = 0; i < numOfPages; i++) {
      readFromVulkanPage(i);
    }

    requestDelfi(URLdelfi, function (err, res, body) {
      if (err) {
        console.log(err, "error occured while hitting URL");
      } else {
        let $ = cheerio.load(body);  //loading of complete HTML body

        let lastPageNumber = 0;
        $('nav.pagination-nav > nav > ul > li.page-item').each(function (index) {
          let currentNumber = $(this).find('a').text();
          lastPageNumber = currentNumber != "›" ? currentNumber : lastPageNumber;
        })

        lastPageNumber = parseInt(lastPageNumber);

        for (let i = 1; i <= lastPageNumber; i++) {
          readFromDelfiPage(i);
        }
        console.log("Fetching finished");
      }
    });
  }
});


app.post('/getUserByUsernamePassword', async (req, res) => {
  const users = await UserModel.find({ 'username': req.body.username });
  const user = users[0];
  if (user) {
    if (user.password != req.body.password) {
      return res.json({ messagePassword: "Uneta lozinka nije odgovarajuća!" });
    }
    return res.json(user);
  }

  return res.json({ messageUsername: "Ne postoji korisnik sa unetim korisničkim imenom!" });
})

app.post('/areUsernameAndEmailUnique', async (req, res) => {
  const usersApproved = await UserModel.find({ 'username': req.body.username });
  const usersPending = await RequestModel.find({ 'username': req.body.username });
  if (usersApproved[0] || usersPending[0]) {
    return res.json({ messageUsername: "Ovo korisničko ime je već u upotrebi!" });
  } else {
    const usersWithEmailApproved = await UserModel.find({ 'email': req.body.email });
    const usersWithEmailPending = await RequestModel.find({ 'email': req.body.email });
    if (usersWithEmailApproved[0] || usersWithEmailPending[0]) {
      return res.json({ messageEmail: "Ovaj e-mail je već u upotrebi!" });
    }
    return res.json({ message: "Slobodno." });
  }
})

app.post('/createNewRequest', async (req, res, next) => {
  console.log(req.body);
  let request = new RequestModel({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    phone: req.body.phone,
    city: req.body.city,
    address: req.body.address,
    type: "user"
  });

  request.save();

  res.json(request);
})

app.post('/saveProfileChanges', async (req, res, next) => {
  let username = req.body.username;
  let name = req.body.name;
  let surname = req.body.surname;
  let address = req.body.address;
  let city = req.body.city;
  let phone = req.body.phone;

  const changedUser = await UserModel.findOneAndUpdate({ 'username': username }, {
    'name': name, 'surname': surname, 'address': address,
    'city': city, 'phone': phone
  }, { new: true });
  return res.json(changedUser);
})

app.post('/changePassword', async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  const changedUser = await UserModel.findOneAndUpdate({ 'username': username }, { 'password': password }, { new: true });
  return res.json(changedUser);
})

app.post('/sendMailConfirmation', async (req, res, next) => {
  let email = req.body.email;
  let emailBody = req.body.emailBody;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bookloversprojectpia@gmail.com',
      pass: 'sifra123'
    }
  });

  let mailOptions = {
    from: 'bookloversprojectpia@gmail.com',
    to: email,
    subject: 'Zahtev za registraciju',
    text: 'Vaš zahtev za registraciju je ' + emailBody + ' !'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.json('Email je poslat');
    }
  });
})

app.get('/getAllRequests', async (req, res, next) => {
  const requests = await RequestModel.find();
  res.json(requests);
})

app.post('/acceptRequest', async (req, res, next) => {
  const requestToAdd = await RequestModel.findOneAndDelete({ _id: req.body._id });
  let request = new UserModel({
    name: requestToAdd.name,
    surname: requestToAdd.surname,
    email: requestToAdd.email,
    username: requestToAdd.username,
    password: requestToAdd.password,
    phone: requestToAdd.phone,
    city: requestToAdd.city,
    address: requestToAdd.address,
    type: "user"
  });

  request.save();
  res.json(request);
})

app.post('/denyRequest', async (req, res, next) => {
  const requestToRemove = await RequestModel.findOneAndDelete({ _id: req.body._id });
  res.json(requestToRemove);
})

app.get('/getAllBooks', async (req, res, next) => {
  const books = await BookModel.find();
  res.json(books);
})

app.post('/addToWishlist', async (req, res, next) => {
  let request = new WishlistModel({
    bookId: req.body.bookId,
    userId: req.body.userId,
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    bookStore: req.body.bookstore,
    link: req.body.link,
    imgSrc: req.body.imgSrc
  });

  request.save();
  res.json(request);
})

app.post('/removeFromWishlist', async (req, res, next) => {
  const bookToRemove = await WishlistModel.findOneAndDelete({ 'title': req.body.title, 'userId': req.body.userId, 'link': req.body.link });
  res.json(bookToRemove);
})

app.get('/getMyWishlist/:userId', async (req, res, next) => {
  let userId = req.params.userId;
  const wishlist = await WishlistModel.find({ 'userId': userId });
  res.json(wishlist);
})

app.get('/searchBooks/:keyword', async (req, res, next) => {
  const regex = new RegExp(req.params.keyword, 'i')

  const books = await BookModel.find({ $or: [{ 'title': { $regex: regex } }, { 'bookstore': { $regex: regex } }, { 'author': { $regex: regex } }] });
  res.json(books);
})

app.post('/order', async (req, res, next) => {
  let order = new OrderModel({
    books: req.body.books,
    userId: req.body.userId,
    price: req.body.price,
    name: req.body.name,
    surname: req.body.surname,
    address: req.body.address,
    city: req.body.city,
    phone: req.body.phone
  });

  order.save();
  res.json(order);
})

app.get('/getMyOrders/:userId', async (req, res, next) => {
  let userId = req.params.userId;
  const orders = await OrderModel.find({ 'userId': userId });
  res.json(orders);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
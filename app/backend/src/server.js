const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const { UserModel } = require('./models/userModel.js');
const { RequestModel } = require('./models/requestModel.js');
const { request } = require('express');

mongoose.connect('mongodb://localhost:27017/bazaDiplomski', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express()
const port = 4000

const router = express.Router();

app.use(cors())
app.use(bodyParser.json())

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongo open');
});

/*app.get('/', (req, res) => {
  res.send('Hello World!')
})*/

/*app.post('/', (req, res) => {
    res.json({ poruka : req.body.ime });
})*/

app.post('/getUserByUsernamePassword', async (req, res) => {
  const users = await UserModel.find({'username' : req.body.username});
  const user = users[0];
  if (user) {
    if (user.password != req.body.password) {
      return res.json({ messagePassword: "Uneta lozinka nije odgovarajuća!"});
    }
    return res.json(user);
  }

  return res.json({ messageUsername: "Ne postoji korisnik sa unetim korisničkim imenom!"});
})

app.post('/areUsernameAndEmailUnique', async (req, res) => {
  const usersApproved = await UserModel.find({'username': req.body.username});
  const usersPending = await RequestModel.find({'username': req.body.username});
  if (usersApproved[0] || usersPending[0]) {
    return res.json({ messageUsername: "Ovo korisničko ime je već u upotrebi!"});
  } else {
    const usersWithEmailApproved = await UserModel.find({'email': req.body.email});
    const usersWithEmailPending = await RequestModel.find({'email': req.body.email});
    if (usersWithEmailApproved[0] || usersWithEmailPending[0]) {
      return res.json({ messageEmail: "Ovaj e-mail je već u upotrebi!"});
    }
    return res.json({ message: "Slobodno."});
  }
})

app.post('/createNewRequest', async (req, res, next) => {
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

  const changedUser = await UserModel.findOneAndUpdate({'username': username}, {'name': name, 'surname': surname, 'address': address, 
                                                                          'city': city, 'phone': phone}, {new: true});
  return res.json(changedUser);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
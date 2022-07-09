var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var User = require("../models/User.js");
var db = mongoose.connection;

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// router.get('/', function(req, res, next) {
//   res.json({
//     "users":[
//       {"id": 123,
//       "name": "Germán Loaiza",
//       "phones": {
//         "home": "555-555-5555",
//         "mobile": "333-333-3333"
//       },
//       "email": [
//         "ger@ger.com.co",
//         "fonso@fonso.com.co"],
//       "dateOfBirth": "1990-06-06T00:00:00:.000Z",
//       "registered": true
//     },
//     {"id": 456,
//       "name": "Gaby Pinto",
//       "phones": {
//         "home": "555-555-5556",
//         "mobile": "333-333-3334"
//       },
//       "email": [
//         "gaby@gaby.com.co",
//         "pinto@pinto.com.co"],
//       "dateOfBirth": "1959-07-22T00:00:00:.000Z",
//       "registered": false
//     }
//   ]
//   });
// });

router.get("/", function (req, res, next) {
  User.find()
    .sort("-creationdate")
    .exec(function (err, users) {
      if (err) res.status(500).send(err);
      else res.status(200).json(users);
    });
});

// router.get('/:id', function(req, res) {
//   if (req.params.id == '123') {
//   res.json({
//       "id": 123,
//       "name": "Germán Loaiza",
//       "phones": {
//         "home": "555-555-5555",
//         "mobile": "333-333-3333"
//       },
//       "email": [
//         "ger@ger.com.co",
//         "fonso@fonso.com.co"],
//       "dateOfBirth": "1990-06-06T00:00:00:.000Z",
//       "registered": true
//     });
//   }else
//   res.status(404).send('Lo siento, el item no se ha encontrado');
//   });

router.get("/:id", function (req, res, next) {
  User.findById(req.params.id, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.status(200).json(userinfo);
  });
});

// //POST de un Nuevo Usuario
// router.post('/', function(req, res) {
//   var new_user = req.body;
//   //ToDo (hacer algo con el nuevo usuario)
//   res.status(200).send('Usuario ' + req.body.name + ' ha sido añadido satisfactoriamente');
// });
router.post("/", function (req, res) {
  User.create(req.body, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

// //PUT de un Nuevo Usuario
// router.put('/:id', function(req, res) {
//   var update_user = req.body;
//   //ToDo (hacer algo con el nuevo usuario)
//   res.status(200).send('Usuario ' + req.body.name + ' ha sido actualizado satisfactoriamente');
//   });
router.put("/:id", function (req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

// //DELETE de un Usuario por su id
// router.delete('/:id', function(req, res) {
//   var update_user = req.body;
//   //ToDo (hacer algo con el nuevo usuario)
//   res.status(200).send('Usuario con id ' + req.params.id + ' ha sido borrado satisfactoriamente');
//   });
router.delete("/:id", function (req, res, next) {
  User.findByIdAndDelete(req.params.id, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

// login usuarios de

router.post("/signin", function (req, res, next) {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) res.status(500).send("Error Comprobando el Usuarios");
    // si e usuario existe...
    if (user != null) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) return next(err);
        // si el password es correcto...
        if (isMatch)
          res
            .status(200)
            .send({ message: "ok", role: user.role, id: user._id });
        else res.status(200).send({ message: "ko" });
      });
    } else res.status(401).send({ message: "ko" });
  });
});

module.exports = router;

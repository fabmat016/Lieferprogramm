// Standard -------------------------------------------------------------------------
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var dbFile = './data.db';
let KundenId = 1;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
app.use(express.static(__dirname))

const port = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var dbExists = fs.existsSync(dbFile);
//-----------------------------------------------------------------------------------
let db = new sqlite3.Database(dbFile);
db.get('PRAGMA foreign_keys = ON; .method column');

// Erststart ===============================================================================
if (!dbExists) {
  console.log(db.run('PRAGMA foreign_keys;'));
  db.run('CREATE TABLE Lieferdaten (Id INTEGER NOT NULL PRIMARY KEY, Filiale TEXT, Verkäufer TEXT, Titel TEXT, Vorname TEXT, Nachname TEXT, Adresse TEXT, PLZ INTEGER, Telefon TEXT, LieferungsNr INTEGER AUTO_INCREMENT, Lieferdatum date, Lieferzeit time, Zahlung TEXT, Zustellgebühr decimal(10,2), Entsorgungsgebühr decimal(10,2), Montagegebühr decimal(10,2), Anzahlung decimal(10,2), Rabatt decimal(10,2), Endpreis decimal(10,2), Anmerkungen TEXT);');
  db.get('PRAGMA foreign_keys = ON;');
  console.log(db.run('PRAGMA foreign_keys;'));
  db.run('CREATE TABLE Ware (Id INTEGER NOT NULL PRIMARY KEY, KundenId INTEGER NOT NULL, Menge INTEGER, Bezeichnung TEXT, Einzelpreis decimal(10,2), Gesamtpreis decimal(10,2), FOREIGN KEY (KundenId) REFERENCES Lieferdaten(Id) ON UPDATE CASCADE ON DELETE CASCADE);');
  console.log(db.run('PRAGMA foreign_keys;'));
  db.run('CREATE TABLE Benutzer (Id INTEGER NOT NULL PRIMARY KEY, Username TEXT, Password TEXT);');
}
// not required: Titel, Lieferzeit





//=======================================================================================
// get ###################################################################################
app.post('/erstellen', function(req, res) {
  var Filiale = req.body.filialen;
  var Verkaeufer = req.body.Verkäuferin;
  var Titel = req.body.titel;
  var Vorname = req.body.vorname;
  var Nachname = req.body.nachname;
  var Adresse = req.body.adresse;
  var PLZ = req.body.PLZ;
  var Telefon = req.body.telnummer;
  var Lieferungdatum = req.body.ldatum;
  var Lieferzeit = req.body.lzeit;
  var Zahlung = req.body.Zahlung;
  var Zustellgebuehr = req.body.Zgebühren;
  var Entsorgungsgebuehr = req.body.Egebühren;
  var Montagegebuehr = req.body.Mgebühren;
  var Anzahlung = req.body.anzahlung;
  var Rabatt = req.body.rabatt;
  var Endpreis = req.body.endbet;
  var Anmerkungen = req.body.comment;
  const Menge = req.body.menge;
  const Bezeichnung = req.body.bezeichnung;
  const Einzelpreis = req.body.einzelp;
  const Gesamtpreis = req.body.result;


  // INSERT-Fälle für Lieferdaten ******************************************************************************
  if (Titel == '' && Lieferzeit == '') {
    var statement = db.prepare('INSERT INTO Lieferdaten (Id, Filiale, Verkäufer, Vorname, Nachname, Adresse, PLZ, Telefon, Lieferdatum, Zahlung, Zustellgebühr, Entsorgungsgebühr, Montagegebühr, Anzahlung, Rabatt, Endpreis, Anmerkungen) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);');
    statement.run(null, Filiale, Verkaeufer, Vorname, Nachname, Adresse, PLZ, Telefon, Lieferungdatum, Zahlung, Zustellgebuehr, Entsorgungsgebuehr, Montagegebuehr, Anzahlung, Rabatt, Endpreis, Anmerkungen);

    statement.finalize();
  }
  else if (Titel == '' && Lieferzeit != '') {
    var statement = db.prepare('INSERT INTO Lieferdaten (Id, Filiale, Verkäufer, Vorname, Nachname, Adresse, PLZ, Telefon, Lieferdatum, Lieferzeit, Zahlung, Zustellgebühr, Entsorgungsgebühr, Montagegebühr, Anzahlung, Endpreis, Rabatt, Anmerkungen) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);');

    statement.run(null, Filiale, Verkaeufer, Vorname, Nachname, Adresse, PLZ, Telefon, Lieferungdatum, Lieferzeit, Zahlung, Zustellgebuehr, Entsorgungsgebuehr, Montagegebuehr, Anzahlung, Rabatt, Endpreis, Anmerkungen);

    statement.finalize();
  }
  else if (Titel != '' && Lieferzeit == '') {
    db.serialize(function() {
      var statement = db.prepare('INSERT INTO Lieferdaten (Id, Filiale, Verkäufer, Titel, Vorname, Nachname, Adresse, PLZ, Telefon, Lieferdatum, Zahlung, Zustellgebühr, Entsorgungsgebühr, Montagegebühr, Anzahlung, Endpreis, Rabatt, Anmerkungen) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);');
      db.close();
      statement.run(null, Filiale, Verkaeufer, Titel, Vorname, Nachname, Adresse, PLZ, Telefon, Lieferungdatum, Zahlung, Zustellgebuehr, Entsorgungsgebuehr, Montagegebuehr, Anzahlung, Rabatt, Endpreis, Anmerkungen);

      statement.finalize();
    })
    
  }
  else {
    var statement = db.prepare('INSERT INTO Lieferdaten (Id, Filiale, Verkäufer, Titel, Vorname, Nachname, Adresse, PLZ, Telefon, Lieferdatum, Lieferzeit, Zahlung, Zustellgebühr, Entsorgungsgebühr, Montagegebühr, Anzahlung, Rabatt, Endpreis, Anmerkungen) ' + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    statement.run(null, Filiale, Verkaeufer, Titel, Vorname, Nachname, Adresse, PLZ, Telefon, Lieferungdatum, Lieferzeit, Zahlung, Zustellgebuehr, Entsorgungsgebuehr, Montagegebuehr, Anzahlung, Rabatt, Endpreis, Anmerkungen);

    statement.finalize();

    //********************************************************************************* 
  }
  // INSERT für Ware $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  if (typeof Menge == typeof []) {
    for (var i = 0; i < Menge.length; i++) {
  var statement = db.prepare('INSERT INTO Ware (Id, KundenId, Menge, Bezeichnung, Einzelpreis, Gesamtpreis) ' +
    'VALUES (?, ?, ?, ?, ?, ?);');

  statement.run(null, KundenId, Menge[i], Bezeichnung[i], Einzelpreis[i], Gesamtpreis[i]);

  statement.finalize();
}
  }
  else {
  var statement = db.prepare('INSERT INTO Ware (Id, KundenId, Menge, Bezeichnung, Einzelpreis, Gesamtpreis) ' +
    'VALUES (?, ?, ?, ?, ?, ?);');

  statement.run(null, KundenId, Menge, Bezeichnung, Einzelpreis, Gesamtpreis);

  statement.finalize();
}

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
KundenId++;
res.redirect("/menü.html");
});

// ##################################################################################



/*db.all('SELECT * FROM Lieferdaten', function(err, rows) {
  rows.forEach(function(row) {
    console.log(row.Id + row.Vorname + row.Nachname);
  });
});

db.run('DELETE FROM Lieferdaten');
*/
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/auth', function(req, res) {
  var username = req.body.username;
  var password = req.body.passwort;
  if (username != null && password != null) {
    db = new sqlite3.Database(dbFile);
    db.get('PRAGMA foreign_keys = ON;');
    db.all('SELECT * FROM Benutzer WHERE username = ? AND password = ?', [username, password], function(error, rows) {
      if (error) throw error;
      console.log(rows);
      if (rows != null && rows != "") {
        res.redirect('/menü.html');
      } else {
        res.send('Falscher Benutzername und/oder Passwort!');
      }
      res.end();
    });
  } else {
    res.send('Bitte Benutzername und Passwort eingeben!');
    res.end();
  }
});
// Ende +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.listen(port, () => console.log(`App listening on port ${port}!`))
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the database connection.');
});
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
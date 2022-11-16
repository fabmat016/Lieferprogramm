var preis = 0;
var gesamtbetrag = 0;
var mitz = 1;
var sqlite3 = require('sqlite3').verbose();

console.log("inside script");


function addEingabe() {
  var table = document.getElementById("interactivwe");
  var row = table.insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);

  cell1.innerHTML = "<input id='meng_"+mitz+"' name='menge' class='form__input_wareneingabe' placeholder='Menge'>";
  cell2.innerHTML = "<input id='bez_"+mitz+"' name='bezeichnung' class='form__input_wareneingabe' placeholder='Bezeichnung'>";
  cell3.innerHTML = "<input id='einp_"+mitz+"' name='einzelp' class='form__input_wareneingabe' placeholder='Einzelpreis' onblur='add_number()'>";
  cell4.innerHTML = "<input type='text' id='txtresult_"+mitz+"' name='result' class='form__input_wareneingabe'>";

  mitz++;
}

function removeEingabe() {
  var table = document.getElementById("interactivwe");
  var row = table.deleteRow(1);
  mitz--;
}

function add_number() {
  // mit einer schleife die ids durchgehen 
  //zwischenpreis die gesamtpreise zaumzählen
  //schleife beendet:
  //preis auf zwischenpreis setzten
  // vor der schleife preis auf 0 setzen -> wegen mehrfachen aufruf
  var m = document.getElementById("meng_");
  var ez = document.getElementById("einp_");
  var first_number = parseFloat(m.value); //parsefloat macht aus string zahl
  if (isNaN(first_number)) first_number = 0; //isnan schaut ob es wirklich eine nummer ist
  var second_number = parseFloat(ez.value);
  if (isNaN(second_number)) second_number = 0;
  var result = first_number * second_number;
  document.getElementById("txtresult").value = result.toFixed(2);
  preis = preis + result;
  document.getElementById("preise").value = preis.toFixed(2);
}

function gesamtpreis() {
  var zg1 = document.getElementById("zugeb");
  var eg1 = document.getElementById("engeb");
  var mg1 = document.getElementById("mogeb");
  var zg = parseFloat(zg1.value);
  var eg = parseFloat(eg1.value);
  var mg = parseFloat(mg1.value);
  if (isNaN(zg)) zg = 0;
  if (isNaN(eg)) eg = 0;
  if (isNaN(mg)) mg = 0;
  gesamtbetrag = preis + zg + eg + mg;
  console.log(gesamtbetrag)
  document.getElementById("ges").value = gesamtbetrag.toFixed(2);
}

function endpreis() {
  var endpreis = 0;
  var anz1 = document.getElementById("anzb");
  var rab1 = document.getElementById("rabb");
  var anz = parseFloat(anz1.value);
  var rab = parseFloat(rab1.value);
  if (isNaN(anz)) anz = 0;
  if (isNaN(rab)) rab = 0;
  endpreis = gesamtbetrag - anz - rab;
  document.getElementById("endb").value = endpreis.toFixed(2);
}

function loadPage() {
  var printpage = window.open("print.html");
  printpage.addEventListener("DOMContentLoaded", function() {
    console.log("listening");
    uebergabe();
  });
}

function loadPage2() {
  var liefern = document.getElementById("liefern").value;
  var lieferd = document.getElementById("lieferd").value;
  if(liefern == "" && lieferd != ""){
    window.open("print2.html");
  }
  if(liefern != "" && lieferd == ""){
    window.open("print.html");
  }
}

// funkt nicht
function uebergabe() {
  var db = new sqlite3.Database("./data.db");

  db.get('SELECT * FROM Lieferdaten WHERE Id = (SELECT MAX(Id) FROM Lieferdaten);', [], function(err, row) {
    if (err) {
      console.log(err);
    }
    else {
     // rows.forEach(function(row) {
        console.log(row);
        this.document.getElementById("titel").innerHTML = row.Titel;
      //});
    }
  });

  //db.transaction(function(tx) {
  /* db.executeSql("SELECT Titel FROM Lieferdaten WHERE Id = (SELECT MAX(Id) FROM Lieferdaten);", [], function(err, row) {
     document.getElementById('titel').innerHTML = "" + row;
   });*/
  //});
}

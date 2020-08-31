var fs = require("fs");
var parse = require("csv-parse");
var transform = require("stream-transform");

var records = [];
var parser = parse({ delimiter: "," });
var input = fs.createReadStream("Jobs.csv");
var transformer = transform(function (record, callback) {
  callback(null, records.push(record));
});

console.time("importTm");
input.pipe(parser).pipe(transformer).pipe(process.stdout);
console.timeEnd("importTm");

setTimeout(function () {
  console.time("transformTm");
  makeItHTML();
  console.timeEnd("transformTm");
}, 2000);

// Iterates through CSV input to create objects containing:
//  - unique dates
//  - jsonRows of roles/individuals per date.
var makeItHTML = function () {
  var offset = 0,
    dates = { s: [], w: [] },
    jsonRows = {};
  for (var i in records) {
    if (i > 0) {
      var r = records[i];
      if (i == 1) {
        if (r[2].indexOf("Wednesday") > -1) {
          offset = 1;
        }
      }
      r = records[i];
      var dt = new Date(r[0]);
      var dte = dt.getTime() / 1000;
      // console.log(dt+' '+dte+' '+r);
      if (dte) {
        dSp = dt.toString().split(" ");
        printDate = dSp[1] + " " + dSp[2];
        // console.log(printDate);
        if (r[2].indexOf("Wednesday") > -1) {
          if (dates.w.indexOf(printDate) === -1) {
            // dates.w.push(dte);
            dates.w.push(printDate);
            console.log("add W " + printDate);
          }
        }
        if (r[2].indexOf("Sunday") > -1) {
          if (dates.s.indexOf(printDate) === -1) {
            // dates.s.push(dte);
            dates.s.push(printDate);
            console.log("add S " + printDate);
          }
        }
        if (jsonRows[printDate] !== undefined) {
          jsonRows[printDate][r[1]] = r[3];
        } else {
          jsonRows[printDate] = {};
          jsonRows[printDate][r[1]] = r[3];
        }
      } // End if reasonable date value exists
    } // End not header Row
  }

  // var outDates = function(inDate){
  //   d=new Date(inDate);
  //   da=d.toDateString().split(' ');
  //   printD=da[1]+' '+da[2];
  //   return printD;
  // };
  // var headRow='';
  // for(var d in dates.s){
  //   sun=dates.s[d];
  //   if(typeof(sun)==='number' & sun !== undefined){
  //     dt=new Date(sun*1000);
  //     dta=dt.toString().split(' ');
  //     dtp=dta[1]+' '+dta[2];
  //     console.log(dtp);
  //     headRow+=','+dtp;
  //   }
  // }
  //
  // var wedRow='';
  // for(var d in dates.w){
  //   wed=dates.w[d];
  //   if(typeof(wed)==='number' & wed !== undefined){
  //     dt=new Date(wed*1000);
  //     dta=dt.toString().split(' ');
  //     dtp=dta[1]+' '+dta[2];
  //     console.log(dtp);
  //     wedRow+=','+dtp;
  //   }
  // }

  roleColFull = {
    row00: "Sunday Morning",
    row01: "Announcements",
    row02: "Lead Singing Sun AM",
    row03: "Opening Prayer AM",
    row04: "Collection Presiding",
    row05: "Lord's Supper AM Presiding",
    row06: "Lord's Supper AM 1",
    row07: "Lord's Supper AM 2",
    row08: "Lord's Supper AM 3",
    row09: "Lord's Supper AM 4",
    row10: "Lord's Supper AM 5",
    row11: "Lord's Supper AM 6",
    row12: "Lord's Supper AM 7",
    row13: "Scripture Reading",
    row14: "Closing Prayer Sun AM",
    row15: "Audio video Sun AM",
    row16: "Usher Left",
    row17: "Usher Center",
    row18: "Usher Right",
    row19: "Sunday Evening",
    row20: "Lead Singing Sun PM",
    row21: "Opening Prayer PM",
    row22: "Scripture Reading PM",
    row23: "Lord's Supper PM Presiding",
    row24: "Lords Supper PM",
    row25: "Closing Prayer Sun PM",
    row26: "Audio video Sun PM",
    row27: "Usher Center PM",
    row28: "Wednesday",
    row29: "Lead Singing Wed",
    row30: "Invitation",
    row31: "Closing Prayer",
    row32: "Audio video wed.",
    row33: "Usher Center Wed",
  };

  rowsFull = {
    row00: ["Sunday Morning"],
    row01: ["Announcements"],
    row02: ["Lead Singing"],
    row03: ["Opening Prayer"],
    row04: ["Collection Presiding"],
    row05: ["LS Presiding"],
    row06: ["LS Serving"],
    row07: ["LS Serving"],
    row08: ["LS Serving"],
    row09: ["LS Serving"],
    row10: ["LS Serving"],
    row11: ["LS Serving"],
    row12: ["LS Serving"],
    row13: ["Scripture Reading"],
    row14: ["Closing Prayer"],
    row15: ["A/V AM"],
    row16: ["Usher Left"],
    row17: ["Usher Center"],
    row18: ["Usher Right"],
    row19: ["Sunday Evening"],
    row20: ["Lead Singing"],
    row21: ["Opening Prayer"],
    row22: ["Scripture Reading"],
    row23: ["LS Presiding"],
    row24: ["LS Serving"],
    row25: ["CLosing Prayer"],
    row26: ["A/V PM"],
    row27: ["Usher Center"],
    row28: ["Wednesday"],
    row29: ["Lead Singing"],
    row30: ["Short Talk*"],
    row31: ["Closing Prayer"],
    row32: ["A/V Wed"],
    row33: ["Usher Center Wed"],
  };

  roleCol = {
    row00: "Sunday Morning - 9AM",
    row01: "0900-Announcements",
    row02: "0900-Singing",
    row03: "0900-OpeningPrayer",
    row04: "0900-LSPresiding",
    row05: "0900-ClosingPrayer",
    row06: "Sunday Morning - 11AM",
    row07: "1100-Announcements",
    row08: "1100-Singing",
    row09: "1100-OpeningPrayer",
    row10: "1100-LSPresiding",
    row11: "1100-ClosingPrayer",
  };

  rows = {
    row00: ["Sunday Morning - 9AM"],
    row01: ["Announcements"],
    row02: ["Song Leading"],
    row03: ["Opening Prayer"],
    row04: ["Lord's Supper Presiding"],
    row05: ["Closing Prayer"],
    row06: ["Sunday Morning - 11AM"],
    row07: ["Announcements"],
    row08: ["Song Leading"],
    row09: ["Opening Prayer"],
    row10: ["Lord's Supper Presiding"],
    row11: ["Closing Prayer"],
  };

  for (r in rows) {
    rNum = parseInt(r.substr(3, 2));
    console.log("rNum", rNum, "\n");
    // if(r === 'row00'){ // For Filling in Sunday Dates
    if (rNum === 0) {
      // For Filling in Sunday Dates
      s = dates.s;
      for (var d in s) {
        rows[r].push(s[d]);
      }
      // } else if (r === 'row22') { // For Filling in Wednesday Dates
    } else if (rNum === 28) {
      // For Filling in Wednesday Dates
      w = dates.w;
      for (var d in w) {
        rows[r].push(w[d]);
      }
    } else {
      // console.log(rows[r][0]+' '+roleCol[r]);
      // if (rNum < 28 && rNum !== 19) {
      if (rNum < 28 && rNum !== 6) {
        var sun = dates.s;
        for (var s in sun) {
          // ds=mmmDDtoDtStr(d,2016)
          console.log(
            "jsonRows[sun[s]][roleCol[r]]",
            jsonRows[sun[s]][roleCol[r]]
          );

          nameEntry =
            jsonRows[sun[s]][roleCol[r]] !== undefined
              ? jsonRows[sun[s]][roleCol[r]]
              : "Song Service";

          // rows[r].push(jsonRows[sun[s]][roleCol[r]]);
          rows[r].push(nameEntry);
        }
      } else if (rNum > 27) {
        var wed = dates.w;
        for (var w in wed) {
          rows[r].push(jsonRows[wed[w]][roleCol[r]]);
        }
      }
    } // for non header rows
  } // for r in rows

  htmlOut =
    "<html><head><link href='https://fonts.googleapis.com/css?family=Quattrocento:400,700' rel='stylesheet' type='text/css'><link href='out.css' rel='stylesheet' type='text/css'></head><body><table>";
  for (r in rows) {
    // console.log(r);
    // if (r !== "row04") {
    htmlOut += "<tr>";
    // console.log('r','\t',r,rows[r])
    for (i in rows[r]) {
      var c = "td";
      e = rows[r];

      // if (r === "row00" || r === "row19" || r === "row28") {
      if (r === "row00" || r === "row06") {
        c = "th";
      }

      if (i === 0) {
        c = 'th class="label"';
      }
      // console.log(c+'\t'+i+'\t'+e[i])
      // console.log(i==0)
      htmlOut += "<" + c + ">" + e[i] + "</" + c + ">";
      // if (r === "row19") {
      if (r === "row06") {
        htmlOut += "<th colspan=" + (rows["row00"].length - 1) + "></th>";
      }
    }
    htmlOut += "</tr>";
    // }
  }
  // htmlOut +=
  //   '</table><span> * - "Short Talk" = 4-5 minutes</span></body></html>';

  htmlOut.replace(/\'/g, '"');

  fs.writeFile("out.html", htmlOut, function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
};

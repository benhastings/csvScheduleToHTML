var fs = require('fs');
var parse = require('csv-parse');
var transform = require('stream-transform');

var records = [];
var parser = parse({delimiter: ','});
var input = fs.createReadStream('Jobs.csv');
var transformer = transform(function(record, callback){
    callback(null, records.push(record));
  });

console.time('importTm');
input.pipe(parser).pipe(transformer).pipe(process.stdout);
console.timeEnd('importTm');

setTimeout(function(){
  console.time('transformTm');
  makeItHTML();
  console.timeEnd('transformTm');
},2000);

// Iterates through CSV input to create objects containing:
//  - unique dates
//  - jsonRows of roles/individuals per date.
var makeItHTML = function(){
  var offset=0, dates={s:[],w:[]}, jsonRows={};
  for(var i in records){
    if(i>0){
      var r=records[i];
      if(i==1){
        if(r[2].indexOf('Wednesday')>-1){
          offset=1;
        }
      }
      r=records[i];
      var dt=new Date(r[0]);
      var dte=dt.getTime()/1000;
      // console.log(dt+' '+dte+' '+r);
      if(dte){
        dSp=dt.toString().split(' ');
        printDate=dSp[1]+' '+dSp[2];
        // console.log(printDate);
        if(r[2].indexOf('Wednesday')>-1){
          if(dates.w.indexOf(printDate)===-1){
            // dates.w.push(dte);
            dates.w.push(printDate);
            console.log('add W '+printDate);
          }
        }
        if(r[2].indexOf('Sunday')>-1){
          if(dates.s.indexOf(printDate)===-1){
            // dates.s.push(dte);
            dates.s.push(printDate);
            console.log('add S '+printDate);
          }
        }
        if(jsonRows[printDate] !== undefined){
          jsonRows[printDate][r[1]]=r[3];
        } else {
          jsonRows[printDate]={};
          jsonRows[printDate][r[1]]=r[3];
        }
      }// End if reasonable date value exists


    }// End not header Row
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

  roleCol={
    'row00':'Sunday Morning',
    'row01':'Announcements',
    'row02':'Lead Singing Sun AM',
    'row03':'Opening Prayer AM',
    'row04':"Lord's Supper AM Presiding",
    'row05':"Lord's Supper AM 1",
    'row06':"Lord's Supper AM 2",
    'row07':"Lord's Supper AM 3",
    'row08':"Lord's Supper AM 4",
    'row09':"Lord's Supper AM 5",
    'row10':"Lord's Supper AM 6",
    'row11':"Lord's Supper AM 7",
    'row12':"Scripture Reading",
    'row13':'Closing Prayer Sun AM',
    'row14':'Audio video Sun AM',
    'row15':'Usher Left',
    'row16':'Usher Center',
    'row17':'Usher Right',
    'row18':'Sunday Evening',
    'row19':'Lead Singing Sun PM',
    'row20':'Opening Prayer PM',
    'row21':'Scripture Reading PM',
    'row22':"Lord's Supper PM Presiding",
    'row23':"Lords Supper PM",
    'row24':'Closing Prayer Sun PM',
    'row25':'Audio video Sun PM',
    'row26':'Usher Center PM',
    'row27':'Wednesday',
    'row28':'Lead Singing Wed',
    'row29':'Invitation',
    'row30':'Closing Prayer',
    'row31':'Audio video wed.',
    'row32':'Usher Center Wed'

  };

  rows={
    row00:["Sunday Morning"],
    row01:["Announcements"],
    row02:["Lead Singing"],
    row03:["Opening Prayer"],
    row04:["LS Presiding"],
    row05:["LS Serving"],
    row06:["LS Serving"],
    row07:["LS Serving"],
    row08:["LS Serving"],
    row09:["LS Serving"],
    row10:["LS Serving"],
    row11:["LS Serving"],
    row12:["Scripture Reading"],
    row13:["Closing Prayer"],
    row14:["A/V AM"],
    row15:["Usher Left"],
    row16:["Usher Center"],
    row17:["Usher Right"],
    row18:["Sunday Evening"],
    row19:["Lead Singing"],
    row20:["Opening Prayer"],
    row21:["Scripture Reading"],
    row22:["LS Presiding"],
    row23:["LS Serving"],
    row24:["CLosing Prayer"],
    row25:["A/V PM"],
    row26:["Usher Center"],
    row27:["Wednesday"],
    row28:["Lead Singing"],
    row29:["Short Talk*"],
    row30:["Closing Prayer"],
    row31:["A/V Wed"],
    row32:["Usher Center Wed"]
  };


  for (r in rows){
    rNum=parseInt(r.substr(3,2));
    console.log('rNum',rNum,'\n')
    // if(r === 'row00'){ // For Filling in Sunday Dates
    if(rNum === 0){ // For Filling in Sunday Dates
      s=dates.s;
      for(var d in s){rows[r].push(s[d]);}
    // } else if (r === 'row22') { // For Filling in Wednesday Dates
    } else if (rNum === 27) { // For Filling in Wednesday Dates
      w=dates.w;
      for(var d in w){rows[r].push(w[d]);}
    } else {
      // console.log(rows[r][0]+' '+roleCol[r]);
      if (rNum<27 && rNum !== 18){
        var sun=dates.s;
        for(var s in sun){
          // ds=mmmDDtoDtStr(d,2016)
          rows[r].push(jsonRows[sun[s]][roleCol[r]]);
            console.log(jsonRows[sun[s]][roleCol[r]]);
        }

      } else if (rNum>27){
        var wed=dates.w;
        for(var w in wed){
          rows[r].push(jsonRows[wed[w]][roleCol[r]]);      }

      }
    } // for non header rows

  } // for r in rows



  htmlOut="<html><head><link href='https://fonts.googleapis.com/css?family=Quattrocento:400,700' rel='stylesheet' type='text/css'><link href='out.css' rel='stylesheet' type='text/css'></head><body><table>";
  for(r in rows){
    htmlOut+='<tr>';
    // console.log('r','\t',r,rows[r])
    for(i in rows[r]){
      var c='td';
      e=rows[r];

      if(r==='row00' || r==='row18'|| r==='row27'){c='th';}

      if(i===0){c='th class="label"';}
      // console.log(c+'\t'+i+'\t'+e[i])
      // console.log(i==0)
      htmlOut+="<"+c+">"+e[i]+"</"+c+">";
      if(r==='row18'){htmlOut+="<th colspan="+(rows['row00'].length-1)+"></th>";}
    }
    htmlOut+='</tr>';
  }
  htmlOut+='</table><span> * - "Short Talk" = 4-5 minutes</span></body></html>';

  htmlOut.replace(/\'/g,'"');

  fs.writeFile("out.html", htmlOut, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  });
}

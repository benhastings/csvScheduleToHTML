var fs = require('fs');
var parse = require('csv-parse');
var transform = require('stream-transform');

var records = [];
var parser = parse({delimiter: ','});
var input = fs.createReadStream('Jobs.csv');
var transformer = transform(function(record, callback){
  // setTimeout(function(){
    // callback(null, record.join(' ')+'\n');
    callback(null, records.push(record));
  });
  // }, 500);
// }, {parallel: 10});
input.pipe(parser).pipe(transformer).pipe(process.stdout);

// console.log(records);
// Function to take mmm dd to mm/dd/yyyy
// var mmmDDtoDtStr = function(d,y){
//   d=d+' '+y;
//   dObj=new Date(d);
//   console.log(dObj);
//   dy=dObj.getDate() < 10 ? '0'+dObj.getDate() :+ dObj.getDate();
//   mn=dObj.getMonth() < 9 ? '0'+(dObj.getMonth()+1) :+ (dObj.getMonth()+1);
//   ds=mn+'/'+dy+'/'+dObj.getFullYear();
//   return ds;
// }

// Iterates through CSV input to create objects containing:
//  - unique dates
//  - jsonRows of roles/individuals per date.

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
          console.log('add W');
        }
      }
      if(r[2].indexOf('Sunday')>-1){
        if(dates.s.indexOf(printDate)===-1){
          // dates.s.push(dte);
          dates.s.push(printDate);
          console.log('add S');
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
  'row21':"Lord's Supper PM Presiding",
  'row22':"Lords Supper PM",
  'row23':'Closing Prayer Sun PM',
  'row24':'Audio video Sun PM',
  'row25':'Wednesday',
  'row26':'Lead Singing Wed',
  'row27':'Invitation',
  'row28':'Closing Prayer',
  'row29':'Audio video wed.'
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
  row21:["LS Presiding"],
  row22:["LS Serving"],
  row23:["CLosing Prayer"],
  row24:["A/V PM"],
  row25:["Wednesday"],
  row26:["Lead Singing"],
  row27:["Invitation"],
  row28:["Closing Prayer"],
  row29:["A/V Wed"]
};


for (r in rows){
  rNum=parseInt(r.substr(3,2));
  // if(r === 'row00'){ // For Filling in Sunday Dates
  if(rNum === 0){ // For Filling in Sunday Dates
    s=dates.s;
    for(var d in s){rows[r].push(s[d]);}
  // } else if (r === 'row22') { // For Filling in Wednesday Dates
  } else if (rNum === 23) { // For Filling in Wednesday Dates
    w=dates.w;
    for(var d in w){rows[r].push(w[d]);}
  } else {
    // console.log(rows[r][0]+' '+roleCol[r]);
    if (rNum<23 && rNum !== 16){
      var sun=dates.s;
      for(var s in sun){
        // ds=mmmDDtoDtStr(d,2016)
        rows[r].push(jsonRows[sun[s]][roleCol[r]]);
          // console.log(jsonRows[sun[s]][roleCol[r]]);
      }

    } else if (rNum>23){
      var wed=dates.w;
      for(var w in wed){
        rows[r].push(jsonRows[wed[w]][roleCol[r]]);      }

    }
  } // for non header rows

} // for r in rows

htmlOut="<html><head><link href='https://fonts.googleapis.com/css?family=Quattrocento:400,700' rel='stylesheet' type='text/css'><link href='out.css' rel='stylesheet' type='text/css'></head><body><table>"
for(r in rows){
  htmlOut+='<tr>';

  for(i in rows[r]){
    var c='td';
    e=rows[r];
    if(r==='row00' || r==='row23'){c='th';}

    if(i==0){c='th class="label"';}
    // console.log(c+'\t'+i+'\t'+e[i])
    // console.log(i==0)
    htmlOut+="<"+c+">"+e[i]+"</"+c+">";
    if(r==='row16'){htmlOut+="<th colspan="+(rows['row00'].length-1)+"></th>";}
  }
  htmlOut+='</tr>';
}
htmlOut+='</table></body></html>';

htmlOut.replace(/\'/g,'"');

console.log(htmlOut)

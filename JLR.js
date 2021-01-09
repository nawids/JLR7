var seconds = 1;
var on = "1";
var off= "0";
var offsetchar = "&nbsp;";
var offset = 1;
var ss = "";
var counter = 0;

var don = "1";
var ddouble = "0";
var doff= "0";

jlr7();
jlr7date();

function jlr7()
{
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    if(h == 0){
        h = 12;
    }
    if(h > 12){
        h = h - 12;
    }
    var face = createArray();
    ss = createSymbolArray();
    face = fillArray(face,h,m);
    face[7][seconds] = on;
    seconds++;
    if(seconds == 4)
    {
        seconds =1 ;
    }

    var printed = printArray(face);
    document.getElementById("jlr7display").innerHTML=printed;
    setTimeout(jlr7, 1000);

}
function createSymbolArray()
{
    //The letters used should be JLR7
    //but 7 is now translated to S(even) due to css limitations
    var s1 = ["J", "L", "R", "S"];
    var s2 = ["S", "J", "L", "J"];
    var s3 = ["L", "J", "S", "R"];
    var s4 = ["R", "S", "J", "S"];
    var ss = [s1,s2,s3,s4,s1,s2,s3,s4];
    return ss;
}
function createArray()
{
    var x = new Array(8);
    for (var i = 0; i < x.length; i++)
    {
        x[i] = new Array(4);
        for (var j = 0; j < x[i].length; j++)
        {
            x[i][j] = off;
        }
    }
    return x;
}
function printArray(array)
{
    var x = array;
    var out = "";
    for (var i = 0; i < x.length; i++)
    {
        if(offset && i%2)
        {
            out = out+ offsetchar;
        }
        for (var j = 0; j < x[i].length; j++)
        {
            var symbol = ss[i][j];
            out = out +"<span>"+
                    "<img width=\"30\" height=\"30\" src=\"images/"+symbol+""+x[i][j]+".png\">"+
                    "&nbsp;</span>";
        }
        out = out + "\n";
    }
    return out;
}
function fillArray(array,h,m)
{
    var q = Math.floor(m/15);
    m = m - (q*15);
    var x = array;
    var out = "";
    for (var i = 0; i < x.length; i++) {
      for (var j = 0; j < x[i].length; j++)
      {
        if(h>0)
        {
            x[i][j] = on;
            h--;
        }
        if(q>0 && i==3)
        {
            x[i][j] = on;
            q--;
        }
        if(m>0 && i==3)
        {
            x[3][3]= on;
        }
        if((m-1)>0 && i>3)
        {
            x[i][j] = on;
            m--;
        }
      }
    }

    return array;
}
function toggleOffset()
{
    if(offset)
    {
        offset = 0;
    }
    else
    {
        offset = 1;
    }
}

function startAnimation()
{

    counter=0;
    animate();
}

function animate()
{
    if(counter < 7)
    {
        counter++;
        var face = createArray();
        face = fillArrayAnimation(face);
        var printed = printArray(face);
        document.getElementById("jlr7display").innerHTML=printed;
        setTimeout(animate, 150);
    }
}
function fillArrayAnimation(array,h,m)
{
    var x = array;
    for (var i = 0; i < x.length; i++)
    {
        for (var j = 0; j < x[i].length; j++)
        {
            var answers = [ on, off];
            var index = Math.floor(Math.random(1,2) * 2);
            x[i][j] = answers[index];
        }
    }
    return array;
}



function jlr7date()
{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!

    var face = createDateArray();
    face = fillDateArray(face,mm,dd);

    var printed = printDateArray(face);
    document.getElementById("jlr7datedisplay").innerHTML=printed;
    //setTimeout(jlr7date, 1000);
}
function createDateArray()
{
    var x = new Array(8);
    for (var i = 0; i < x.length; i++) {
      x[i] = new Array(4);
      for (var j = 0; j < x[i].length; j++)
      {
           x[i][j] = doff;
      }
    }
    return x;
}
function printDateArray(array)
{
    var x = array;
    var out = "";
    for (var i = 0; i < x.length; i++) {
      if(offset && i%2)
      {
        out = out+ offsetchar;
      }
      for (var j = 0; j < x[i].length; j++)
      {
        //out = out +"<span>" +x[i][j]+"</span>";
        var symbol = ss[i][j];
        out = out +"<span>"+
                "<img width=\"30\" height=\"30\" src=\"images/"+symbol+""+x[i][j]+".png\">"+
                "&nbsp;</span>";
      }
      out = out + "\n";
    }
    return out;
}
function fillDateArray(array,mm,dd)
{
    var x = array;
    var out = "";
    for (var i = 0; i < x.length; i++)
    {
        for (var j = 0; j < x[i].length; j++)
        {
            if(mm > 0 && mm<=dd)
            {
                x[i][j] = ddouble;
                dd--;
                mm--;
            }
            else if(dd > 0)
            {
                x[i][j] = don;
                dd--;
            }
        }
    }
    return array;
}


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
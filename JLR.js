let seconds = 1;
let on = "1";
let off = "0";
let offsetchar = "&nbsp;";
let offset = 1;
let ss = "";
let counter = 0;

let don = "1";
let ddouble = "0";

jlr7();
jlr7date();

function jlr7()
{
    let date = new Date();
    let h = date.getHours(); // 0 - 23
    let m = date.getMinutes(); // 0 - 59
    if(h === 0){
        h = 12;
    }
    if(h > 12){
        h = h - 12;
    }
    let face = createArray();
    ss = createSymbolArray();
    face = fillArray(face,h,m);
    face[7][seconds] = on;
    seconds++;
    if(seconds === 4)
    {
        seconds =1 ;
    }

    document.getElementById("jlr7display").innerHTML=printArray(face);
    setTimeout(jlr7, 1000);

}
function createSymbolArray()
{
    //The letters used should be JLR7
    //but 7 is now translated to S(even) due to css limitations
    let s1 = ["J", "L", "R", "S"];
    let s2 = ["S", "J", "L", "J"];
    let s3 = ["L", "J", "S", "R"];
    let s4 = ["R", "S", "J", "S"];
    return [s1, s2, s3, s4, s1, s2, s3, s4];
}
function createArray()
{
    let x = new Array(8);
    for (let i = 0; i < x.length; i++)
    {
        x[i] = new Array(4);
        for (let j = 0; j < x[i].length; j++)
        {
            x[i][j] = off;
        }
    }
    return x;
}
function printArray(array)
{
    let x = array;
    let out = "";
    for (let i = 0; i < x.length; i++)
    {
        if(offset && i%2)
        {
            out = out+ offsetchar;
        }
        for (let j = 0; j < x[i].length; j++)
        {
            let symbol = ss[i][j];
            out = out +"<span>"+
                    "<img width=\"30\" height=\"30\" src=\"images/"+symbol+""+x[i][j]+".png\" alt=\"\">"+
                    "&nbsp;</span>";
        }
        out = out + "\n";
    }
    return out;
}
function fillArray(array,h,m)
{
    let q = Math.floor(m / 15);
    m = m - (q*15);
    let x = array;
    for (let i = 0; i < x.length; i++) {
      for (let j = 0; j < x[i].length; j++)
      {
        if(h>0)
        {
            x[i][j] = on;
            h--;
        }
        if(q>0 && i===3)
        {
            x[i][j] = on;
            q--;
        }
        if(m>0 && i===3)
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
        let face = createArray();
        face = fillArrayAnimation(face);
        document.getElementById("jlr7display").innerHTML=printArray(face);
        setTimeout(animate, 150);
    }
}
function fillArrayAnimation(array)
{
    let x = array;
    for (let i = 0; i < x.length; i++)
    {
        for (let j = 0; j < x[i].length; j++)
        {
            let answers = [on, off];
            let index = Math.floor(Math.random() * 2);
            x[i][j] = answers[index];
        }
    }
    return array;
}

function jlr7date()
{
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!

    let face = createArray();
    face = fillDateArray(face,mm,dd);
    document.getElementById("jlr7date_display").innerHTML=printArray(face);
    setTimeout(jlr7date, 60000);
}

function fillDateArray(array,mm,dd)
{
    let x = array;
    for (let i = 0; i < x.length; i++)
    {
        for (let j = 0; j < x[i].length; j++)
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
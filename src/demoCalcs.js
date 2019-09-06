
function timeFuseLenSingle(w, b)
{
    var walk = w; //in seconds
    var burn = b; //in metres per second
    var constant = 0.3;
    var fuseLen = 0;
    if(walk < 0 || burn < 118){
        fuseLen = 0;
    }
    else{
        fuseLen = Math.floor(walk/burn * 10000); //to prevent JS math bug from affecting 
        fuseLen = Math.floor(fuseLen/10);  //needs to chop it at thousanth
        fuseLen = fuseLen/1000;

        if(fuseLen * 100 - Math.floor(fuseLen * 100) > 0){
            fuseLen = Math.ceil(fuseLen*100);
            fuseLen/=100;
            fuseLen += constant;
            fuseLen = Math.floor(fuseLen * 100);
            fuseLen/=100;
        }
        else{
            
            fuseLen += constant;
            fuseLen = Math.floor(fuseLen * 100);
            fuseLen/=100;
            
        }
    }
   
    return fuseLen;
}

function timeFuseLenMulti(w, b)
{
    var result;
    result = timeFuseLenSingle(w,b);
    if(result * 10 % 10 > 0){
        result = Math.ceil(result*10);
        result/=10;
    }
    return result;
}

function totalTime(fl, bt)
{
    //returns total time in seconds
    var fuseLen, burnTime, temp, total;

    fuseLen = fl;
    burnTime = bt;
    
    temp = fuseLen * burnTime
    total = Math.round(temp);
    if(total < temp){  //total will be rounded down or up. if fuselen x burntime is 
                        //less than the rounded version, then add one to account for rounding rules
        total+=1;
    }
    return total;
    
}

function getMin(fl, bt)
{
    var totalMin;
    var t = totalTime(fl, bt);

    totalMin = Math.floor(t/60);

    return totalMin;
    
}

function getSec(fl, bt)
{
    var sec; 
    var t = totalTime(fl, bt);

    sec = t/60;
    sec = sec - getMin(fl, bt);
    sec *=60;
    sec = Math.ceil(sec);

    return sec;

}


function roundQuarterBlock(n) //used to round c4 to quarter blocks
{
    var temp;
    var num = n;
   
    temp = Math.floor(num);
   
    if(num-temp == 0){
        num = Math.floor(num);
    }
    else if(num-temp > 0 && num-temp <= 0.25){
        num = Math.floor(num);
        num += 0.25;
    }
    else if(num-temp > 0.25 && num-temp <= 0.5){
        num = Math.floor(num);
        num += 0.5;
    }
    else if(num - temp > 0.5 && num - temp <= 0.75){
        num = Math.floor(num);
        num += 0.75;
    }
    else if(num-temp > 0.75){
        num = Math.floor(num);
        num += 1;
    }
    
    return num;
}


function calcCx(t)
{
    var cx;
    var thickness = t;
    cx = ((thickness * thickness) / 380) * 50;
    cx = cx*100;
    cx = Math.floor(cx) / 100;

    if(cx < 1){
        cx = 1;
    }
    
    cx = roundQuarterBlock(cx);
    

    return cx;
}

function iBeamCalcC(t, lc)

{
    var lc, c;
    var cx = calcCx(t);
    c = (lc/28) * cx;
    c = roundQuarterBlock(c);

    return c;
}

function convertBlocks(w)
{
    var weight = w;
    var block = weight/0.56;
    block = roundQuarterBlock(block);
    
    return block;
}
function steelBar(c)
{
    var circum = c;
    var chrgSize = (c*c)/550;
    chrgSize *= 100;

    chrgSize = Math.round(chrgSize);
    chrgSize /= 100;

    return chrgSize;

}




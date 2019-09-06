
function createBody()
{
    var mainpage = document.getElementById("mainpage");
    var div = document.createElement("div");
    div.id = "body";
    mainpage.appendChild(div);
}

function clear()
{
    var mainpage = document.getElementById("mainpage");
    while(mainpage.firstChild){
        mainpage.removeChild(mainpage.firstChild);
    }

    return mainpage;
}

function clearBody()
{
    var body = document.getElementById("body");
    while(body.firstChild){
        body.removeChild(body.firstChild);
    }

    return body;
}

function timeFuse()
{
    clear();
    var title = document.getElementById("mainpage");
    var h1 = document.createElement('h1');
    var single = document.createElement('button');
    var double = document.createElement('button');
    single.id = "singleButton";
    double.id = "multiButton";

    h1.innerHTML = "Time Fuse";
    single.innerHTML = "Single Shot";
    double.innerHTML = "Multi Shot";

    title.appendChild(h1);
    title.appendChild(single);
    title.appendChild(double);
}


function loadInput()
{
    var body = document.getElementById('body');
    var div = document.createElement('div');
    div.class = "calcInput";
    
    var WTinput = document.createElement('input');
    WTinput.placeholder = "Walk time";
    WTinput.id = "WTinput"

    var BTinput = document.createElement('input');
    BTinput.placeholder = "Burn time";
    BTinput.id = "BTinput"

    var button = document.createElement('button');
    button.id = "calculateButton";
    button.innerHTML = "Calculate";

    div.appendChild(WTinput);
    div.appendChild(BTinput);
    div.appendChild(button);
    body.appendChild(div);

}

function singleShotClick()
{
    var body = document.getElementById("body");
    var button = document.getElementById("singleButton");

    var loadDesc = function()
    {
        clearBody();
        var desc = document.createElement("p");
        var div = document.createElement('div');
        div.id = "singleDesc";
        desc.innerHTML = "Enter in details for single shot time fuse calculation";
        div.appendChild(desc);
        body.appendChild(div);

    }

    button.addEventListener("click", loadDesc);
    button.addEventListener("click", loadInput);
    button.addEventListener("click", calculateClickSingle);

}

function multiShotClick()
{
    var body = document.getElementById("body");
    var button = document.getElementById("multiButton");
    
    var loadDesc = function()
    {
        clearBody();
        var desc = document.createElement("p");
        var div = document.createElement('div');
        div.id = "multiDesc";
        desc.innerHTML = "Enter in details for multi shot time fuse calculation";
        div.appendChild(desc);
        body.appendChild(div);
        
    }

    button.addEventListener("click", loadDesc);
    button.addEventListener("click", loadInput);
    button.addEventListener("click", calculateClickMulti);
}

function calculateSingle()
{
    var WT = document.getElementById("WTinput");
    var BT = document.getElementById("BTinput");
    
    var walkTime = WT.value;
    var burnTime = BT.value;

    return timeFuseLenSingle(walkTime, burnTime);
}

function calculateMulti()
{
    var WT = document.getElementById("WTinput");
    var BT = document.getElementById("BTinput");
    
    var walkTime = WT.value;
    var burnTime = BT.value;

    return timeFuseLenMulti(walkTime, burnTime);
}

function calculateClickSingle()
{
    var x = document.getElementById('calculateButton');
   // x.addEventListener("click", clearFlStatement);
    x.addEventListener("click", clearTTStatement);
    x.addEventListener("click", calculateSingle);
    x.addEventListener("click", displayFuseLenSingle);
}

function displayFuseLenSingle()
{
    var fl = calculateSingle();
    var BT = document.getElementById("BTinput");
    var burnTime = BT.value;

    var body = document.getElementById("body");
    var div = document.createElement('div');
    var p = document.createElement('p');
    p.id = "lenFuseStatement";
    p.innerHTML = "Length of fuse for single shot: " + fl + "m";
    div.appendChild(p);
    body.appendChild(div);
    displayTotalTime(fl, burnTime);
}

function calculateClickMulti()
{
    var x = document.getElementById('calculateButton');
    x.addEventListener("click", calculateMulti);
    x.addEventListener("click", displayFuseLenMulti);
}


function displayFuseLenMulti()
{
    var fl = calculateMulti();
    var BT = document.getElementById("BTinput");
    var burnTime = BT.value;

    var body = document.getElementById("body");
    var div = document.createElement('div');
    var p = document.createElement('p');
    p.innerHTML = "Length of fuse for first multi shot: " + fl + "m";
    div.appendChild(p);
    body.appendChild(div);
    displayTotalTime(fl, burnTime);
}

function displayTotalTime(fl, bt)
{
    //grab fuselen, and bt from input field. then run through this.

    var total, min, sec;
    total = totalTime(fl, bt);
    min = getMin(fl, bt);
    sec = getSec(fl, bt);

    var body = document.getElementById("body");
    var div = document.createElement('div');
    var p = document.createElement('p');
    p.id ="totalTimeStatement";
    p.innerHTML = "The total time is " + total + " seconds or " + min + " minutes and " + sec + " seconds.";
    div.appendChild(p);
    body.appendChild(div);
    
}

function clearFlStatement()
{
    var flSt = document.getElementById("lenFuseStatement");
    while(flSt.firstChild){
        flSt.removeChild(flSt.firstChild);
    }

    return flSt;

}

clearTTStatement = () =>
{
    var tSt = document.getElementById("totalTimeStatement");
    if(tSt.firstChild){
        while(tSt.firstChild){
            tSt.removeChild(tSt.firstChild)
        }
        
    }
    return tSt;
}
function start()
{
    timeFuse();
    createBody();
    singleShotClick();
    multiShotClick();
    
    
}


window.onload = start();
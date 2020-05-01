module.exports.timeFuseLenSingle = function(w, b) {
  let walk = w; //in seconds
  let burn = b; //in metres per second
  let constant = 0.3;
  let fuseLen = 0;
  if (walk <= 0 || burn < 118) {
    fuseLen = 0;
  } else {
    fuseLen = Math.floor((walk / burn) * 10000); //to prevent JS math bug from affecting
    fuseLen = Math.floor(fuseLen / 10); //needs to chop it at thousanth
    fuseLen = fuseLen / 1000;

    if (fuseLen * 100 - Math.floor(fuseLen * 100) > 0) {
      fuseLen = Math.ceil(fuseLen * 100);
      fuseLen /= 100;
      fuseLen += constant;
      fuseLen = Math.floor(fuseLen * 100);
      fuseLen /= 100;
    } else {
      fuseLen += constant;
      fuseLen = Math.floor(fuseLen * 100);
      fuseLen /= 100;
    }
  }
  return fuseLen;
};

module.exports.timeFuseLenMulti = function(w, b) {
  var result;
  result = module.exports.timeFuseLenSingle(w, b);
  if ((result * 10) % 10 > 0) {
    result = Math.ceil(result * 10);
    result /= 10;
  }
  return result;
};

module.exports.totalTime = function(fl, bt) {
  //returns total time in seconds
  var fuseLen, burnTime, temp, total;

  fuseLen = fl;
  burnTime = bt;

  temp = fuseLen * burnTime;
  total = Math.round(temp);
  if (total < temp) {
    //total will be rounded down or up. if fuselen x burntime is
    //less than the rounded version, then add one to account for rounding rules
    total += 1;
  }
  return total;
};

module.exports.getMin = function(fl, bt) {
  var totalMin;
  var t = totalTime(fl, bt);

  totalMin = Math.floor(t / 60);

  return totalMin;
};

module.exports.getSec = function(fl, bt) {
  var sec;
  var t = totalTime(fl, bt);

  sec = t / 60;
  sec = sec - getMin(fl, bt);
  sec *= 60;
  sec = Math.ceil(sec);

  return sec;
};

module.exports.roundQuarterBlock = function(
  n //used to round c4 to quarter blocks
) {
  var temp;
  var num = n;

  temp = Math.floor(num);

  if (num - temp == 0) {
    num = Math.floor(num);
  } else if (num - temp > 0 && num - temp <= 0.25) {
    num = Math.floor(num);
    num += 0.25;
  } else if (num - temp > 0.25 && num - temp <= 0.5) {
    num = Math.floor(num);
    num += 0.5;
  } else if (num - temp > 0.5 && num - temp <= 0.75) {
    num = Math.floor(num);
    num += 0.75;
  } else if (num - temp > 0.75) {
    num = Math.floor(num);
    num += 1;
  }

  return num;
};

module.exports.calcCx = function(t) {
  var cx;
  var thickness = t;
  cx = ((thickness * thickness) / 380) * 50;
  cx = cx * 100;
  cx = Math.floor(cx) / 100;

  if (cx < 1) {
    cx = 1;
  }

  cx = module.exports.roundQuarterBlock(cx);

  return cx;
};

module.exports.iBeamCalcC = function(t, lc) {
  var lc, c;
  var cx = calcCx(t);
  c = (lc / 28) * cx;
  c = module.exports.roundQuarterBlock(c);

  return c;
};

module.exports.convertBlocks = function(w) {
  var weight = w;
  var block = weight / 0.56;
  block = module.exports.roundQuarterBlock(block);

  return block;
};
module.exports.steelBar = function(c) {
  var chrgSize = (c * c) / 550;
  chrgSize *= 100;

  chrgSize = Math.round(chrgSize);
  chrgSize /= 100;

  return chrgSize;
};

module.exports.steelCable = function(c) {
  var chrgSize = (c * c) / 450;
  chrgSize *= 100;

  chrgSize = Math.round(chrgSize);
  chrgSize /= 100;

  return chrgSize;
};

var userpot = 1000;
var bets= {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0};
window.onload = function(){
    document.querySelectorAll('.betIncrementer').forEach(function(i){
    i.addEventListener("click",function(el){
        incrementBets(el);
    });
    });
    setHighScore();
}   
function playGame(){
    if(!areBetsValid()) return;
    var totalBets = betsTotal(bets);
    userpot = userpot - totalBets;
    calculateWinnings(playDice(), bets);
    gtag('event', 'play', {
        'event_category': 'Game'
      });
      ga('rollTracker.send', 'S2Testing');
      
}
function betsTotal(bets){
    return Object.values(bets).reduce((acc,cur)=>acc+cur); //combo of all bets;
}

function playDice(){
    var dice1 = getRandomInt(1,7);
    var dice2 = getRandomInt(1,7);
    var results = [];
    results.push(dice1);
    results.push(dice2);
    displayDiceGif(results);
    return results;
}
function displayDiceGif(results){
    console.log(results);
/*
    document.querySelector('.newsReel').innerHTML = `<h3>Dice Values are ${results[0]}, ${results[1]}</h3>`;
    document.querySelectorAll(".dice-container div").forEach(function(el,ind){
        el.className="die"+results[ind];
    }); */
    document.querySelectorAll(".die1 img").forEach(i=>{
        if(i.style.display!="none"){i.style.display ="none";
  window.setTimeout(()=>{document.querySelector(".die1 .d"+results[0]).style.display = "inline-block";},100) //for animation effect. not happening for same dice values if not delayed.
    }
    });
    document.querySelectorAll(".die2 img").forEach(i=>{
        if(i.style.display!="none"){ i.style.display ="none";
        window.setTimeout(()=>{document.querySelector(".die2 .d"+results[1]).style.display = "inline-block";},100) 
    }
    });
    playDiceSound();
}
function playDiceSound(){
    var s = document.getElementById("diceSound");
    s.pause(); //not playing when already in progress - clicked twice etc
    s.currentTime = 0;
    s.play();
}
function calculateWinnings(diceResults, bets){
    var dice1 = diceResults[0];
    var dice2 = diceResults[1];
    var winnings = (bets[dice1] * 2) + (bets[dice2] * 2);
    userpot = userpot + winnings;
    if(winnings){
        document.querySelector('.newsReel').innerHTML = `<h3>You won ${winnings}</h3>`;    
        if(window && window.localStorage){
            if(!window.localStorage["highScore"] || window.localStorage["highScore"] < userpot) window.localStorage["highScore"] = winnings;
        }
    }
    document.querySelector('.userpot').innerText = userpot;
    clearBets();
    if(userpot == 0) gameOver();
}
function setHighScore(){
    if(window && window.localStorage && window.localStorage["highScore"]) document.querySelectorAll('.highScore').forEach(function(i){
i.innerText = window.localStorage["highScore"];
    })
}
function gameOver(){
    /*
    document.querySelector('.newsReel').innerHTML = "<h2>Game Over</h2>";
    document.querySelector('.playgame.btn').setAttribute("disabled","disabled");
    */
   setHighScore();
   showOverlay();
}
function startOver(){
    userpot = 1000;
    setHighScore();
    clearBets();
    document.querySelector('.userpot').innerText = userpot;
    document.querySelector('.newsReel').innerHTML = "<h2>New Game</h2>";
    document.querySelector('.playGame.btn').removeAttribute("disabled");
}
function clearBets(){
    Object.keys(bets).forEach(i=>{
        var query = "input.betValue_"+i;
        document.querySelector(query).value = "";
    });
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function incrementBets(el){
    if(!areBetsValid()) return;
    var amount = el.target.attributes["increment"]["value"];
    var card = el.target.attributes["card"]["value"];
    var inputField = ".betValue_" + card;
    document.querySelector(inputField).value = Number(document.querySelector(inputField).value) + Number(amount);
    if(!areBetsValid()){
    document.querySelector('.newsReel').innerHTML = "<h3>You don't have enough cash to increase the bet!</h3>";
        document.querySelector(inputField).value = Number(document.querySelector(inputField).value) - Number(amount);
        if(document.querySelector(inputField).value == 0) document.querySelector(inputField).value = "";
    }
}
function areBetsValid(){
    Object.keys(bets).forEach(i=>{
        var query = "input.betValue_"+i;
        var betValue = document.querySelector(query).value;
        bets[i] = Number(betValue);
    });
    var totalBets = betsTotal(bets);
    if(isNaN(totalBets)){
        document.querySelector('.newsReel').innerHTML = "<h3>Please enter valid bet Amount</h3>";
        return false;    
    }
    if(userpot < totalBets){
    document.querySelector('.newsReel').innerHTML = "<h3>You don't have enough cash! Please reduce the bet</h3>";
    return false;    
    }
    return true;
}
function showOverlay(){
    document.querySelector(".overlay").style.display = "block";
}
function hideOverlay(){
    document.querySelector(".overlay").style.display = "none";
}
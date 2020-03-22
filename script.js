var userpot = 1000;
var bets= {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0};
window.onload = function(){
    document.querySelector('.betIncrementer').addEventListener("click",function(el){
        console.log(el.target.className);
        console.log(el.target.parentNode);
    });
}   
function playGame(){
    document.querySelector(".die1").style.backgroundImage = "";
    document.querySelector(".die2").style.backgroundImage = "";
    Object.keys(bets).forEach(i=>{
        var query = "input.betValue_"+i;
        var betValue = document.querySelector(query).value;
        bets[i] = Number(betValue);
    });
    var totalBets = betsTotal(bets);
    if(userpot < totalBets){
    document.querySelector('.newsReel').innerHTML = "<h3>You don't have enough cash! Please reduce the bet</h3>";
    return;    
    }
    else userpot = userpot - totalBets;
    calculateWinnings(playDice(), bets);
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
    document.querySelector('.newsReel').innerHTML = `<h3>Dice Values are ${results[0]}, ${results[1]}</h3>`;
  /*  document.querySelectorAll(".dice-container div").forEach(function(el,ind){
       // el.className="die"+results[ind];
    }); */
    document.querySelector(".die1").style.backgroundImage = "url('./assets/dice_" + results[0] +".png')";
    document.querySelector(".die2").style.backgroundImage = "url('./assets/dice_" + results[1] +".png')";

}
function calculateWinnings(diceResults, bets){
    var dice1 = diceResults[0];
    var dice2 = diceResults[1];
    var winnings = (bets[dice1] * 2) + (bets[dice2] * 2);
    userpot = userpot + winnings;
    document.querySelector('.userpot').innerText = userpot;
    clearBets();
    if(userpot == 0) gameOver();
}
function gameOver(){
    document.querySelector('.newsReel').innerHTML = "<h2>Game Over</h2>";
    document.querySelector('.playgame.btn').setAttribute("disabled","disabled");
}
function startOver(){
    userpot = 1000;
    clearBets();
    document.querySelector('.userpot').innerText = userpot;
    document.querySelector('.newsReel').innerHTML = "<h2>New Game</h2>";
    document.querySelector('.playGame.btn').removeAttribute("disabled");
}
function clearBets(){
    Object.keys(bets).forEach(i=>{
        var query = "input.betValue_"+i;
        document.querySelector(query).value = "0";
        
    });
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
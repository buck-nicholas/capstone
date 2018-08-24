import * as firebase2 from 'firebase'
import firebase from '@firebase/app';
import '@firebase/auth';

export function ScoreBoardInit(gameKey){
    database = firebase2.database();
    firebase2.database().ref('games/' + gameKey).update({
        playerOneScore: 501,
        playerOneDarts: 'No Darts Thrown',
        playerOneRegisteredDarts: 0,
        PlayerOnePointsPerDart: 0,
        playerTwoScore: 501,
        playerTwoDarts: 'No Darts Thrown',
        playerTwoRegisteredDarts: 0,
        PlayerTwoPointsPerDart: 0,
        PlayerTurn: 'Player One'
    })
}

export function ScoreUpdate(gameDart,gameKey){

    database = firebase2.database();
    var ref = database.ref('games');

    let dartValue = DartCalculator(gameDart);

    ref.once('value', snapshot => {
        var games = []
        snapshot.forEach(function(data) {
            let result = data.val();
            result['key'] = data.key;
            if(result.key == gameKey){
                games.push(result);
            }
        })
        myGame = games[0];
        if(myGame.PlayerTurn == 'Player One'){
            if( myGame.playerOneScore - dartValue === 1){
                resetPointsTotal = playerOneDarts.reduce(function(a, b) {return a + b})
                newPPD = PointsPerDartCalculator((myGame.playerOneScore + resetPointsTotal), (myGame.playerOneRegisteredDarts - myGame.playerOneDarts.length))
                firebase2.database().ref('games/' + gameKey).update({
                    playerOneScore: myGame.playerOneScore + resetPointsTotal,
                    PlayerTurn: 'Player Two',
                    PlayerOnePointsPerDart: newPPD,
                })
                return;
            }
            if(myGame.playerOneDarts == 'No Darts Thrown'){
                dartArray = [dartValue]
            }
            else if(myGame.playerOneDarts.length == 3){
                dartArray = [dartValue]
            }
            else{
                dartArray = myGame.playerOneDarts;
                dartArray.push(dartValue);
            }
            newScore = myGame.playerOneScore - dartValue;
            newRegisteredDarts = myGame.playerOneRegisteredDarts + 1;
            newPPD = PointsPerDartCalculator(newScore, newRegisteredDarts)
            turnValue = (dartArray.length == 3) ? 'Player Two' : 'Player One';
            firebase2.database().ref('games/' + gameKey).update({
                playerOneDarts: dartArray,
                playerOneScore: newScore,
                PlayerTurn: turnValue,
                playerOneRegisteredDarts: newRegisteredDarts,
                PlayerOnePointsPerDart: newPPD,
            })
            if(newScore == 0){
                alert("Game Over Pre Process")
                ProcessGameEnd(gameKey);}
        }
        else{
            if( myGame.playerTwoScore - dartValue == 1){
                resetPointsTotal = playerTwoDarts.reduce(function(a, b) {return a + b})
                newPPD = PointsPerDartCalculator((myGame.playerTwoScore + resetPointsTotal), (myGame.playerTwoRegisteredDarts - myGame.playerTwoDarts.length))
                firebase2.database().ref('games/' + gameKey).update({
                    playerTwoScore: myGame.playerTwoScore + resetPointsTotal,
                   PlayerTurn: 'Player One',
                    playerTwoPointsPerDart: newPPD,
                })
                return;
            }
            if(myGame.playerTwoDarts == 'No Darts Thrown'){
                dartArray = [dartValue]
            }
            else if(myGame.playerTwoDarts.length == 3){
                dartArray = [dartValue]
            }
            else{
                dartArray = myGame.playerTwoDarts;
                dartArray.push(dartValue);
            }
            newScore = myGame.playerTwoScore - dartValue;
            newRegisteredDarts = myGame.playerTwoRegisteredDarts + 1;
            // newRegisteredDarts = newRegisteredDarts.toString();
            newPPD = PointsPerDartCalculator(newScore, newRegisteredDarts)
            turnValue = (dartArray.length == 3) ? 'Player One' : 'Player Two';
            firebase2.database().ref('games/' + gameKey).update({
                playerTwoDarts: dartArray,
                playerTwoScore: newScore,
                PlayerTurn: turnValue,
                playerTwoRegisteredDarts: newRegisteredDarts,
                playerTwoPointsPerDart: newPPD,
            })
            if(newScore == 0){
                alert("Game Over Pre Process")
                ProcessGameEnd(gameKey);}
        }
    })
}

function DartCalculator(dartObj){
    dartValue = '';
    if(dartObj.Number == 'Bull'){
        if(dartObj.Type == 'Single'){
            dartValue = 25;
            return dartValue;
        }
        else{
            dartValue = 50;
            return dartValue;
        }
    }
    switch(dartObj.Type) { 
        case 'Single':
            dartValue = dartObj.Number;
        break;
        case 'Double':
            dartValue = dartObj.Number * 2;
        break;
        case 'Triple':
            dartValue = dartObj.Number * 3;
        break;
    }
    // alert('501-101: ' + dartValue)
    return dartValue;
}

function ProcessGameEnd(currentGame){
    database = firebase2.database();
    var ref = database.ref('games');
    ref.once('value', snapshot => {
        var games = []
        snapshot.forEach(function(data) {
            let result = data.val();
            result['key'] = data.key;
            if(result.key == currentGame){
                games.push(result);
            }
        })
        myGame = games[0];
        winner = (myGame.playerOneScore == 0) ? myGame.playerOne : myGame.playerTwo;
        firebase2.database().ref('games/' + currentGame).update({ // Update and Set Winner
            gameState: 'Completed',
            gameWinner: winner,
        })
        UpdatePPDTable(myGame)
    })
    alert("Game Over")
}

function UpdatePPDTable(myGame){
    pOneId = myGame.playerOne;
    pTwoId = myGame.playerTwo;
    database = firebase2.database();
    var ref = database.ref('stats/ppdRank');
    ref.once('value', snapshot => {
        var players = []
        snapshot.forEach(function(data) {
            let result = data.val();
            result['key'] = data.key;
            players.push(result);
        })
        if(players.includes(pOneId)){
            newAvg = (players[players.indexOf(pOneId)].ppdAvg + myGame.PlayerOnePointsPerDart) / 2;
            firebase2.database().red('stats/ppdRank' + pOneId).update({
                ppdAvg: newAvg,
            })
        }
        else{
            firebase2.database().red('stats/ppdRank' + pOneId).set({
                ppdAvg: myGame.PlayerOnePointsPerDart,
            })
        }
    })
    ref.once('value', snapshot => {
        var players = []
        snapshot.forEach(function(data) {
            let result = data.val();
            result['key'] = data.key;
            players.push(result);
        })
        if(players.includes(pTwoId)){
            newAvg = (players[players.indexOf(pTwoId)].ppdAvg + myGame.PlayerTwoPointsPerDart) / 2;
            firebase2.database().red('stats/ppdRank' + pTwoId).update({
                ppdAvg: newAvg,
            })
        }
        else{
            firebase2.database().red('stats/ppdRank' + pTwoId).set({
                ppdAvg: myGame.PlayerTwoPointsPerDart,
            })
        }
    })
}

function PointsPerDartCalculator(currentScore, dartsRegistered){
    pointsEarned = 501 - currentScore;
    pointsPerDart = pointsEarned / dartsRegistered;
    pointsPerDart = pointsPerDart.toFixed(2);
    return pointsPerDart;
}
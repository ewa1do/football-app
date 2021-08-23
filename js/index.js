'use strict';

// fake database which i'm use to receive the data
const teamsDB = [
    { name: 'Manchester United', },
    { name: 'Manchester City', },
    { name: 'Liverpool FC', },
    { name: 'Chelsea FC', },
    { name: 'Arsenal FC', },
    { name: 'Everton FC', },
    { name: 'West Ham United', },
    { name: 'Leicester City', },
    { name: 'Tottenham Hotspur', },
    { name: 'Watford FC', },
];

// Array i'm gonna use to store the matches obj
const matches = [];

// variables for the table
const teamTable = document.querySelector('.team--table');
const teamEl = document.querySelector('.team');

const localTeam = document.querySelector('#team-local');
const visitTeam = document.querySelector('#team-visitor');

const localScore = document.querySelector('#local-score');
const visitScore = document.querySelector('#visitor-score');

const btnPlay = document.querySelector('#btn-play');

// variables for the weeks feature
const selectWeek = document.querySelector('#select-weeks');
const weekBtn = document.querySelector('#display-week');
const matchesDiv = document.querySelector('.matches');

localScore.value = 0;
visitScore.value = 0;
selectWeek.value = 1; 


class Team {
    constructor (GP, W, D, L, GF, GA, GD, PTS, ID) {
        this.GP = GP;
        this.W = W;
        this.D = D;
        this.L = L;
        this.GF = GF;
        this.GA = GA;
        this.GD = GD;
        this.PTS = PTS;
        this.ID = ID;
    }

    static setTeams (db) {
        db.forEach((team, i) => {
            team.GP = 0;
            team.W = 0;
            team.D = 0;
            team.L = 0;
            team.GF = 0;
            team.GA = 0;
            team.GD = 0;
            team.PTS = 0;
            team.ID = i + 1;
        });
    }

    static addGamePlayed (team) {
        team.GP++;
    } 

    static winnerStats (winner, winnerScore, loserScore) {
        winner.W += 1;
        winner.PTS += 3;
        winner.GF += winnerScore;
        winner.GA += loserScore;
        winner.GD = winner.GF - winner.GA;
    };
    
    static loserStats (loser, winnerScore, loserScore) {
        loser.L += 1;
        loser.GF += loserScore;
        loser.GA += winnerScore;
        loser.GD = loser.GF - loser.GA;
    };
    
    static drawStats (team, teamScore, otherTeamScore) {
        team.D++;
        team.GF += teamScore;
        team.GA += otherTeamScore;
        team.GD = team.GF - team.GA;
        team.PTS++;
    };

    // callback function to use into the sort method
    static compareTeams (team1, team2) {
        if (team1.PTS > team2.PTS) {
            return -1;
        }
        if (team1.PTS < team2.PTS) {
            return 1;
        }
        // if both teams have the same points then sort using the goal difference
        if ((team1.PTS === team2.PTS) && (team1.GD > team2.GD)) {
            return -1
        } 
        
        if ((team1.PTS === team2.PTS) && (team1.GD < team2.GD)) {
            return 1
        } 
    
        // if both teams have the same points and the same goal difference sort by goals on favor
        if (team1.GD === team2.GD) {
            if (team1.GF > team2.GF) return -1;
            else return 1;
        }
        
        return 0;
    };
    
}


class UI {
    static displayTeamsTable (arr) {
        // remove the existent <tr> of the html
        document.querySelector('.team').classList.add('remove');

        for (const [i, obj] of arr.entries()) {
            const output = `
            <tr class='team'>
                <td class='position'>${i + 1}</td>
                <td class='team--name'>${obj.name}</td>
                <td class='GP'>${obj.GP}</td>
                <td class='W'>${obj.W}</td>
                <td class='D'>${obj.D}</td>
                <td class='L'>${obj.L}</td>
                <td class='GF'>${obj.GF}</td>
                <td class='GA'>${obj.GA}</td>
                <td class='GD'>${obj.GD}</td>
                <td class='PTS'>${obj.PTS}</td>
            </tr>
            `;
            teamTable.insertAdjacentHTML('beforeend', output);
        }
    }

    static updateTeamsTable () {
        // Remove existent table
        for (let i = 1; i < teamTable.children.length; i++) {
            teamTable.children[i].classList.add('remove');
        }

        // Display new table
        UI.displayTeamsTable(teamsDB);
    }

    static displayTeamsSelect (element, arr) {
        arr.forEach((obj) => {
            const option =  `<option value="${obj.name}">${obj.name}</option>`;
            element.insertAdjacentHTML('beforeend', option);
        });
    }

    // this function fix the bug that the teams plays with itself, now the selected team disappears from the other team options
    static removeSelectedTeam (e, otherTeam) {
        if (e.target.value !== 'team') {
            for (const team of otherTeam.children) {
                if (e.target.value === team.value) team.classList.toggle('remove');
            }
        }
    }

    static highlightInput () {
        this.select();
    }

    // function that shows the matches organized by weeks 
    static displayWeeksAccordion () {
        const accordion = document.querySelectorAll('.accordion');
    
        accordion.forEach(function (accord, i) {
            accord.addEventListener('click', function (e) {
                this.classList.toggle('active');
                const accordDisplay = this.nextElementSibling.children;
                for (const acc of accordDisplay) {
                    acc.classList.toggle('remove');
                    // acc.classList.toggle('slide-in');
                }
            });
        });
    };

}

class Match {
    // returns a random index of the array and update the arr without the index returned
    static removeRandomIndex = function (arr) {
        const randomNum = Math.trunc(Math.random() * arr.length);
        const match = arr.splice(randomNum, 1);
        return match[0];
    }

    // returns a random score between 0 and 5
    static randomScore () { 
        return Math.trunc(Math.random() * 6);
    }

    // function which makes the game logic of the teams
    static gameResult (local, visitor, scoreLocal, scoreVisitor) {
        // Adding +1 game played for both teams
        Team.addGamePlayed(local);
        Team.addGamePlayed(visitor);

        if (scoreLocal > scoreVisitor) {
            Team.winnerStats(local, scoreLocal, scoreVisitor);
            Team.loserStats(visitor, scoreLocal, scoreVisitor);
        } else if (scoreLocal === scoreVisitor) {
            Team.drawStats(local, scoreLocal, scoreVisitor);
            Team.drawStats(visitor, scoreVisitor, scoreLocal);
        } else {
            Team.winnerStats(visitor, scoreVisitor, scoreLocal);
            Team.loserStats(local, scoreVisitor, scoreLocal);
        }
    }

}

const updateStats = function () {
    // Store the teams of the select tag into variables
    const homeTeam = teamsDB.filter(team => team.name === localTeam.value)[0];
    const awayTeam = teamsDB.filter(team => team.name === visitTeam.value)[0];

    // Store the score of the inputs
    const homeScore = Number(Math.abs(localScore.value));
    const awayScore = Number(Math.abs(visitScore.value));

    if (!isNaN(homeScore) && !isNaN(awayScore)) {
        Match.gameResult(homeTeam, awayTeam, homeScore, awayScore);

        // sorting the table to display how's leading
        teamsDB.sort(Team.compareTeams);
    }

    // Update the table
    UI.updateTeamsTable();
};

const stringToNumber = string => Number(string);

const weekStats = function () {
    const week = stringToNumber(selectWeek.value);
    const saveMatch = `<div class='match-list'></div>`

    for (let i = 0; i < week; i++) {

        matchesDiv.insertAdjacentHTML('afterbegin', saveMatch); 
        const teamsArr = teamsDB.map(team => team.name);
        
        const accordDiv = `<div class='accordion'><span>Week ${i + 1}</span></div>`
        matchesDiv.insertAdjacentHTML('afterbegin', accordDiv);
        
        for (let i = 0; i < 5; i++) {
            matches.push({
                match: i + 1,
            });
    
            matches[i].local = Match.removeRandomIndex(teamsArr);
            matches[i].visitor = Match.removeRandomIndex(teamsArr);
            matches[i].localScore = Match.randomScore();
            matches[i].visitorScore = Match.randomScore();

            const homeTeam = teamsDB.filter(team => team.name === matches[i].local)[0];
            const awayTeam = teamsDB.filter(team => team.name === matches[i].visitor)[0];
            const { localScore, visitorScore } = matches[i];

            Match.gameResult(homeTeam, awayTeam, localScore, visitorScore);

            const output = 
            `
            <div class='match remove'>
                <span class='local-visitor'>${matches[i].local} ${matches[i].localScore} - ${matches[i].visitorScore} ${matches[i].visitor} </span>
            </div>
            `;
    
            teamsDB.sort(Team.compareTeams);

            // updateTable();
            UI.updateTeamsTable();
            
            document.querySelector('.match-list').insertAdjacentHTML('beforeend', output);
    
            matches[i].local = 0;
            matches[i].visitor = 0;
            matches[i].localScore = 0;
            matches[i].visitorScore = 0;
        } 
    }

    UI.displayWeeksAccordion();
};

// Function calls
Team.setTeams(teamsDB);

document.addEventListener('DOMContentLoaded', UI.displayTeamsTable(teamsDB));

UI.displayTeamsSelect(localTeam, teamsDB);
UI.displayTeamsSelect(visitTeam, teamsDB);

localScore.addEventListener('click', UI.highlightInput);
visitScore.addEventListener('click', UI.highlightInput);

localTeam.addEventListener('click', event => UI.removeSelectedTeam(event, visitTeam));
visitTeam.addEventListener('click', event => UI.removeSelectedTeam(event, localTeam));

btnPlay.addEventListener('click', updateStats);

selectWeek.addEventListener('click', UI.highlightInput);
weekBtn.addEventListener('click', weekStats);
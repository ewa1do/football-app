'use strict';

const teams = [
    {
        name: 'Manchester United',
        GP: '0',
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        PTS: 0,
        ID: 1,
    },
    {
        name: 'Manchester City',
        GP: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        PTS: 0,
        ID: 2,
    },
    {
        name: 'Liverpool FC',
        GP: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        PTS: 0,
        ID: 3,
    },
    {
        name: 'Chelsea FC',
        GP: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        PTS: 0,
        ID: 4,
    },
    {
        name: 'Arsenal FC',
        GP: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        PTS: 0,
        ID: 5,
    },
    {
        name: 'Everton FC',
        GP: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        PTS: 0,
        ID: 6,
    },
    {
        name: 'West Ham United',
        GP: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        PTS: 0,
        ID: 7,
    },
    {
        name: 'Leicester City',
        GP: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        PTS: 0,
        ID: 8,
    },
    {
        name: 'Tottenham Hotspur',
        GP: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        PTS: 0,
        ID: 9,
    },
    {
        name: 'Watford FC',
        GP: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        PTS: 0,
        ID: 10,
    },
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

///////////TABLE COMPONENT//////////////////
// Display the teams table
const displayTeams = function (arr) {

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
    
};

// Display the teams select
const selectTeams = function (element, arr) {
    for (const obj of arr) {
        const option = `<option value="${obj.name}">${obj.name}</option>`;
        element.insertAdjacentHTML('beforeend', option);
    }
};

const addGamePlayed = team => team.map(obj => obj.GP++);

const winnerStats = function (winner, winnerScore, loserScore) {
    winner.map(team => team.W++);
    winner.map(team => team.GF += winnerScore);
    winner.map(team => team.GA += loserScore);
    winner.map(team => team.GD = team.GF - team.GA);
    winner.map(team => team.PTS += 3);
};

const loserStats = function (loser, winnerScore, loserScore) {
    loser.map(team => team.L++);
    loser.map(team => team.GF += loserScore);
    loser.map(team => team.GA += winnerScore);
    loser.map(team => team.GD = team.GF - team.GA);
};

const drawStats = function (draw, teamScore, otherTeamScore) {
    draw.map(team => team.D++);
    draw.map(team => team.GF += teamScore);
    draw.map(team => team.GA += otherTeamScore);
    draw.map(team => team.GD = team.GF - team.GA);
    draw.map(team => team.PTS++);
};

const updateTable = function () {
    // Remove existent table
    for (let i = 1; i < teamTable.children.length; i++) 
        teamTable.children[i].classList.add('remove');
    
    // Updating new table
    displayTeams(teams);
};

// callback function to use into the sort method
const compare = function (team1, team2) {
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

const hightlightInput = function () {
    this.select();
};

// this function fix the bug that the teams plays with itself, now the selected team disappears from the other team options
const removeSelectedTeam = function (event, otherTeam) {
    if (event.target.value !== 'team') {
        for (let i = 1; i < otherTeam.children.length; i++) {
            if (event.target.value === otherTeam.children[i].value) otherTeam.children[i].classList.toggle('remove');
        }
    }
};

const updateStats = function () {
    // Store the teams of the select tag into variables
    const homeTeam = teams.filter(team => team.name === localTeam.value);
    const awayTeam = teams.filter(team => team.name === visitTeam.value);

    // Store the score of the inputs
    const homeScore = Number(Math.abs(localScore.value));
    const awayScore = Number(Math.abs(visitScore.value));

    if (!isNaN(homeScore) && !isNaN(awayScore)) {
        // Adding +1 game played for both teams
        addGamePlayed(homeTeam);
        addGamePlayed(awayTeam);
        
        // Defining win, draw or lose
        if (homeScore > awayScore) { 
            winnerStats(homeTeam, homeScore, awayScore);
            loserStats(awayTeam, homeScore, awayScore);
        } else if (homeScore === awayScore) {
            drawStats(homeTeam, homeScore, awayScore);
            drawStats(awayTeam, awayScore, homeScore);
        } else {
            winnerStats(awayTeam, awayScore, homeScore);
            loserStats(homeTeam, awayScore, homeScore);
        }

        // sorting the table to display how's leading
        teams.sort(compare);
    }

    // Update the table
    updateTable();
};

////////////WEEKS COMPONENT////////////////////

// Get randoms teams
// returns a random index of the array and update the arr without the index returned
const removeRandomIndex = function (arr) {
    const randomNum = Math.trunc(Math.random() * arr.length);
    const match = arr.splice(randomNum, 1);
    return match[0];
}

// returns a random score between 0 and 5
const randomScore = () => Math.trunc(Math.random() * 6);

const winnerStatsWeek = function (winner, winnerScore, loserScore) {
    winner.W += 1;
    winner.PTS += 3;
    winner.GF += winnerScore;
    winner.GA += loserScore;
    winner.GD = winner.GF - winner.GA;
};

const loserStatsWeek = function (loser, winnerScore, loserScore) {
    loser.L += 1;
    loser.GF += loserScore;
    loser.GA += winnerScore;
    loser.GD = loser.GF - loser.GA;
};

const drawStatsWeek = function (draw, teamScore, otherTeamScore) {
    draw.D++;
    draw.GF += teamScore;
    draw.GA += otherTeamScore;
    draw.GD = draw.GF - draw.GA;
    draw.PTS++;
};

const stringToNumber = string => Number(string);

// function that shows the matches organized by weeks 
const displayAccordion = function () {
    const accordion = document.querySelectorAll('.accordion');
    
    for (const accord of accordion) {
        accord.addEventListener('click', function () {
            this.classList.toggle('active');
            const accordShow = this.nextElementSibling.children;
            for (const element of accordShow) {
                element.classList.toggle('remove');
                element.classList.toggle('slide-in');
            }
        });
    }
};

const weekStats = function () {
    const week = stringToNumber(selectWeek.value);
    const saveMatch = `<div class='match-list'></div>`

    for (let i = 0; i < week; i++) {

        matchesDiv.insertAdjacentHTML('afterbegin', saveMatch); 
        const teamsArr = teams.map(team => team.name);
        
        const accordDiv = `<div class='accordion'><span>Week ${i + 1}</span></div>`
        matchesDiv.insertAdjacentHTML('afterbegin', accordDiv);
        
        for (let i = 0; i < 5; i++) {
            matches.push({
                match: i + 1,
            });
    
            matches[i].local = removeRandomIndex(teamsArr);
            matches[i].visitor = removeRandomIndex(teamsArr);
            matches[i].localScore = randomScore();
            matches[i].visitorScore = randomScore();
    
            const homeTeam = teams.filter(team => team.name === matches[i].local)[0];
            const awayTeam = teams.filter(team => team.name === matches[i].visitor)[0];
            const { localScore, visitorScore } = matches[i];
    
            homeTeam.GP++;
            awayTeam.GP++;
            
            if (localScore > visitorScore) {
                winnerStatsWeek(homeTeam, localScore, visitorScore);
                loserStatsWeek(awayTeam, localScore, visitorScore);
            } else if (localScore === visitorScore) {
                drawStatsWeek(homeTeam, localScore, visitorScore);
                drawStatsWeek(awayTeam, visitorScore, localScore);
            } else {
                winnerStatsWeek(awayTeam, visitorScore, localScore);
                loserStatsWeek(homeTeam, visitorScore, localScore);
            }
            
            const output = 
            `
            <div class='match remove'>
                <span class='local-visitor'>${matches[i].local} ${matches[i].localScore} - ${matches[i].visitorScore} ${matches[i].visitor} </span>
            </div>
            `;
    
            teams.sort(compare);

            updateTable();
            
            document.querySelector('.match-list').insertAdjacentHTML('beforeend', output);
    
            matches[i].local = 0;
            matches[i].visitor = 0;
            matches[i].localScore = 0;
            matches[i].visitorScore = 0;
        } 
    }

    displayAccordion();

};

// Function calls
displayTeams(teams);

selectTeams(localTeam, teams);
selectTeams(visitTeam, teams);

localScore.addEventListener('click', hightlightInput);
visitScore.addEventListener('click', hightlightInput);

localTeam.addEventListener('click', event => removeSelectedTeam(event, visitTeam));
visitTeam.addEventListener('click', event => removeSelectedTeam(event, localTeam));

btnPlay.addEventListener('click', updateStats);

selectWeek.addEventListener('click', hightlightInput);
weekBtn.addEventListener('click', weekStats);
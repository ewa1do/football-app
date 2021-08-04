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
    },
];


const teamTable = document.querySelector('.team--table');
const teamEl = document.querySelector('.team');

const localTeam = document.querySelector('#team-local');
const visitTeam = document.querySelector('#team-visitor');

const localScore = document.querySelector('#local-score');
const visitScore = document.querySelector('#visitor-score');

const btnPlay = document.querySelector('#btn-play');

localScore.value = 0;
visitScore.value = 0;

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

// Function calls
displayTeams(teams);

selectTeams(localTeam, teams);
selectTeams(visitTeam, teams);

localScore.addEventListener('click', hightlightInput);
visitScore.addEventListener('click', hightlightInput);

localTeam.addEventListener('click', event => removeSelectedTeam(event, visitTeam));
visitTeam.addEventListener('click', event => removeSelectedTeam(event, localTeam));

btnPlay.addEventListener('click', updateStats);
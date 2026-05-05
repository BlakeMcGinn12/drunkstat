// DrunkStat Game Logic
// In-memory storage for prototype (resets on page refresh)

const GameState = {
    currentScreen: 'main-menu',
    isHost: false,
    gameCode: null,
    playerName: null,
    players: [],
    categories: [],
    statTypes: [],
    currentRound: 0,
    questions: [],
    answers: {}, // player -> { questionId -> answer }
    scores: {}, // player -> score
    timer: null,
    timeLeft: 30
};

// Question Database
const QuestionDB = {
    'college-football': {
        individual: [
            {
                question: "Who holds the NCAA record for most rushing yards in a single season?",
                answers: ["Barry Sanders", "Derrick Henry", "Ron Dayne", "Ricky Williams"],
                correct: 0,
                correctAnswer: "Barry Sanders (2,628 yards in 1988)"
            },
            {
                question: "Which QB threw the most touchdown passes in a single college season?",
                answers: ["Joe Burrow", "Bryce Young", "Bailey Zappe", "Case Keenum"],
                correct: 0,
                correctAnswer: "Joe Burrow (60 TDs in 2019)"
            },
            {
                question: "Who won the Heisman Trophy in 2022?",
                answers: ["Caleb Williams", "Bryce Young", "CJ Stroud", "Max Duggan"],
                correct: 0,
                correctAnswer: "Caleb Williams (USC)"
            },
            {
                question: "Which player holds the record for most career receiving yards in college football?",
                answers: ["Corey Davis", "Trevor Insley", "Ryan Broyles", "Justin Hardy"],
                correct: 1,
                correctAnswer: "Trevor Insley (5,005 yards, Nevada 1996-99)"
            }
        ],
        fantasy: [
            {
                question: "Which QB had the most fantasy points in a single college game in 2023?",
                answers: ["Michael Penix Jr.", "Bo Nix", "Jayden Daniels", "Caleb Williams"],
                correct: 2,
                correctAnswer: "Jayden Daniels (LSU)"
            },
            {
                question: "In standard CFF scoring, how many points is a passing TD worth?",
                answers: ["4 points", "6 points", "5 points", "3 points"],
                correct: 0,
                correctAnswer: "4 points"
            },
            {
                question: "Which RB led all of college football in fantasy points per game in 2023?",
                answers: ["Ollie Gordon II", "Jonathon Brooks", "Trey Benson", "Braelon Allen"],
                correct: 0,
                correctAnswer: "Ollie Gordon II (Oklahoma State)"
            },
            {
                question: "In CFF, how many points is a 100-yard rushing game bonus typically worth?",
                answers: ["2 points", "3 points", "5 points", "1 point"],
                correct: 2,
                correctAnswer: "5 points (varies by league)"
            }
        ],
        team: [
            {
                question: "Which college football team has won the most national championships?",
                answers: ["Alabama", "Notre Dame", "Yale", "Princeton"],
                correct: 3,
                correctAnswer: "Princeton (28 claimed)"
            },
            {
                question: "What is the record for most points scored by one team in a single game?",
                answers: ["106", "128", "222", "91"],
                correct: 2,
                correctAnswer: "222 (Georgia Tech over Cumberland in 1916)"
            },
            {
                question: "Which team has the longest winning streak in college football history?",
                answers: ["Oklahoma", "Miami", "Alabama", "Notre Dame"],
                correct: 0,
                correctAnswer: "Oklahoma (47 games, 1953-1957)"
            },
            {
                question: "What is the largest margin of victory in a bowl game?",
                answers: ["49 points", "63 points", "55 points", "70 points"],
                correct: 1,
                correctAnswer: "63 points (Army over Houston in 2018 Armed Forces Bowl)"
            }
        ]
    },
    'nfl': {
        individual: [
            {
                question: "Who holds the NFL record for most career passing yards?",
                answers: ["Tom Brady", "Drew Brees", "Peyton Manning", "Brett Favre"],
                correct: 0,
                correctAnswer: "Tom Brady (89,214 yards)"
            },
            {
                question: "Which player has the most career rushing touchdowns?",
                answers: ["Emmitt Smith", "LaDainian Tomlinson", "Marcus Allen", "Walter Payton"],
                correct: 0,
                correctAnswer: "Emmitt Smith (164 TDs)"
            },
            {
                question: "Who holds the single-season sack record?",
                answers: ["Reggie White", "JJ Watt", "Michael Strahan", "Aaron Donald"],
                correct: 2,
                correctAnswer: "Michael Strahan (22.5 sacks in 2001)"
            },
            {
                question: "Which QB has the most career interceptions thrown?",
                answers: ["Brett Favre", "Dan Marino", "Peyton Manning", "John Elway"],
                correct: 0,
                correctAnswer: "Brett Favre (336 INTs)"
            }
        ],
        fantasy: [
            {
                question: "Which player scored the most fantasy points in a single game (PPR)?",
                answers: ["Jamaal Charles", "Alvin Kamara", "Clinton Portis", "Drew Brees"],
                correct: 1,
                correctAnswer: "Alvin Kamara (6 TDs, 56.2 points in 2020)"
            },
            {
                question: "Who holds the record for most fantasy points in a single season (PPR)?",
                answers: ["LaDainian Tomlinson", "Christian McCaffrey", "Randy Moss", "Cooper Kupp"],
                correct: 0,
                correctAnswer: "LaDainian Tomlinson (2006 - 31 total TDs)"
            },
            {
                question: "In PPR scoring, how many points is a reception worth?",
                answers: ["0.5 points", "1 point", "1.5 points", "2 points"],
                correct: 1,
                correctAnswer: "1 point (hence 'Point Per Reception')"
            },
            {
                question: "Which TE had the most fantasy points in a single season?",
                answers: ["Travis Kelce", "George Kittle", "Mark Andrews", "Rob Gronkowski"],
                correct: 3,
                correctAnswer: "Rob Gronkowski (2011 - 1,327 yards, 17 TDs)"
            }
        ],
        team: [
            {
                question: "Which NFL team has won the most Super Bowls?",
                answers: ["Pittsburgh Steelers", "New England Patriots", "Dallas Cowboys", "San Francisco 49ers"],
                correct: 0,
                correctAnswer: "Pittsburgh Steelers (6, tied with Patriots)"
            },
            {
                question: "What is the highest-scoring game in NFL history?",
                answers: ["72-41", "63-35", "58-48", "73-0"],
                correct: 0,
                correctAnswer: "72-41 (Washington over Giants in 1966)"
            },
            {
                question: "Which team has the worst all-time win percentage?",
                answers: ["Cleveland Browns", "Detroit Lions", "Arizona Cardinals", "Tampa Bay Buccaneers"],
                correct: 2,
                correctAnswer: "Arizona Cardinals (since 1920)"
            },
            {
                question: "What is the largest comeback in NFL playoff history?",
                answers: ["28 points", "32 points", "35 points", "24 points"],
                correct: 1,
                correctAnswer: "32 points (Bills over Oilers, 1993)"
            }
        ]
    },
    'college-basketball': {
        individual: [
            {
                question: "Who holds the NCAA record for most points in a single game?",
                answers: ["Pete Maravich", "Austin Carr", "Frank Selvy", "Kevin Bradshaw"],
                correct: 2,
                correctAnswer: "Frank Selvy (100 points, Furman 1954)"
            },
            {
                question: "Which player holds the career scoring record?",
                answers: ["Pete Maravich", "Tyler Hansbrough", "JJ Redick", "Chris Clemons"],
                correct: 0,
                correctAnswer: "Pete Maravich (3,667 points at LSU)"
            },
            {
                question: "Who was the last player to average 30+ points per game for a season?",
                answers: ["Trae Young", "Doug McDermott", "Stephen Curry", "Jimmer Fredette"],
                correct: 0,
                correctAnswer: "Trae Young (Oklahoma, 27.4 PPG - 2018)"
            },
            {
                question: "Which player holds the record for most career assists?",
                answers: ["Bobby Hurley", "Chris Paul", "Jason Kidd", "Ty Lawson"],
                correct: 0,
                correctAnswer: "Bobby Hurley (1,076 at Duke)"
            }
        ],
        fantasy: [
            {
                question: "In CBB fantasy, how many fantasy points is a double-double typically worth as a bonus?",
                answers: ["2 points", "5 points", "3 points", "No bonus"],
                correct: 1,
                correctAnswer: "5 points (varies by platform)"
            },
            {
                question: "Which player had the most fantasy points in the 2023 NCAA Tournament?",
                answers: ["Zach Edey", "Markquis Nowell", "Adama Sanogo", "Jordan Hawkins"],
                correct: 0,
                correctAnswer: "Zach Edey (Purdue)"
            },
            {
                question: "In standard CBB fantasy scoring, how many points is a 3-pointer worth?",
                answers: ["3 points", "3.5 points", "4 points", "2 points"],
                correct: 0,
                correctAnswer: "3 points (same as real life)"
            },
            {
                question: "Which stat category typically gives the most fantasy points per occurrence?",
                answers: ["Rebound", "Assist", "Steal", "Block"],
                correct: 3,
                correctAnswer: "Block (usually 3 points vs 2 for others)"
            }
        ],
        team: [
            {
                question: "Which team has won the most NCAA Championships?",
                answers: ["Kentucky", "North Carolina", "UCLA", "Duke"],
                correct: 2,
                correctAnswer: "UCLA (11 titles, 10 under John Wooden)"
            },
            {
                question: "What is the lowest seed to ever win the NCAA Tournament?",
                answers: ["8 seed", "11 seed", "10 seed", "12 seed"],
                correct: 0,
                correctAnswer: "8 seed (Villanova, 1985)"
            },
            {
                question: "Which team has made the most Final Four appearances?",
                answers: ["Duke", "North Carolina", "Kentucky", "UCLA"],
                correct: 1,
                correctAnswer: "North Carolina (21 Final Fours)"
            },
            {
                question: "What is the largest margin of victory in an NCAA Championship game?",
                answers: ["30 points", "34 points", "28 points", "42 points"],
                correct: 1,
                correctAnswer: "34 points (UNLV over Duke, 1990 - 103-73)"
            }
        ]
    },
    'nba': {
        individual: [
            {
                question: "Who holds the NBA record for most points in a single game?",
                answers: ["Kobe Bryant", "Wilt Chamberlain", "Michael Jordan", "Damian Lillard"],
                correct: 1,
                correctAnswer: "Wilt Chamberlain (100 points, 1962)"
            },
            {
                question: "Which player has the most career triple-doubles?",
                answers: ["Magic Johnson", "LeBron James", "Russell Westbrook", "Oscar Robertson"],
                correct: 2,
                correctAnswer: "Russell Westbrook (198+)"
            },
            {
                question: "Who holds the record for most 3-pointers made in a single game?",
                answers: ["Stephen Curry", "Klay Thompson", "Damian Lillard", "Zach LaVine"],
                correct: 1,
                correctAnswer: "Klay Thompson (14 threes, 2018)"
            },
            {
                question: "Which player has the highest career scoring average?",
                answers: ["Michael Jordan", "LeBron James", "Kevin Durant", "Wilt Chamberlain"],
                correct: 0,
                correctAnswer: "Michael Jordan (30.12 PPG)"
            }
        ],
        fantasy: [
            {
                question: "Who holds the record for most fantasy points in a single NBA game?",
                answers: ["James Harden", "Russell Westbrook", "Anthony Davis", "Hakeem Olajuwon"],
                correct: 2,
                correctAnswer: "Anthony Davis (59 points, 20 reb, 4 ast, 59.0 fantasy points)"
            },
            {
                question: "In standard 9-cat fantasy, which stat is NOT typically counted?",
                answers: ["Turnovers", "Free Throw %", "Plus/Minus", "Blocks"],
                correct: 2,
                correctAnswer: "Plus/Minus"
            },
            {
                question: "Which player had the highest fantasy value over replacement in 2022-23?",
                answers: ["Nikola Jokic", "Luka Doncic", "Joel Embiid", "Shai Gilgeous-Alexander"],
                correct: 0,
                correctAnswer: "Nikola Jokic (MVP season)"
            },
            {
                question: "In points leagues, how many fantasy points is a double-double typically worth?",
                answers: ["3 points", "5 points", "2 points", "No bonus"],
                correct: 1,
                correctAnswer: "5 points bonus"
            }
        ],
        team: [
            {
                question: "Which NBA team has won the most championships?",
                answers: ["Boston Celtics", "Los Angeles Lakers", "Chicago Bulls", "Golden State Warriors"],
                correct: 0,
                correctAnswer: "Boston Celtics (18 titles as of 2024)"
            },
            {
                question: "What is the best regular season record in NBA history?",
                answers: ["73-9", "72-10", "69-13", "74-8"],
                correct: 0,
                correctAnswer: "73-9 (2015-16 Golden State Warriors)"
            },
            {
                question: "Which team has the longest winning streak in NBA history?",
                answers: ["Golden State Warriors", "Miami Heat", "Los Angeles Lakers", "Boston Celtics"],
                correct: 2,
                correctAnswer: "Los Angeles Lakers (33 games, 1971-72)"
            },
            {
                question: "What is the largest margin of victory in an NBA game?",
                answers: ["58 points", "68 points", "73 points", "63 points"],
                correct: 1,
                correctAnswer: "68 points (Cavs over Heat, 1991)"
            }
        ]
    },
    'mlb': {
        individual: [
            {
                question: "Who holds the MLB record for most career home runs?",
                answers: ["Babe Ruth", "Hank Aaron", "Barry Bonds", "Alex Rodriguez"],
                correct: 2,
                correctAnswer: "Barry Bonds (762 home runs)"
            },
            {
                question: "Which pitcher has the most career strikeouts?",
                answers: ["Randy Johnson", "Nolan Ryan", "Roger Clemens", "Steve Carlton"],
                correct: 1,
                correctAnswer: "Nolan Ryan (5,714 strikeouts)"
            },
            {
                question: "Who holds the single-season hit record?",
                answers: ["Ichiro Suzuki", "George Sisler", "Ty Cobb", "Tony Gwynn"],
                correct: 0,
                correctAnswer: "Ichiro Suzuki (262 hits in 2004)"
            },
            {
                question: "Which player has the longest hitting streak in MLB history?",
                answers: ["Pete Rose", "Ty Cobb", "Joe DiMaggio", "Willie Keeler"],
                correct: 2,
                correctAnswer: "Joe DiMaggio (56 games in 1941)"
            }
        ],
        fantasy: [
            {
                question: "In standard 5x5 fantasy baseball, which is NOT a pitching category?",
                answers: ["ERA", "WHIP", "Strikeouts", "Quality Starts"],
                correct: 3,
                correctAnswer: "Quality Starts (not in standard 5x5)"
            },
            {
                question: "Which player had the most fantasy points in a single season (standard scoring)?",
                answers: ["Barry Bonds", "Babe Ruth", "Shohei Ohtani", "Mike Trout"],
                correct: 0,
                correctAnswer: "Barry Bonds (2001 - 73 HRs, .863 OBP)"
            },
            {
                question: "In fantasy baseball, what does QS stand for?",
                answers: ["Quality Start", "Quick Strikeout", "Quarter Season", "Qualified Starter"],
                correct: 0,
                correctAnswer: "Quality Start (6+ innings, 3 or fewer earned runs)"
            },
            {
                question: "How many points is a stolen base typically worth in fantasy points leagues?",
                answers: ["2 points", "3 points", "5 points", "1 point"],
                correct: 1,
                correctAnswer: "3 points (varies by league)"
            }
        ],
        team: [
            {
                question: "Which MLB team has won the most World Series?",
                answers: ["Boston Red Sox", "St. Louis Cardinals", "New York Yankees", "Los Angeles Dodgers"],
                correct: 2,
                correctAnswer: "New York Yankees (27 championships)"
            },
            {
                question: "What is the longest winning streak in MLB history?",
                answers: ["21 games", "26 games", "33 games", "19 games"],
                correct: 1,
                correctAnswer: "26 games (1916 Giants - includes tie)"
            },
            {
                question: "Which team lost the most games in a single season?",
                answers: ["1962 Mets", "2003 Tigers", "1899 Spiders", "1979 Blue Jays"],
                correct: 2,
                correctAnswer: "1899 Cleveland Spiders (20-134 record)"
            },
            {
                question: "What is the highest-scoring game in MLB history?",
                answers: ["26-23", "30-3", "22-18", "49-33"],
                correct: 0,
                correctAnswer: "26-23 (Cubs over Phillies, 1922)"
            }
        ]
    }
};

// Utility Functions
function generateGameCode() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '23456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += letters[Math.floor(Math.random() * letters.length)];
    for (let i = 0; i < 3; i++) code += numbers[Math.floor(Math.random() * numbers.length)];
    return code;
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    GameState.currentScreen = screenId;
}

function copyCode() {
    navigator.clipboard.writeText(GameState.gameCode);
    alert('Game code copied!');
}

// Host Functions
function createGame() {
    // Get selected categories
    const categoryInputs = document.querySelectorAll('#host-setup input[type="checkbox"]:checked');
    const categories = [];
    const statTypes = [];
    
    categoryInputs.forEach(input => {
        const val = input.value;
        if (['college-football', 'nfl', 'college-basketball', 'nba', 'mlb'].includes(val)) {
            categories.push(val);
        } else {
            statTypes.push(val);
        }
    });
    
    if (categories.length === 0 || statTypes.length === 0) {
        alert('Please select at least one category and one stat type!');
        return;
    }
    
    GameState.isHost = true;
    GameState.gameCode = generateGameCode();
    GameState.playerName = 'Host';
    GameState.categories = categories;
    GameState.statTypes = statTypes;
    GameState.players = [{ name: 'Host', isHost: true }];
    GameState.scores = { 'Host': 0 };
    
    // Add some mock players for demo
    setTimeout(() => addMockPlayers(), 1000);
    
    document.getElementById('host-game-code').textContent = GameState.gameCode;
    updatePlayersList();
    showScreen('lobby-host');
}

function addMockPlayers() {
    const mockNames = ['Mike', 'Sarah', 'Dave', 'Jessica'];
    const numPlayers = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numPlayers; i++) {
        const name = mockNames[i];
        if (!GameState.players.find(p => p.name === name)) {
            GameState.players.push({ name, isHost: false });
            GameState.scores[name] = 0;
        }
    }
    updatePlayersList();
}

function updatePlayersList() {
    const hostList = document.getElementById('players-list');
    const playerList = document.getElementById('players-list-player');
    const playerCount = document.getElementById('player-count');
    
    const html = GameState.players.map(p => 
        `<li class="${p.isHost ? 'host' : ''}">${p.name}</li>`
    ).join('');
    
    if (hostList) hostList.innerHTML = html;
    if (playerList) playerList.innerHTML = html;
    if (playerCount) playerCount.textContent = GameState.players.length;
}

function startRound() {
    // Generate questions based on categories and stat types
    GameState.questions = generateQuestions();
    GameState.currentRound = 0;
    GameState.answers = {};
    
    // Initialize answers for each player
    GameState.players.forEach(p => {
        GameState.answers[p.name] = {};
    });
    
    showQuestion();
}

function generateQuestions() {
    const questions = [];
    const questionsPerCombo = 1; // 1 question per category-stat combo
    
    GameState.categories.forEach(cat => {
        GameState.statTypes.forEach(statType => {
            const pool = QuestionDB[cat][statType];
            if (pool && pool.length > 0) {
                // Pick random question from pool
                const q = pool[Math.floor(Math.random() * pool.length)];
                questions.push({
                    ...q,
                    category: cat,
                    statType: statType,
                    id: `${cat}-${statType}-${questions.length}`
                });
            }
        });
    });
    
    // Shuffle questions
    return questions.sort(() => Math.random() - 0.5).slice(0, 5); // Max 5 questions
}

function showQuestion() {
    if (GameState.currentRound >= GameState.questions.length) {
        showScoreboard();
        return;
    }
    
    const q = GameState.questions[GameState.currentRound];
    
    document.getElementById('current-q').textContent = GameState.currentRound + 1;
    document.getElementById('total-q').textContent = GameState.questions.length;
    document.getElementById('q-category').textContent = formatCategory(q.category) + ' • ' + formatStatType(q.statType);
    document.getElementById('question-text').textContent = q.question;
    
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';
    
    q.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.onclick = () => submitAnswer(index);
        answersContainer.appendChild(btn);
    });
    
    // Start timer
    GameState.timeLeft = 30;
    updateTimer();
    GameState.timer = setInterval(() => {
        GameState.timeLeft--;
        updateTimer();
        if (GameState.timeLeft <= 0) {
            submitAnswer(-1); // Time's up
        }
    }, 1000);
    
    showScreen('question-round');
}

function updateTimer() {
    const timerEl = document.getElementById('timer');
    timerEl.textContent = GameState.timeLeft;
    timerEl.className = 'timer';
    if (GameState.timeLeft <= 10) timerEl.classList.add('danger');
    else if (GameState.timeLeft <= 20) timerEl.classList.add('warning');
}

function submitAnswer(answerIndex) {
    clearInterval(GameState.timer);
    
    // Record answer for current player
    const currentPlayer = GameState.isHost ? 'Host' : GameState.playerName;
    const q = GameState.questions[GameState.currentRound];
    GameState.answers[currentPlayer][q.id] = answerIndex;
    
    // For demo: simulate other players answering
    simulateOtherPlayers(q.id);
    
    // Move to next question
    GameState.currentRound++;
    
    // Small delay before next question
    setTimeout(() => showQuestion(), 500);
}

function simulateOtherPlayers(questionId) {
    const q = GameState.questions[GameState.currentRound];
    GameState.players.forEach(p => {
        if (p.name !== 'Host' && p.name !== GameState.playerName) {
            // Random answer (sometimes correct, sometimes not)
            const correct = Math.random() > 0.6;
            const answer = correct ? q.correct : Math.floor(Math.random() * q.answers.length);
            GameState.answers[p.name] = GameState.answers[p.name] || {};
            GameState.answers[p.name][questionId] = answer;
        }
    });
}

function showScoreboard() {
    // Calculate scores
    calculateScores();
    
    const container = document.getElementById('results-container');
    container.innerHTML = '';
    
    // Show each question result
    GameState.questions.forEach((q, idx) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'question-result';
        
        let playerAnswersHtml = '';
        GameState.players.forEach(p => {
            const playerAnswer = GameState.answers[p.name][q.id];
            const isCorrect = playerAnswer === q.correct;
            const answerText = playerAnswer === -1 ? 'Time up!' : q.answers[playerAnswer];
            
            playerAnswersHtml += `
                <div class="player-answer ${isCorrect ? 'correct' : 'wrong'}">
                    <span class="name">${p.name}</span>
                    <span class="answer">${answerText}</span>
                    ${isCorrect ? '<span class="points">+100</span>' : '<span class="points">+0</span>'}
                </div>
            `;
        });
        
        resultDiv.innerHTML = `
            <div class="question-result-header">
                <h3>Q${idx + 1}: ${q.question.substring(0, 50)}...</h3>
                <span class="correct-answer">${q.answers[q.correct]}</span>
            </div>
            <div class="player-answers">
                ${playerAnswersHtml}
            </div>
        `;
        
        container.appendChild(resultDiv);
    });
    
    // Show scores summary
    const scoresDiv = document.createElement('div');
    scoresDiv.className = 'scores-summary';
    
    const sortedPlayers = Object.entries(GameState.scores)
        .sort((a, b) => b[1] - a[1]);
    
    let scoresHtml = '<h3>🏆 Final Scores</h3>';
    sortedPlayers.forEach(([name, score], idx) => {
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '  ';
        scoresHtml += `
            <div class="score-row ${idx === 0 ? 'leader' : ''}">
                <span class="rank">${medal}</span>
                <span class="name">${name}</span>
                <span class="score">${score}</span>
            </div>
        `;
    });
    
    scoresDiv.innerHTML = scoresHtml;
    container.appendChild(scoresDiv);
    
    // Show appropriate controls
    if (GameState.isHost) {
        document.getElementById('host-controls').classList.remove('hidden');
        document.getElementById('player-waiting').classList.add('hidden');
    } else {
        document.getElementById('host-controls').classList.add('hidden');
        document.getElementById('player-waiting').classList.remove('hidden');
    }
    
    showScreen('scoreboard');
}

function calculateScores() {
    GameState.players.forEach(p => {
        let score = 0;
        GameState.questions.forEach(q => {
            if (GameState.answers[p.name][q.id] === q.correct) {
                score += 100;
            }
        });
        GameState.scores[p.name] = score;
    });
}

function backToLobby() {
    if (GameState.isHost) {
        showScreen('lobby-host');
    } else {
        showScreen('lobby-player');
    }
}

function endGame() {
    if (confirm('End this game? All players will be disconnected.')) {
        location.reload();
    }
}

// Player Functions
function joinGame() {
    const code = document.getElementById('join-code').value.toUpperCase().trim();
    const name = document.getElementById('player-name').value.trim();
    
    if (!code) {
        alert('Please enter a game code!');
        return;
    }
    if (!name) {
        alert('Please enter your name!');
        return;
    }
    
    // For prototype, accept any code
    GameState.isHost = false;
    GameState.gameCode = code;
    GameState.playerName = name;
    
    // Mock players including host
    GameState.players = [
        { name: 'Host', isHost: true },
        { name: name, isHost: false }
    ];
    GameState.scores = { 'Host': 0, [name]: 0 };
    
    document.getElementById('player-game-code').textContent = code;
    updatePlayersList();
    showScreen('lobby-player');
}

// Formatting helpers
function formatCategory(cat) {
    return cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatStatType(type) {
    if (type === 'individual') return 'Individual Stats';
    if (type === 'fantasy') return 'Fantasy Points';
    if (type === 'team') return 'Team Stats';
    return type;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showScreen('main-menu');
});

// 
console.log('extention');

let debugMode = false;
let defaultBall = 0;
let encountPointBase = 0;
function switchDebugMode(){
    debugMode = !debugMode;
    if (debugMode) {
        defaultBall = 3;
        encountPointBase = 6;
    } else {
        defaultBall = 0;
        encountPointBase = 0;
    }
}
switchDebugMode();


// main,game,result,get,dex
let state = 'main';
function changeState(s = 'main'){
    state = s;
    const main = document.getElementById("pokePF_main");
    const game = document.getElementById("pokePF_game");
    const result = document.getElementById("pokePF_result");
    const get = document.getElementById("pokePF_get");
    const dex = document.getElementById("pokePF_dex");
    main.style.display = 'none';
    game.style.display = 'none';
    result.style.display = 'none';
    get.style.display = 'none';
    dex.style.display = 'none';
    document.getElementById(`pokePF_${state}`).style.display = 'block';
}

let gameStartTime = 0;
const limitSeconds = 30;
let remainSeconds = limitSeconds;
// 現在のunixTime
function currentUnixTime() {
    const currentDateTime = new Date();
    const unixTime = Date.parse(currentDateTime) / 1000;
    return unixTime;
}
function escapeHTML(text){
    const box = document.createElement('p');
    box.textContent = text;
    return box.innerHTML;
}
// 0から指定された整数までのランダムな整数を返す関数
function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}
function findMin(numbers){
    return Math.min(...numbers);
}


const apiUrl = 'https://pokeapi.co/api/v2/';
const maxPoke = 1025;
let getPoke = {};
getPoke[1] = 1;
if (debugMode) {
    getPoke[2] = 1;
    getPoke[3] = 1;
}
function savePokeData(){
    // console.log('Save Data:', getPoke);
    // sessionStorage.setItem('myPokeData', JSON.stringify(getPoke));
    // 
    // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, { action: "sendPokeData", data: getPoke });
    // });
    // chrome.runtime.sendMessage({ action: "sendPokeData", data: getPoke });
}
console.log(getPoke, 'GotPokeList');
// 引数の番号のポケモンのデータを取得
async function fetchPoke(pokeId){
    // console.log(pokeId);

    const url = `${apiUrl}pokemon/${pokeId}`;
    // console.log(url);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('ネットワークエラーまたはリクエストに問題があります');
        }

        return response.json();
    } catch (error) {
        console.log('データを取得できませんでした', error);
        throw error;
    }
}
// 引数の番号のポケモンの名前を取得
async function fetchPokeName(pokeId){

    const url = `${apiUrl}pokemon-species/${pokeId}`;
    // console.log(url, 'URL');
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('ネットワークエラーまたはリクエストに問題があります');
        }
        const data = await response.json();
        // console.log(data);
        return data.names.find(nameData => nameData.language.name === 'ja').name;
    } catch (error) {
        console.log('データを取得できませんでした', error);
        throw error;
    }
}
// 選択されているポケモンを表示
async function displayPoke(n) {
    console.log(n, 'displayPoke')
    const pokeId = n;
    const spriteValue = "front_default";
    const pokeNameElement = document.getElementById(`pokeName_${state}`);
    const pokeImgElement = document.getElementById(`pokeImg_${state}`);
    try {
        const data = await fetchPoke(pokeId);
        const pokeName = await fetchPokeName(pokeId);
        // console.log(data);

        if (data) {
            const pokeImg = data.sprites[spriteValue];

            pokeNameElement.textContent = pokeName;
            pokeImgElement.src = pokeImg;
            // console.log(pokeImg);
        }
    } catch (error) {
        console.log('データの表示中にエラーが発生しました', error);
    }
}
function randamPokeIndex(){
    const obj = getPoke;
    // 1以上の要素のindexを取得する
    const validIndices = Object.keys(obj).filter(key => obj[key] >= 1).map(Number);
    console.log(validIndices, 'GotPokeNums');
    // ランダムにindexを選択する
    const randomKey = Math.floor(Math.random() * validIndices.length);
    // 選択された要素
    return validIndices[randomKey];
}


async function pokeHTML(pokeId){
    const spriteValue = "front_default";
    try {
        const data = await fetchPoke(pokeId);
        const pokeName = await fetchPokeName(pokeId);

        if (data) {
            return `
                <p id="pokeName">${pokeId}. ${pokeName} x${getPoke[pokeId]}</p>
                <img id="pokeImg" src="${data.sprites[spriteValue]}" alt="Sprite">
            `;
        }
    } catch (error) {
        console.log('データの表示中にエラーが発生しました', error);
        return '';
    }
}

// 選択されているポケモンを表示
async function displayPokeDex() {
    const pokeDexElement = document.getElementById("pokeDex");
    pokeDexElement.innerHTML = '';
    const getPokeNums  = Object.keys(getPoke).filter(key => getPoke[key] >= 1).map(Number);
    console.log(getPokeNums, 'PokeNums');
    changeState('dex')
    for (const pokeId of getPokeNums) {
        console.log(pokeId, 'PokeId');
        const newDiv = document.createElement('div');
        newDiv.innerHTML = await pokeHTML(pokeId);
        pokeDexElement.appendChild(newDiv);
    }
}

// 素数判定する関数
function isPrime(n) {
    if (n <= 1) {
        return false;
    } else if (n <= 3) {
        return true;
    } else if (n % 2 === 0 || n % 3 === 0) {
        return false;
    }
    let i = 5;
    while (i * i <= n) {
        if (n % i === 0 || n % (i + 2) === 0) {
            return false;
        }
        i += 6;
    }
    return true;
}
// 素因数分解する関数
async function primeFactors(n) {
    // 文字列を数値として扱う
    n = Number(n);
    const factors = [];
    // デカい素数を入れたときに、これだと時間かかる。例:33550337
    // でも、素因数がデカい合成数はなぜか速い。例:67100674
    // if (n < 2) {
    if (n < 2 || isPrime(n)) {
        factors.push(n);
    }else{
        let divisor = 2;
        while (n >= 2) {
            if (n % divisor === 0) {
                factors.push(divisor);
                n /= divisor;
            } else {
                divisor++;
            }
        }
    }
    return factors;
}
// 素因数分解結果をΠn^mで表す関数（HTML表示）
function primeFactorProductHTML(factors) {
    const product = {};

    for (let i = 0; i < factors.length; i++) {
        const factor = factors[i];
        product[factor] = (product[factor] || 0) + 1;
    }

    let result = '';
    for (const factor in product) {
        if (product.hasOwnProperty(factor)) {
            if (result !== '') {
                result += ' * ';
            }
            if (product[factor] === 1) {
                result += factor;
            } else {
                result += `${factor}<sup>${product[factor]}</sup>`;
            }
        }
    }
    return result;
}
// ランダムな合成数を返す関数
function generateRandomNumber(factors) {
    if (factors.length === 1) {
        // 素数等の場合、その数を返す
        return factors[0];
    } else {
        let result = 1;
        while (result == 1) {
            const product = {};
            for (let i = 0; i < factors.length; i++) {
                const factor = factors[i];
                product[factor] = (product[factor] || 0) + 1;
            }
            for (const factor in product) {
                if (product.hasOwnProperty(factor)) {
                    const exponent = getRandomInt(product[factor]);
                    result *= Math.pow(factor, exponent);
                }
            }
        }
        return result;
    }
}


// 引数の約数(ポケモンNo.)を返す。存在しなければ0を返す
async function convertNumToPokeNum(number){
    const factors = await primeFactors(number);
    console.log(factors, 'factors');
    if (findMin(factors) < 2 || maxPoke < findMin(factors)) {
        return 0;
    } else {
        let n = maxPoke + 1;
        while (maxPoke < n) {
            n = generateRandomNumber(factors);
        }
        return n;
    }
}


let clickedNum = 0;
async function clickNumber(number){
    clickedNum = number;
    if (state == 'main') {
        const conNum = await convertNumToPokeNum(clickedNum);
        console.log(conNum, 'Divisor');
        if (conNum) {
            // 約数にポケモンが存在するので、エンカウントチャンスのある素因数分解をする
            gameStartTime = currentUnixTime();
            const gameNumElement = document.getElementById('gameNum');
            gameNumElement.textContent = number;

            changeState('game');
            const timer = document.getElementById("pokePF_timer");
            timer.value = limitSeconds;
            setInterval(() => {
                remainSeconds = limitSeconds + gameStartTime - currentUnixTime();
                timer.value = remainSeconds;
                if (remainSeconds <= 0 && state == 'game') {
                    // gameover
                    gameover(0);
                }
            }, 1000);
        } else {
            console.log('sorry!');
            gameover(0);
            const resultTextElement = document.getElementById("resultText");
            resultTextElement.textContent = 'Sorry! Not prepared';
        }
    }
}
// let canEncount = true;
// function existPoke(is = true){
//     const timer_3 = document.getElementById("pokePF_timer_3");
//     if (is) {
//         canEncount = true;
//         timer_3.style.backgroundColor = '#afffaf';
//     } else {
//         canEncount = true;
//         timer_3.style.backgroundColor = '#afafff';
//     }
// }

async function sendNum(){
    // 入力を数値として扱う
    const number = Number(document.getElementById("pokePrime").value);
    const gameNumElement = document.getElementById('gameNum');
    const factors = await primeFactors(gameNumElement.textContent);
    // console.log(factors, 'factors');
    if (isPrime(number) && factors.includes(number)) {
        gameNumElement.textContent /= number;
    }
    if (state == 'game' && gameNumElement.textContent == 1) {
        // clear
        gameover(remainSeconds);
    }
}

function gameover(seconds){
    const resultTextElement = document.getElementById("resultText");
    const resultButtonElement = document.getElementById("resultButton");
    const resultGetButtonElement = document.getElementById("resultGetButton");
    resultButtonElement.style.display = 'block';
    resultGetButtonElement.style.display = 'none';
    const gotPoke = document.getElementById("pokePF_result_gotPoke");
    gotPoke.style.display = 'none';
    if (0 < seconds) {
        resultTextElement.textContent = 'Clear!';
        if (limitSeconds / 2 < seconds) {
            if (limitSeconds * 5 / 6 < seconds) {
                encountPoint += (4 + encountPointBase);
            } else if (limitSeconds * 4 / 6 < seconds) {
                encountPoint += (2 + encountPointBase);
            } else {
                encountPoint += (1 + encountPointBase);
            }
            pointDisplay('encount');
            if (encountMax <= encountPoint) {
                resultButtonElement.style.display = 'none';
                resultGetButtonElement.style.display = 'block';
            }
        } else {
            if (limitSeconds * 2 / 6 < seconds) {
                ballPoint += 4;
            } else if (limitSeconds * 1 / 6 < seconds) {
                ballPoint += 2;
            } else {
                ballPoint += 1;
            }
            pointDisplay('ball');
        }
    } else {
        resultTextElement.textContent = 'gameover';
    }
    changeState('result');
}
function exitResult(){
    console.log('exitResult');
    changeState('main');
    if (ballMax <= ballPoint) {
        ballGrade ++;
        if (ballGrade > 3) {
            ballGrade = 3;
            ballPoint = ballMax-1;
        }else{
            ballPoint -= 8;
        }
    }
    displayNowBall();
    pointDisplay('ball');
    displayPoke(randamPokeIndex());
}
function displayNowBall(){
    const nowBall = document.getElementById("pokePF_nowBall");
    switch (ballGrade) {
        case 0:
            nowBall.textContent = 'pokeball';
            break;
        case 1:
            nowBall.textContent = 'greatball';
            break;
        case 2:
            nowBall.textContent = 'ultraball';
            break;
        case 3:
            nowBall.textContent = 'masterball';
            break;
        default:
            nowBall.textContent = 'pokeball';
            break;
    }
}

const encountMax = 8;
let encountPoint = 0;
const ballMax = 8;
let ballPoint = 0;
let ballGrade = defaultBall;
function pointDisplay(bar = 'ball'){
    if (bar == 'ball') {
        for (let i = 0; i < ballMax; i++) {
            if (i < ballPoint) {
                document.getElementById(`pokePF_ball_${i}`).style.backgroundColor = '#7f7fff'
            } else {
                document.getElementById(`pokePF_ball_${i}`).style.backgroundColor = 'var(--pokeBackgroundColor)'
            }
        }
    } else {
        for (let i = 0; i < encountMax; i++) {
            if (i < encountPoint) {
                document.getElementById(`pokePF_encount_${i}`).style.backgroundColor = '#5fff5f'
            } else {
                document.getElementById(`pokePF_encount_${i}`).style.backgroundColor = 'var(--pokeBackgroundColor)'
            }
        }
    }
}

let encountPokeNum = 1;
async function getChance(){
    encountPoint = 0;
    pointDisplay('encount');
    document.getElementById("pokePF_get_encPoke").innerHTML = `
        <p id="pokeName_get">Name</p>
        <img id="pokeImg_get" src="" alt="Sprite">
    `;
    changeState('get');

    const conNum = await convertNumToPokeNum(clickedNum);
    encountPokeNum = conNum;
    // console.log(conNum, 'dividorNum');
    if (conNum) {
        // 約数のポケモンを表示する
        displayPoke(conNum);
    }
}
function throwBall(){
    let isGot = false;
    const gotPoke = document.getElementById("pokePF_result_gotPoke");
    const resultTextElement = document.getElementById("resultText");
    const resultButtonElement = document.getElementById("resultButton");
    const resultGetButtonElement = document.getElementById("resultGetButton");
    resultButtonElement.style.display = 'block';
    resultGetButtonElement.style.display = 'none';
    if (state == 'get') {
        if (getRandomInt(3 - ballGrade) == 0) {
            isGot = true;
            getPoke[encountPokeNum] = (getPoke[encountPokeNum] || 0) + 1;
            console.log(getPoke, 'GotPokeNum');
            savePokeData();
            resultTextElement.textContent = 'Get!!!';
            gotPoke.style.display = 'block';
        } else {
            resultTextElement.textContent = 'Get failed';
            gotPoke.style.display = 'none';
        }
        gotPoke.innerHTML = `
            <p id="pokeName_result">Name</p>
            <img id="pokeImg_result" src="" alt="Sprite">
        `;
        changeState('result');
        ballGrade = defaultBall;
        displayNowBall();
        if (isGot) {   
            displayPoke(encountPokeNum);
        }
    }

}


let small = false;
// switch,open,close
function windowSize(action = 'switch'){
    const elememt = document.getElementById("poke-right-top");
    const content = document.getElementById("rtContent");
    if (action == 'open' || (action == 'switch' && small)) {
        elememt.style.width = '10em';
        elememt.style.height = '15em';
        content.style.display = 'block';
        small = false;
        displayPoke(randamPokeIndex());
    } else if (action == 'close' || (action == 'switch' && !small)) {
        elememt.style.width = '0';
        elememt.style.height = '0';
        content.style.display = 'none';
        small = true;
    }
}

// main,game,result,get,dex
const addDiv = `
    <div id="poke-right-top">
        <div id="sizeButton"></div>
        <div id="rtContent">
            <div>
                <div id="pokePF_encounts">
                    <div id="pokePF_encount_0" class="pokePF_encount_box"></div>
                    <div id="pokePF_encount_1" class="pokePF_encount_box"></div>
                    <div id="pokePF_encount_2" class="pokePF_encount_box"></div>
                    <div id="pokePF_encount_3" class="pokePF_encount_box"></div>
                    <div id="pokePF_encount_4" class="pokePF_encount_box"></div>
                    <div id="pokePF_encount_5" class="pokePF_encount_box"></div>
                    <div id="pokePF_encount_6" class="pokePF_encount_box"></div>
                    <div id="pokePF_encount_7" class="pokePF_encount_box"></div>
                </div>
                <div id="pokePF_balls">
                    <div id="pokePF_ball_0" class="pokePF_ball_box"></div>
                    <div id="pokePF_ball_1" class="pokePF_ball_box"></div>
                    <div id="pokePF_ball_2" class="pokePF_ball_box"></div>
                    <div id="pokePF_ball_3" class="pokePF_ball_box"></div>
                    <div id="pokePF_ball_4" class="pokePF_ball_box"></div>
                    <div id="pokePF_ball_5" class="pokePF_ball_box"></div>
                    <div id="pokePF_ball_6" class="pokePF_ball_box"></div>
                    <div id="pokePF_ball_7" class="pokePF_ball_box"></div>
                </div>
            </div>
            <div id="pokePF_nowBall">pokeball</div>
            <br>
            <div id="pokePF_display">
                <div id="pokePF_main">
                    <p id="pokeName_notice">Click Number!<p>
                    <p id="pokeName_main">Name</p>
                    <img id="pokeImg_main" src="" alt="Sprite">
                    <button id="mainButton">PokeDex</button>
                </div>
                <div id="pokePF_game">
                    <progress id="pokePF_timer" value="${limitSeconds}" max="${limitSeconds}"></progress>
                    <div id="pokePF_timers">
                        <div id="pokePF_timer_0" class="pokePF_timer_box"></div>
                        <div id="pokePF_timer_1" class="pokePF_timer_box"></div>
                        <div id="pokePF_timer_2" class="pokePF_timer_box"></div>
                        <div id="pokePF_timer_3" class="pokePF_timer_box"></div>
                        <div id="pokePF_timer_4" class="pokePF_timer_box"></div>
                        <div id="pokePF_timer_5" class="pokePF_timer_box"></div>
                    </div>
                    <p id="gameNum">1</p>
                    <input type="number" id="pokePrime" min="2" value="">
                    <button id="sendButton">Wall</button>
                </div>
                <div id="pokePF_result">
                    <p id="resultText">clear</p>
                    <div id="pokePF_result_gotPoke">
                        <p id="pokeName_result">Name</p>
                        <img id="pokeImg_result" src="" alt="Sprite">
                    </div>
                    <button id="resultButton">Exit</button>
                    <button id="resultGetButton">Get</button>
                </div>
                <div id="pokePF_get">
                    <div id="pokePF_get_encPoke">
                        <p id="pokeName_get">Name</p>
                        <img id="pokeImg_get" src="" alt="Sprite">
                    </div>
                    <div id="pokePF_getBall"><img src="" alt="ball"></div>
                    <button id="throwButton">Throw</button>
                </div>
                <div id="pokePF_dex">
                    <div id="pokeDex"></div>
                    <button id="dexButton">Exit</button>
                </div>
            </div>
        </div>
    </div>
`;
const before = '<mark class="poke-highlight">';
const after = '</mark>';
const regexNum = new RegExp('[0-9]+', 'g');
// HTMLテキストの数字をマークアップする関数
function markNumbers() {
    const body = document.body;
    const text = body.innerHTML;
    const newText = text.replace(/(^[^<]*<)|(>[^><]+<)|(>[^>]+$)/g, (_, group1, group2, group3) => {
        if (group1 !== undefined) {
            return `${addDiv}${group1.replace(regexNum, match => `${before}${match}${after}`)}`;
        } else if (group2 !== undefined) {
            return group2.replace(regexNum, match => `${before}${match}${after}`);
        } else if (group3 !== undefined) {
            return group3.replace(regexNum, match => `${before}${match}${after}`);
        }
    });
    body.innerHTML = newText;
    
    // マークされた数字をクリックしたときの処理
    document.querySelectorAll('.poke-highlight').forEach(elememt => {
        elememt.addEventListener('click', event => {
            const number = event.target.textContent;
            console.log(number, 'ClickNum');
            clickNumber(number);
            windowSize('open');
        });
    });
    document.querySelector('#sizeButton').addEventListener('click', () => windowSize());
    document.querySelector('#mainButton').addEventListener('click', () => displayPokeDex());
    document.querySelector('#sendButton').addEventListener('click', () => sendNum());
    document.querySelector('#pokePrime').addEventListener('keypress', function(event) {
        // 入力欄でEnterを押すと関数を実行
        if (event.key === "Enter") {
            sendNum();
        }
    });
    document.querySelector('#throwButton').addEventListener('click', () => throwBall());
    document.querySelector('#resultButton').addEventListener('click', () => exitResult());
    document.querySelector('#resultGetButton').addEventListener('click', () => getChance());
    document.querySelector('#dexButton').addEventListener('click', () => exitResult());
    pointDisplay('ball');
    pointDisplay('encount');
    displayNowBall();
}
markNumbers();
displayPoke(randamPokeIndex());
changeState();
savePokeData();
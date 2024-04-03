// 

console.log('extention');

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

const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
const maxPoke = 1025;
// 引数の番号のポケモンのデータを取得
async function fetchPoke(pokeId){
    // console.log(pokeId);

    const url = `${apiUrl}${pokeId}`;
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
// 選択されているポケモンを表示
async function displayPoke(n) {
    const pokeId = n;
    const spriteValue = "front_default";
    const pokeNumElement = document.getElementById('pokeNum');
    const pokeNameElement = document.getElementById('pokeName');
    const pokeImgElement = document.getElementById('pokeImg');
    try {
        const data = await fetchPoke(pokeId);
        console.log(data);

        if (data) {
            const pokeName = data.name;
            const pokeImg = data.sprites[spriteValue];

            pokeNumElement.textContent = pokeId;
            pokeNameElement.textContent = `Name: ${pokeName}`;
            pokeImgElement.src = pokeImg;
            console.log(pokeImgElement);
        }
    } catch (error) {
        console.log('データの表示中にエラーが発生しました', error);
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
            // console.log(product);
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
    console.log(factors);
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



async function clickNumber(number){
    const rtContent = document.getElementById("rtContent");
    const conNum = await convertNumToPokeNum(number);
    console.log(conNum);
    if (conNum) {
        // 約数にポケモンが存在するので、エンカウントチャンスのある素因数分解をする
        displayPoke(conNum);
        rtContent.style.backgroundColor = '#ff0000';
    } else {
        // ここは、約数にポケモンが存在しないとき
        // 2以上なら素因数分解させる(0,1の時はどうする？)
        rtContent.style.backgroundColor = '#0000ff';
    }
}
async function sendNum(){
    // 入力を数値として扱う
    const number = Number(document.getElementById("pokePrime").value);
    const pokeNumElement = document.getElementById('pokeNum');
    const factors = await primeFactors(pokeNumElement.textContent);
    // console.log(factors);
    // console.log(factors.includes(number));
    if (isPrime(number) && factors.includes(number)) {
        pokeNumElement.textContent /= number;
        displayPoke(document.getElementById('pokeNum').textContent);
    }
}




let small = false;
// switch,open,close
function windowSize(action = 'switch'){
    const elememt = document.getElementById("poke-right-top");
    const content = document.getElementById("rtContent");
    if (action == 'open' || (action == 'switch' && small)) {
        elememt.style.width = '24em';
        elememt.style.height = '20em';
        content.style.display = 'block';
        small = false;
    } else if (action == 'close' || (action == 'switch' && !small)) {
        elememt.style.width = '0';
        elememt.style.height = '0';
        content.style.display = 'none';
        small = true;
    }
}

const addDiv = `
    <div id="poke-right-top">
        <div id="sizeButton"></div>
        <div id="rtContent">
            Hello World!
            <div>
                <p id="pokeNum">1</p>
                <p id="pokeName">Name</p>
                <img id="pokeImg" src="" alt="Sprite">
                <div>
                    <input type="number" id="pokePrime" min="2" value="">
                    <button id="sendButton">Go</button>
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
            console.log(number);
            clickNumber(number);
            windowSize('open');
        });
    });
    document.querySelector('#sizeButton').addEventListener('click', () => windowSize());
    document.querySelector('#sendButton').addEventListener('click', () => sendNum());
}
markNumbers();

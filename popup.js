// 

let getPoke = {};
getPoke[1] = 1;
getPoke[2] = 1;
getPoke[3] = 1;
getPoke[4] = 1;
getPoke[5] = 1;
getPoke[6] = 1;
getPoke[7] = 1;
getPoke[8] = 1;
getPoke[9] = 1;

function loadPokeData(){
    const loadData = JSON.parse(sessionStorage.getItem('myPokeData'));
    if (loadData) {
        getPoke = loadData;
    }
}
loadPokeData();

const apiUrl = 'https://pokeapi.co/api/v2/';

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
async function displayPoke() {
    const pokeDexElement = document.getElementById("pokeDex");
    const getPokeNums  = Object.keys(getPoke).filter(key => getPoke[key] >= 1).map(Number);
    
    for (const pokeId of getPokeNums) {
        const newDiv = document.createElement('div');
        newDiv.innerHTML = await pokeHTML(pokeId);
        pokeDexElement.appendChild(newDiv);
    }
}
displayPoke();
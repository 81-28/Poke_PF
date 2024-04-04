
let getPoke = {};
getPoke[1] = 1;
// function loadPokeData(){
//     getPoke = JSON.parse(sessionStorage.getItem('myPokeData'));
//     console.log('Load Data:', getPoke);
// }

const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

// 引数の番号のポケモンのデータを取得
async function fetchPoke(pokeId){
    console.log(pokeId);

    const url = `${apiUrl}${pokeId}`;
    console.log(url);
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



async function pokeHTML(pokeId){
        const spriteValue = "front_default";
        try {
            const data = await fetchPoke(pokeId);

            if (data) {
                return `
                    <p id="pokeName">${data.name}</p>
                    <img id="pokeImg" src="${data.sprites[spriteValue]}" alt="Sprite">
                `;
            }
        } catch (error) {
            console.log('データの表示中にエラーが発生しました', error);
            return '';
        }
}

// 選択されているポケモンを表示
function displayPoke() {
    const pokeDexElement = document.getElementById("pokeDex");
    const getPokeNums  = Object.keys(getPoke).filter(key => getPoke[key] >= 1).map(Number);
    getPokeNums.forEach((num, inedx) => {
        const pokeId = num;
        const newDiv = document.createElement('div');
        // newDiv.innerHTML = pokeHTML(pokeId);
        newDiv.innerHTML = pokeId;
        pokeDexElement.appendChild(newDiv);
    });

}


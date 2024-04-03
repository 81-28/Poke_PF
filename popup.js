

const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

const pokeNum = document.getElementById('num');
const pokeNameElement = document.getElementById('pokeName');
const pokeImgElement = document.getElementById('pokeImg');

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

// 選択されているポケモンを表示
async function displayPoke() {
    const pokeId = pokeNum.value;
    const spriteValue = "front_default";
    try {
        const data = await fetchPoke(pokeId);
        console.log(data);

        if (data) {
            const pokeName = data.name;
            const pokeImg = data.sprites[spriteValue];

            pokeNameElement.textContent = `Name: ${pokeName}`;
            pokeImgElement.src = pokeImg;
        }
        console.log(pokeImg);
    } catch (error) {
        console.log('データの表示中にエラーが発生しました', error);
    }
}

function numChange(){
    if(pokeNum.value < 1){
        pokeNum.value = 1;
    }else if(pokeNum.value > 1025){
        // pokeNum.value = 1025;
    }
    displayPoke();
}
numChange();
pokeNum.addEventListener('change', () => {
    numChange();
});


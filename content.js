
// // ページが読み込まれたときに実行される関数
// function addMarkToNumbers() {
//     const nodes = document.querySelectorAll('*:not(script):not(style)');
//     console.log(nodes);
//     nodes.forEach(node => {
//         // ページ内のテキストを取得
//         var pageText = node.innerHTML;
//         // 正規表現を使用して数字を検索し、<mark>タグを追加する
//         var modifiedText = pageText.replace(/[0-9]+/g, function(match) {
//             return '<mark>' + match + '</mark>';
//         }); 
//         // ページ内のテキストを更新
//         node.innerHTML = modifiedText;
//     });
// }

// // ページが読み込まれたときにaddMarkToNumbers関数を実行
// addMarkToNumbers();


console.log('extention');

function escapeHTML(text){
    const box = document.createElement('p');
    box.textContent = text;
    return box.innerHTML;
}
const tag = document.getElementById("tag");
if (tag) {
    tag.innerHTML = escapeHTML('<p>8128</p>');
}

const before = '<span style="color: #ff0000;">';
const after = '</span>';
// HTMLテキストの数字をマークアップする関数
function markNumbers() {
    const body = document.body;
    const text = body.innerHTML;
    const newText = text.replace(/(^[^<]+<)|(>[^<]+<)|(>[^>]+$)/g, (_, group1, group2, group3) => {
        if (group1 !== undefined) {
            return group1.replace(/[0-9]+/g, match => `<mark>${match}</mark>`);
        } else if (group2 !== undefined) {
            console.log(group2);
            return group2.replace(/[0-9]+/g, match => `${before}${match}${after}`);
        } else if (group3 !== undefined) {
            return group3.replace(/[0-9]+/g, match => `<mark>${match}</mark>`);
        }
    });
    body.innerHTML = newText;
}
markNumbers();

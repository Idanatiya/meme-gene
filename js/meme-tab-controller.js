'use strict';

// function onInitMemes() {
//     renderMemes();
// }


function renderMemes() {
    const memes = loadFromStorage('memeDB');
    const elMemeContainer = document.querySelector('.meme-grid-container');
    if (memes.length === 0 || !memes) return elMemeContainer.innerHTML = '<h1 class="flex justify-center">You didnt save any memes yet</h1>';
    const strHtmls = memes.map(memeData => {
        return `
        <div class="meme-card">
            <img src="${memeData}" />
        </div>`
    }).join('');
    elMemeContainer.innerHTML = strHtmls;
}

function onDeleteMemes() {
    deleteMemes();
    renderMemes();
}




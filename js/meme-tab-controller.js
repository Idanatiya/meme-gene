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


function drawRect(x, y) {
    let modeSelectedIdx;
    const meme = getCurrMeme();
    if (gFocusMode === 'line') {
        modeSelectedIdx = meme.lines[meme.selectedLineIdx];
    } else {
        modeSelectedIdx = meme.stickers[meme.selectedStickerIdx];
    }
    const memeTxt = meme.lines[meme.selectedLineIdx].txt;
    const yRectSize = -meme.lines[meme.selectedLineIdx].size;
    gCtx.beginPath();
    gCtx.lineWidth = 4;
    gCtx.fillStyle = '#ffffff60';
    gCtx.strokeRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
    gCtx.fillRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
}



function drawRect(x, y) {
    const meme = getCurrMeme();
    const memeTxt = meme.lines[meme.selectedLineIdx].txt;
    const yRectSize = -meme.lines[meme.selectedLineIdx].size;
    gCtx.beginPath();
    gCtx.lineWidth = 4;
    gCtx.fillStyle = '#ffffff60';
    gCtx.strokeRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
    gCtx.fillRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
}

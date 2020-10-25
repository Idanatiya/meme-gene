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


// function drawRect(x, y) {
//     let modeSelectedIdx;
//     const meme = getCurrMeme();
//     if (gFocusMode === 'line') {
//         modeSelectedIdx = meme.lines[meme.selectedLineIdx];
//     } else {
//         modeSelectedIdx = meme.stickers[meme.selectedStickerIdx];
//     }
//     const memeTxt = meme.lines[meme.selectedLineIdx].txt;
//     const yRectSize = -meme.lines[meme.selectedLineIdx].size;
//     gCtx.beginPath();
//     gCtx.lineWidth = 4;
//     gCtx.fillStyle = '#ffffff60';
//     gCtx.strokeRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
//     gCtx.fillRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
// }



// function drawRect(x, y) {
//     const meme = getCurrMeme();
//     const memeTxt = meme.lines[meme.selectedLineIdx].txt;
//     const yRectSize = -meme.lines[meme.selectedLineIdx].size;
//     gCtx.beginPath();
//     gCtx.lineWidth = 4;
//     gCtx.fillStyle = '#ffffff60';
//     gCtx.strokeRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
//     gCtx.fillRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
// }


// function onStartDrag(ev) {
//     ev.preventDefault();
//     gCtx.beginPath();
//     console.log('event:', ev);
//     gIsDrag = true;
//     onCanvasClicked(ev);
//     var rect = document.querySelector('#my-canvas').getBoundingClientRect();
//     const x = ev.touches ? ev.touches[0].clientX - rect.left : ev.offsetX;
//     const y = ev.touches ? ev.touches[0].clientY - rect.top : ev.offsetY;
//     gCtx.moveTo(x, y);
// }


// function onDownloadCanvas(elLink) {
//     // const meme = getCurrMeme();
//     const currSelectedIdx = getCurrSelectedIdx();
//     const currStickerIdx = meme.selectedStickerIdx;
//     console.log('idx:', currSelectedIdx);

//     //put the selected idx to imaginary one for few secs and render to update the canvav
//     meme.selectedLineIdx = 50;
//     meme.selectedStickerIdx = 50;
//     // renderCanvas();
//     // const data = elCanvas.toDataURL('image/png');
//     // elLink.href = data;


//     const meme = getCurrMeme();
//     const imgSelected = getImgById(meme.selectedImgId);
//     const img = new Image();
//     img.src = `${imgSelected.url}`;
//     img.onload = () => {
//         gCtx.drawImage(img, 0, 0, elCanvas.width, elCanvas.height)
//         drawLines();
//         drawStickers();
//         const data = elCanvas.toDataURL('image/png');
//         elLink.href = data;
//     }


    // meme.selectedLineIdx = currSelectedIdx;
    // meme.selectedStickerIdx = currStickerIdx;
    // setTimeout(() => {
    //     const data = elCanvas.toDataURL('image/png');
    //     elLink.href = data;
    //     meme.selectedLineIdx = currSelectedIdx;
    //     meme.selectedStickerIdx = currStickerIdx;
    //     console.log('exetcued');
    //     //Render the rectangle again
    //     renderCanvas()
    // }, 300)
    // console.log('idx:', getCurrSelectedIdx())

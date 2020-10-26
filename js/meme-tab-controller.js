'use strict';



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
// function loadMemeToCanvas(imgUrl) {
//     renderStickers();
//     const img = new Image();
//     img.onload = function () {
//         console.log(`width and height: ${this.width}, ${this.height}`);
//         const imgWidth = this.width;
//         const imgHeight = this.height;
//         const calcFormula = (imgHeight * gCanvas.width) / imgWidth;
//         gFocusMode = 'line';
//         gCtx.drawImage(img, 0, 0, elCanvas.width, elCanvas.height);
//         resizeCanvas();
//     }
//     img.src = `${imgUrl}`;
// }


// function loadMemeToCanvas(imgUrl) {
//     renderStickers();

//     var elContainer = document.querySelector('.canvas-container');
//     console.log(elContainer);
//     console.log('mmm', elContainer.offsetWidth, elContainer.offsetHeight);
//     const img = new Image();
//     img.src = `${imgUrl}`;
//     img.onload = function () {
//         const imgWidth = this.width;
//         const imgHeight = this.height;
//         const ratio = imgWidth / imgHeight;
//         console.log('ratio:', ratio);
//         if (ratio > 1) {
//             elCanvas.width = Math.min(elContainer.offsetWidth, imgWidth);
//             console.log('in ratrio height > 1', elCanvas.height / ratio);
//             elCanvas.height = elCanvas.height / ratio;
//             console.log('img is  rohvit!', elCanvas.width, elCanvas.height);
//         } else {
//             elCanvas.height = Math.min(elContainer.offsetHeight, imgHeight);
//             elCanvas.width = elCanvas.height * ratio;
//         }
//         console.log(elCanvas.height, elCanvas.width);
//         // console.log(`width and height: ${this.width}, ${this.height}`);

//         // const calcCanvasHeight = (imgHeight * elCanvas.width) / imgWidth;
//         // elCanvas.height = calcCanvasHeight;
//         // console.log('canvas height:', elCanvas.height)
//         gFocusMode = 'line';
//         gCtx.drawImage(img, 0, 0, elCanvas.width, elCanvas.height);
//         renderCanvas();
//     }
// }
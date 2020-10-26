'use strict';
console.log('Js is running!');

var elCanvas;
var gCtx;
var gIsDrag;
var gFocusMode;



function onInit() {
    init();
    renderImgs();
    renderKeyWords();
    elCanvas = document.querySelector('#my-canvas');
    gCtx = elCanvas.getContext('2d');
    const numOfMemes = getSavedMemes();
    document.querySelector('.num-saved').innerText = `(${numOfMemes})`
}


function resizeCanvas() {
    if (window.innerWidth < 720) {
        elCanvas.width = 300;
        elCanvas.height = 300;
    } else {
        elCanvas.width = 600;
        elCanvas.height = 600;
    }
    console.log('RESIZING');
    renderCanvas();
}


function onOpenMemeTab() {
    renderMemes();
    const elImgsContainer = document.querySelector('.img-gallery-container');
    const elEditorContainer = document.querySelector('.meme-editor-container');
    const elMemeTabContainer = document.querySelector('.meme-tab-container');
    if (!elImgsContainer.classList.contains('hide')) {
        toggleElement(elImgsContainer, 'hide')
        toggleElement(elMemeTabContainer, 'hide');
    }
    else {
        elEditorContainer.style.display = 'none';
        elMemeTabContainer.style.display = 'block';
        renderMemes();
    }
}

function onNextPage() {
    nextPage();
    renderStickers();
}

function onPrevPage() {
    prevPage();
    renderStickers();
}

function renderImgs() {
    const elImgsContainer = document.querySelector('.grid-container');
    const imgs = getImgsForDisplay();
    const strHtmls = imgs.map(img => {
        return `
        <div class="card" onclick="onSelectImg(${img.id})" data-imgId="${img.id}">
            <img class="card-img" src="${img.url}"  />
        </div>
        `
    })
    elImgsContainer.innerHTML = strHtmls.join('');
    if (!imgs.length) elImgsContainer.innerHTML = '<h1 class="flex justify-center">We couldnt find a meme for your search</h1>'

}

function renderKeyWords() {
    const elKeyWordList = document.querySelector('.keyword-list');
    const keywords = getKeyWords();
    const strHtmls = keywords.map(keyword => {
        return `<li onclick="onFilterByClick(this)">${keyword}</li>`
    })
    elKeyWordList.innerHTML = strHtmls.join('');
}

function renderStickers() {
    const stickers = getStickers();
    const strHtmls = stickers.map(sticker => {
        return `<li>
                    <img onclick="onAddSticker(this,'${sticker.id}')" src="imgs/stickers/${sticker.url}.png" alt="sticker" />
                </li>`
    })
    document.querySelector('.stickers-list').innerHTML = strHtmls.join('');
}

function onAddSticker(elSticker, stickerId) {
    gFocusMode = 'sticker';
    addSticker(stickerId, elSticker.width, elSticker.height);
    drawSticker(stickerId);
    renderCanvas();
}

function drawSticker(stickerId) {
    const sticker = getStickerById(stickerId);
    var img = new Image()
    img.src = `imgs/stickers/${sticker.url}.png`;
    img.onload = () => {
        gCtx.drawImage(img, sticker.coords.x, sticker.coords.y, sticker.stickerWidth, sticker.stickerHeight)
    }
}


function onFilterByClick(elKeyword) {
    const keyword = elKeyword.innerText;
    setSearchTerm(keyword);
    const currFontSize = getFontSize(keyword);
    if (currFontSize > 75) return;
    elKeyword.style.fontSize = `${currFontSize}px`;
    renderImgs();
}


function onSelectImg(imgId) {
    const elImgsContainer = document.querySelector('.img-gallery-container');
    const elEditorContainer = document.querySelector('.meme-editor-container');
    toggleElement(elImgsContainer, 'hide');
    toggleElement(elEditorContainer, 'hide')
    const img = getImgById(imgId);
    setSelectedMeme(imgId)
    loadMemeToCanvas(img.url)
}


function onSetSearchTerm(searchTerm) {
    setSearchTerm(searchTerm)
    renderImgs();
}


function onSaveMeme() {
    removeFocusBoxOnSave();
    showAlert();
}

function removeFocusBoxOnSave() {
    const meme = getCurrMeme();
    const currLineIdx = meme.selectedLineIdx;
    const currStickerIdx = meme.selectedStickerIdx;
    meme.selectedLineIdx = 50;
    meme.selectedStickerIdx = 50;
    console.log('idx changed to:', meme.selectedLineIdx);
    renderCanvas();
    setTimeout(() => {
        const imgData = elCanvas.toDataURL('image/png');
        saveCanvas(imgData);
        meme.selectedLineIdx = currLineIdx;
        meme.selectedStickerIdx = currStickerIdx;
        renderCanvas()
        const numOfMemes = getSavedMemes();
        document.querySelector('.num-saved').innerText = `(${numOfMemes})`;
    }, 100)
    console.log('idx changed to:', meme.selectedLineIdx);


}


function onDownloadCanvas(elLink) {
    const meme = getCurrMeme();
    const currSelectedIdx = getCurrSelectedIdx();
    const currStickerIdx = meme.selectedStickerIdx;
    console.log('idx:', currSelectedIdx);

    //put the selected idx to imaginary one for few secs and render to update the canvav
    meme.selectedLineIdx = 50;
    meme.selectedStickerIdx = 50;
    renderCanvas();
    setTimeout(() => {
        const data = elCanvas.toDataURL('image/png');
        elLink.href = data;
        meme.selectedLineIdx = currSelectedIdx;
        meme.selectedStickerIdx = currStickerIdx;
        console.log('exetcued');
        //Render the rectangle again
        renderCanvas()
    }, 300)
    console.log('idx:', getCurrSelectedIdx())
}

function showAlert() {
    const elAlert = document.querySelector('.meme-save-modal');
    elAlert.style.display = 'block';
    setTimeout(() => {
        elAlert.style.display = 'none';
    }, 1500)
}


function onManageFontSize(diff) {
    const meme = getCurrMeme();
    if (gFocusMode === 'line') manageFontSize(meme.selectedLineIdx, diff)
    else manageStickerSize(diff);
    renderCanvas()
}
function onDeleteLine() {
    const meme = getCurrMeme();
    if (gFocusMode === 'line') {
        deleteLine();
    } else {
        deleteSticker();
        if (!meme.stickers.length) {
            gFocusMode = 'line'
        }
    }
    renderCanvas();
}


function onChangeLineProp(prop, value) {
    console.log('prop:', prop);
    console.log('value:', value);
    changeLineProp(prop, value);
    renderCanvas();
}


function onManageAlignment(direction) {
    const meme = getCurrMeme();
    const txtWidth = gCtx.measureText(meme.lines[meme.selectedLineIdx].txt).width;
    switch (direction) {
        case 'left':
            manageAlignment(elCanvas.width - txtWidth);
            break;
        case 'center':
            manageAlignment(elCanvas.width / 2);
            break;
        case 'right':
            manageAlignment(0)
            break;
    }
    renderCanvas();
}


function onAddLine() {
    gFocusMode = 'line';
    addLine();
    switchLines();
    renderCanvas();
    document.querySelector('.add-txt').value = '';
}


function onSwitchLines() {
    switchLines();
    const meme = getCurrMeme();
    renderCanvas();
    document.querySelector('.add-txt').value = meme.lines[meme.selectedLineIdx].txt;
}


function onTxtChange(elInput) {
    const txt = elInput.value;
    const selectedLineIdx = getCurrSelectedIdx();
    txtChange(selectedLineIdx, txt);
    renderCanvas();
}



function onManageFontSize(diff) {
    const meme = getCurrMeme();
    if (gFocusMode === 'line') manageFontSize(meme.selectedLineIdx, diff)
    else manageStickerSize(diff);
    renderCanvas()
}


function onManageDirection(diff) {
    const meme = getCurrMeme();
    manageDirection(meme.selectedLineIdx, diff);
    renderCanvas();
}


function renderCanvas() {
    const meme = getCurrMeme();
    const imgSelected = getImgById(meme.selectedImgId);
    const img = new Image();
    img.src = `${imgSelected.url} `;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, elCanvas.width, elCanvas.height)
        drawLines();
        drawStickers();
    }
}

function drawStickers() {
    const meme = getCurrMeme();
    const memeStickers = getMemeStickers();
    memeStickers.forEach((sticker, idx) => {
        drawSticker(sticker.id);
        if (idx === meme.selectedStickerIdx && gFocusMode === 'sticker') drawStickerRect(sticker.coords.x, sticker.coords.y)
    })
}


function drawLines() {
    const meme = getCurrMeme();
    meme.lines.forEach((line, idx) => {
        // console.log(`painting rect in pos: ${ line.coords.x }, ${ line.coords.y } `);
        drawText(line)
        if (idx === meme.selectedLineIdx && gFocusMode === 'line') drawRect(line.coords.x, line.coords.y)
    })
}

function drawText(line) {
    gCtx.lineWidth = 2;
    gCtx.font = `${line.size}px ${line.font} `;
    gCtx.textAlign = line.align;
    gCtx.fillStyle = line.color;
    gCtx.fillText(line.txt, line.coords.x, line.coords.y)
    gCtx.strokeStyle = line.outline;
    gCtx.strokeText(line.txt, line.coords.x, line.coords.y)
    gCtx.stroke();
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


function drawStickerRect(x, y) {
    const currStickerSelected = getCurrSticker();
    gCtx.beginPath();
    gCtx.lineWidth = 4;
    gCtx.fillStyle = '#ffffff60';
    gCtx.strokeRect(x, y, currStickerSelected.stickerWidth + 8, currStickerSelected.stickerHeight);
    gCtx.fillRect(x, y, currStickerSelected.stickerWidth + 8, currStickerSelected.stickerHeight);

}



function loadMemeToCanvas(imgUrl) {
    console.log('img ur:', imgUrl);
    renderStickers();
    const img = new Image();
    img.onload = function () {
        const imgWidth = this.width;
        const imgHeight = this.height;
        console.log(`width and height: ${this.width}, ${this.height} `);
        const calcCanvasHeight = (imgHeight * elCanvas.width) / imgWidth;
        elCanvas.height = calcCanvasHeight;
        console.log('canvas height:', elCanvas.height)
        gFocusMode = 'line';
        resizeCanvas();
        gCtx.drawImage(img, 0, 0, imgWidth, calcCanvasHeight);
    }
    img.src = `${imgUrl} `;
}



function onCanvasClicked(ev) {
    console.log('ev:', ev)
    var rect = document.querySelector('#my-canvas').getBoundingClientRect();
    const x = ev.touches ? ev.touches[0].clientX - rect.left : ev.offsetX;
    const y = ev.touches ? ev.touches[0].clientY - rect.top : ev.offsetY;
    const meme = getCurrMeme();
    const lineIdx = meme.lines.findIndex(line => {
        const txtWidth = gCtx.measureText(line.txt).width
        const txtHeight = line.size;
        return x > line.coords.x && x < line.coords.x + txtWidth && (y < line.coords.y && y > line.coords.y - txtHeight);
    })
    const stickerIdx = meme.stickers.findIndex(sticker => {
        return x > sticker.coords.x && x < sticker.coords.x + sticker.stickerWidth &&
            y - sticker.stickerHeight < sticker.coords.y && y > sticker.coords.y - sticker.stickerHeight;
    })
    console.log(lineIdx, stickerIdx);
    if (lineIdx !== -1) {
        meme.selectedLineIdx = lineIdx;
        document.querySelector('.add-txt').value = meme.lines[lineIdx].txt;
        gFocusMode = 'line'
    } else if (stickerIdx !== -1) {
        meme.selectedStickerIdx = stickerIdx;
        gFocusMode = 'sticker'
    }
}

function onStartDrag(ev) {
    ev.preventDefault();
    gCtx.beginPath();
    console.log('event:', ev);
    gIsDrag = true;
    onCanvasClicked(ev);
    var rect = document.querySelector('#my-canvas').getBoundingClientRect();
    const x = ev.touches ? ev.touches[0].clientX - rect.left : ev.offsetX;
    const y = ev.touches ? ev.touches[0].clientY - rect.top : ev.offsetY;
    gCtx.moveTo(x, y);
}


//Start the movement;
function onDragLine(ev) {
    ev.preventDefault();
    if (!gIsDrag) return;
    var rect = document.querySelector('#my-canvas').getBoundingClientRect();
    var x = ev.touches ? ev.touches[0].clientX - rect.left : ev.offsetX;
    var y = ev.touches ? ev.touches[0].clientY - rect.top : ev.offsetY;
    // console.log('X:', x, 'Y:', y);
    if (gFocusMode === 'line') {
        const selectedLine = getCurrLine();
        const xCenterDragLine = x - gCtx.measureText(selectedLine.txt).width / 2;
        const yCenterDragLine = y + 30
        console.log('expirment:', x + gCtx.measureText(selectedLine.txt).width / 2)
        dragLine(xCenterDragLine, yCenterDragLine);
    } else if (gFocusMode === 'sticker') {
        const selectedSticker = getCurrSticker();
        const xCenterDragSticker = x - selectedSticker.stickerWidth / 2;
        const yCenterDragSticker = y - 20;
        // console.log('rendring drag stickers');
        dragSticker(xCenterDragSticker, yCenterDragSticker);
    }
    renderCanvas();
}

function onStopDrag(ev) {
    ev.preventDefault();
    gIsDrag = false;
    console.log('dragging ended:', gIsDrag);
    gCtx.closePath();
}


function toggleMenu() {
    document.body.classList.toggle('menu-open');
}


function onResizeCanvas(ev) {
    console.log(ev);
    var elContainer = document.querySelector('.canvas-container');
    console.log(elContainer.offsetWidth);
    elCanvas.width = elContainer.offsetWidth;
    elCanvas.height = elContainer.offsetHeight;
    renderCanvas();
}




// The next 2 functions handle IMAGE UPLOADING to img tag from file system: 
function onImgInput(ev) {
    loadImageFromInput(ev, renderCanvas)
}
function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
        loadMemeToCanvas(img.src)
        console.log('img src?:', img.src);
    }
    reader.readAsDataURL(ev.target.files[0]);
}













// function onSetFontFamily(fontName) {
//     setFontFamily(fontName)
//     renderCanvas();
// }


// function onChangeColor(color) {
//     changeColor(color)
//     renderCanvas();
// }

// function onChangeOutline(color) {
//     changeOutline(color)
//     renderCanvas();
// }


// function drawRect(x, y) {
//     console.log(`getting: ${ x }, ${ y } `);
//     let modeSelectedIdx;
//     gCtx.beginPath();
//     const meme = getCurrMeme();
//     if (gFocusMode === 'line') {
//         modeSelectedIdx = meme.lines[meme.selectedLineIdx];
//         const memeTxt = modeSelectedIdx.txt;
//         const yRectSize = -modeSelectedIdx.size;
//         gCtx.lineWidth = 4;
//         gCtx.fillStyle = '#ffffff60';
//         gCtx.strokeRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
//         gCtx.fillRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
//     } else if (gFocusMode === 'sticker') {
//         modeSelectedIdx = meme.stickers[meme.selectedStickerIdx];
//         gCtx.lineWidth = 4;
//         gCtx.strokeRect(x, y, modeSelectedIdx.stickerWidth + 8, modeSelectedIdx.stickerHeight);
//     }
//     console.log(modeSelectedIdx);
//     console.log('FOCUS MODE:', gFocusMode);
// }
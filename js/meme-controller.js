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
    const imgData = elCanvas.toDataURL('image/png');
    console.log('got here')
    saveCanvas(imgData);
    showAlert();
}

function showAlert() {
    const elAlert = document.querySelector('.meme-save-modal');
    elAlert.style.display = 'block';
    setTimeout(() => {
        elAlert.style.display = 'none';
    }, 1500)

}

function onDownloadCanvas(elLink) {
    const data = elCanvas.toDataURL('image/png');
    elLink.href = data;
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

function onSetFontFamily(fontName) {
    setFontFamily(fontName)
    renderCanvas();
}


function onChangeColor(color) {
    changeColor(color)
    renderCanvas();
}

function onChangeOutline(color) {
    changeOutline(color)
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
    img.onload = () => {
        drawStickers();
        gCtx.drawImage(img, 0, 0, elCanvas.width, elCanvas.height)
        drawLines();
    }
    img.src = `${imgSelected.url}`;
}

function drawStickers() {
    const memeStickers = getMemeStickers();
    memeStickers.forEach(sticker => {
        drawSticker(sticker.id);
    })
}


function drawLines() {
    const meme = getCurrMeme();
    meme.lines.forEach((line, idx) => {
        // console.log(`painting rect in pos: ${line.coords.x},${line.coords.y}`);
        drawText(line)
        if (idx === meme.selectedLineIdx) drawRect(line.coords.x, line.coords.y)
    })
}

function drawText(line) {
    gCtx.lineWidth = 2;
    gCtx.font = `${line.size}px ${line.font}`;
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
    gCtx.fillStyle = '#ffffff60'
    gCtx.strokeRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
    gCtx.fillRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
}

function loadMemeToCanvas(imgUrl) {
    renderStickers();
    const img = new Image();
    img.src = `${imgUrl}`;
    img.onload = () => {
        gFocusMode = 'line';
        gCtx.drawImage(img, 0, 0, elCanvas.width, elCanvas.height);
        resizeCanvas();
    }
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


function onDragLine(ev) {
    ev.preventDefault();
    if (!gIsDrag) return;
    var rect = document.querySelector('#my-canvas').getBoundingClientRect();
    var x = ev.touches ? ev.touches[0].clientX - rect.left : ev.offsetX;
    var y = ev.touches ? ev.touches[0].clientY - rect.top : ev.offsetY;
    if (gFocusMode === 'line') {
        dragLine(x, y);
    } else if (gFocusMode === 'sticker') {
        console.log('rendring drag stickers');
        dragSticker(x, y);
    }
    renderCanvas();
}

function onStopDrag(ev) {
    ev.preventDefault();
    gIsDrag = false;
    console.log('dragging ended:', gIsDrag);
    gCtx.closePath();
}


function onResizeCanvas(ev) {
    console.log(ev);
    var elContainer = document.querySelector('.canvas-container');
    console.log(elContainer.offsetWidth);
    elCanvas.width = elContainer.offsetWidth;
    elCanvas.height = elContainer.offsetHeight;
    renderCanvas();
}


function toggleMenu() {
    document.body.classList.toggle('menu-open');
}



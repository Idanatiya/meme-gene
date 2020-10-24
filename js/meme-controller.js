'use strict';
console.log('Js is running!');

var gCanvas;
var gCtx;
var gIsDrag;
var gFocusMode;
var gIsStickerDrag;



function onInit() {
    init();
    onInitMemes();
    renderImgs();
    renderKeyWords();
    renderStickers();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
}


function resizeCanvas() {
    if (window.innerWidth < 720) {
        gCanvas.width = 300;
        gCanvas.height = 300;
    } else {
        gCanvas.width = 600;
        gCanvas.height = 600;
    }

}



function onOpenMemeTab() {
    const elImgsContainer = document.querySelector('.img-gallery-container');
    const elEditorContainer = document.querySelector('.meme-editor-container');
    const elMemeTabContainer = document.querySelector('.meme-tab-container');
    if (!elImgsContainer.classList.contains('hide')) {
        toggleElement(elImgsContainer, 'hide')
        toggleElement(elMemeTabContainer, 'hide');
    }

    else if (elImgsContainer.classList.contains('hide')) {
        elEditorContainer.style.display = 'none';
        elMemeTabContainer.style.display = 'block';
        onInitMemes();
    }
}


function onNextPage() {
    console.log('On Next page function')
    nextPage();
    renderStickers();
}

function onPrevPage() {
    console.log('on Prev Page fucntiom');
    prevPage();
    renderStickers();
}




function renderImgs() {
    const elImgsContainer = document.querySelector('.grid-container');
    const imgs = getImgsForDisplay();
    const strHtmls = imgs.map(img => {
        return `<div class="card" onclick="onSelectImg(${img.id})" data-imgId="${img.id}">
        <img class="card-img" src="${img.url}"  />
        </div>
        `
    })
    elImgsContainer.innerHTML = strHtmls.join('');
    if (!imgs.length) elImgsContainer.innerHTML = '<h1>We couldnt find a meme for your search</h1>'

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
    console.log('sticker found:', sticker);
    console.log(sticker.stickerWidth, sticker.stickerHeight);
    console.log('drawed sticker with id of:', sticker);
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
    loadImgToCanvas(img.url)
}


function onSetSearchTerm(searchTerm) {
    setSearchTerm(searchTerm)
    renderImgs();
}


function onSaveMeme() {
    const imgData = gCanvas.toDataURL('image/png');
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
    const data = gCanvas.toDataURL('image/png');
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
    manageAlignment(direction)
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
    img.src = `${imgSelected.url}`;
    img.onload = () => {
        resizeCanvas()
        drawStickers();
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        drawLines();
    }
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
        console.log('line:', line)
        console.log(`painting rect in pos: ${line.coords.x},${line.coords.y}`);
        drawText(line.txt, line.size, line.font, line.color, line.outline, line.align, line.coords.x, line.coords.y)
        if (idx === meme.selectedLineIdx) drawRect(line.coords.x, line.coords.y)
    })
}

function drawText(txt, size, fontName, color, outlineColor, align, x, y) {
    gCtx.lineWidth = 2;
    gCtx.font = `${size}px ${fontName}`;
    gCtx.textAlign = align;
    gCtx.fillStyle = color;
    gCtx.fillText(txt, x, y)
    gCtx.strokeStyle = outlineColor;
    gCtx.strokeText(txt, x, y)
    gCtx.stroke();
}

function drawRect(x, y) {
    const meme = getCurrMeme();
    const memeTxt = meme.lines[meme.selectedLineIdx].txt;
    const yRectSize = -meme.lines[meme.selectedLineIdx].size
    gCtx.beginPath();
    gCtx.lineWidth = 4;
    gCtx.fillStyle = '#ffffff60'
    gCtx.strokeRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
    gCtx.fillRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
}

function loadImgToCanvas(imgUrl) {
    const img = new Image();
    img.src = `${imgUrl}`;
    img.onload = () => {
        gFocusMode = 'line';
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        renderCanvas()
    }
}

function onGetLineFocused(ev) {
    var rect = document.querySelector('#my-canvas').getBoundingClientRect();
    const x = ev.touches ? ev.touches[0].clientX - rect.left : ev.offsetX;
    const y = ev.touches ? ev.touches[0].clientY - rect.top : ev.offsetY;
    const meme = getCurrMeme();
    const lineIdx = meme.lines.findIndex(line => {
        const txtWidth = gCtx.measureText(line.txt).width
        const txtHeight = line.size;
        return x > line.coords.x && x < line.coords.x + txtWidth && (y < line.coords.y && y > line.coords.y - txtHeight);
    })
    if (lineIdx !== -1) {
        meme.selectedLineIdx = lineIdx;
        document.querySelector('.add-txt').value = meme.lines[lineIdx].txt;
        gFocusMode = 'line'
    }
    return lineIdx;
}




function onFocusSticker(ev) {
    const meme = getCurrMeme();
    if (meme.stickers.length === 0) {
        console.log('MEME STICKERS ARRAY IS EMPTY!@')
        return;
    }
    var rect = document.querySelector('#my-canvas').getBoundingClientRect();
    const x = ev.touches ? ev.touches[0].clientX - rect.left : ev.offsetX;
    const y = ev.touches ? ev.touches[0].clientY - rect.top : ev.offsetY;
    const stickerIdx = meme.stickers.findIndex(sticker => {
        return x > sticker.coords.x && x < sticker.coords.x + sticker.stickerWidth &&
            y - sticker.stickerHeight < sticker.coords.y && y > sticker.coords.y - sticker.stickerHeight;
    })
    console.log('sticker idx:', stickerIdx);
    if (stickerIdx !== -1) {
        meme.selectedStickerIdx = stickerIdx;
        gFocusMode = 'sticker'
    }
}
document.querySelector('#my-canvas').addEventListener('click', ev => {
    onFocusSticker(ev);
});


function onStartDrag(ev) {
    ev.preventDefault();
    gCtx.beginPath();
    console.log('event:', ev);

    gIsDrag = true;
    gIsStickerDrag = true;
    const isLineExists = onGetLineFocused(ev);
    if (isLineExists === -1) {
        console.log('not drag an drop!');
        return;
    }
    var rect = document.querySelector('#my-canvas').getBoundingClientRect();
    const x = ev.touches ? ev.touches[0].clientX - rect.left : ev.offsetX;
    const y = ev.touches ? ev.touches[0].clientY - rect.top : ev.offsetY;
    gCtx.moveTo(x, y);
}


function onDragLine(ev) {
    ev.preventDefault();
    if (!gIsDrag) return;
    if (!gIsStickerDrag) return;
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
    gIsStickerDrag = false;
    console.log('dragging ended:', gIsDrag);
    gCtx.closePath();
}


function onResizeCanvas(ev) {
    console.log(ev);
    var elContainer = document.querySelector('.canvas-container');
    console.log(elContainer.offsetWidth);
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
}


function toggleMenu() {
    document.body.classList.toggle('change');
}



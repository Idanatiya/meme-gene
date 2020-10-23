'use strict';
console.log('Js is running!');

var gCanvas;
var gCtx;
var gIsDrag;
var gCurrDragEl;


function onInit() {
    init();
    onInitMemes();
    renderImgs();
    renderKeyWords();
    renderStickers();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    console.log(gCtx)
}


//show and hide sections
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




//render Imgs
function renderImgs() {
    const elImgsContainer = document.querySelector('.grid-container');
    const imgs = getImgsForDisplay();
    console.log('imgs:', imgs);
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
    console.log('Stickers to render now:', stickers)
    const strHtmls = stickers.map(sticker => {
        return `<li onclick="onAddSticker('${sticker.id}')">
                    <img src="imgs/stickers/${sticker.url}.png" alt="sticker" />
                </li>`
    })

    document.querySelector('.stickers-list').innerHTML = strHtmls.join('');
}


function onAddSticker(stickerId) {
    console.log('adding...', stickerId);
    //add curr sticker to model
    addSticker(stickerId);
    //draw sticker to cnavas
    drawSticker(stickerId);
}




function drawSticker(stickerId) {
    const sticker = getStickerById(stickerId);
    console.log('drawed sticker with id of:', sticker);
    var img = new Image()
    img.src = `imgs/stickers/${sticker.url}.png`;
    img.onload = () => {
        gCtx.drawImage(img, sticker.coords.x, sticker.coords.y)
    }
}


function onFilterByClick(elKeyword) {
    const keyword = elKeyword.innerText;
    setSearchTerm(keyword);
    //get fontSize for the specific li that has been clicked
    const currFontSize = getFontSize(keyword);
    if (currFontSize > 75) return;

    //set the fontsize for the specific keyword clicked
    elKeyword.style.fontSize = `${currFontSize}px`;

    renderImgs();
}




//select img from gallery and load to canvas
function onSelectImg(imgId) {
    const elImgsContainer = document.querySelector('.img-gallery-container');
    const elEditorContainer = document.querySelector('.meme-editor-container');
    //hide gallery and show editor
    toggleElement(elImgsContainer, 'hide');
    toggleElement(elEditorContainer, 'hide')
    const img = getImgById(imgId);

    //update gMeme
    setSelectedMeme(imgId)
    console.log(img);
    //load img into canvas
    loadImgToCanvas(img.url)
}


function onSetSearchTerm(searchTerm) {
    setSearchTerm(searchTerm)
    renderImgs();
}


function onSaveMeme() {
    const imgData = gCanvas.toDataURL('image/png');
    //set href to the data
    // elLink.href = imgData;
    console.log('got here')
    saveCanvas(imgData);
}


function onDownloadCanvas(elLink) {
    //turn img into base 64
    const data = gCanvas.toDataURL('image/png');
    console.log(data);
    //set href to the data
    elLink.href = data;
}

function onDeleteLine() {
    console.log('trash clicked!')
    deleteLine();
    renderCanvas();
}

function onSetFontFamily(fontName) {
    console.log('font selected:', fontName)
    setFontFamily(fontName)
    renderCanvas();
}


function onChangeColor(color) {
    changeColor(color)
    renderCanvas();
}

function onChangeOutline(color) {
    console.log('outline:', color);
    changeOutline(color)
    renderCanvas();
}


function onManageAlignment(direction) {
    console.log('Clicked on aligment:', direction);
    manageAlignment(direction)
    renderCanvas();
}



//add 1 more line
function onAddLine() {
    //add line to mode
    addLine();
    switchLines();
    renderCanvas();
    document.querySelector('.add-txt').value = '';
}


function onSwitchLines() {
    const rect = gCanvas.getBoundingClientRect();
    console.log('rect', rect);
    switchLines();
    const meme = getCurrMeme();
    // drawRect(coordX, coordY)
    renderCanvas();
    document.querySelector('.add-txt').value = meme.lines[meme.selectedLineIdx].txt;
}




//change dynamically txt
function onTxtChange(elInput) {
    const txt = elInput.value;
    const selectedLineIdx = getCurrSelectedIdx();
    //Update txt in model
    txtChange(selectedLineIdx, txt);
    //render canvas
    renderCanvas();
}



//manage font sizes
function onManageFontSize(diff) {
    const meme = getCurrMeme();
    //change fontsize on service
    manageFontSize(meme.selectedLineIdx, diff);
    renderCanvas()
}


//manage directions
function onManageDirection(diff) {
    const meme = getCurrMeme();
    manageDirection(meme.selectedLineIdx, diff);
    renderCanvas();
}


//render canvas
function renderCanvas() {
    const meme = getCurrMeme();
    const imgSelected = getImgById(meme.selectedImgId);
    const img = new Image();
    img.src = `${imgSelected.url}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        drawLines();
        drawStickers();
    }
}



//draw the stuicker the user already chose evreytime when canvas is rendered
function drawStickers() {
    const memeStickers = getMemeStickers();
    memeStickers.forEach(sticker => {
        drawSticker(sticker.id);
    })
}


//draw lines dynamiclly for each line
function drawLines() {
    const meme = getCurrMeme();
    //loop through each line obj in lines and draw a text into the canvas
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
    //aligning
    // gCtx.textAlign = 'left';
    gCtx.textAlign = align;
    //text color
    gCtx.fillStyle = color;
    //position the text
    gCtx.fillText(txt, x, y)
    //border color
    gCtx.strokeStyle = outlineColor;
    gCtx.stroke();
    gCtx.strokeText(txt, x, y)
}

function drawRect(x, y) {
    const meme = getCurrMeme();
    const memeTxt = meme.lines[meme.selectedLineIdx].txt;
    const yRectSize = -meme.lines[meme.selectedLineIdx].size
    gCtx.beginPath();

    gCtx.lineWidth = 4;
    gCtx.fillStyle = '#ffffff60'
    //draw border
    gCtx.strokeRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
    //fill the rect
    gCtx.fillRect(x, y, gCtx.measureText(memeTxt).width + 8, yRectSize + 4);
}

//Draw img on canvas
function loadImgToCanvas(imgUrl) {
    const img = new Image();
    img.src = `${imgUrl}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
        renderCanvas()
    }
}

function onGetClickedLine(ev) {
    //offset relative to the container
    const { offsetX, offsetY } = ev;
    //offset relative to the screen
    const { clientX, clientY } = ev;

    console.log(offsetX, offsetY);
    console.log(clientX, clientY);
    //get meme obj
    const memes = getCurrMeme();
    const clickedLine = memes.lines.find(line => {
        return offsetX > line.coords.x && offsetY < line.coords.y;
    })
    if (!clickedLine) return;

    //get the txt of line clicked to the input;
    document.querySelector('.add-txt').value = clickedLine.txt;

}

function onStartDrag(ev) {
    // console.log('start the drag', ev)
    gCtx.beginPath();
    gIsDrag = true;
    if (ev.touches) {
        ev.preventDefault();
        var rect = document.querySelector('#my-canvas').getBoundingClientRect();
        var x = ev.touches[0].clientX - rect.left;
        var y = ev.touches[0].clientY - rect.top;
        gCtx.moveTo(x, y)
    } else {
        const { offsetX, offsetY } = ev;
        gCtx.moveTo(offsetX, offsetY)

    }
    switchLines();
    //Starting position
}

function onDragLine(ev) {
    //if we are not in drag mode i dont run the func
    if (!gIsDrag) return;

    //get end position
    // var x = ev.offsetX;
    // var y = ev.offsetY;
    var rect = document.querySelector('#my-canvas').getBoundingClientRect();
    // console.log(rect);
    var x = ev.touches ? ev.touches[0].clientX - rect.left : ev.offsetX;
    var y = ev.touches ? ev.touches[0].clientY - rect.top : ev.offsetY;
    dragLine(x, y)
    renderCanvas();
}

function onStopDrag(ev) {
    ev.preventDefault();
    gIsDrag = false;
    console.log('dragging ended:', gIsDrag);
    gCtx.closePath();
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    console.log(elContainer.offsetWidth);
    // Note: changing the canvas dimension this way clears the canvas
    gCanvas.width = elContainer.offsetWidth // show width & height in CSS
    gCanvas.height = elContainer.offsetHeight
}



function toggleMenu() {
    document.body.classList.toggle('menu-open');
}





























// function onSearchMemes(elSearch) {
//     const searchVal = elSearch.value.toLowerCase();
//     const imgs = getImgsForDisplay();
//     console.log(searchVal);

//     const filterList = imgs.filter(img => {
//         return img.keywords.indexOf(searchVal) !== -1;
//     })
//     console.log(filterList);
//     renderImgs();
// }


// function onSearchMemes(elSearch) {
//     const searchVal = elSearch.value.toLowerCase();
//     searchMemes(searchVal);
//     renderImgs()
//     // renderImgs()
// }


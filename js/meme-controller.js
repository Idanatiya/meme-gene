'use strict';
console.log('Js is running!');

var gCanvas;
var gCtx;


function onInit() {
    init();
    renderImgs();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    console.log(gCtx)
}



//render Imgs
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
}


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


function onSwitchLines() {
    console.log('Switch lines');
    switchLines();
    renderCanvas();
}


//change dynamically txt
function onTxtChange(elInput) {
    const txt = elInput.value;
    const selectedLineIdx = getCurrSelectedIdx();
    //Update txt in model
    txtChange(selectedLineIdx, txt)
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


function onManageDirection(diff) {
    const meme = getCurrMeme();
    manageDirection(meme.selectedLineIdx, diff);
    renderCanvas()
}


function onAddLine() {
    //add line to mode
    addLine();
    renderCanvas();
    document.querySelector('.add-txt').value = ''
}

//render canvas
function renderCanvas() {
    const meme = getCurrMeme();
    const txt = meme.lines[meme.selectedLineIdx].txt;
    const size = meme.lines[meme.selectedLineIdx].size;

    console.log('txt:', txt);
    console.log('size:', size);
    const imgSelected = getImgById(meme.selectedImgId);
    const img = new Image();
    img.src = `${imgSelected.url}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        drawLines();
    }
}

function drawLines() {
    const meme = getCurrMeme();
    meme.lines.forEach(line => {
        console.log('line:', line)
        drawText(line.txt, line.size, line.coords.x, line.coords.y)
    })
}

function drawText(txt, size, x, y) {
    console.log(y)
    gCtx.font = `${size}px Impact`;
    gCtx.textAlign = 'start'
    gCtx.fillText(txt, x, y)
    gCtx.strokeText(txt, x, y)
}


//Draw img on canvas
function loadImgToCanvas(imgUrl) {
    const img = new Image();
    img.src = `${imgUrl}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
        // drawText(txt, 30, 40)

    }
}

// function drawText(txt, size, x, y) {
//     console.log('drawing txt:', txt);
//     gCtx.font = '48px Impact'
//     gCtx.textAlign = 'start'
//     gCtx.fillText(txt, x, y)
//     gCtx.strokeText(txt, x, y)
// }




//render canvas uppon txt change
// function renderCanvas(txt) {
//     const meme = getCurrMeme();
//     const imgInfo = getImgById(meme.selectedImgId)
//     const img = new Image();
//     img.src = `${imgInfo.url}`;
//     img.onload = () => {
//         gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
//         drawText(txt, 30, 40)
//     }
// }
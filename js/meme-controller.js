'use strict';
console.log('Js is running!');

var gCanvas;
var gCtx;
var gIsDrag;
var gCurrDragEl;


function onInit() {
    init();
    renderImgs();
    renderKeyWords();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    console.log(gCtx)
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

function onFilterByClick(elKeyword) {
    const keyword = elKeyword.innerText;
    setSearchTerm(keyword);
    //get fontSize for the specific li that has been clicked
    const currFontSize = getFontSize(keyword);

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


function onManageAlignment(direction) {
    console.log('Clicked on aligment:', direction);
    manageAlignment(direction)
    renderCanvas();
}



//add 1 more line
function onAddLine() {
    //add line to mode
    addLine();
    renderCanvas();
    document.querySelector('.add-txt').value = '';
}
function onSwitchLines() {
    const rect = gCanvas.getBoundingClientRect();
    console.log('rect', rect);
    switchLines();
    const meme = getCurrMeme();
    const coordX = meme.lines[meme.selectedLineIdx].coords.x - 190
    console.log('coordX:', coordX);
    const coordY = meme.lines[meme.selectedLineIdx].coords.y - 35
    console.log('coordY:', coordY);
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
    }
}


//draw lines dynamiclly for each line
function drawLines() {
    const meme = getCurrMeme();
    //loop through each line obj in lines and draw a text into the canvas
    meme.lines.forEach((line, idx) => {
        console.log('line:', line)
        if (idx === meme.selectedLineIdx) drawRect(line.coords.x - 190, line.coords.y - 35)
        drawText(line.txt, line.size, line.font, line.color, line.align, line.coords.x, line.coords.y)
    })
}

function drawText(txt, size, fontName, color, align, x, y) {
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
    gCtx.strokeStyle = 'black'
    gCtx.stroke();

    gCtx.strokeText(txt, x, y)
}

function drawRect(x, y) {
    gCtx.beginPath();
    gCtx.rect(x, y, 370, 40);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.fillStyle = '#fafafa';
    gCtx.fillRect(x, y, 370, 40);
}

//Draw img on canvas
function loadImgToCanvas(imgUrl) {
    const img = new Image();
    img.src = `${imgUrl}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
        renderCanvas()
        // drawText(txt, 30, 40)

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
    console.log('dragging started:', gIsDrag);
    const { offsetX, offsetY } = ev;
    //Starting position
    gCtx.moveTo(offsetX, offsetY)

}

function onDragLine(ev) {
    //if we are not in drag mode i dont run the func
    if (!gIsDrag) return;
    //get end position
    var x = ev.offsetX;
    var y = ev.offsetY;

    dragLine(x, y)
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


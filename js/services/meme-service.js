
var gImgs;
var gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: []
}
const STORAGE_KEY = 'imgsDB';


function _createLine(x, y) {
    return {
        txt: 'Enter Your Text',
        size: 40,
        coords: { x, y },
        align: 'center',
        color: 'black'
    }
}




function switchLines() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
    else gMeme.selectedLineIdx += 1;
}

//add line to model
function addLine() {
    if (gMeme.lines.length === 0) gMeme.lines.push(_createLine(30, 40));
    else if (gMeme.lines.length === 1) gMeme.lines.push(_createLine(30, 185));
    else if (gMeme.lines.length === 2) gMeme.lines.push(_createLine(30, 330));
    else gMeme.lines.push(_createLine(30, 185))
    // gMeme.lines.push(_createLine())
    console.log('Line has been added!')
}


function init() {
    _createImgs();
}




function getCurrSelectedIdx() {
    return gMeme.selectedLineIdx;
}


function setSelectedMeme(memeId) {
    gMeme.selectedImgId = memeId;
}


function manageDirection(selectedLineIdx, diff) {
    gMeme.lines[selectedLineIdx].coords.y += diff;
    // console.log('direction updated!')
}

function txtChange(selectedLineIdx, txt) {
    gMeme.lines[selectedLineIdx].txt = txt;
    // console.log('text change!')
}

//change fontsize on model
function manageFontSize(selectedLineIdx, diff) {
    gMeme.lines[selectedLineIdx].size += diff;
    console.log(gMeme.lines[selectedLineIdx].size)
}


function getImgsForDisplay() {
    return gImgs;
}

function getCurrMeme() {
    return gMeme;
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId);
}



function _createImgs() {
    let memeImgs = loadFromStorage(STORAGE_KEY);
    if (!memeImgs) {
        memeImgs = [];
        //create a img obj for each picture
        for (let i = 1; i <= 18; i++) {
            memeImgs.push(_createImg(i, `meme-imgs/${i}.jpg`));
        }
    }
    gImgs = memeImgs;

}



function _createImg(id, url, keywords = []) {
    return {
        id,
        url,
        keywords
    }
}


function saveImgsToStorage() {
    saveToStorage(STORAGE_KEY, gImgs)

}

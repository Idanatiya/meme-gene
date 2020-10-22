'use strict';
var gKeywords = { 'cute': 25, 'funny': 30, 'dogs': 25, 'movie': 20 }
var gImgs;
var gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: [
        _createLine(175, 40)
    ]
}

var gSearchBy;
var gSavedMemes;
const STORAGE_KEY = 'memeDB';

function init() {
    _createImgs();
    _createMemeDb();
}


function startDrag() {

}

function dragLine(x, y) {
    gMeme.lines[gMeme.selectedLineIdx].coords.x = x;
    gMeme.lines[gMeme.selectedLineIdx].coords.y = y;
}

function getKeyWords() {
    return Object.keys(gKeywords);
}

//get the value of the specified keyword based on the search keyword clicked
function getFontSize(keyword) {
    return gKeywords[keyword];
}

function getSavedMemes() {
    return gSavedMemes;
}

function setSearchTerm(searchTerm) {
    console.log(searchTerm);
    gSearchBy = searchTerm;
}

function deleteLine() {
    // const lineIdx = gMeme.lines[gMeme.selectedLineIdx]
    console.log('line idx', gMeme.selectedLineIdx, 'has been deleted!')
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.selectedLineIdx > 0) gMeme.selectedLineIdx -= 1

}


function changeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}
function changeOutline(color) {
    gMeme.lines[gMeme.selectedLineIdx].outline = color;
}

function setFontFamily(fontName) {
    console.log('getting from controller!', fontName)
    gMeme.lines[gMeme.selectedLineIdx].font = fontName;
}

//update specific line align;
function manageAlignment(direction) {
    gMeme.lines[gMeme.selectedLineIdx].align = direction;
}

function switchLines() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
    else gMeme.selectedLineIdx += 1;
}

function addLine() {
    if (gMeme.lines.length === 0) gMeme.lines.push(_createLine(175, 40));
    else if (gMeme.lines.length === 1) gMeme.lines.push(_createLine(175, 330));
    else if (gMeme.lines.length === 2) gMeme.lines.push(_createLine(175, 185));
    else gMeme.lines.push(_createLine(175, 185))
    // gMeme.lines.push(_createLine())
    console.log('Line has been added!')
}




function getCurrSelectedIdx() {
    return gMeme.selectedLineIdx
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
    //if input is emptyt return all imgs
    if (!gSearchBy) return gImgs;
    //if input is not empty i filter by the keywoirds
    var imgs = gImgs.filter(img => img.keywords.includes(gSearchBy))

    //add to the specific clicked keyword +1 each time to the value
    gKeywords[gSearchBy] += 4;
    console.log(imgs);
    return imgs;
}

function getCurrMeme() {
    return gMeme;
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId);
}


//add to the memesDB a new img and update storage
function saveCanvas(imgData) {
    gSavedMemes.push(imgData);
    _saveMemesToStorage();
}


function _createLine(x, y) {
    return {
        txt: 'Enter Your Text',
        size: 40,
        coords: { x, y },
        align: 'center',
        color: 'white',
        font: 'Impact',
        outline: 'black'
    }
}

//add line to model

function _createImgs() {
    let memeImgs;
    memeImgs = [];
    memeImgs.push(_createImg(1, 'meme-imgs/1.jpg', ['politc', 'trump']))
    memeImgs.push(_createImg(2, 'meme-imgs/2.jpg', ['cute', 'dogs']))
    memeImgs.push(_createImg(3, 'meme-imgs/3.jpg', ['cute', 'dogs']))
    memeImgs.push(_createImg(4, 'meme-imgs/4.jpg', ['cute', 'cats']))
    memeImgs.push(_createImg(5, 'meme-imgs/5.jpg', ['cute', 'funny']))
    memeImgs.push(_createImg(6, 'meme-imgs/6.jpg', ['funny', 'science']))
    memeImgs.push(_createImg(7, 'meme-imgs/7.jpg', ['cute', 'funny']))
    memeImgs.push(_createImg(8, 'meme-imgs/8.jpg', ['funny', 'wizard']))
    memeImgs.push(_createImg(9, 'meme-imgs/9.jpg', ['funny', 'baby']))
    memeImgs.push(_createImg(10, 'meme-imgs/10.jpg', ['politc', 'funny']))
    memeImgs.push(_createImg(11, 'meme-imgs/11.jpg', ['funny', 'kiss']))
    memeImgs.push(_createImg(12, 'meme-imgs/12.jpg', ['funny']))
    memeImgs.push(_createImg(13, 'meme-imgs/13.jpg', ['funny', 'movie', 'leonardo']))
    memeImgs.push(_createImg(14, 'meme-imgs/14.jpg', ['sungalss', 'movie']))
    memeImgs.push(_createImg(15, 'meme-imgs/15.jpg', ['movie', 'ned']))
    memeImgs.push(_createImg(16, 'meme-imgs/16.jpg', ['movie']))
    memeImgs.push(_createImg(17, 'meme-imgs/17.jpg', ['politc', 'putin']))
    memeImgs.push(_createImg(18, 'meme-imgs/18.jpg', ['funny', 'cute']))
    //create a img obj for each picture
    // for (let i = 1; i <= 18; i++) {
    //     memeImgs.push(_createImg(i, `meme-imgs/${i}.jpg`));
    // }
    gImgs = memeImgs;

}



function _createMemeDb() {
    let memes = loadFromStorage(STORAGE_KEY);
    if (!memes) {
        memes = [];
    }
    gSavedMemes = memes;
    _saveMemesToStorage()
}


function _createImg(id, url, keywords = []) {
    return {
        id,
        url,
        keywords
    }
}



function deleteMemes() {
    deleteFromStorage(STORAGE_KEY);
    init();

}

function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gSavedMemes)

}

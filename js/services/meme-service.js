'use strict';
var gKeywords = { 'cute': 25, 'funny': 30, 'dogs': 25, 'movie': 20 }
var gImgs;
var gMeme = {
    gCurrImg: null,
    gCurrImg: null,
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: [],
    selectedStickerIdx: 0,
    stickers: []
}
const STORAGE_KEY = 'memeDB';

var gSearchBy;
var gSavedMemes;

var gStickers;

var gPageIdx = 0;
var PAGE_SIZE = 4;


function init() {
    _createImgs();
    _createStickers();
    _createMemeDb();
    if (window.innerWidth < 540) gMeme.lines.push(_createLine(27, 40));
    else if (window.innerWidth > 540) gMeme.lines.push(_createLine(170, 42));
}


function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function getCurrSticker() {
    return gMeme.stickers[gMeme.selectedStickerIdx];
}

function dragLine(x, y) {
    getCurrLine().coords.x = x;
    getCurrLine().coords.y = y;
}

function dragSticker(x, y) {
    console.log('in service:', x)
    console.log('in service:', y)
    gMeme.stickers[gMeme.selectedStickerIdx].coords.x = x;
    gMeme.stickers[gMeme.selectedStickerIdx].coords.y = y;
}

function getKeyWords() {
    return Object.keys(gKeywords);
}

function getCars() {
    var fromIdx = gPageIdx * PAGE_SIZE;
    return gCars.slice(fromIdx, fromIdx + PAGE_SIZE)
}

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
    console.log('line idx', gMeme.selectedLineIdx, 'has been deleted!')
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.selectedLineIdx > 0) gMeme.selectedLineIdx -= 1
}

function deleteSticker() {
    console.log('deleted sticker in idx:', gMeme.selectedStickerIdx)
    gMeme.stickers.splice(gMeme.selectedStickerIdx, 1);
}



function changeLineProp(prop, val) {
    getCurrLine()[prop] = val;
}



function manageAlignment(direction) {
    getCurrLine().coords.x = direction;
}

function switchLines() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
    else gMeme.selectedLineIdx += 1;
}


function addLine() {
    if (window.innerWidth < 540) setLinesInMobile();
    else setLinesInDesktop();
}

function setLinesInDesktop() {
    if (gMeme.lines.length === 2) gMeme.lines.push(_createLine(170, 300))
    else gMeme.lines.push(_createLine(170, 590))
}

function setLinesInMobile() {
    if (gMeme.lines.length === 2) gMeme.lines.push(_createLine(27, 170));
    else gMeme.lines.push(_createLine(27, 295));
}

function addSticker(stickerId, stickerWidth, stickerHeight) {
    gMeme.selectedStickerIdx += 1;
    const sticker = getStickerById(stickerId);
    sticker.stickerWidth = stickerWidth;
    sticker.stickerHeight = stickerHeight
    console.log('STICKER IS:', sticker);
    gMeme.stickers.push(sticker);
    if (gMeme.selectedStickerIdx === gMeme.stickers.length) gMeme.selectedStickerIdx = 0;
    console.log(`On add sticker service,  adding : ${stickerWidth},${stickerHeight}`)
}

//get the array of stickers from gMeme
function getMemeStickers() {
    return gMeme.stickers;
}

function getCurrSelectedIdx() {
    return gMeme.selectedLineIdx;
}


function setSelectedMeme(memeId) {
    gMeme.selectedImgId = memeId;
}


function manageDirection(selectedLineIdx, diff) {
    gMeme.lines[selectedLineIdx].coords.y += diff;
}

function txtChange(selectedLineIdx, txt) {
    gMeme.lines[selectedLineIdx].txt = txt;
}

//change fontsize on model
function manageFontSize(selectedLineIdx, diff) {
    gMeme.lines[selectedLineIdx].size += diff;
}

function manageStickerSize(diff) {
    gMeme.stickers[gMeme.selectedStickerIdx].stickerWidth += diff;
    gMeme.stickers[gMeme.selectedStickerIdx].stickerHeight += diff;
}

function getImgsForDisplay() {
    if (!gSearchBy) return gImgs;
    var imgs = gImgs.filter(img => {
        return img.keywords.some(keyword => keyword.toLowerCase().includes(gSearchBy.toLowerCase()))
    })

    //add 4 to gKeywords to the specfied key
    gKeywords[gSearchBy] += 4;
    return imgs;
}

function getCurrMeme() {
    return gMeme;
}


function getSavedMemes() {
    return gSavedMemes.length;
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId);
}


function saveCanvas(imgData) {
    gSavedMemes.push(imgData);
    _saveMemesToStorage();
}


function _createLine(x, y) {
    const height = document.querySelector('canvas').offsetHeight;
    console.log('height', height);
    return {
        txt: 'Enter Your Text',
        size: 40,
        coords: { x, y },
        align: 'left',
        color: 'white',
        font: 'Impact',
        outline: 'black'
    }
}

function _createImgs() {
    let memeImgs;
    memeImgs = [];
    memeImgs.push(_createImg(1, 'meme-imgs-aspect/1.jpg', ['politc', 'trump']));
    memeImgs.push(_createImg(2, 'meme-imgs-aspect/2.jpg', ['cute', 'dogs']));
    memeImgs.push(_createImg(3, 'meme-imgs-aspect/3.jpg', ['cute', 'dogs']));
    memeImgs.push(_createImg(4, 'meme-imgs-aspect/4.jpg', ['cute', 'cats']));
    memeImgs.push(_createImg(5, 'meme-imgs-aspect/5.jpg', ['cute', 'funny']));
    memeImgs.push(_createImg(6, 'meme-imgs-aspect/6.jpg', ['funny', 'science']));
    memeImgs.push(_createImg(7, 'meme-imgs-aspect/7.jpg', ['cute', 'funny']));
    memeImgs.push(_createImg(8, 'meme-imgs-aspect/8.jpg', ['funny', 'wizard']));
    memeImgs.push(_createImg(9, 'meme-imgs-aspect/9.jpg', ['funny', 'baby']));
    memeImgs.push(_createImg(10, 'meme-imgs-aspect/10.jpg', ['politc', 'funny']));
    memeImgs.push(_createImg(11, 'meme-imgs-aspect/11.jpg', ['funny', 'kiss']));
    memeImgs.push(_createImg(12, 'meme-imgs-aspect/12.jpg', ['funny']));
    memeImgs.push(_createImg(13, 'meme-imgs-aspect/13.jpg', ['funny', 'movie', 'leonardo']));
    memeImgs.push(_createImg(14, 'meme-imgs-aspect/14.jpg', ['sungalss', 'movie']));
    memeImgs.push(_createImg(15, 'meme-imgs-aspect/15.jpg', ['movie', 'ned']));
    memeImgs.push(_createImg(16, 'meme-imgs-aspect/16.jpg', ['movie']));
    memeImgs.push(_createImg(17, 'meme-imgs-aspect/17.jpg', ['politc', 'putin']));
    memeImgs.push(_createImg(18, 'meme-imgs-aspect/18.jpg', ['funny', 'cute']));
    memeImgs.push(_createImg(19, 'meme-imgs-aspect/19.jpg', ['funny', 'cute']));
    memeImgs.push(_createImg(20, 'meme-imgs-aspect/20.jpg', ['funny', 'cute']));
    memeImgs.push(_createImg(21, 'meme-imgs-aspect/21.jpg', ['funny', 'cute']));
    memeImgs.push(_createImg(22, 'meme-imgs-aspect/22.jpg', ['funny', 'cute']));
    memeImgs.push(_createImg(23, 'meme-imgs-aspect/23.jpg', ['funny', 'cute']));
    memeImgs.push(_createImg(24, 'meme-imgs-aspect/24.jpg', ['funny', 'cute']));
    memeImgs.push(_createImg(25, 'meme-imgs-aspect/25.jpg', ['funny', 'cute']));
    // memeImgs.push(_createImg(19, 'meme-imgs/19.jpg', ['funny', 'cute']));
    // memeImgs.push(_createImg(20, 'meme-imgs/20.jpg', ['funny', 'cute']));
    gImgs = memeImgs;
}

function _createMemeDb() {
    let memes = loadFromStorage(STORAGE_KEY);
    if (!memes) memes = [];
    gSavedMemes = memes;
    _saveMemesToStorage()
}


function _createImg(id, url, keywords = []) {
    return { id, url, keywords }
}


function deleteMemes() {
    deleteFromStorage(STORAGE_KEY);
    init();
}

function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gSavedMemes)
}

//*****Stickers logic******///
function getStickers() {
    const fromIdx = gPageIdx * PAGE_SIZE;
    const endIdx = fromIdx + PAGE_SIZE;
    console.log(`slicing from ${fromIdx} to  ${fromIdx + PAGE_SIZE}`);
    return gStickers.slice(fromIdx, endIdx);
}

function nextPage() {
    gPageIdx++;
    console.log('page idx is now', gPageIdx);
    if (gPageIdx * PAGE_SIZE >= gStickers.length) gPageIdx = 0;
}

function prevPage() {
    console.log('page idx is now', gPageIdx);
    if (gPageIdx === 0) {
        gPageIdx = Math.ceil(gStickers.length / PAGE_SIZE) - 1;
        console.log('got back to idx:', gPageIdx);
        return;
    }
    gPageIdx -= 1;
    console.log('page idx is now', gPageIdx);
}

function getStickerById(stickerId) {
    return gStickers.find(sticker => sticker.id === stickerId);
}

function _createStickers() {
    let stickers = [];
    for (var i = 1; i <= 20; i++) stickers.push(_createSticker(i))
    gStickers = stickers;
}

function _createSticker(url, stickerWidth = 0, stickerHeight = 0) {
    return {
        id: makeId(),
        url,
        coords: randCoords(),
        stickerWidth,
        stickerHeight
    }
}

function randCoords() {
    return {
        x: Math.floor(Math.random() * 250) + 1,
        y: Math.floor(Math.random() * 250) + 1
    }
}
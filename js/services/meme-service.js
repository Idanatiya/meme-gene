
var gImgs;
var gMemes;
const STORAGE_KEY = 'imgsDB';


function init() {
    _createImgs();
}




function getImgsForDisplay() {
    return gImgs;
}



function _createImgs() {
    let memeImgs = loadFromStorage(STORAGE_KEY);
    if (!memeImgs) {
        memeImgs = [];
        //create a img obj for each picture
        for (let i = 1; i <= 18; i++) {
            memeImgs.push(_createImg(i));
        }
    }
    gImgs = memeImgs;
    saveImgsToStorage();
}



function _createImg(url, keywords = []) {
    return {
        id: makeId(),
        url,
        keywords
    }
}


function saveImgsToStorage() {
    saveToStorage(STORAGE_KEY, gImgs)
}
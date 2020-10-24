'use strict';


function onInitMemes() {
    renderMemes();
}


function renderMemes() {
    const memes = loadFromStorage('memeDB');
    const elMemeContainer = document.querySelector('.meme-grid-container');
    const strHtmls = memes.map(memeData => {
        return `<div class="meme-card">
        <img src="${memeData}" />
        </div>`
    }).join('');
    elMemeContainer.innerHTML = strHtmls;
    if (memes.length === 0 || !memes) elMemeContainer.innerHTML = '<h1 class="flex justify-center">You didnt save any memes yet</h1>';
}

function onDeleteMemes() {
    deleteMemes();
    renderMemes();
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}




//alternative to stickers fontsize
// gMeme.selectedStickerIdx += 1;
// if(gMeme.selectedStickerIdx === gMeme.stickers.length) gMeme.selectedStickerIdx = 0;

// function manageStickerSize(diff) {
//     // console.log('got to here', gMeme.stickers[selectedLineIdx].stickerHeight);
//     gMeme.stickers[gMeme.selectedStickerIdx -1].stickerWidth += diff;
//     gMeme.stickers[gMeme.selectedStickerIdx -1].stickerHeight += diff;
// }


// function addSticker(stickerId, stickerWidth, stickerHeight) {
//     //update selectedStickerIdx to get focused on the spefific focused sticker the user is on
//     if (gMeme.selectedStickerIdx === gMeme.stickers.length) {
//         console.log('they are erual')
//         console.log(`selected sticker idx:${gMeme.selectedLineIdx}, stickers array len:${gMeme.stickers.length}`);
//         gMeme.selectedStickerIdx = 0;
//     }
//     else gMeme.selectedStickerIdx += 1;
//     console.log(`**AFTER ADDING**(selected sticker idx:${gMeme.selectedLineIdx}, stickers array len:${gMeme.stickers.length}`);
//     // console.log(`On add sticker service,  adding : ${stickerWidth},${stickerHeight}`)

//     //Update sticker with and height propeties when user draw an sticker
//     const sticker = getStickerById(stickerId);
//     sticker.stickerWidth = stickerWidth;
//     sticker.stickerHeight = stickerHeight
//     console.log('STICKER IS:', sticker);
//     //push the sticeker
//     gMeme.stickers.push(sticker);
// }

// function addSticker(stickerId, stickerWidth, stickerHeight) {
//     debugger;
//     //update selectedStickerIdx to get focused on the spefific focused sticker the user is on
//     if (gMeme.selectedStickerIdx === gMeme.stickers.length) gMeme.selectedStickerIdx = 0;
//     else gMeme.selectedStickerIdx += 1;
//     console.log(`On add sticker service,  adding : ${stickerWidth},${stickerHeight}`)

//     //Update sticker with and height propeties when user draw an sticker
//     const sticker = getStickerById(stickerId);
//     sticker.stickerWidth = stickerWidth;
//     sticker.stickerHeight = stickerHeight
//     console.log('STICKER IS:', sticker);
//     //push the sticeker
//     gMeme.stickers.push(sticker);

// }

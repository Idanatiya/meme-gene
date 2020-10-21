'use strict';

console.log('Js is running!');


function onInit() {
    init();
    renderImgs();
}



function renderImgs() {
    const elImgsContainer = document.querySelector('.grid-container');
    const imgs = getImgsForDisplay();
    const strHtmls = imgs.map(img => {
        return `<div class="card" onclick="selectMeme('${img.id}')" data-imgId="${img.id}">
                    <img class="card-img" src="meme-imgs/${img.url}.jpg"  />
                </div>
        `
    })
    elImgsContainer.innerHTML = strHtmls.join('');
}
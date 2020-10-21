function makeId(length = 6) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}


function toggleElement(el, className) {
    el.classList.toggle(className);
}


function isNumber(value) {
    console.log('val', value)
    return Number.isInteger(+value)
}


const getDeepCopy = items => {
    return JSON.parse(JSON.stringify(items))
}

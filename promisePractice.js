function sayHello2s() {
    console.log('Hello 2 seconds');
}

function delay(time) {
    return new Promise((resolve, reject) => {
        console.log('pending');
        if (isNaN(time)) { reject }
        setTimeout(sayHello2s, time);
    })
}

const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('foo'), 4000)
})

myPromise
    .then(value => { return value + ' and bar'; })
    .then(value => { return value + ' and bar again'; })
    .then(value => { return value + ' and again'; })
    .then(value => { return value + ' and again'; })
    .then(value => { console.log(value) })
    .catch(err => { console.log(err) });


async function delayES8(time) {
    await delay(time);
    return console.log('it works')
}

delayES8(6000);
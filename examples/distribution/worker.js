importScripts('../../index.js');

onmessage = function(e) {
    const { seed, bins, rolls, min, max } = e.data;
    const randomGenerator = new seededRandom(seed);
    let previousRandom = 0;
    let randomNumbers = [];
    let newRandom = 0;
    randomNumbers = randomGenerator.blackbox.getArray(min, max, rolls);
    // for (let i = 0; i < rolls; i++) {
    //     newRandom = randomGenerator.custom.roll(min, max, 1, previous);
    //     previousRandom = newRandom;
    //     randomNumbers.push(newRandom);
    // }

    const distributionData = getDistributionData(randomNumbers, bins, min, max);
    postMessage({ seed, distributionData });
};

function getDistributionData(randomNumbers, bins, min, max) {
    let data = new Array(bins).fill(0);
    randomNumbers.forEach(num => {
        let index = Math.floor((num - min) / ((max - min + 1) / bins));
        if (index >= bins) index = bins - 1; // Ensure index is within bounds
        data[index]++;
    });
    return data;
}

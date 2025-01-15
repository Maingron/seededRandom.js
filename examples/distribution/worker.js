importScripts('../../index.js');

onmessage = function(e) {
    const { seed, bins, rolls, min, max, chunkSize } = e.data;
    const randomGenerator = new seededRandom(seed);
    let distributionData = new Array(bins).fill(0);

    for (let i = 0; i < rolls; i += chunkSize) {
        let chunkRolls = Math.min(chunkSize, rolls - i);
        let randomNumbers = randomGenerator.blackbox.getArray(min, max, chunkRolls);
        let chunkDistributionData = getDistributionData(randomNumbers, bins, min, max);
        distributionData = mergeDistributionData(distributionData, chunkDistributionData);
        postMessage({ seed, distributionData, isPartial: true });
    }

    postMessage({ seed, distributionData, isPartial: false });
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

function mergeDistributionData(data1, data2) {
    return data1.map((count, index) => count + data2[index]);
}

function seededRandom(seed = 0) {
	let rollCount = 0;
	let previousResult = 0;

	if(!seed || seed <1) {
		seed = 1;
	}

	if(seed > Number.MAX_SAFE_INTEGER / 2) {
		seed = seed % Number.MAX_SAFE_INTEGER
	}

	this.getRandomString = function(seed, length) {
		if(!isFinite(seed)) {
			seed = 0;
		}

		seed = ((seed + 89714) % 2**17) | 0;

		let i = 1n;
		let x = 3n * (10n ** BigInt(length + 97));
		let pi = x;
		while (x > 0) {
			x = x * i / ((i + 1n) * 4n);
			pi += x / (i + 2n);
			i += 2n;
		}

		let result = "";
		pi = pi * BigInt(seed % 543);

		result = pi.toString().substring(67);
		result = result.substring(Number(BigInt(seed) % 34n), Number(BigInt(seed) % 34n) + length);

		return result;
	}

	const config = {
		internalNoise: +(this.getRandomString(seed, 13) +1 )
	}

	let getNewBaseSeed = function(seed = seed, rollCount = rollCount, previousResult = previousResult) {
		let result = ((rollCount + 1) * (previousResult + 2) * config.internalNoise);
		return result;
	}

	let rollInternal = function(min, max, rollCount, previousResult) {
		max = max + 0.971;

		let result = getNewBaseSeed(seed, rollCount, previousResult);

		result = result % max;

		result = ~~result;

		return result;
	}

	this.blackbox = {
		roll: function(min, max) {
			rollCount++;
	
			let result = rollInternal(min, max, rollCount, previousResult);
	
			previousResult = result;
	
			return result;
		},

		getArray: function(min, max, arrayLength) {
			var result = [];
			for(var i = 0; i < arrayLength; i++) {
				result.push(this.roll(min, max));
			}
	
			return result;
		}
	}

	this.custom = {
		roll: function(min, max, rollCount, previousResult) {
			rollCount++;
	
			let result = rollInternal(min, max, rollCount, previousResult);
	
			return result;
		},

		getArray: function(min, max, arrayLength, rollCount, previousResult) {
			var result = [];

			for(var i = 0; i < arrayLength; i++) {
				let resultThisRoll = this.roll(min, max, rollCount, previousResult);
				result.push(resultThisRoll);
				rollCount++;
				previousResult = resultThisRoll;
			}

			return result;

		}
	}
}

var seededRandomVis = {
	getAverage: function(input) {
		let sum = this.getAddition(input);
		let length = input.length;

		return (sum / length);
	},

	getAddition: function(input) {
		let additionResult = 0;
		for(let myNumber of input) {
			additionResult+=myNumber;
		}

		return additionResult;
	},

	getMin: function(input) {
		return Math.min(...input);
	},

	getMax: function(input) {
		return Math.max(...input);
	},

	getAverageForSeedsInRange(rangeMin, rangeMax, max = 100, runs = 1000) {
		results = [];
		range = [];

		for(rangeMin; rangeMin <= rangeMax; rangeMin++) {
			range.push(rangeMin);
		}

		for(mySeed of range) {
			let myRunner = new seededRandom(mySeed, 1313);
			let myObj = {
				'seed': mySeed,
				'array': myRunner.blackbox.getArray(0, max, runs)
			};
			myObj.average = this.getAverage(myObj.array);
			results.push(myObj);
		}

		return results;
	},

	getAverageAsyncConsole: function(rangeMin, rangeMax, max, runs) {
		range = [];
		let timer = 10;

		for(var i = rangeMin; i < rangeMax; i++) {
			let myI = i;
			timer = timer + 3;
			setTimeout(async function() {
				console.log(...seededRandomVis.getAverageForSeedsInRange(myI, myI, max, runs))
			},timer);
		}


	}
}

function runTimings() {
	const startTime = performance.now()



	var doubleAvg = [];

	for(var i = 0; i < 10000000; i++) {
		// doubleAvg.push(Math.random() * 100000 | 0 );
		doubleAvg.push(hans.blackbox.roll(0, 100));
	};

	// doubleAvg.push(seededRandomVis.getAverage(hans.custom.getArray(0, 1, 10000000, 0, 0)))

	// hans.custom.getArray(0, 255, 3 * 1300000, 0, 0)

	console.log(seededRandomVis.getAverage(doubleAvg));


	const endTime = performance.now();

	const resultTime = endTime - startTime;

	console.log("took " + resultTime);
}

var hans = new seededRandom(34312, 100);


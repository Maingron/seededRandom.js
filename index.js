function seededRandom(seed = 0) {
	let rollCount = 0;
	let previousResult = 1;

	const config = {
		internalMax: Number.MAX_SAFE_INTEGER,
		internalNoise: 98470239817094

	}

	let getNewBaseSeed = function(seed = seed, rollCount = rollCount, previousResult = previousResult) {
		let result = (seed + 1) * (rollCount + 1) * (previousResult + 2);
		result = (result * config.internalNoise) % config.internalMax;

		return result;
	}

	let rollInternal = function(min, max, rollCount, previousResult) {
		max = max + 0.98;

		let result = getNewBaseSeed(seed, rollCount, previousResult);

		result = result % max;

		result = result|0;

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

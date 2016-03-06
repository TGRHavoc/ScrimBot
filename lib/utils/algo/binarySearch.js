//Search the specified key with the given value (value MUST be unique && array MUST be sorted by key)
function binarySearch(arr, key, toFind){
	var minIndex = 0;
	var maxIndex = arr.length -1;
	var currentIndex;
	var currentElement;

	while(minIndex <= maxIndex){
		currentIndex = (minIndex + maxIndex) /2 | 0;
		currentElement = arr[currentIndex][key];

		if(currentElement < toFind){
			minIndex = currentIndex +1;
		}else if (currentElement > toFind) {
			maxIndex = currentIndex -1;
		}else{
			return arr[currentIndex];
		}
	}

	return -1; //We couldn't find our object with the value in it's key :(
}
//E.g.
/*
Performing binarySearch on this (sorted) array.

Make sure it's sorted first: mergeSort(array, "name");
to get by name: binarySearch(array, "name", "Yup...");


var array = [
	{"uuid" : "Some UUID", "name" : "Some Name"},
	{"uuid" : "Another", "name" : "Yup.."}
]
*/
module.exports = binarySearch;

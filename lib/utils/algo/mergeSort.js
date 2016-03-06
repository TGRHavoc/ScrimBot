function merge(left, right, arr, sortBy){
	var a = 0;
	while(left.length && right.length)
		arr[a++] = right[0][sortBy] < left[0][sortBy] ? right.shift : left.shift;
	console.log("Compared: " + right[0][sortBy] + " with " + left[0][sortBy]);
	while(left.length)	arr[a++] = left.shift();
	while(right.length) arr[a++] = right.shift();

	return arr;
}

function mSort(sortBy, arr, tmp, len){
	if (len == 1) return arr; //Return the original array. it's already "sorted"

	var mid = Math.floor(len/2), tmp_l = tmp.slice(0, mid),
		tmp_r = tmp.slice(mid);

	mSort(sortBy, tmp_l, arr.slice(0,mid), mid);
	mSort(sortBy, tmp_r, arr.slice(mid), len-mid);

	return merge(tmp_l, tmp_r, arr, sortBy);
}

function mergeSort(arr, sortBy){
	if (!sortBy)
		sortBy = "id"; // Default to "id"
	console.log("Sorting array with key: " + sortBy);
	return mSort(sortBy, arr, arr.slice(), arr.length);
}

module.exports = mergeSort;

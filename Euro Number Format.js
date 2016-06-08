function euroNumber(numS){
	var minus = false;
	if (parseInt(numS)<0){
	  minus = true;
	  numS = numS.replace('-','');
	}

	// Brake the number to 2 parts
	var numSParts= numS.split('.');

	if (numSParts.length == 2){
	  // Remove all ','
	  var find = ',';
	  var re = new RegExp(find, 'g');
	  numSParts[0] = numSParts[0].replace(re, '');
	  
	  // Set '.' between every 3 characters from right
	  numSParts[0] = numSParts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

	  // Set the right part to fixed 2 chars
	  numSParts[1] = (numSParts[1]+'00').slice(-2);
	  
	  console.log((minus?'-':'')+numSParts[0]+','+numSParts[1])
	}
}

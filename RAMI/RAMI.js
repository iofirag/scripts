/* RAMI V2 */

loadScript("http://code.jquery.com/jquery-2.2.1.min.js", handler);
//$.getScript("http://code.jquery.com/jquery-2.2.1.min.js", function(){

	//alert("Script loaded but not necessarily executed.");
	//handler()
//});


function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}


function handler(){
	
	var regexForText = /&nbsp;/gi
	var regexForNumber = /\D/g
	var allATags = $('tbody a[href^="resultsDetailed.aspx?"]');
	var allResults = [];
	var errors = [];
	var start = new Date().getTime();

	$.each(allATags, function(i,link){
		var link = allATags[i];
		$.get(link, function( htmlResultString ) {
			var html = jQuery.parseHTML(htmlResultString)
			var data = {};
			
			// String
			data.date   =       $( $('b:contains("תאריך החלטה")', html).parent().parent()[0].children[2] ).text().replace(regexForText,'').trim()
			data.city = 		$( $('b:contains("ישוב")', html).parent().parent()[0].children[2] ).text().trim()
			data.region =		$( $('b:contains("שכונה")', html).parent().parent()[0].children[0] ).text().trim()
			data.mechrazID = 	$( $('b:contains("נתוני מכרז")', html).parent().parent().parent()[0].children[1] ).text().trim()
			data.idOfMigrash = 	$( $('b:contains("נתוני מגרש/מתחם")', html).parent().parent()[0].children[0]).text().trim()
			data.winnerNames =  $( $('b:contains("שם הזוכה")', html).parent().parent()[0].children[0] ).text().replace(regexForText,'').trim()
			
			// Link
			data.publicPage = '<![CDATA['+link.href+']]>';
			
			// Numbers
			data.areaSize = 	     parseInt( $( $('b:contains("שטח")', html).parent().parent()[0].children[0] ).text().replace(regexForNumber ,'').trim() )
			data.units = 		     parseInt( $( $('b:contains('+'יח"ד'+')', html).parent().parent()[0].children[0] ).text().replace(regexForNumber ,'').trim() )
			data.numOfBids =         parseInt( $( $('b:contains("מספר הצעות")', html).parent().parent()[0].children[0] ).text().replace(regexForNumber ,'').trim() )
			data.amountOfMigrashim = parseInt( $( $('b:contains("מספר מגרשים באתר")', html).parent().parent()[0].children[0] ).text().replace(regexForNumber ,'').trim() )
			data.minSalary = 	     parseInt( $( $('b:contains("מחיר מינימום")', html).parent().parent()[0].children[0] ).text().replace(regexForNumber ,'').trim() )
			data.shuma =             parseInt( $( $('b:contains("מחיר שומא")', html).parent().parent()[0].children[0] ).text().replace(regexForNumber ,'').trim() )
			data.pituch =            parseInt( $( $('b:contains("הוצאות פיתוח")', html).parent().parent()[0].children[0] ).text().replace(regexForNumber ,'').trim() )
			data.firstBid = 		 parseInt( $( $('b:contains("פירוט הצעות")', html).parent().parent()[0].children[3] ).text().replace(regexForNumber ,'').trim() )
			data.secondBid =   		 parseInt( $( $('b:contains("פירוט הצעות")', html).parent().parent()[0].children[2] ).text().replace(regexForNumber ,'').trim() )
			data.winAmount =         parseInt( $( $('b:contains("סכום זכיה")', html).parent().parent()[0].children[0] ).text().replace(regexForNumber ,'').trim() )
			data.averageBids =       parseInt( $( $('b:contains("ממוצע הצעות")', html).parent().parent()[0].children[0] ).text().replace(regexForNumber ,'').trim() )
			data.amountOfWinners =   parseInt( data.winnerNames.split(",").length )
			
			// Our calculation
			if (!!data.shuma){
				data.shuma = data.minSalary*2;
			}
			data.winAmountToShuma_Percent = (data.winAmount/data.shuma*100)-100;
			
			

			allResults.push(data)
			checkForPrintResults();
		}).fail(function() {
			errors.push(link)
		});
	})
	function checkForPrintResults(){
	  console.log('Results '+allResults.length+'/'+allATags.length)
	  if (allATags.length == (allResults.length + errors.length)){
		console.dir(allResults);
		var end = new Date().getTime();
		var time = end - start;
		alert('Execution time: ' + time);
		var xmlStr = json2xml(allResults)
		var xmlStrValid = '<?xml version="1.0" encoding="UTF-8"?>'
							+'<file>'
							+xmlStr
							+'</file>';
		exportAsXML(xmlStr)
	  }
	}
	function exportAsXML(xmlStr){
		var blob = new Blob([xmlStr], {type: 'application/xml'});
		var url  = URL.createObjectURL(blob);
		// Build download file
		var a = document.createElement('a');
		a.download    = 'backup'+Date.now()+'.xml';
		a.href        = url;
		a.textContent = 'Download backup.xml';
		a.click();
	}
	function json2xml(o, tab) {
	   var toXml = function(v, name, ind) {
		  var xml = "";
		  if (v instanceof Array) {
			 for (var i=0, n=v.length; i<n; i++)
				xml += ind + toXml(v[i], name, ind+"\t") + "\n";
		  }
		  else if (typeof(v) == "object") {
			 var hasChild = false;
			 xml += ind + "<" + name;
			 for (var m in v) {
				if (m.charAt(0) == "@")
				   xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
				else
				   hasChild = true;
			 }
			 xml += hasChild ? ">" : "/>";
			 if (hasChild) {
				for (var m in v) {
				   if (m == "#text")
					  xml += v[m];
				   else if (m == "#cdata")
					  xml += "<![CDATA[" + v[m] + "]]>";
				   else if (m.charAt(0) != "@")
					  xml += toXml(v[m], m, ind+"\t");
				}
				xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
			 }
		  }
		  else {
			 xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
		  }
		  return xml;
	   }, xml="";
	   for (var m in o)
		  xml += toXml(o[m], 'obj', "");
	   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
	}
}


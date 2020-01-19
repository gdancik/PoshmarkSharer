ff = function(x) {
    alert(document.URL);
}

sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function share(shares, i, type) {

	var p;
	if (type == 'feed') {
		className = 'share-wrapper__share-title caption';	
		p = shares[i].parentElement.parentElement.parentElement;
	} else if (type == 'closet') {	
		className = 'share-wrapper-con';			
		p = shares[i].parentElement.parentElement.parentElement.parentElement.parentElement		
	} else {	
		alert('Error: type must be either \'feed\' or \'closet\'');
    	return;   	
	}

    p.scrollIntoView();
    
    p.style.backgroundColor = 'lightyellow';
    
    await sleep(400 + Math.random(200));

    //console.log('clicking #: ' + (i+1));
    shares[i].click();

   await sleep(1000 + Math.random()*1000);
   
    confirm = document.getElementsByClassName(className);
    
    if (confirm.length == 0) {
    	alert('Error: confirm page not found');
    	return;
    }
    
    confirm[0].click();
    //console.log('now confirm')
    await sleep(1000 + Math.random() * 1000);
    shares[i].parentElement.parentElement.style = 'background-color: pink;';
}

async function getShares(n) { // We need to wrap the loop into an async function for this to work

//    alert('in getShares!');

    var type = 'none';
    var url = document.URL;
    if (url.includes('feed')) {
        type = 'feed';
   // } else if (url.includes('closet')) {
   //     type = 'closet';
    } else {
        type = 'closet';
//        alert('Please run from your feed or a closet');
    }

    if (type == 'feed') {
    	className = 'social-action-bar__share';
    } else if (type == 'closet') {
    	className = 'share-gray';
    } else {
    	alert('Error: type must be either \'feed\' or \'closet\'');
    	return;    	
	}

    shares = document.getElementsByClassName(className);

	if (shares.length == 0) {
		alert('Error: No shares detected for type: ' + type);
		return;
	}
    
    //n = Math.min(n, shares.length);

    var shareCount  = document.getElementById('poshmarker-share-count');
    if (shareCount == null)  {
        div = document.createElement('div');
        div.style = 'position: fixed; bottom:0%; right: 0%; background-color:black; width: 20%; height: 5%; color:white;';
        div.innerHTML = "<center><h3 id = 'poshmarker-share-count' style='padding:8px;'> Number of shares: 0 / " + n + "</h3></center>";
        document.body.appendChild(div);
        shareCount  = document.getElementById('poshmarker-share-count');
    }


    for (var i = 0; i < n; i++) {
   
        if (i >= shares.length) {
            window.scrollBy(0,200);
            await sleep(1000 + Math.random()*1000);
            shares = document.getElementsByClassName(className);
            if (i >= shares.length) {
                shareCount.innerHTML = 'Number of shares: ' + (i+1) + ' / ' + n + ' (no more found)';
                n = i;
                break;
            }
        }

        await share(shares, i, type);    
        // console.log('shared: ' + (i+1));
        shareCount.innerHTML = 'Number of shares: ' + (i+1) + ' / ' + n;
     }

     chrome.storage.local.get(['shareNum', 'shareNumDate'], function(result) {

        var count = result.shareNum;
        var d = result.shareNumDate;
        if (count == undefined || d == undefined) {
            count = 0;
        }

        count = count + n;
        chrome.storage.local.set({'shareNum': count});
    });

     chrome.storage.local.get(['shareNumToday'], function(result) {

        var count = result.shareNumToday;
        if (count == undefined) {
            count = 0;
        }

        count = count + n;
        chrome.storage.local.set({'shareNumToday': count});

     });

}




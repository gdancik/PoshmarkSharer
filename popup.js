
chrome.tabs.executeScript(null, {file: "poshmark.js"});

function loadShareNum() {

    chrome.storage.local.get(['shareNum', 'shareNumDate'], function(result) {

        var count = result.shareNum;
        var d = result.shareNumDate;
        if (count == undefined || d == undefined) {
            chrome.storage.local.set({'shareNum': 0}); 
            d = new Date();
            d =  d.toLocaleTimeString() + ' on ' + d.toLocaleDateString(); 
            chrome.storage.local.set({'shareNumDate': d}); 
            count = 0;
        } 
        
        var str = 'You have shared <b>' + count + '</b> items since ' + d;
        document.getElementById('countSpan').innerHTML = str;

    });
}

function clearShareNum() {
        chrome.storage.local.clear(function() {
            loadShareNum();
        });
}

function highlight(number) {
    window.close();
    //codeString = "var qry = \"" + keyword + "\";";
    //chrome.tabs.executeScript(null, {code: codeString});

    codeString = "getShares(" + number + ");";
    chrome.tabs.executeScript(null, {code: codeString});

}


// Chrome extensions do not allow inline Javascript in popups for security reasons; instead
// add listener for button click, in this case calling 'highlight()'
document.addEventListener('DOMContentLoaded', function() {


    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
        function(tabs){
            if (tabs[0].url.includes('poshmark')) {

                loadShareNum();

                document.getElementById("btnShare").addEventListener("click", function() {
                    var number = document.getElementById('shareNum').value;
                    if (number == "") {
                        alert("Please enter a number");
                         return;
                    }

                    highlight(number);
                });

                document.getElementById('btnReset').addEventListener("click", function() {
                    clearShareNum()
                }); 

            } else {

                document.body.innerHTML = '</br><h2> Welcome to the PoshMarker</h2>' +  
                    '<p> To use this extension, please go to ' +  
                    '<a href = "https://poshmark.com" target="_blank">https://poshmark.com</a></p></br>';

            }
            
            document.body.style.borderStyle = 'solid';
            document.body.style.margin = '5px'
            document.body.style.padding = '10px'
            document.body.style.borderWidth = '1px'
        }
    );

});




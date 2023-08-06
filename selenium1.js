
require("chromedriver")
let swd = require("selenium-webdriver")

let browser = new swd.Builder()
let gCodesElements = [];
let tAreaE = null;
let gcInputBox = null;


let tab = browser.forBrowser("chrome").build()

let tabWillBeOpened = tab.get("https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login")

tabWillBeOpened.then(function () {
   
    let findTimeOutP = tab.manage().setTimeouts({
        implicit: 10000
    });
    return findTimeOutP;
})
.then(function(){
    let inputBoxPromise = tab.findElement(swd.By.css("#input-1"));
    let passwordBoxPromise = tab.findElement(swd.By.css("#input-2"));
        return Promise.all([ passwordBoxPromise, inputBoxPromise]);
})
    .then(function(bothBox){
        
        let passwordBox = bothBox[0]
        let inputBox = bothBox[1]
        let passwordWillBeFilled = passwordBox.sendKeys("//Enter your password here")
        let inputBoxWillBeFilled = inputBox.sendKeys("//Enter your email here")
        return Promise.all([inputBoxWillBeFilled, passwordWillBeFilled]);
    })
    .then(function(){
        let loginBtn = tab.findElement(swd.By.css("button[data-analytics='LoginPassword']"))
        return loginBtn;
    })
    .then(function(loginBtn){
       let loginBtnWillBeClicked =  loginBtn.click()
       return loginBtnWillBeClicked;
    })
    .then(function(){
        let interviewBtnFind = tab.findElement(swd.By.css(".ui-card.ui-layer-3.active-card"));
        return interviewBtnFind;
    })
    .then(function(interviewBtn){
       let interviewBtnWillBeClicked = interviewBtn.click()
       return interviewBtnWillBeClicked;
    })
    .then(function(){
        let warmupBtnFind = tab.findElement(swd.By.css("a[data-attr1='warmup']"));
        return warmupBtnFind;
    })
    .then(function(warmupBtn){
        let warmupBtnWillBeClicked = warmupBtn.click()
        return warmupBtnWillBeClicked;
    }).then(function () {
        
        let allQtag = tab.findElements(swd.By.css("a.js-track-click.challenge-list-item"));
        return allQtag
    }).then(function (alQues) {
        let allQLinkP = alQues.map(function (anchor) {
            return anchor.getAttribute("href");
        })
        let allLinkPromise = Promise.all(allQLinkP);
        return allLinkPromise;
    }).then(function (allQLink) {
       
        let f1Promise = questionSolver(allQLink[0]);
        for (let i = 1; i < allQLink.length; i++) {
            f1Promise = f1Promise.then(function () {
                return questionSolver(allQLink[i])
            })
        }
        let lstQuestWillBeSolvedP = f1Promise;
        return lstQuestWillBeSolvedP;
    }).then(function () {
        console.log("All questions");
    })
    .catch(function (err) {
        console.log(err);
    })




    function questionSolver(url) {
        return new Promise(function (resolve, reject) {
           
            let qPageWillBeOpenedP = tab.get(url);
            qPageWillBeOpenedP.then(function () {
           
            let EditorButtonWillBeSelected = tab.findElement(swd.By.css("a[data-attr2='Editorial']"))
            return EditorButtonWillBeSelected;
        })
        .then(function(editBtn){
            let editBtnWillBeClicked = editBtn.click()
            return editBtnWillBeClicked;
        })
        .then(function(){
            let lockBtnHandled = handleLockBtn();  
            return lockBtnHandled;
        })
        .then(function () {
            let cCodeWillBecopied = copyCode(); 
            return cCodeWillBecopied;
        }).then(function (code) {  
            let codeWillBepastedP = pasteCode(code);  
            return codeWillBepastedP;
        })
        .then(function(){
            resolve() 
        })
        .catch(function (err) {
            reject(err);
        })
    })
}


function handleLockBtn(){
    return new Promise(
        
        
        
        function(resolve,reject){


        let lockBtnWillBeFind = tab.findElement(swd.By.css(".editorial-content-locked button"))
        lockBtnWillBeFind
        .then(function(lockBtn){
            let lockBtnWillBeClicked = lockBtn.click()
            return lockBtnWillBeClicked;    
        })
        .then(function(){
            resolve()
        })
        .catch(function(){
            resolve()
        })




         }
    
    
    
    
    )
}

function copyCode() {
    return new Promise(function (resolve, reject) {
        
        let allLangElementP = tab.findElements(swd.By.css(".hackdown-content h3"));
       
        let allcodeEementP = tab.findElements(swd.By.css(".hackdown-content .highlight"));


        let bothArrayP = Promise.all([allLangElementP, allcodeEementP]);

        bothArrayP
            .then(function (bothArrays) {
                let langsElements = bothArrays[0]; 
                gCodesElements = bothArrays[1];
                let allLangTextP = [];
                for (let i = 0; i < langsElements.length; i++) {
                    let cLangP = langsElements[i].getText();
                    allLangTextP.push(cLangP);  
                }
                return Promise.all(allLangTextP);
            })
            .then(function (allLangs) {
                let codeOfCP;
                for (let i = 0; i < allLangs.length; i++) {
                    if (allLangs[i].includes("C++")) {
                        codeOfCP = gCodesElements[i].getText(); 
                        break;
                    }
                }
                return codeOfCP;
            }).then(function (code) {
                console.log(code)
                resolve(code);
            }).catch(function (err) {
                reject(err);
            })
    });
}

function pasteCode(code) {
    return new Promise(function (resolve, reject) {
       
        let pTabWillBeSelectedP = tab.findElement(swd.By.css("li#Problem"));
        pTabWillBeSelectedP.then(function (pTab) {
            let pTwillBeClickedP = pTab.click();
            return pTwillBeClickedP
        })
        .then(function () {
            let inputBoxWBeSP = tab.findElement(swd.By.css(".custom-input-checkbox"));
            return inputBoxWBeSP;
        }).then(function (inputBox) {
            let inputbWillBeCP = inputBox.click();
            return inputbWillBeCP;
        }).then(function () {
            let cInputWillBeSelectedP = tab.findElement(swd.By.css(".custominput"));
            return cInputWillBeSelectedP;
        }).then(function (cInputBox) {
            gcInputBox = cInputBox;
            let codeWillBeEnteredP = cInputBox.sendKeys(code);  
            return codeWillBeEnteredP;
        }).then(function () {
            let ctrlAWillBeSendP = gcInputBox.sendKeys(swd.Key.CONTROL + "a");
            return ctrlAWillBeSendP;
        }).then(function () {
            let ctrlXWillBeSendP = gcInputBox.sendKeys(swd.Key.CONTROL + "x");
            return ctrlXWillBeSendP;
        })
        .then(function () {
            let tAreaP = tab.findElement(swd.By.css("textarea"));
            return tAreaP;
        }).
        then(function(tArea){
            tAreaE = tArea;
            let pSelectAll = tArea.sendKeys(swd.Key.CONTROL + "a");
            return pSelectAll;
        })
        .then(function(){
            let pDelete = tAreaE.sendKeys(swd.Key.BACK_SPACE);
            return  pDelete
        })
        .then(function(){
            let pPaste = tAreaE.sendKeys(swd.Key.CONTROL + "v");
            return pPaste;

        })
        .then(function () {
            let submitCodeBtnWillBeS = tab.findElement(swd.By.css("button.hr-monaco-submit"));
            return submitCodeBtnWillBeS;
        }).then(function (submitBtn) {
            let submitBtnWillBeClickedP = submitBtn.click();
            return submitBtnWillBeClickedP;
        })
        .then(function () {
            resolve();
        }).catch(function (err) {
            reject(err);
        })
        
    })
}

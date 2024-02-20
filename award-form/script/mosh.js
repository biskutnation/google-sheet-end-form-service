function countInputsByName(name){
    return document.getElementsByName(name).length;
}

// 141123 - replace td tag with div
function addIncrementCell(name,parent){
    let div = document.createElement("div");
    let i = countInputsByName(name)+1;
    div.setAttribute("class","col-1 px38 order-first numbering")

    div.textContent = i+".";
    parent.append(div);
}

// 141123 - replace td tag with div 

function removeParentButton(parent,id) {
    // parent jahat
    let div = document.createElement("div");
    div.setAttribute("class","col-1 px38 remove order-md-last")
    let iRemove = document.createElement("i");
    iRemove.setAttribute("class","bi bi-x-circle-fill");
      
    iRemove.onclick = function(){    
        this.parentElement.parentElement.remove();
        incrementRecount(id);
        };
    
    div.append(iRemove);
    parent.append(div);
}

// 14/11/2023 replace tag tr with class name numbering
function incrementRecount(id) {
    // renumber the column with numbering class name 
    
    const parent = document.getElementById(id);
    let rows = parent.getElementsByClassName("numbering");
    let i = 1;

    for (row of rows) {
        if (row.textContent === "#") { continue }  
        row.textContent = i+".";
        i++;
    }
}

// 141123 updated
function addUserRow(){
    const userDetails = document.getElementById("userDetails");
    let parent = document.createElement("div");
    parent.setAttribute("class","row my-2 my-md-0 pb-1 justify-content-between")
    
    // first child
    addIncrementCell("names",parent);

    // second child in DOM
    removeParentButton(parent,"userDetails")

    // the keys' values are for placeholder
    let obj = {
        names : 'Nama Penuh', icNos : 'No. K/P', emails : 'Emel', hpNos : 'No. Tel' 
    }

    for (key in obj) {
        let div = document.createElement("div");
        div.setAttribute("class","col-12 col-md mb-1 mb-md-0");
        // if (key === "names") div.className += " mt-2 mt-md-0";

        let input = document.createElement("input");
        input.setAttribute("type","text"); 
        input.setAttribute("name",key);
        input.setAttribute("placeholder",obj[key]);

        div.append(input)
        parent.append(div);
    }
    
    userDetails.append(parent);
}

document.getElementById("firstAddButton")
    .addEventListener("click",()=>{
        addUserRow();

    });

// 141123 previously addFourCols()
function addTitleDateRow(){
    const titleDate = document.getElementById("titleDate");
    let parent = document.createElement("div");
    parent.setAttribute("class","row py-1")

    // first child
    addIncrementCell("titles",parent);
    

    let obj = { titles : 'col', dates : 'col-3' };
    
    for (key in obj){
        let div = document.createElement("div");
        let input = document.createElement("input");
        input.setAttribute("type","text");
        input.setAttribute("name",key);
        div.setAttribute("class",obj[key]);

        div.append(input);
        parent.append(div);
    }
    
    removeParentButton(parent,"titleDate"); // last child
    titleDate.append(parent);
}

document.getElementById("secondAddButton").addEventListener("click",()=>{addTitleDateRow()});

let arr1 = [ 
    [ 'Alf The Fred', 'ic_01', 'bukitledangmpi@yahoo.com', 'hp_01' ],
    [ 'name_02', 'ic_02', 'trainingmpi2945@gmail.com', 'hp_02' ],
    [ 'name_03', 'ic_03', 'testing@test.com', 'hp_03' ],
    [ 'Shizuka Redline', 'ic_04', 'field@example.com', 'hp_04' ],
    [ 'name_05', 'ic_05', 'email_05', 'hp_05' ]
    ];

let arr2 = [
    [ 'item_01', 345 ],
    [ 'item_02', 2 ],
    [ 'item_03', 146 ],
    [ 'item_04', 678 ],
    [ 'item_05', 19 ]
    ];


// ignore this for a while
function buttonClicks(name,arr,id) {
    // clicks button based on array length
    // can be improved especially on i & name, maybe put default statement

    let button = document.getElementById(id);
    let i = countInputsByName(name);
    for (i; i<arr.length; i++) {
    button.click();
    }
}

// ignore this for a while
function populateInputsById(id,array2D) {
    let parent = document.getElementById(id).getElementsByTagName("div");

    let i = 0;
    for ( els of parent ) {
        let inputs = els.getElementsByTagName("input");
        
        let j = 0;
        if (inputs.length > 0) {
            for (input of inputs) {
            input.value = array2D[i][j];
                j++;
                }
            i++;
            }
        }
}

const params = (new URL(window.location.href)).searchParams;
if (params.get('by') != null) document.getElementsByName('EnterBy')[0].value = params.get('by');

const inputNamesObj = {

    Category : 'category',
    MediaType : 'mediaType',
    Organisation : 'organisation',
    Name : 'names',
    NoHP : 'hpNos', 
    NoIC : 'icNos', 
    Email : 'emails',
    Title : 'titles',
    Date : 'dates',
    ssId : 'ssId',
    sht : 'sht'
    //Language : 'language',
    //EnterBy : '',
    //Link : ''
};


function pushToHiddenInputs(obj) {
    // to extract values from existing names based on object value
    // and push those value into hidden names

    for (key in obj) {
        let name = document.getElementsByName(key);
        let plural = document.getElementsByName(obj[key]);

        if (plural.length < 1) continue; // especially for form without Language & PsuedoName inputs

        let array = [];
        
        for (el of plural) {
            array.push(el.value.trim());
        }
        name[0].value = array.join(",\n")
        //console.log(key, name.value);
    }
}


const actionURL = "https://script.google.com/macros/s/AKfycbzmeVR4LqdrC4qgKQVxurD1P2uz9sWA25rcn3g_yQ9saYNDQj8o_wBbCnVX9YIy6i6i/exec";

function CheckError(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
}

let data;
function postSubmit(formId,lang) {
    // lang = ENG or BM

    displayHide("#pageOverlay");
    if(!validation(lang)) return displayHide("#pageOverlay");
    pushToHiddenInputs(inputNamesObj);
    let form = document.forms[formId];
    console.time("fetch");
    //document.getElementById('sixCols').scrollIntoView();
    fetch(actionURL, {
         method: 'POST', 
         body: new FormData(form)
        })
        .then(response => response.json())
        .then(res => {
            displayHide("#modalBox");
            afterRespondMsg("",lang);
            console.log(res)
            console.timeEnd("fetch");
            data = res;
            document.getElementById('catId').textContent = "Entry No : " + data.response[1];
        })
        .catch(error => {
            console.error('Error!', error.message);
            displayHide("#modalBox");
            afterRespondMsg("Error",lang);
        })
    console.log("this submission will email confirmation to recipient")    
}

// ignore this for a while
// populate inputs
function abc() {
    
    document.getElementsByName("category")[0][6].selected = true; 
    document.getElementsByName("mediaType")[0][3].selected = true; 

    buttonClicks("names",arr1,"firstAddButton");
    buttonClicks("titles",arr2,"secondAddButton");
    
    populateInputsById("userDetails",arr1);
    populateInputsById("titleDate",arr2);
    
    document.getElementsByName("organisation")[0].value = "Brentford United";
    //if (document.getElementsByName("language").length != 0) document.getElementsByName("language")[0].options[2].selected = true;
    //if (document.getElementsByName("publication").length != 0) document.getElementsByName("publication")[0].value = "Sasbadi";

    }
console.log("Try abc()");

function afterRespondMsg(result,lang) {
    // result = Error or Success
    // lang = ENG or BM
    
    let modalBox = document.getElementById("modalBox");
    let ionIcon = document.createElement("ion-icon");
    let h3 = document.createElement("h3");
    let p = document.createElement("p");
    let a = document.createElement("a");
    let catId = document.createElement("h2");

    // this removing child is important
    while (modalBox.firstChild) {
        modalBox.removeChild(modalBox.firstChild);
    }

    ionIcon.setAttribute('class','check');
    ionIcon.setAttribute('name','checkmark-circle');
    
    h3.textContent = "Submit!"
    
    p.setAttribute("class","alertText");
    p.textContent = "Your entry has been submitted. A confirmation email will be sent.";

    a.setAttribute("onclick","endProcess()"); 
    a.setAttribute("class", "btn btn-outline-secondary")
    a.textContent = "Close";

    catId.setAttribute("id","catId");
    catId.textContent = "-";

    //if (data) catId.textContent = data.response[4];

    if (lang === "BM") {
        h3.textContent = "Hantar!";
        p.textContent = "Penyertaan ini telah direkod dan emel pengesahan penyertaan akan dihantar.";
        a.textContent = "Tutup";
    }

    if (result === "Error") {
        ionIcon.setAttribute('class','X');
        ionIcon.setAttribute('name','close-circle');
        h3.textContent = "Error";
        p.textContent = "Please wait for a while and try again.";
        if (lang === "BM") {
            p.textContent = "Sila tunggu sebentar untuk beberapa minit dan cuba tekan lagi butang hantar";
        }
    }

    if (result != "Error") a.addEventListener("click",function(){window.location.reload()});

    modalBox.append(ionIcon,h3,p,catId,a);
}

// 20/11/23 updated, just changing function name from hideShow to displayHide
function displayHide(selector) {
    const el = document.querySelector(selector);
    if (el.style.display == "none" || el.style.display == "") {
        el.style.display = "inline-block";
    } else {
        el.style.display = "none";
    }
}

// 20/11/23 added
function visibilityHide(selector,hidden_visibility = "hidden") {
    const el = document.querySelector(selector);
    return el.style.visibility = hidden_visibility;
}

function endProcess() {
    displayHide('#modalBox');
    document.getElementsByTagName("h3")[0].scrollIntoView();
    setTimeout(() => {displayHide("#pageOverlay")}, 1200);
};

// function validate(Form) {
//     let form = document.forms[Form];

//        if( form.names.value == "" ) {
//           alert( "Please provide your name" );
//           form.names.focus() ;
//           return false;
//        }
//        if( form.emails.value == "" ) {
//           alert( "Please provide your Email" );
//           form.emails.focus() ;
//           return false;
//        }
//       return( true );
// }

function check(elName, text) {

    let byName = document.getElementsByName(elName)[0];

    if (!byName) return (true); // check existence of an element by name

    if (byName.value == "") {
        alert(text); byName.focus(); return false;
    }

    return (true);
}

function validation(lang) {
    // lang = ENG or BM

    let obj = { 
        BM : {
            category : "Mohon pilih kategori",
            mediaType: "Mohon pilih jenis media",
            names:"Sila isi nama penuh",
            organisation:"Mohon isi nama penerbitan atau media",
            language:"Sila pilih bahasa / jenis media",
            icNos:"Sila isi nombor kad pengenalan",
            emails:"Sila isi alamat emel",
            hpNos:"Sila isi nombor telefon",
            titles:"Sila isi tajuk",
            //publication:"Sila isi nama penerbitan",
            Link:"Mohon isi pautan (link) bahan penyertaan"
            },
        
        ENG : {
            category : "Please select category",
            mediaType: "Please select media type",
            names:"Please provide the full name",
            language:"Please select language or media type",
            organisation:"Please provide the name of publication or media",
            icNos:"Please fill up the identification number",
            emails:"Please provide the email address",
            hpNos:"Please provide the contact number",
            titles:"Please fill up the title",
            //publication:"Please provide the name of publication",
            Link:"Please provide the url link of material(s)"
        }
    }
    
    if (!lang) lang = "ENG";

    let object = obj[lang];
    for (key in object) {
        if(!check(key,object[key])) return;
     };

    return (true);
}

// 19/11/2023 updated
// category option behavior changes via media type selection
function optMediaType() {
    
    const mediaType = document.getElementById("mediaType");
    const category = document.getElementById("category");
    
    let val = mediaType.value[0]; // first letter of media type
    
    // IDs' variable    
    const first = "#firstAddButton";
    const second = "#secondAddButton";

    // empty language value or initial point
    if (!val || val === "") {
        category.disabled = true;
        category.options[0].selected = true;
        
        visibilityHide(first);
        visibilityHide(second);
        console.log("Media type not selected");
        return;
    }
    
    console.log("type:",val);
    category.disabled = false;
    category.options[0].selected = true;
    
    // val: F|G|C|V|R;
    
    // Photography
    if (val === "F") {
        for (option of category.options) {
            option.hidden = true;
            if (option.value === "J. Single Foto" || option.value === "K. Esei Foto") {
                option.hidden = false;
            }
        }
        visibilityHide(first);
        visibilityHide(second);
        oneChildOnly("userDetails");
        oneChildOnly("titleDate");
        console.log("individual and one title only")
        return;
    }

    // Graphic
    if (val === "G") {
        for (option of category.options) {
            option.hidden = true;
            if (option.value[0] === "B" || option.value[0] === "C") {
                option.hidden = false;
            }
        }
        visibilityHide(first,"visible");
        visibilityHide(second);
        oneChildOnly("titleDate");
        console.log("team members allowed and one title only")
        return;
    }

    // Print 
    if (val === "C") {
        
        const index = "DEFGHI";
        const muda = "A. Muda Cetak";
        for (option of category.options) {
            option.hidden = true;
            if (index.indexOf(option.value[0]) !== -1 || option.value === muda) option.hidden = false;
        }  
        visibilityHide(first,"visible");
        visibilityHide(second,"visible");
        console.log("team members allowed")
        
        // category.addEventListener("change",function(){optPrintMedia()}); // 12/12/23 affecting other categories value

        return;
    }

    // Video
    if (val === "V") {
        
        const index = "DELMNO";
        const muda = "A. Muda TV";
        for (option of category.options) {
            option.hidden = true;
            if (index.indexOf(option.value[0]) !== -1 || option.value === muda) option.hidden = false;
        }  
        visibilityHide(first,"visible");
        visibilityHide(second,"visible");
        console.log("team members allowed")
        return;
    }

    // Radio
    if (val === "R") {
        
        const index = "DEPQRS";
        for (option of category.options) {
            option.hidden = true;
            if (index.indexOf(option.value[0]) !== -1) option.hidden = false;
        }  
        visibilityHide(first,"visible");
        visibilityHide(second,"visible");
        console.log("team members allowed")
        return;
    }  
};

// 26/01/24 there is a new change
function optPrintMedia() {
    const category = document.getElementById("category");

    // IDs' variable    
    const first = "#firstAddButton";
    const second = "#secondAddButton";

    visibilityHide(first, "visible");
    visibilityHide(second,"visible");
    
    const indexOneTitle = 'BCDFMNOPQRS' // 26/01/24      // BC are graphic categories, MNO are TV, PQRS are radio

    // if ( category.value[0] === "D" || category.value[0] === "F") { // OLD
    // 26/01/24
    if ( indexOneTitle.indexOf(category.value[0]) > -1) {
        visibilityHide(second);
        oneChildOnly("titleDate");
        return console.log("team members allowed and one title only")
    }

    const indexOneUser = 'AGJK'; // Muda, Kolum, Foto, Esei Foto

    if (indexOneUser.indexOf(category.value[0]) > -1) {
        visibilityHide(first);
        visibilityHide(second);
        if ( category.value[0] === "A" || category.value[0] === "G") visibilityHide(second,"visible");
        oneChildOnly("userDetails");
        return console.log("individual only")
    }

    return console.log("team members allowed")
}

// this is not one child policy..... JK
function oneChildOnly(parent_Id) {
    const PARENT = document.getElementById(parent_Id); // maybe use query selector

    while (PARENT.children.length > 2) {
        PARENT.lastChild.remove();
    }
}

// eventlistener on mediaType id 
if(document.getElementById("mediaType")) {
    window.addEventListener("load",function(){optMediaType()});
    document.getElementById("mediaType").addEventListener("change",function(){optMediaType()});
    document.getElementById("category").addEventListener("change",function(){optPrintMedia()});
    
    // 22/11/23 // OLD
    // window.addEventListener("load",function(){datalistRun()});
};

// ************ for datalist tag ********** 22/11/23 **************

function appendOption(parent,value) {
    let option = document.createElement("option")
    option.setAttribute("value",value)
    document.getElementById(parent).append(option)
}

let unwanted = `UM,UKM,SSM,PMO,Retired,KKM,Top Gear,PBB`.split(",")
let orgasIndex = 0;

function addListOfOptions(array) {
    array.forEach(el=> {
        if (unwanted.includes(el.Organisation)) { return }
        //console.log(orgasIndex, el.Organisation)
        appendOption("orgas",el.Organisation)
        orgasIndex++
    })
}

const datalistRun = async() => {

    let mediaList = fetch("https://opensheet.elk.sh/1HZDZwPP-UE6GlFjYUo40rwA-zP_aYmzozyErJWhbUy8/1")
        .then((res) => res.json())
        .then((data) => mediaList = data);

    let list = await mediaList
    addListOfOptions(list)
    console.log("datalist loaded")
}
// ***************************** end of datalist ******************


// 26/01/24
if(document.getElementsByName("organisation")[0]) {
    window.addEventListener("load",function(){datalistRun()});
}
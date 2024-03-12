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
    parent.setAttribute("class","row inputsRow my-2 my-md-0 py-1 justify-content-between align-items-center")
    
    // first child
    addIncrementCell("names",parent);

    // second child in DOM but last in order //
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
        input.setAttribute("class","form-control");
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

// 141123 previously known as addFourCols()
function addTitleDateRow(){
    const titleDate = document.getElementById("titleDate");
    let parent = document.createElement("div");
    parent.setAttribute("class","row inputsRow py-1 justify-content-between align-items-center my-md-0")

    // first child
    addIncrementCell("titles",parent);
    

    let obj = { 
        titles : {
            class : 'col-12 col-md mb-1 mb-md-0',
            placeholder : 'Tajuk'
        }, 
        dates : {
            class : 'col-5 col-md-3 mb-1 mb-md-0',
            placeholder : 'Tarikh'
        }, 
    };
    
    removeParentButton(parent,"titleDate"); // second in dom but last order

    for (key in obj){
        let div = document.createElement("div");
        div.setAttribute("class",obj[key].class);
        
        let input = document.createElement("input");
        input.setAttribute("type","text");
        input.setAttribute("name",key);
        input.setAttribute("class","form-control");
        input.setAttribute("placeholder",obj[key].placeholder);

        div.append(input);
        parent.append(div);
    }
    
    titleDate.append(parent);
}

document.getElementById("secondAddButton")
    .addEventListener("click",()=>{
        addTitleDateRow()
    });

function testDataObject(key) {

    const obj = {
        users : [ 
            [ 'Alf The Fred', 'ic_01', 'bukitledangmpi@yahoo.com', 'hp_01' ],
            [ 'name_02', 'ic_02', 'trainingmpi2945@gmail.com', 'hp_02' ],
            [ 'name_03', 'ic_03', 'testing@test.com', 'hp_03' ],
            [ 'Shizuka Redline', 'ic_04', 'field@example.com', 'hp_04' ],
            [ 'name_05', 'ic_05', 'email_05', 'hp_05' ]
        ],
        titleDate : [
            [ 'item_01', 345 ],
            [ 'item_02', 2 ],
            [ 'item_03', 146 ],
            [ 'item_04', 678 ],
            [ 'item_05', 19 ]
        ],
        organisation : [
            "Brentford United",
            "Jimmy Choo",
            "Wonka's Chocolate Factory",
            "Wankel Engine Workshop",
            "Dinamika Serbaboleh",
            "Spice Sand of Life",
            "Govern With Might"
        ],
        www : [
            "www.mpi.my","www.example.com","www.google.com","www.gsc.com","www.itch.io"
        ]
    }
    return obj[key]
}

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
    let parent = document.getElementById(id).getElementsByClassName("inputsRow");
    
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

// this one is old stuff, have to refactor this later on
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
    Date : 'dates'
    // ssId : 'ssId', // no more ssid, just awdId now
    // sht : 'sht'
    //Language : 'language',
    //EnterBy : '',
    //Link : ''
};


function pushToHiddenInputs(obj) {
    // to extract values from existing input(s) based on object value
    // and push those value into hidden input(s) 

    for (key in obj) {
        let name = document.getElementsByName(key);
        let plural = document.getElementsByName(obj[key]);

        if (plural.length < 1) continue; 

        let array = [];
        
        for (el of plural) {
            array.push(el.value.trim());
        }
        name[0].value = array.join(",\n")
        //console.log(key, name.value);
    }
}


const actionURL = "https://script.google.com/macros/s/AKfycbyNzz93yv0aokOI9Ge0Eq3ROUBbWXC666nwKLz9MDu5y6XksSteg22945MWxCKmJe1w/exec";
                                                    
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

function randomMath(number) {
    return Math.floor(Math.random()*number)
}

// populate inputs
function abc() {
    
    const obj = {
        cat : document.getElementsByName("category")[0],
        media_type : document.getElementsByName("mediaType")[0],
        link : document.getElementsByName("Link")[0]
    }
    obj.cat_len = obj.cat.length;
    obj.media_len = obj.media_type ? obj.mediaType.length : undefined;


    obj.cat[randomMath(obj.cat_len)].selected = true; 
    if (obj.media_type) obj.media_type[randomMath(obj.media_type)].selected = true; 

    let users = testDataObject("users");
    let titleDate = testDataObject("titleDate")

    buttonClicks("names",users,"firstAddButton");
    buttonClicks("titles",titleDate,"secondAddButton");
    
    populateInputsById("userDetails",users);
    populateInputsById("titleDate",titleDate);
    
    let orga = testDataObject("organisation")[randomMath(testDataObject("organisation").length)];
    document.getElementsByName("organisation")[0].value = orga;
    
    if (obj.link) obj.link.value = testDataObject("www")[randomMath(testDataObject("www").length)];
    

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
function visibilityHide(selector,hidden_visible = "hidden") {
    const el = document.querySelector(selector);
    return el.style.visibility = hidden_visible;
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

// 29/02/2024 updated
// category option behavior changes via category type selection
function optCategory_for_Agro() {
    
    // const mediaType = document.getElementById("mediaType");
    const category = document.getElementById("category");
    
    // let val = mediaType.value[0]; // first letter of media type
    
    // IDs' variable    
    const first = "#firstAddButton";
    const second = "#secondAddButton";

    // empty language value or initial point
    // if (!val || val === "") {
    //     category.disabled = true;
    //     category.options[0].selected = true;
        
    //     visibilityHide(first);
    //     visibilityHide(second);
    //     console.log("Media type not selected");
    //     return;
    // }
    
    // 29/02/2024
    if (category.value === "" || !category.value) {
        visibilityHide(first)
        visibilityHide(second)
        console.log("please select category")
        return
    }

    // console.log("type:",val);
    category.disabled = false;
    // category.options[0].selected = true;
    
    // val: A|B|C|D;
    visibilityHide(first,"visible")
    visibilityHide(second);
    oneChildOnly("titleDate");
    console.log("team members allowed and one title per entry only")
    return;
    
};

function optCategory_for_KPKT() {
    
    // const mediaType = document.getElementById("mediaType");
    const category = document.getElementById("category");
    
    // let val = mediaType.value[0]; // first letter of media type
    
    // IDs' variable    
    const first = "#firstAddButton";
    const second = "#secondAddButton";

    
    // 29/02/2024
    if (category.value === "" || !category.value) {
        visibilityHide(first)
        visibilityHide(second)
        console.log("please select category")
        return
    }

    // console.log("type:",val);
    category.disabled = false;
    // category.options[0].selected = true;
    
    // for F. Foto only
    if (category.value[0] === "F") {
        visibilityHide(first)
        visibilityHide(second)
        oneChildOnly("userDetails");
        oneChildOnly("titleDate");
        console.log("individual and one title per entry only")
        return
    }

    visibilityHide(first,"visible")
    visibilityHide(second, "visible");
    // oneChildOnly("titleDate");
    console.log("team members allowed and one title per entry only")
    return;
    
};


// this is not one child policy..... JK
function oneChildOnly(parent_Id) {
    const PARENT = document.getElementById(parent_Id); // maybe use query selector

    while (PARENT.children.length > 2) {
        PARENT.lastChild.remove();
    }
}

const AWARD_ID = document.getElementsByName("awdId")[0].value

// add event listener onload & change on category option
if(AWARD_ID === "Agro24") {
    window.addEventListener("load",function(){optCategory_for_Agro()});
    document.getElementById("category").addEventListener("change",function(){optCategory_for_Agro()});
}

if(AWARD_ID === "KPKT24") {
    window.addEventListener("load",function(){optCategory_for_KPKT()});
    document.getElementById("category").addEventListener("change",function(){optCategory_for_KPKT()});
}


// ************ for datalist tag ********** 22/11/23 **************

function appendOption(parent,value) {
    let option = document.createElement("option")
    option.setAttribute("value",value)
    document.getElementById(parent).append(option)
}

let unwanted = `UM,UKM,SSM,PMO,Retired,KKM,Top Gear,PBB`.split(",")
let orgasIndex = 0; // for log purpose 

function addListOfOptions(array) {
    array.forEach(el=> {
        if (unwanted.includes(el.Organisation)) { return }
        //console.log(orgasIndex, el.Organisation)
        appendOption("orgas",el.Organisation)
        orgasIndex++
    })
}

// query string to input field
(new URL(window.location.href))
    .searchParams
    .forEach((x, y) => {
        if (!document.getElementById(y)) return console.error("param query error: " + y);
        document.getElementById(y).value = x;
    });

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
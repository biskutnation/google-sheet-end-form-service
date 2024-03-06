// https://script.google.com/macros/s/AKfycbyNzz93yv0aokOI9Ge0Eq3ROUBbWXC666nwKLz9MDu5y6XksSteg22945MWxCKmJe1w/exec

// procedure for newly added award, should consider:
//  • ssid, spreadsheet id, sheet name
//  • sendingEmail(DATANEWROW,SSID)
//  • catObj which will return value of category/language long wording 
//  • email title in getTitleString(ssid)

// 16/02/2024

// function doPost(e) {

//   var result = "";
//   var response = "";

//   try {
//     response =  writeToSheet(e);
//     result = "Success!";
//    } 
//    catch(error) {
//      Logger.log(error);
//      result = "Error";
//      response = error;
//    }
  
//   Logger.log(response);
//   return ContentService
//     .createTextOutput(JSON.stringify({"Result" : result,response}))
//     .setMimeType(ContentService.MimeType.JSON);

// }

function doPost(e = test_parameter()) {

  var result = "";
  var response = "";

  try {
    response =  writeToSheet(e);
    result = "Success!";
   } 
   catch(error) {
     Logger.log(error);
     result = "Error";
     response = error;
   }
  
  Logger.log("response:\n\n"+response);
  // return ContentService
  //   .createTextOutput(JSON.stringify({"Result" : result,response}))
  //   .setMimeType(ContentService.MimeType.JSON);

}


function sheet_essentials(award_id) {
 
  const essentials = {
    KPKT24 : {
      SPREAD_ID : "1BWZgtI5fmn4KlRR-_aVq15BGGGUDklRgB1n0ljjA2g0",
      SHEET : "responseKPKT24",
      email_template : "KPKT_emel",
      email_title : "AKeMedia KPKT 2024 : Penyertaan Diterima ({{xxyyzz}})"
    },
    Agro24 : {
      SPREAD_ID : "1qV96nOjoEENgxfDlZHTkfPeF9_dwk5Mg0TVQ-dSr0iU",
      SHEET : "responseAgro24",
      email_template : "KPKT_emel",
      email_title : "Anugerah Media Agrobank 2024 : Penyertaan Diterima ({{xxyyzz}})"
    }
    ,
    "default" : {
      SPREAD_ID : "the default doesnt have spreadsheet",
      SHEET : "",
      email_template : "",
      email_title : "abcdefgijklmnopqrstuvwxyz"
    }
  }
  essentials[award_id].getCategoryObject = function() {return categoryObject(award_id)}; // this is quite complicate to explain. the purpose is not to call yet, just standby a function on getting an object without firing it straight away.

  return essentials[award_id] || essentials['default']
}

function getColumnFromHeaders(column_name,column_headers = "headers") {
  let col = column_headers.indexOf(column_name) + 1
  return col
}

function test_parameter() {
  
  let object = {
    parameter : {
      // ssId : "KPKT24",
      // awdId : "KPKT24",
      awdId : "Agro24",
      Category : "G. Kredit Komuniti",
      MediaType : "Foto",
      CatId : "***",
      Name : "Gilded Butler,\nFeranico Gonchalez",
      Organisation : "Awatni Media",
      Title : "Satisfaction, Correlation, Visitation",
      Date : "01/02/03,\n04/05/26,\n09/09/09",
      NoIC : "897454-98-6765,\n563876-49-8658",
      Email : "bukitledangmpi*yahoo.com,\npress2mpi@gmail.com",
      NoHP : "03-75631914",
      Link : "www.example.com",
      Send_Email : true
      //MailStatus : "email pending..."
    }
  }

  return object
}

function logThis(param = test_parameter()) {
  Logger.log(param)
}

function check_Yes_No(status) {
    let valid = ["yes","Yes","YES",true]
    if (valid.indexOf(status) > -1) return true
    return false
}

function writeToSheet(e) {
  // write parameter values to sheet & return data of NEWROW

  const essences = sheet_essentials(e.parameter.awdId) // remember to change ssId to awdId
  const SEND_EMAIL = e.parameter.Send_Email;

  Logger.log(`Spread & Sheet : ${essences.SPREAD_ID} & ${essences.SHEET}
  Name(s) : ${e.parameter.Name}  `)

  const SHEET = SpreadsheetApp.openById(essences.SPREAD_ID).getSheetByName(essences.SHEET);
      
  const lastCol = SHEET.getLastColumn();
  const headers = SHEET.getRange(1, 1, 1, lastCol).getValues()[0]; 
    
  const LASTROW = SHEET.getLastRow(); // also for ID increment on No_ID column
  const NEWROW = LASTROW+1;
  let row = [new Date(),LASTROW];
  
  for (i in headers ) {
    if (headers[i] == "Timestamp" || headers[i] == "No_ID") { } 
    else {
      row.push(e.parameter[headers[i]]);
    }
  }

  SHEET.getRange(NEWROW, 1, 1, row.length).setValues([row]); // paste on spreadsheet

  // for catId generation
  //  const c_category = getColumnFromHeaders("Category");
  // const c_mediaType = getColumnFromHeaders("MediaType");
  //     const c_catId = getColumnFromHeaders("CatId");
  //  const catFormula = '=left(R[0]XXX,find(".",R[0]XXX)-1) & text(COUNTIFS(R2XXX:R[0]XXX,R[0]XXX,R2YYY:R[0]YYY,R[0]YYY),"00")'; // replaceAll() is not supported, may try regexp
  const catFormula = '=left(R[0]C3,find(".",R[0]C3)-1) & text(COUNTIFS(R2C3:R[0]C3,R[0]C3,R2C4:R[0]C4,R[0]C4),"00")'; 
  const catRange = SHEET.getRange(NEWROW,5)
  catRange.setFormulaR1C1(catFormula).setValue(catRange.getDisplayValue());

  const DATANEWROW = SHEET.getRange(NEWROW,1,1,row.length).getDisplayValues()[0];
  //Logger.log(`Data : ${DATANEWROW}`)
  
  let emailStatus = "did not send";
  let col_MailStatus = getColumnFromHeaders("MailStatus",headers);

  if (check_Yes_No(SEND_EMAIL)) emailStatus = sendingEmail(DATANEWROW,essences);
  if (!emailStatus) emailStatus = "mail error";
  
  // expect 3 kind of email status here : did not send | mail error | sent!
  SHEET.getRange(NEWROW,col_MailStatus).setValue(emailStatus);
  
  DATANEWROW[col_MailStatus-1] = emailStatus
    
  return DATANEWROW;
}

function substringFirstUserOnly(detail) {
  return detail.substring(0, detail.indexOf(","));
}

// 13/01/2022 updated
function sendingEmail(data,essences) {
// data param is should be assigned from data of a row from a spreadsheet

  data.firstUser = {
    name : data[5].trim(),
    email : data[10].trim()
  }

  // if the name is actually contain plenty of names then we retrieve the first name details only
  if (data.firstUser.name.indexOf(",") > 1) {
    data.firstUser.name = substringFirstUserOnly(data.firstUser.name);
    data.firstUser.email = substringFirstUserOnly(data.firstUser.email).trim();
  };
   
  let html = getHTMLcontent(data,essences);
  essences.email_title = essences.email_title.replace("{{xxyyzz}}",data[1]);
  let mail_result;

  // send email yo
  try{
    MailApp.sendEmail(
    data.firstUser.email, 
    essences.email_title,
    "",
    {htmlBody: html }
    ); 
    // https://developers.google.com/apps-script/reference/mail/mail-app#sendEmail(String,String,String,Object)
    mail_result = "sent!"
    Logger.log("email sent to: " + data.firstUser.email)
  }
  catch(error){
    Logger.log("Mail error: "+error);
    mail_result = false;
  }

  return mail_result;
}


function getHTMLcontent(data,essences) {
  
  let html = HtmlService.createTemplateFromFile(essences.email_template);
    
  const CATOBJ = essences.getCategoryObject(); // it works

  let obj = {
    Timestamp : data[0],
    NoID : data[1],
    Cat : CATOBJ[data[2]],
    MediaType : CATOBJ[data[3]],
    CatId : data[4],
    Name : data[5],
    Orga : data[6],
    Title : data[7],
    Date : data[8],
    NoIC : data[9],
    Email : data[10],
    NoHP : data[11],
    Link : data[12],
    PseudoName : data[15],
    FirstName : data.firstUser.name,
    FirstEmail : data.firstUser.email
  };

  if (!obj.Cat) obj.Cat = data[2]
  if (!obj.MediaType) obj.MediaType = data[3]

  html.resp = obj;

  return html.evaluate().getContent();

};



function categoryObject(award_id) {
  const object = {
    KPKT24 : {
           'A. Media Khas' : 'A. Anugerah Khas YBM KM',
            'B. Perumahan' : 'B. Anugerah Liputan Perumahan Terbaik',
                  'C. PBT' : 'C. Anugerah Liputan PBT Terbaik',
           'D. Wira Merah' : 'D. Anugerah Liputan Wira Merah Terbaik',
                'E. Hijau' : 'E. Anugerah Liputan Kemampanan Bandar & Persekitaran Hijau Terbaik',
         'F. Sisa Pepejal' : 'F. Anugerah Liputan Pengurusan Sisa Pepejal Terbaik',
      'G. Kredit Komuniti' : 'G. Anugerah Liputan Kredit Komuniti Terbaik',
                'H. Radio' : 'H. Anugerah Liputan Radio Terbaik',
           'I. Multimedia' : 'I. Anugerah Media Khas Multimedia',
                 'J. Foto' : 'J. Anugerah Kewartawanan Foto Cemerlang',
                      Foto : 'Fotografi',
                     Cetak : 'Media Cetak & Portal Berita',
                        TV : 'Media Penyiaran Televisyen & Video Dalam Talian',
                     Radio : 'Media Penyiaran Radio'
    },
    Agro24 : {
            'A. Cetak' : 'A. ',
               'B. TV' : 'B. ',
            'C. Radio' : 'C. ',
            'D. Sains' : 'D. '
    },
    "default" : "no stuff here"
  }
  return object[award_id];
}

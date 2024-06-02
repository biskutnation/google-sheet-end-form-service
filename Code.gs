// https://script.google.com/macros/s/AKfycbyNzz93yv0aokOI9Ge0Eq3ROUBbWXC666nwKLz9MDu5y6XksSteg22945MWxCKmJe1w/exec

// procedure for newly added award, should consider:
//  • award_id, spreadsheet id, sheet name
//  • sendingEmail(DATANEWROW,essences)
//  • catObj || categoryObject which will return value of category/language long wording 
//  • email title & template in sheet_essentials
//  • year 

// try default value with e = test_parameter()
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
  return ContentService
    .createTextOutput(JSON.stringify({"Result" : result,response}))
    .setMimeType(ContentService.MimeType.JSON);

}

// use this to pass parameters on do_post or writeToSheet
function test_parameter() {
  
  let object = {
    parameter : {
      // awdId : "KPKT24",
      awdId : "CIDB24",
      Category : "G. Kredit Komuniti",
      MediaType : "Foto",
      CatId : "***",
      Name : "Jihadian Butler,\nFeranico Gonchalez",
      Organisation : "Awatni Media",
      Title : "Satisfaction, Correlation, Visitation",
      Date : "01/02/03,\n04/05/26,\n09/09/09",
      NoIC : "897454-98-6765,\n563876-49-8658",
      Email : "press2mpi@gmail.com\n,bukitledangmpi*yahoo.com,\npress2mpi@gmail.com",
      NoHP : "03-75631914",
      Link : "www.example.com",
      Send_Email : "no"
      //MailStatus : "email pending..."
    }
  }

  return object
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
      email_template : "Agro_emel",
      email_title : "Anugerah Media Agrobank 2024 : Penyertaan Diterima ({{xxyyzz}})"
    },
    KPA24 : {
      SPREAD_ID : "1nGlnaHHT6dD4crdQzNxCchqg5Lj3uAdrecv7UBCKoAM",
      SHEET : "responseKPA24",
      email_template : "KPA_emel",
      email_title : "KPA 2024 : Entry Received ({{xxyyzz}})"
    },
    CIDB24 : {
      SPREAD_ID : "1Y5WUZEvUdf7j2466yVB0J7Kxq-THxDZW80Z9H9hwPqc",
      SHEET : "responseCIDB24",
      email_template : "CIDB_emel",
      email_title : "AMP CIDB 2024 : Entry Received ({{xxyyzz}})"
    },
    "default" : {
      SPREAD_ID : "the default doesnt have spreadsheet",
      SHEET : "",
      email_template : "",
      email_title : "abcdefgijklmnopqrstuvwxyz"
    }
  }
  essentials[award_id].getCategoryObject = function() {return categoryObject(award_id)}; // this is quite complicated to explain. the purpose is not to call yet, just standby a function on getting an object without firing it straight away.

  return essentials[award_id] || essentials['default']
}

function getColumnFromHeaders(column_name,column_headers = "headers") {
  let col = column_headers.indexOf(column_name) + 1
  return col
}

// for testing purpose
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

  const essences = sheet_essentials(e.parameter.awdId) // award_id
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
  
  let emailStatus = "did not send"; // default status but check yes no could alter it
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
           'A. Khas' : 'A. Anugerah Khas YB KM',
             'B. TV' : 'B. Anugerah Penyiaran Televisyen Terbaik',
   'C. Video Portal' : 'C. Anugerah Video Portal & Dalam Talian',
        'D. Artikel' : 'D. Anugerah Penerbitan Artikel Terbaik',
          'E. Radio' : 'E. Anugerah Penyiaran Radio Terbaik',
           'F. Foto' : 'F. Anugerah Kewartawanan Foto Terbaik',
         'G. Medsos' : "G. Anugerah 'Content' Media Sosial Terbaik",
        'H. Popular' : 'H. Anugerah Video Popular/Pilihan'
    },
    Agro24 : {
              'A. Berita' : 'A. Anugerah Media Cetak & Portal Berita - Berita',
             'B. Rencana' : 'B. Anugerah Media Cetak & Portal Berita - Rencana',
        'C. Video Berita' : 'C. Anugerah Media Penyiaran Televisyen & Video Dalam Talian - Berita',
          'D. Video Doku' : 'D. Anugerah Media Penyiaran Televisyen & Video Dalam Talian - Dokumentari',
               'E. Radio' : 'E. Anugerah Media Radio',
               'F. Sains' : 'F. Anugerah Sains & Teknologi Pertanian Rakan Tani Muda Agrobank'
    },
    KPA24 : {
        '1A. Feature' : '1A. Journalism Award (Feature and News Feature)',
      '1B. Broadcast' : '1B. Journalism Award (Broadcast)',
    '1C. Photography' : '1C. Journalism Award (Photography)',
            '2. News' : '2. News Reporting Award (Non-Feature)',
          '3. Sports' : '3. Sports Journalism Award',
        '4. Business' : '4. Business and Economic Reporting Award',
   '5. Environmental' : '5. Environmental Journalism Award',
   '6. Entertainment' : '6. Entertainment, Culture and Arts Reporting Award',
                   BM : 'Print & Online Portal - Bahasa Melayu',
                  ENG : 'Print & Online Portal - English',
                  CHI : 'Print & Online Portal - Chinese',
                   TV : 'Broadcast Television & Online Video',
                Photo : 'Photography'
    },
    CIDB24 : {
          'A. BERITA' : 'A. MEDIA CETAK & PORTAL BERITA - LAPORAN KHAS BERITA',
         'B. RENCANA' : 'B. MEDIA CETAK & PORTAL BERITA - RENCANA',
           'C. VIDEO' : 'C. MEDIA PENYIARAN TELEVISYEN & VIDEO DALAM TALIAN - LAPORAN KHAS & DOKUMENTARI',
           'D. RADIO' : 'D. MEDIA PENYIARAN RADIO',
            'E. FOTO' : 'E. FOTOGRAFI',
      'F. INFOGRAFIK' : 'F. INFOGRAFIK PEGUN',
     'G. VIDEOGRAFIK' : 'G. INFOGRAFIK VIDEO'
    },
    "default" : "no stuff here"
  }
  return object[award_id];
}

// https://script.google.com/macros/s/AKfycbyNzz93yv0aokOI9Ge0Eq3ROUBbWXC666nwKLz9MDu5y6XksSteg22945MWxCKmJe1w/exec
// 01/04/2022 : for KPA 2022
// 13/04/2022 : updated for MSOSH 2022
// 09/06/2022 : updated for KJA 2022 (Kenyalang) // deployed on 100622
// 24/05/2023 : updated for KPKT 2023
// 04/05/2023 : updated for KPA 2023 (Kinabalu)
// 04/08/2023 : updated for CIDB 2023
// 14/09/2023 : updated for KJA 2023 (Kenyalang)

// procedure for newly added award, should consider:
//  • ssid, spreadsheet id, sheet name
//  • sendingEmail(DATANEXTROW,SSID)
//  • catObj which will return value of category/language long wording 
//  • email title in getTitleString(ssid)

/*
function doPost(e) {

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
  
  Logger.log(response);
  return ContentService
    .createTextOutput(JSON.stringify({"Result" : result,response}))
    .setMimeType(ContentService.MimeType.JSON);

}


// spreadsheet link
// KPKT_2023 : https://docs.google.com/spreadsheets/d/12XYeU8s3gY_tSb9BdXk9d95OOx80C4TXVMgGIRr3B5Y/edit#gid=0
// CIDB_2023 : https://docs.google.com/spreadsheets/d/1Y5WUZEvUdf7j2466yVB0J7Kxq-THxDZW80Z9H9hwPqc/edit?usp=sharing
// KPA_2023 : https://docs.google.com/spreadsheets/d/1nGlnaHHT6dD4crdQzNxCchqg5Lj3uAdrecv7UBCKoAM/edit#gid=0


// added on 04/06/2023
// pure function returning array of spread id & sheet
function getSPREADnSHT(ssid) {
  var spreadsheet_id, sht_name;
  
  // 14/09/2023 updated  
  if (ssid === "KJA23") {
    spreadsheet_id = "1aHlHqGvgKitASGv_d9_2ApoPF00_GcqzIU39c7_sMHM";
    sht_name = "responseKJA23";
  }

  if (ssid === "CIDB23") {
    spreadsheet_id = "1Y5WUZEvUdf7j2466yVB0J7Kxq-THxDZW80Z9H9hwPqc";
    sht_name = "responseCIDB23";
  }

  // 24/05/2023 updated
  if (ssid === "KPKT23") {
    spreadsheet_id = "12XYeU8s3gY_tSb9BdXk9d95OOx80C4TXVMgGIRr3B5Y";
    sht_name = "responseKPKT23";
  }

  // 04/06/2023 updated  
  if (ssid === "KPA23") {
    spreadsheet_id = "1nGlnaHHT6dD4crdQzNxCchqg5Lj3uAdrecv7UBCKoAM";
    sht_name = "responseKPA23";
  }

  return [spreadsheet_id,sht_name]
}



function writeToSheet(e) {
  // write parameter values to sheet & return data of NEXTROW

  // const SPREADSHEET_ID = e.parameter.ssId;
  // const SS = SpreadsheetApp.openById(SPREADSHEET_ID);
  // const SHEET = SS.getSheetByName("PostHere"); 
    //  try to find a better static sheetname 
    //   or get the name from parameter key
    //   something magically dynamic 
  
  var catFormula = '=left(R[0]C3,find(".",R[0]C3)-1) & text(COUNTIFS(R2C3:R[0]C3,R[0]C3,R2C4:R[0]C4,R[0]C4),"00")'; // for column CatId
  const SSID = e.parameter.ssId; 
  const SPREADnSHT = getSPREADnSHT(SSID);
  const SPREAD_ID = SPREADnSHT[0];
  const SHT = SPREADnSHT[1];
  
  Logger.log(`Spread & Sheet : ${SPREADnSHT}
  Name(s) : ${e.parameter.name}  `)

  const SHEET = SpreadsheetApp.openById(SPREAD_ID).getSheetByName(SHT);
      
  var lastCol = SHEET.getLastColumn();
  var headers = SHEET.getRange(1, 1, 1, lastCol).getValues()[0]; 
      // next project would be to generate own headers from parameter key // 01 April 2022 bila nak buat?
  const LASTROW = SHEET.getLastRow(); // also for ID increment on No_ID column
  const NEXTROW = LASTROW+1;
  var row = [new Date(),LASTROW];
  
  var catRange = SHEET.getRange(NEXTROW,5)

  for (i in headers ) {
    if (headers[i] == "Timestamp" || headers[i] == "No_ID") { } 
    else {
      row.push(e.parameter[headers[i]]);
    }
  }

  SHEET.getRange(NEXTROW, 1, 1, row.length).setValues([row]); // paste on spreadsheet
  catRange.setFormulaR1C1(catFormula).setValue(catRange.getDisplayValue()); // not cool and static to column 5

  const DATANEXTROW = SHEET.getRange(NEXTROW,1,1,row.length).getDisplayValues()[0];
  Logger.log(`Data : ${DATANEXTROW}`)
 // 13/01/2022 
  //if (SSID === "KPKT23" || SSID === "MSOSH22" || SSID === "KJA22" || SSID === "KPA22" ) sendingEmail(DATANEXTROW,SSID); // should have param that says send email ? yes : no
  if (SSID === "KPKT23" || SSID === "CIDB23" ||SSID === "KPA23") sendingEmail(DATANEXTROW,SSID);

  return DATANEXTROW;
  
}


// object reference function 
// 24/05/2023
function catObj(ssId) {
  //if (!ssId) return Error();
  
  // var awardObj;

  // 140923
  if (ssId === "KJA23") { 
    return {
        'A. Feature' : '1A. Journalism Award (Feature and News Feature)',
      'B. Broadcast' : '1B. Journalism Award (Broadcast)',
    'C. Photography' : '1C. Journalism Award (Photography)',
           '2. News' : '2. News Reporting Award (Non-Feature)',
         '3. Sports' : '3. Sports Journalism Award',
       '4. Business' : '4. Business and Economic Reporting Award',
  '5. Environmental' : '5. Environmental Journalism Award',
  '6. Entertainment' : '6. Entertainment, Culture and Arts Reporting Award',
                  BM : 'Print & Online Portal - Bahasa Melayu',
                 ENG : 'Print & Online Portal - English',
                 CHI : 'Print & Online Portal - Chinese',
                  TV : 'Broadcast Television & Online Video',
               Photo : 'Photography',
          'A. Cetak' : 'A. Media Cetak & Portal Berita',
             'B. TV' : 'B. Media Penyiaran Televisyen & Video Dalam Talian',
          'C. Radio' : 'C. Media Penyiaran Radio & Radio Dalam Talian',
         '1.Feature' : '1 - Journalism Award (Feature and News Feature)',
            '2.News' : '2 - News Reporting Award (Non-Feature)',
          '3.Sports' : '3 - Sports Reporting Award',  
       '4.Broadcast' : '4 - Broadcast Journalism Award',
         '5.Sustain' : '5 - Sustainability Journalism Award',
        '6.Business' : '6 - Business & Economic Journalism Award',
       '7.Community' : '7 - Community Well-being Journalism Award',
     '8.SinglePhoto' : '8 - Photo Journalism Award',
      '9.EssayPhoto' : '9 - Photo Essay Award',
        '10.Digital' : '10 - Digital Economy Journalism Award',
                IBAN : 'Print & Online Portal - Iban'
    }
  }

  if (ssId === "KPKT23") {
    return {
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
    }
  }

  // 040823
  // 080823 swap places for tv & foto
  if (ssId === "CIDB23") {
    return {
      'A. CETAK' : 'A. Anugerah Media Cetak & Portal Berita',
      'B. TV' : 'B. Anugerah Media Penyiaran Televisyen & Video Dalam Talian',
      'C. FOTO' : 'C.  Anugerah Fotografi',
      'D. INFOGRAFIK' : 'D. Anugerah Infografik'
    }
  }

  // 040623
  if (ssId === "KPA23") {
    return {
        'A. Feature' : '1A. Journalism Award (Feature and News Feature)',
      'B. Broadcast' : '1B. Journalism Award (Broadcast)',
    'C. Photography' : '1C. Journalism Award (Photography)',
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
               }
  }
  // return awardObj;
}

// 24/05/23 added function
function substringFirstUserOnly(detail) {
  return detail.substring(0, detail.indexOf(","));
}

function getHTMLcontent(data,ssId) {

  var html; 

  // *****080823***** please make a better pure function on returning html template file ******

  // // 13/01/2022 updated
  // if (ssId === "MSOSH22") { 
  //   html = HtmlService.createTemplateFromFile('MSOSH_emel');
  // }

  // // 09/06/2022 updated
  // if (ssId === "KJA22") { 
  //   html = HtmlService.createTemplateFromFile('KJA_emel'); 
  // }

  // 24/05/2023 updated
  if (ssId === "KPKT23") { 
    html = HtmlService.createTemplateFromFile('KPKT_emel');
  }

  // 04/06/2023 updated
  if (ssId === "CIDB23") {
    html = HtmlService.createTemplateFromFile('CIDB_emel');
  }

  // 04/06/2023 updated
  if (ssId === "KPA23") {
    html = HtmlService.createTemplateFromFile('KPA_emel');
  }
  // **************************


  var firstUserName = data[5]; 
  var firstUserEmail = data[10].trim();

  // if the name is actually names then we retrieve the first name only
  if (firstUserName.indexOf(",") > 1) {
    firstUserName = substringFirstUserOnly(firstUserName);
    firstUserEmail = substringFirstUserOnly(firstUserEmail).trim();
  };

  
  const CATOBJ = catObj(ssId);

  var obj = {
    Timestamp : data[0],
    NoID : data[1],
    Cat : CATOBJ[data[2]],
    Lang : CATOBJ[data[3]],
    Name : data[5],
    Orga : data[6],
    Title : data[7],
    Date : data[8],
    NoIC : data[9],
    Email : data[10],
    NoHP : data[11],
    Link : data[16],
    PsuedoName : data[17],
    FirstName : firstUserName,
    FirstEmail : firstUserEmail
  };


  html.resp = obj;

  return html.evaluate().getContent();

};


// 24/05/2023 add email subject title function 
function getTitleString(ssId) {
  let title;
  if (ssId === "KPA23") title = "KPA 2023 : Entry Received"; // updated on 04/06/2023
  if (ssId === "MSOSH22") title = "MSOSH 2022 : Entry Received";
  if (ssId === "KJA22") title = "KJA 2022 : Entry Received"; // updated on 09/06/2022
  if (ssId === "KPKT23") title = "KPKT 2023 : Entry Received"; // 24/05/2023
  if (ssId === "CIDB23") title = "AMP CIDB 2023 : Entry Received"; // 04/08/2023
  return title;
}


// 13/01/2022 updated
function sendingEmail(data,ssId) {
// data param is should be assigned from data of a row from a spreadsheet

  var firstUserName = data[5]; 
  var firstUserEmail = data[10].trim();

  // if the name is actually contain plenty of names then we retrieve the first name only
  if (firstUserName.indexOf(",") > 1) {
    firstUserName = substringFirstUserOnly(firstUserName);
    firstUserEmail = substringFirstUserOnly(firstUserEmail).trim();
  };

  var titleSTR = getTitleString(ssId);
  
  var html = getHTMLcontent(data,ssId);
  
  // send email yo
  MailApp.sendEmail(
    firstUserEmail,
    titleSTR + " (" + data[1] + ")",
    "",
    {htmlBody: html }
  ); 
  // https://developers.google.com/apps-script/reference/mail/mail-app#sendEmail(String,String,String,Object)

  return null;
}



// 13/04/2022 **abandanoned project**, to distinguish KPA22, MSOSH22 objects
// 24/05/2023 huh?! why did i abandon this function? seems fine
//
// function categoryObject(SSID) {
//   if (SSID === "KPA22") { 
//     return {
//         'A. Feature' : '1A. Journalism Award (Feature and News Feature)',
//       'B. Broadcast' : '1B. Journalism Award (Broadcast)',
//     'C. Photography' : '1C. Journalism Award (Photography)',
//            '2. News' : '2. News Reporting Award (Non-Feature)',
//          '3. Sports' : '3. Sports Journalism Award',
//        '4. Business' : '4. Business and Economic Reporting Award',
//   '5. Environmental' : '5. Environmental Journalism Award',
//   '6. Entertainment' : '6. Entertainment, Culture and Arts Reporting Award',
//                   BM : 'Print & Online Portal - Bahasa Melayu',
//                  ENG : 'Print & Online Portal - English',
//                  CHI : 'Print & Online Portal - Chinese',
//                   TV : 'Broadcast Television & Online Video',
//                Photo : 'Photography'
//     }
//   }
//  if (SSID === "KPA22") {
//    return {
//      "A. Cetak" : "A. Media Cetak & Portal Berita",
//         "B. TV" : "B. Media Penyiaran Televisyen & Video Dalam Talian",
//      "C. Radio" : "C. Media Penyiaran Radio & Radio Dalam Talian"
//    }
//  }
// }


// all these below are from getHTMLcontent()
// 13/04/2022 updated
  // object from KPA & MSOSH combine together
  // could cause confusion in future 
  // 090622, yup definitely the object can confuse us later on...  

  // const CATOBJ = {
  //       'A. Feature' : '1A. Journalism Award (Feature and News Feature)',
  //     'B. Broadcast' : '1B. Journalism Award (Broadcast)',
  //   'C. Photography' : '1C. Journalism Award (Photography)',
  //          '2. News' : '2. News Reporting Award (Non-Feature)',
  //        '3. Sports' : '3. Sports Journalism Award',
  //      '4. Business' : '4. Business and Economic Reporting Award',
  // '5. Environmental' : '5. Environmental Journalism Award',
  // '6. Entertainment' : '6. Entertainment, Culture and Arts Reporting Award',
  //                 BM : 'Print & Online Portal - Bahasa Melayu',
  //                ENG : 'Print & Online Portal - English',
  //                CHI : 'Print & Online Portal - Chinese',
  //                 TV : 'Broadcast Television & Online Video',
  //              Photo : 'Photography',
  //         'A. Cetak' : 'A. Media Cetak & Portal Berita',
  //            'B. TV' : 'B. Media Penyiaran Televisyen & Video Dalam Talian',
  //         'C. Radio' : 'C. Media Penyiaran Radio & Radio Dalam Talian',
  //        '1.Feature' : '1 - Journalism Award (Feature and News Feature)',
  //           '2.News' : '2 - News Reporting Award (Non-Feature)',
  //         '3.Sports' : '3 - Sports Reporting Award',  
  //      '4.Broadcast' : '4 - Broadcast Journalism Award',
  //        '5.Sustain' : '5 - Sustainability Journalism Award',
  //       '6.Business' : '6 - Business & Economic Journalism Award',
  //      '7.Community' : '7 - Community Well-being Journalism Award',
  //    '8.SinglePhoto' : '8 - Photo Journalism Award',
  //     '9.EssayPhoto' : '9 - Photo Essay Award',
  //       '10.Digital' : '10 - Digital Economy Journalism Award',
  //               IBAN : 'Print & Online Portal - Iban'
  // }

  // '4. Sports Photo' : '4. Sports Photography Awards',

*/
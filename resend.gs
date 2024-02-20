// function getSPREADnSHT(ssid) {
//   var spreadsheet_id, sht_name;
//   // 24/05/2023 updated
//   if (ssid === "KPKT23") {
//     spreadsheet_id = "12XYeU8s3gY_tSb9BdXk9d95OOx80C4TXVMgGIRr3B5Y";
//     sht_name = "responseKPKT23";
//   }

//   // 04/06/2023 updated  
//   if (ssid === "KPA23") {
//     spreadsheet_id = "1nGlnaHHT6dD4crdQzNxCchqg5Lj3uAdrecv7UBCKoAM";
//     sht_name = "responseKPA23";
//   }

//   return [spreadsheet_id,sht_name]
// }


// please refer to getDataById
// function getDataByRow(ssid, row) {

//   const SSID_array = getSPREADnSHT(ssid)
//   const SPREAD_ID = SSID_array[0]
//   const SHT = SSID_array[1]
    
//   const SHEET = SpreadsheetApp.openById(SPREAD_ID).getSheetByName(SHT);

//   var lastCol = SHEET.getLastColumn();
  
//   const DATA = SHEET.getRange(row,1,1,lastCol).getDisplayValues()[0];

//   // Logger.log(DATA);

//   return DATA;

// }

function dataToObj(ssid, data) {
  
  const CATOBJ = catObj(ssid);
  
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
    PsuedoName : data[15],
 }
  return obj
}


// 230623 have to think of elegant way on dealing with textInsert, openingTag, endTitleFix
function executeEmail(data,ssid,textInsert) {

  Logger.log("execute function email now", ssid)
  
  var firstUserName = data[5]; 
  var firstUserEmail = data[10].trim();

  if (firstUserName.indexOf(",") > 1) {
    firstUserName = firstUserName.substring(0,firstUserName.indexOf(","));
    firstUserEmail = firstUserEmail.substring(0,firstUserEmail.indexOf(",")).trim();
  };

  Logger.log(`${firstUserName} : ${firstUserEmail}`);

  // a heads up to recipient
  var openingTag, endTitleFix;
  if (textInsert) {
    openingTag = "<p style='margin-bottom: 22px;'>Hi!</p><p style='margin-bottom: 42px;'>" + textInsert +  "</p>";
    endTitleFix = "- RESEND" //"- RESUBMIT"
  }

  var html = getHTMLcontent(data,ssid);

// send email yo  
  MailApp.sendEmail(
    // "bukitledangmpi@yahoo.com", // for testing
    firstUserEmail,
    `${getTitleString(ssid)} (${data[1]}) ${endTitleFix}`,
    "",
    {htmlBody: openingTag + html }
  ); 
 
   
  return null;
}

// textInsert = "Your entry material link has been amended!"
function selectiveSendEmail(IdNumber = 84, ssid = "KPKT23",textInsert = "We're resending this email with the entry material link updated") {

  // const row = IdNumber + 1

  // Logger.log(`id: ${IdNumber}, ssid: ${ssid}, text: ${textInsert}`)
  // executeEmail(getDataByRow(ssid,row),ssid, textInsert)
  executeEmail(getDataById(ssid,IdNumber), ssid, textInsert)
  Logger.log("EMAIL RESEND!")
}

// function loopSendEmail(initial=117,end=120) {

//   let i

//   for(i = initial ; i<end ; i++ ) {
//     // if (i === 5 || i === 7 || i === 9) continue
//     selectiveSendEmail(i)
//     // Logger.log(i)    
//   }
// }


//for testing only
// function getDataByIdNo(ssid = "KPKT23",IdNumber = 10) {

//   const row = IdNumber + 1

//   const data = getDataByRow(ssid, row)

//   const OBJ = dataToObj(ssid, data);

//   for (key in OBJ) {
//     Logger.log(`${key} : ${OBJ[key]}`)
//   }
//   // return data
// }

function updatedTableSheet(ssid) {
  let obj = {};

  if (ssid = "KPKT23") {
    obj.spreadsheet_id = "1lcsAv8gnZ_DVQOOQVWn8iAsE460Je0PpdLORdhrmzCM";
    obj.sht_name = "mergedTable";
  }

  return obj
}


// function getIds(ssid = "KPKT23") {
  
//   const SSID_obj = updatedTableSheet(ssid)
//   const SHEET = SpreadsheetApp.openById(SSID_obj.spreadsheet_id).getSheetByName(SSID_obj.sht_name)

//   // return 2d array
//   const ids = SHEET.getRange("B1").getDataRegion(SpreadsheetApp.Dimension.ROWS).getValues() 

//   return ids.flat()
// }

// 270823
function getDataById(ssid,id) {
  
  const SSID_obj = updatedTableSheet(ssid)
  const SHEET = SpreadsheetApp.openById(SSID_obj.spreadsheet_id).getSheetByName(SSID_obj.sht_name)

  // return 2d array
  const IDS = SHEET.getRange("B1").getDataRegion(SpreadsheetApp.Dimension.ROWS).getValues() 
  const row = IDS.flat().indexOf(id) + 1 // can consider parseInt if value type is not a number

  // Logger.log("id: " + id + " row: " + row )
  // Logger.log("typeof IDS.flat()["+id+"]: " + typeof IDS.flat()[0] )
  
  const lastCol = SHEET.getLastColumn();
  
  const DATA = SHEET.getRange(row,1,1,lastCol).getDisplayValues()[0];

  // Logger.log(DATA);
  return DATA;

}



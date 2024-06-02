// 15/04/2024
// selectiveSendEmail -> getDataById -> executeEmail w/ getHTMLcontent


// 15/04/2024
function executeEmail(data,essences,textInsert) {

  Logger.log("execute function email now", essences)
  
   data.firstUser = {
    name : data[5].trim(),
    email : data[10].trim()
  }

  // if the name is actually contain plenty of names then we retrieve the first name details only
  if (data.firstUser.name.indexOf(",") > 1) {
    data.firstUser.name = substringFirstUserOnly(data.firstUser.name);
    data.firstUser.email = substringFirstUserOnly(data.firstUser.email).trim();
  };
   
  Logger.log(`${data.firstUser.name} : ${data.firstUser.email}`);

  // a heads up to recipient
  let openingTag, endTitleFix;
  if (textInsert) {
    openingTag = "<p style='margin-bottom: 22px;'>Hi!</p><p style='margin-bottom: 42px;'>" + textInsert +  "</p>";
    endTitleFix = "- RESEND" //"- RESUBMIT"
  }

  let emailTitle = essences.email_title.replace("{{xxyyzz}}",data[1]) + " " + endTitleFix;
  let html = getHTMLcontent(data,essences);

  // resending email with opening tag and title with end fix
  try{
    MailApp.sendEmail(
    // "bukitledangmpi@yahoo.com", // for testing
    data.firstUser.email, 
    emailTitle,
    "",
    {htmlBody: openingTag + html }
    ); 

    Logger.log("email resend to: " + data.firstUser.email)
  }
  catch(error){
    Logger.log("Mail resend error: "+error);
  }
  
  return null;
}

// 15/04/2024
function getDataById(id, essences) {
  
  const SHEET = SpreadsheetApp.openById(essences.SPREAD_ID).getSheetByName(essences.SHEET)

  // get 2d array from column B
  const IDS = SHEET.getRange("B1").getDataRegion(SpreadsheetApp.Dimension.ROWS).getValues() 
  const row = IDS.flat().indexOf(id) + 1 // can consider parseInt if value type is not a number

  const lastCol = SHEET.getLastColumn();
  
  const DATA = SHEET.getRange(row,1,1,lastCol).getDisplayValues()[0];

  // Logger.log(DATA);
  return DATA;

}

// 15/04/2024
// award_id, go look at Code.gs
function selectiveSendEmail(IdNumber = 4, award_id = "Agro24",textInsert = "Due to a prior email error, We resend this email") {

  const essences = sheet_essentials(award_id) 
  const data = getDataById(IdNumber, essences)

  executeEmail(data, essences, textInsert)
  Logger.log("EMAIL RESEND!")
}

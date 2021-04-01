function logCurrentTimeline() {
  // set the Timelines POST endpoint as the target URL
  var postTimelinesURL = "https://api.tomorrow.io/v4/timelines";

  // get your key from app.tomorrow.io/development/keys
  var apikey = "add your API key here";

  // request the "current" timelines with all the query string parameters as options
  var postTimelinesParameters = {
    location: [40.758, -73.9855],
    fields: [
      "precipitationIntensity",
      "precipitationType",
      "windSpeed",
      "windGust",
      "windDirection",
      "temperature",
      "temperatureApparent",
      "cloudCover",
      "cloudBase",
      "cloudCeiling",
      "weatherCode",
    ],
    units: "imperial",
    timesteps: ["current"],
    timezone: "America/New_York",
  };
  
  var response = JSON.parse(UrlFetchApp.fetch(postTimelinesURL + `?apikey=${apikey}`, {
    method: "post",
    contentType: 'application/json',
    payload: JSON.stringify(postTimelinesParameters),
  }).getContentText());

  // sort current interval values according to fields order
  var values = postTimelinesParameters.fields.map(field => response.data.timelines[0].intervals[0].values[field])
  var timestamp = response.data.timelines[0].intervals[0].startTime;

  // get active spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // delete and prepend fields row (added to this cron job and not as a prerequisite, for guide simplicity)
  sheet.deleteRow(1)
  postTimelinesParameters.fields.unshift("timestamp");
  sheet.insertRowBefore(1).getRange(1, 1, 1, postTimelinesParameters.fields.length).setValues([postTimelinesParameters.fields]);

  // append values of last Timelines run
  sheet.appendRow([timestamp, ...values]);
  // make sure the cell is updated right away in case the script is interrupted
  SpreadsheetApp.flush();
}

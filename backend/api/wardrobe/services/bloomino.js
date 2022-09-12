"use strict"

const config = {
  apiKeyHeader: "XApiKey",
  apiKey: "d43706bd0f19596c75d3a9eea472477d",
  apiUrl: 'https://bloomino.co.uk/api',
  endpoints: {
    authenticate: "/Users/authenticate",
    doRecognition: "/RecognitionService/doRecognitionWithApiKey",
    doRequest: "/RecognitionService",
  }
}

module.exports = {
  config,
}

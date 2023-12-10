import { google } from "googleapis";

const API_KEY = "AIzaSyAfbmSKoke7sV5d8trrX2MrkFIDLO3jEtM";

const DISCOVERY_URL =
  "https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1";

google
  .discoverAPI(DISCOVERY_URL)
  .then((client) => {
    const analyzeRequest = {
      comment: {
        text: "",
      },
      requestedAttributes: {
        TOXICITY: {},
      },
    };

    client.comments.analyze(
      {
        key: API_KEY,
        resource: analyzeRequest,
      },
      (err, response) => {
        if (err) throw err;
        console.log(JSON.stringify(response.data, null, 2));
      }
    );
  })
  .catch((err) => {
    throw err;
  });

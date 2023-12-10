import { google } from "googleapis";
import env from "../config/env";

const perspective = (content) => {
  google
    .discoverAPI(env.PERSPECTIVE_DISCOVERY_URL)
    .then((client) => {
      const analyzeRequest = {
        comment: {
          text: content,
        },
        requestedAttributes: {
          TOXICITY: {},
        },
      };

      client.comments.analyze(
        {
          key: env.PERSPECTIVE_API_KEY,
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
};

export default perspective;

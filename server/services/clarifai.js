import env from "../config/env.js";
import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${env.CLARIFAI_API_KEY}`);

const clarifai = (inputs, callback) => {
  stub.PostModelOutputs(
    {
      model_id: env.CLARIFAI_MODEL_ID,
      inputs: [{ data: { image: { base64: inputs } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log("Error: " + err);
        return;
      }
      if (response.status.code !== 10000) {
        console.log(
          "Received failed status: " +
            response.status.description +
            "\n" +
            response.status.details
        );
        return;
      }
      let results = [];
      for (const c of response.outputs[0].data.concepts) {
        results.push({
          [c.name]: c.value,
        });
      }
      callback(null, results);
    }
  );
};

export default clarifai;

import env from "../config/env";
import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${env.CLARIFAI_API_KEY}`);

const predictImage = (req, res, next) => {
  const file = req.file;

  stub.PostModelOutputs(
    {
      model_id: env.CLARIFAI_MODEL_ID,
      inputs: [{ data: { image: { base64: file } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error predicting image",
        });
      }

      if (response.status.code !== 10000) {
        return res.status(400).json({
          success: false,
          message:
            "Received failed status: " +
            response.status.description +
            "\n" +
            response.status.details,
        });
      }

      let results = [];
      for (const c of response.outputs[0].data.concepts) {
        results.push({
          [c.name]: c.value,
        });
      }

      req.predictedResults = results;
      next();
    }
  );
};

export default predictImage;
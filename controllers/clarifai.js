import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

//! Clarifai
const PAT = "2b135cd9db254ceab719cc763108e00d";
const USER_ID = "9m2bs48higcq";
const APP_ID = "f024665a17024acfbdc910578f0c8863";
export const MODEL_ID = "face-detection";
export const MODEL_VERSION_ID = "45fb9a671625463fa646c3523a3087d5";

const stub = ClarifaiStub.grpc();
// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

export const handleImageApiCall = (req, res) => {
  if (req.body) {
    const { inputURL } = req.body;
    stub.PostModelOutputs(
      {
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID,
        },
        model_id: MODEL_ID,
        version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
        inputs: [
          { data: { image: { url: inputURL, allow_duplicate_url: true } } },
        ],
      },
      metadata,
      (err, response) => {
        if (err) {
          throw new Error(err);
        }

        if (response.status.code !== 10000) {
          throw new Error(
            "Post model outputs failed, status: " + response.status.description
          );
        }

        // Since we have one input, one output will exist here
        const output = response.outputs[0];

        console.log("Predicted concepts:");
        for (const concept of output.data.concepts) {
          console.log(concept.name + " " + concept.value);
        }
        res.json(response);
      }
    );
  }
};

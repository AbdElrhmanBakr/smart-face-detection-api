//! Clarifai
const PAT = "2b135cd9db254ceab719cc763108e00d";
const USER_ID = "9m2bs48higcq";
const APP_ID = "f024665a17024acfbdc910578f0c8863";
export const MODEL_ID = "face-detection";
export const MODEL_VERSION_ID = "45fb9a671625463fa646c3523a3087d5";

// Generates Clarifai Options Object With Image Link Posted from Front-End
const clarifaiOptions = (imageLink) => {
  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: imageLink,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };
  return requestOptions;
};

export const handleImage = async (req, res) => {
  if (req.body) {
    const { inputURL } = req.body;
    const options = clarifaiOptions(inputURL);
    try {
      const response = await fetch(
        "https://api.clarifai.com/v2/models/" +
          MODEL_ID +
          "/versions/" +
          MODEL_VERSION_ID +
          "/outputs",
        options
      );
      const data = await response.json();
      res.json(data);
    } catch (error) {
      Console.log("Error With Clarifai:", error);
    }
  }
};

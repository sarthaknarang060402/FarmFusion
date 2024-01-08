from flask import Flask, request, render_template, jsonify, Markup
from io import BytesIO
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import requests
import pickle
import io
import torch
from torchvision import transforms
from PIL import Image
import joblib
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from flask_cors import CORS, cross_origin

fertilizer_dic = {
    "NHigh": """The N value of soil is high and might give rise to weeds.
        <br/> Please consider the following suggestions:

        <br/><br/> 1. <i> Manure </i> – adding manure is one of the simplest ways to amend your soil with nitrogen. Be careful as there are various types of manures with varying degrees of nitrogen.

        <br/> 2. <i>Coffee grinds </i> – use your morning addiction to feed your gardening habit! Coffee grinds are considered a green compost material which is rich in nitrogen. Once the grounds break down, your soil will be fed with delicious, delicious nitrogen. An added benefit to including coffee grounds to your soil is while it will compost, it will also help provide increased drainage to your soil.

        <br/>3. <i>Plant nitrogen fixing plants</i> – planting vegetables that are in Fabaceae family like peas, beans and soybeans have the ability to increase nitrogen in your soil

        <br/>4. Plant ‘green manure’ crops like cabbage, corn and brocolli

        <br/>5. <i>Use mulch (wet grass) while growing crops</i> - Mulch can also include sawdust and scrap soft woods""",
    "Nlow": """The N value of your soil is low.
        <br/> Please consider the following suggestions:
        <br/><br/> 1. <i>Add sawdust or fine woodchips to your soil</i> – the carbon in the sawdust/woodchips love nitrogen and will help absorb and soak up and excess nitrogen.

        <br/>2. <i>Plant heavy nitrogen feeding plants</i> – tomatoes, corn, broccoli, cabbage and spinach are examples of plants that thrive off nitrogen and will suck the nitrogen dry.

        <br/>3. <i>Water</i> – soaking your soil with water will help leach the nitrogen deeper into your soil, effectively leaving less for your plants to use.

        <br/>4. <i>Sugar</i> – In limited studies, it was shown that adding sugar to your soil can help potentially reduce the amount of nitrogen is your soil. Sugar is partially composed of carbon, an element which attracts and soaks up the nitrogen in the soil. This is similar concept to adding sawdust/woodchips which are high in carbon content.

        <br/>5. Add composted manure to the soil.

        <br/>6. Plant Nitrogen fixing plants like peas or beans.

        <br/>7. <i>Use NPK fertilizers with high N value.

        <br/>8. <i>Do nothing</i> – It may seem counter-intuitive, but if you already have plants that are producing lots of foliage, it may be best to let them continue to absorb all the nitrogen to amend the soil for your next crops.""",
    "PHigh": """The P value of your soil is high.
        <br/> Please consider the following suggestions:

        <br/><br/>1. <i>Avoid adding manure</i> – manure contains many key nutrients for your soil but typically including high levels of phosphorous. Limiting the addition of manure will help reduce phosphorus being added.

        <br/>2. <i>Use only phosphorus-free fertilizer</i> – if you can limit the amount of phosphorous added to your soil, you can let the plants use the existing phosphorus while still providing other key nutrients such as Nitrogen and Potassium. Find a fertilizer with numbers such as 10-0-10, where the zero represents no phosphorous.

        <br/>3. <i>Water your soil</i> – soaking your soil liberally will aid in driving phosphorous out of the soil. This is recommended as a last ditch effort.

        <br/>4. Plant nitrogen fixing vegetables to increase nitrogen without increasing phosphorous (like beans and peas).

        <br/>5. Use crop rotations to decrease high phosphorous levels""",
    "Plow": """The P value of your soil is low.
        <br/> Please consider the following suggestions:

        <br/><br/>1. <i>Bone meal</i> – a fast acting source that is made from ground animal bones which is rich in phosphorous.

        <br/>2. <i>Rock phosphate</i> – a slower acting source where the soil needs to convert the rock phosphate into phosphorous that the plants can use.

        <br/>3. <i>Phosphorus Fertilizers</i> – applying a fertilizer with a high phosphorous content in the NPK ratio (example: 10-20-10, 20 being phosphorous percentage).

        <br/>4. <i>Organic compost</i> – adding quality organic compost to your soil will help increase phosphorous content.

        <br/>5. <i>Manure</i> – as with compost, manure can be an excellent source of phosphorous for your plants.

        <br/>6. <i>Clay soil</i> – introducing clay particles into your soil can help retain & fix phosphorus deficiencies.

        <br/>7. <i>Ensure proper soil pH</i> – having a pH in the 6.0 to 7.0 range has been scientifically proven to have the optimal phosphorus uptake in plants.

        <br/>8. If soil pH is low, add lime or potassium carbonate to the soil as fertilizers. Pure calcium carbonate is very effective in increasing the pH value of the soil.

        <br/>9. If pH is high, addition of appreciable amount of organic matter will help acidify the soil. Application of acidifying fertilizers, such as ammonium sulfate, can help lower soil pH""",
    "KHigh": """The K value of your soil is high</b>.
        <br/> Please consider the following suggestions:

        <br/><br/>1. <i>Loosen the soil</i> deeply with a shovel, and water thoroughly to dissolve water-soluble potassium. Allow the soil to fully dry, and repeat digging and watering the soil two or three more times.

        <br/>2. <i>Sift through the soil</i>, and remove as many rocks as possible, using a soil sifter. Minerals occurring in rocks such as mica and feldspar slowly release potassium into the soil slowly through weathering.

        <br/>3. Stop applying potassium-rich commercial fertilizer. Apply only commercial fertilizer that has a '0' in the final number field. Commercial fertilizers use a three number system for measuring levels of nitrogen, phosphorous and potassium. The last number stands for potassium. Another option is to stop using commercial fertilizers all together and to begin using only organic matter to enrich the soil.

        <br/>4. Mix crushed eggshells, crushed seashells, wood ash or soft rock phosphate to the soil to add calcium. Mix in up to 10 percent of organic compost to help amend and balance the soil.

        <br/>5. Use NPK fertilizers with low K levels and organic fertilizers since they have low NPK values.

        <br/>6. Grow a cover crop of legumes that will fix nitrogen in the soil. This practice will meet the soil’s needs for nitrogen without increasing phosphorus or potassium.
        """,
    "Klow": """The K value of your soil is low.
        <br/>Please consider the following suggestions:

        <br/><br/>1. Mix in muricate of potash or sulphate of potash
        <br/>2. Try kelp meal or seaweed
        <br/>3. Try Sul-Po-Mag
        <br/>4. Bury banana peels an inch below the soils surface
        <br/>5. Use Potash fertilizers since they contain high values potassium
        """,
}

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


def weather_fetch(city_name):
    api_key = "9d7cde1f6d07ec55650544be1631307e"
    base_url = "http://api.openweathermap.org/data/2.5/weather?"

    complete_url = base_url + "appid=" + api_key + "&q=" + city_name
    response = requests.get(complete_url)
    x = response.json()

    if x["cod"] != "404":
        y = x["main"]

        temperature = round((y["temp"] - 273.15), 2)
        humidity = y["humidity"]
        return temperature, humidity
    else:
        return None


@app.route("/crop-classification", methods=["GET", "POST"])
@cross_origin()
def quality():
    # Get the uploaded image
    # Load the trained model
    Qmodel = tf.keras.models.load_model("models/corn_seed_classifier.h5")
    img = request.files["image"]

    # Read the image file into memory
    img = BytesIO(img.read())
    # Load the image and resize it to the required size
    img = image.load_img(img, target_size=(150, 150))
    # Convert the image to a numpy array and normalize it
    x = image.img_to_array(img)
    x = x / 255.0
    # Add a new axis to create a batch of size 1
    x = np.expand_dims(x, axis=0)
    # Make a prediction on the image
    predictions = Qmodel.predict(x)
    # Get the index of the class with the highest probability
    class_index = np.argmax(predictions[0])
    # Get the name of the class from the class index
    class_names = ["Broken", "Discolored", "Pure", "Silkcut"]
    predicted_class_name = class_names[class_index]
    # Get the probability of the predicted class
    class_probability = predictions[0][class_index]
    return jsonify(
        {
            "predicted_class_name": str(predicted_class_name),
            "class_probability": str(class_probability),
        }
    )


# 1. quality request ->flask
# 2. price request ->flask
# 3. add a crop request -> node


@app.route("/crop-price", methods=["GET", "POST"])
@cross_origin()
def price():
    if request.method == "POST":
        Pmodel = joblib.load("models/price_predict.joblib")

        # Load the label encoders
        label_encoders = joblib.load("models/label_encoders.joblib")

        month = request.json["month"]
        state = request.json["state"]
        soil_type = request.json["soil_type"]
        seed_type = request.json["seed_type"]
        weather_condition = request.json["weather_condition"]
        irrigation = request.json["irrigation"]
        fertilizer_usage = float(request.json["fertilizer_usage"])
        pesticide_usage = float(request.json["pesticide_usage"])
        quality = request.json["quality"]

        # Encode the categorical variables
        month = label_encoders["month"].transform([month])[0]
        state = label_encoders["state"].transform([state])[0]
        soil_type = label_encoders["soil type"].transform([soil_type])[0]
        seed_type = label_encoders["seed type"].transform([seed_type])[0]
        weather_condition = label_encoders["weather condition"].transform(
            [weather_condition]
        )[0]
        irrigation = label_encoders["irrigation"].transform([irrigation])[0]
        quality = label_encoders["quality"].transform([quality])[0]

        # Create a DataFrame with the input values
        input_df = pd.DataFrame(
            [
                {
                    "month": month,
                    "state": state,
                    "soil type": soil_type,
                    "seed type": seed_type,
                    "weather condition": weather_condition,
                    "irrigation": irrigation,
                    "fertilizer usage": fertilizer_usage,
                    "pesticide usage": pesticide_usage,
                    "quality": quality,
                }
            ]
        )

        # Make a price prediction
        predicted_price = Pmodel.predict(input_df)[0]
        return jsonify(
            {
                "predicted_price": str(predicted_price),
                "predicted_class_name": str(quality),
            }
        )


@app.route("/crop-suggestion", methods=["POST"])
@cross_origin()
def crop_prediction():
    title = "Crop Suggestion"

    if request.method == "POST":
        Cmodel = joblib.load("models/crop_prediction.joblib", mmap_mode=None)

        N = int(request.json["nitrogen"])
        P = int(request.json["phosphorous"])
        K = int(request.json["pottasium"])
        ph = float(request.json["moisture"]) / 3
        rainfall = float(request.json["temperature"]) * 3
        city = request.json["city"]

        if weather_fetch(city) != None:
            temperature, humidity = weather_fetch(city)
            data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
            my_prediction = Cmodel.predict(data)
            final_prediction = my_prediction[0]

            return jsonify({"prediction": str(final_prediction), "title": str(title)})


@app.route("/fertilizer", methods=["POST"])
@cross_origin()
def fert_recommend():
    print(request.json["nitrogen"])
    title = "Fertilizer Suggestion"
    crop_name = str(request.json["cropname"])
    N = int(request.json["nitrogen"])
    P = int(request.json["phosphorous"])
    K = int(request.json["pottasium"])

    df = pd.read_csv("Datasets/fertilizer.csv")

    nr = df[df["Crop"] == crop_name]["N"].iloc[0]
    pr = df[df["Crop"] == crop_name]["P"].iloc[0]
    kr = df[df["Crop"] == crop_name]["K"].iloc[0]

    n = nr - N
    p = pr - P
    k = kr - K
    temp = {abs(n): "N", abs(p): "P", abs(k): "K"}
    max_value = temp[max(temp.keys())]
    if max_value == "N":
        if n < 0:
            key = "NHigh"
        else:
            key = "Nlow"
    elif max_value == "P":
        if p < 0:
            key = "PHigh"
        else:
            key = "Plow"
    else:
        if k < 0:
            key = "KHigh"
        else:
            key = "Klow"

    response = str(fertilizer_dic[key])

    return jsonify({"reccommendation": str(response), "title": str(title)})


if __name__ == "__main__":
    app.run(debug=True)

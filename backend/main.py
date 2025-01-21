from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import vision
import os
import json

# Initialize FastAPI app
app = FastAPI()

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google Vision API client
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./vision_key.json"
vision_client = vision.ImageAnnotatorClient()

# Load products from JSON file
PRODUCTS_FILE_PATH = "./products.json"
if os.path.exists(PRODUCTS_FILE_PATH):
    with open(PRODUCTS_FILE_PATH) as file:
        PRODUCTS = json.load(file)
else:
    PRODUCTS = []  # Fallback in case the file is missing


# Helper function to calculate similarity score
def calculate_similarity_score(detected_labels, product_labels):
    detected_set = set(detected_labels)
    product_set = set(product_labels)
    matching_labels = detected_set.intersection(product_set)
    score = len(matching_labels) / len(product_set) if product_set else 0
    return score

from fastapi.staticfiles import StaticFiles

app.mount("/raw_images", StaticFiles(directory="raw_images"), name="raw_images")


@app.get("/")
def read_root():
    return {"message": "Visual Product Matcher API is running"}


@app.post("/match/")
async def match_image(image: UploadFile):
    try:
        print("Endpoint hit: /match/")
        print(f"Received file: {image.filename}")
        
        # Validate file format
        if not (image.filename.endswith(".png") or image.filename.endswith(".jpg") or image.filename.endswith(".jpeg")):
            return {"error": "Unsupported file format. Only PNG, JPG, and JPEG are supported."}
        
        # Read the uploaded image content
        content = await image.read()

        # Create a Vision API image object
        vision_image = vision.Image(content=content)

        # Perform label detection
        response = vision_client.label_detection(image=vision_image)
        
        if response.error.message:
            return {"error": response.error.message}

        detected_labels = [label.description.lower() for label in response.label_annotations]

        print("Detected labels:", detected_labels)
        
        product_list = PRODUCTS if isinstance(PRODUCTS, list) else PRODUCTS["products"]
        results = []
        for product in product_list:
            score = calculate_similarity_score(detected_labels, product["labels"])
            if score > 0:
                results.append({
                "product": product,
                "similarity_score": score
            })

        # Sort results by similarity score in descending order
        results = sorted(results, key=lambda x: x["similarity_score"], reverse=True)

        return {"results": results}

    except Exception as e:
        return {"error": str(e)}

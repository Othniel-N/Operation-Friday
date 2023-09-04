from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId  # Import ObjectId from bson module

app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app

# Connect to your MongoDB database
client = MongoClient('mongodb://127.0.0.1:27017')
db = client['details']  # Replace 'your_database_name' with your MongoDB database name
collection = db['collectionName']  # Replace 'your_collection_name' with your collection name

# Define an endpoint to fetch data
@app.route('/mongodb', methods=['GET'])
def get_data():
    try:
        data = list(collection.find({}))
        
        # Convert ObjectId to strings for JSON serialization
        for item in data:
            item['_id'] = str(item['_id'])
        
        # Retrieve all documents from your collection
        return jsonify(data)
    except Exception as e:
        print(str(e))
        return 'Internal Server Error', 500

if __name__ == '__main__':
    app.run(debug=True, port=3002)

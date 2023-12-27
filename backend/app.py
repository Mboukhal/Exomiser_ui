import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import json

from execution import env_setup, save_files

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes



@app.route('/api/submitForm', methods=['POST'])
def submit_form():
    # try:
        data = request.form
        print(data.get('userId'))
        files = request.files
        # # for key, val in files.items():
        # #     print(val.filename)
        for _, value in data.items():
            try:
                val_data = json.loads(value)
            except json.decoder.JSONDecodeError:
                continue
            # print(data[f'file{str(val_data["id"])}'])
            env_setup(
                val_data,
                files[f'file{val_data["id"]}']
                )
        
        # Send a response back to the frontend if needed
        return jsonify({'message': 'Form data received successfully',
                        'id': 10
                        }), 200
    # except Exception as e:
    #     # Handle exceptions
    #     print('Error processing form data:', str(e))
    #     return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    # Run the Flask application on port 5000
    app.run(debug=True, port= 8080)

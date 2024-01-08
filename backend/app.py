import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json

from execution import env_setup, exo_execute, zip_this

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes



@app.route('/api/submitForm', methods=['POST'])
def submit_form():
    # try:
        data = request.form
        # print(data.get('userId'))
        files = request.files
        # # for key, val in files.items():
        # #     print(val.filename)
        
        files_end = []
        
        for _, value in data.items():
            try:
                val_data = json.loads(value)
            except json.decoder.JSONDecodeError:
                continue
            # print(data[f'file{str(val_data["id"])}'])
            files_end.append(env_setup(
                val_data,
                files[f'file{val_data["id"]}']
                ))
        res, error = exo_execute(files_end)
        print('--', res)
        
        zip_path = zip_this(res)
        
        return jsonify({'files': zip_path}), 200
    # except Exception as e:
    #     # Handle exceptions
    #     print('Error processing form data:', str(e))
    #     return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/download/<filename>')
def download_zip(filename):
    # Specify the path to your existing zip file
    zip_file_path = f'download/{filename}'

    # Return the zip file for download
    res = send_file(zip_file_path, as_attachment=True, download_name=f'{filename}.zip')

    return res

if __name__ == '__main__':
    # Run the Flask application on port 5000
    app.run( debug=True, port=8080)
    # host="0.0.0.0",
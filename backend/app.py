import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def save_files(files):
  
    for key in files:
      if request.files:
          uploaded_file_info = request.files['file' + key]
          uploaded_file_path = uploaded_file_info.filename
          uploaded_file_data = uploaded_file_info.read()

          print()

          if uploaded_file_path and uploaded_file_data:
              file_path = f'uploads/{os.path.basename(uploaded_file_path)}'

              with open(file_path, 'wb') as file:
                  file.write(uploaded_file_data)

              print('File saved successfully')
          else:
              print('No file data or path was provided')
      else:
          print('No form data received')



@app.route('/api/submitForm', methods=['POST'])
def submit_form():
    try:
        data = request.form
        # print((data))
        # save_files(data)
            
        for _, value in data.items():
            print(value)
        
        # Send a response back to the frontend if needed
        return jsonify({'message': 'Form data received successfully'}), 200
    except Exception as e:
        # Handle exceptions
        print('Error processing form data:', str(e))
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    # Run the Flask application on port 5000
    app.run(debug=True, port= 8080)

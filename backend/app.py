import os
from flask import Flask, redirect, request, jsonify, send_file, url_for
from flask_cors import CORS
import json
from flask_socketio import SocketIO
import shutil
from execution import env_setup, zip_this, CLI, FOLDER

from threading import Thread
import subprocess


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app,resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app,cors_allowed_origins="*")

@app.route('/api/submitForm', methods=['POST'])
def submit_form():
    try:
        data = request.form
        files = request.files
        
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
    except Exception as e:
        # Handle exceptions
        print('Error processing form data:', str(e))
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/download/<filename>')
def download_zip(filename):
    # Specify the path to your existing zip file
    zip_file_path = f'download/{filename}'
    # Return the zip file for download
    res = send_file(zip_file_path, as_attachment=True, download_name=f'{filename}')

    return res

@app.route('/clean')
def clean_download_zip():
    directory_path = f'download/'
    # Ensure the directory exists
    if os.path.exists(directory_path):
        # Get all files in the directory
        files = os.listdir(directory_path)

        # Loop through the files and remove each one
        for file in files:
            file_path = os.path.join(directory_path, file)
            try:
                if os.path.isfile(file_path):
                    os.remove(file_path)
                elif os.path.isdir(file_path):
                    # Optionally, you can remove directories as well
                    os.rmdir(file_path)
            except Exception as e:
                print(f"Error removing file {file}: {e}")
    return jsonify({'message': 'OK'}), 200


@socketio.on('progress_update')
def exo_execute(data):
    res = []
    error = []

    def execute_single_task(i):
        cli = CLI + "'" + i['tmp'] + "'" + FOLDER + i['result']
        try:
            subprocess.run(cli, shell=True)
            res.append({"files_path": i['result'], "file_name": i['file_name']})
        except subprocess.CalledProcessError:
            error.append('file_name')

    # Create a list to hold the thread objects
    threads = []
    # Create and start a thread for each item in data
    for index, item in enumerate(data):
        
        thread = Thread(target=execute_single_task, args=(item,))
        threads.append(thread)
        socketio.emit('progress_update', {'progress': index + 1, 'total': len(data)})
        if len(threads) >= 3:
            for thread in threads:
                thread.start()
            for thread in threads:
                thread.join()
            threads = []
        
            
    if len(threads) > 0:
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
    return res, error


if __name__ == '__main__':
    # Run the Flask application on port 5000
    socketio.run(app, host="0.0.0.0", port=5001)
import os
from flask import request
from ganerate_yml import ganerate_yml
from uuid import uuid4

CLI = "java -Xms2g -Xmx4g -jar exomiser-cli-13.3.0.jar --analysis "

FOLDER = " --output-directory "

EXO_FOLDER = "../exomiser-cli-13.3.0"

EXO_RESULT = EXO_FOLDER + "/web_results"

UPLOAD_FOLDER = "uploads"

TMP_DIR = "tmp"

TMP = EXO_FOLDER + "/" + TMP_DIR

def env_setup(data, file):
  
    userId = uuid4()
    
    result_dir = EXO_RESULT + '/' + str(userId)
    upload_dir = UPLOAD_FOLDER + '/' + str(userId)
    tmp = TMP + '/' + str(userId)
     
    
    # create folder for result
    folder_name = result_dir + "/" + str(data['id'])
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)
        
    # create tmp folder
    if not os.path.exists(tmp):
        os.makedirs(tmp)
        
    # upload 'vcf' file
    file_path = f'{tmp}/{str(data["id"])}_{os.path.basename(file.filename)}'
    
    file.save(file_path)
    print(tmp)
    
    print(TMP_DIR + '/' + str(userId))
        
    print('OK')
    ganerate_yml(
        file_name=file.filename,
        id=str(data['id']),
        hop=data['hpo'],
        path=tmp,
        yaml_path=TMP_DIR + '/' + str(userId),
    )
    
    
    print(data)
    
    

def save_files(files):
  
    for key in files:
      if request.files:
          uploaded_file_info = request.files['file' + key]
          uploaded_file_path = uploaded_file_info.filename
          uploaded_file_data = uploaded_file_info.read()


          if uploaded_file_path and uploaded_file_data:
              file_path = f'{UPLOAD_FOLDER}/{os.path.basename(uploaded_file_path)}'

              with open(file_path, 'wb') as file:
                  file.write(uploaded_file_data)

              print('File saved successfully')
          else:
              print('No file data or path was provided')
      else:
          print('No form data received')
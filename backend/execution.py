import os
from flask import request
from ganerate_yml import ganerate_yml
from uuid import uuid4

EXO_PATH = "../exomiser-cli-13.3.0/"

CLI = f"cd {EXO_PATH}; java -Xms2g -Xmx4g -jar exomiser-cli-13.3.0.jar --analysis "

FOLDER = " --output-directory "

EXO_FOLDER = "../exomiser-cli-13.3.0"

EXO_RESULT = "web_results"

UPLOAD_FOLDER = "uploads"

TMP_DIR = "tmp"

TMP = EXO_FOLDER + "/" + TMP_DIR

def env_setup(data, file):
  
    userId = uuid4()
    
    result_dir = EXO_RESULT + '/' + str(userId)
    upload_dir = UPLOAD_FOLDER + '/' + str(userId)
    tmp = TMP + '/' + str(userId)
     
    
    # create folder for result
    res_dir = EXO_FOLDER  + '/' + result_dir
    print(res_dir)
    if not os.path.exists(res_dir):
        os.makedirs(res_dir)
        
    # create tmp folder
    if not os.path.exists(tmp):
        os.makedirs(tmp)
    
    # set 'fire_name' 'last_name' 'adn' in text file
    with open(f'{res_dir}/info.txt', 'w') as f:
        f.write(f'First Name: {data["firstName"]}\n')
        f.write(f'Last Name: {data["lastName"]}\n')
        f.write(f'ADN: {data["adn"]}\n')
        
    # upload 'vcf' file
    vcf_file_name = os.path.basename(file.filename)
    file_path = f'{tmp}/{vcf_file_name}'
    
    file.save(file_path)
    print('-->  ', tmp)
    
    # print(TMP_DIR + '/' + file_path + '.yml')
        
    print('OK')
    
    
    yml_file = TMP_DIR + '/' + str(userId) + '/' + vcf_file_name + '.yml'
    print(yml_file)
    
    ganerate_yml(
        file_name=file.filename,
        req_id=str(userId),
        hop=data['hpo'],
        path=TMP_DIR,
        exo_path = EXO_FOLDER,
    )
    
    return {
        'id': str(userId),
        'result': result_dir,
        'tmp': yml_file
        }

    
def exo_execute(data):
    for i in data:
        
        cli = CLI + "'" +  i['tmp'] + "'"  + FOLDER + i['result']
        
        os.system(cli)
        print()
        print()
        print(cli)

        print()
        print()
        print()
        print()
        print()
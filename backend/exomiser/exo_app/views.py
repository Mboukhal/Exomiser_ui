from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import yaml


class GenerateYAMLView(APIView):
    def post(self, request, format=None):
        # Assume the client sends data in the request body
        client_data = request.data

        # Perform any necessary validation or processing of client_data here

        # Generate YAML file based on processed data
        yaml_content = yaml.dump(client_data, default_flow_style=False)

        # Write YAML content to a file
        with open('output_file.yml', 'w') as file:
            file.write(yaml_content)

        return Response({'message': 'YAML file generated successfully'}, status=status.HTTP_200_OK)
import boto3
import os

ACCESS_KEY = os.getenv("ACCESS_KEY")
SECRET_KEY = os.getenv("SECRET_KEY")

s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY, endpoint_url='http://localhost:9000', verify=False)
s3.upload_file("src/README.md", Bucket="skyral-foundations", Key="README.md")
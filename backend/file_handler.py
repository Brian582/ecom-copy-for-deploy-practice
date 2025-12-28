from flask import Blueprint
from dotenv import load_dotenv
from pathlib import Path
import os
import json

fileHandler_bp = Blueprint("fileHandler", __name__)
load_dotenv()

#constructs absolute path by getting relative path from env file
def getFilePath(filename):
  path_rel = os.getenv(filename)        
  if not path_rel:
    raise FileNotFoundError(f"Environment variable {path_rel} is not set")

  path_abs = Path(path_rel).resolve()
  if not path_abs.exists():
    raise FileNotFoundError(f"File does not exist: {path_abs}")

  return path_abs

#reads file to retrieve and return the json data
def readFile(filename):
  file = getFilePath(filename)  
  with open(file, 'r') as f:
    return json.load(f)

#writes file with the new given data
def writeFile(filename,data):
  file = getFilePath(filename)
  with open(file, 'w') as f:
    json.dump(data, f, indent=2)
from flask import Flask, request, abort
import json
from SalesOrderPOSTer import postToNetsuite

app = Flask(__name__)
@app.route('/webhook', methods=['POST'])
def getWebhook():
    postData = request.json
    jsonString = '{'
    for key in postData:
        keyValueString = str(postData[key])
        if keyValueString[0] == '{' and keyValueString[len(keyValueString) - 1] == '}':
            for valueKey in postData[key]:
                # move json values into fields at the main level of the json object (easier to iterate when receiving)
                # i.e. {..., Key: {subkey1: subvalue1, subkey2: subvalue2}, ....}
                # becomes {..., subkey1: subvalue1, subkey2: subvalue2, ...}
                jsonString += '"' + str(valueKey) + '": "' + str(postData[key][valueKey]) + '",'
        else:
            jsonString += '"' + str(key) + '": "' + str(postData[key]) + '",'
    jsonString += '}'
    print('netsuite data ==> ' + jsonString)
    postToNetsuite(jsonString)
    return postData

if __name__ == '__main__':
    app.run()
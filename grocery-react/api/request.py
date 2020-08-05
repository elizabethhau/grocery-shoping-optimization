from flask import Flask, request, jsonify, send_from_directory, Response

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>', methods = ['POST'])
def result(path):
    input = request.get_json()
    print(input)
    userName = input['userName']
    ingredients = input['ingredients']
    recipes = input['recipes']
    return jsonify(input)
    # return Response("requested method is: " + request.method + ' user name is: ' + userName)
    # if request.method == 'POST':
    #     console.log('recognized POST method')
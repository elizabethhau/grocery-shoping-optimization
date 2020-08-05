from flask import Flask, request, jsonify, send_from_directory, Response
import api.optimization_helper as op

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>', methods = ['POST'])
def optimize(path):
    input = request.get_json()
    print(input)
    combined_ingredients = []
    userName = input['userName']
    ingredients = input['ingredients']
    combined_ingredients.append([ingredient['name'] for ingredient in ingredients])

     
    recipes = input['recipes']
    output = {}
    output['userName'] = userName
    # print(result)
    print('INGREDIENTS')
    print(ingredients)
    print(recipes)
    
    # print(result)

  
    # print(ingredients)
    # print(recipes)
    optimization_result = op.optimize(combined_ingredients)
    print(optimization_result)
    # output['instructions'] = optimization_result['instructions']
    print(output)
    return jsonify(optimization_result)
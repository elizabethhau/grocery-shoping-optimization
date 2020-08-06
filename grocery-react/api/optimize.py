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
    recipes = input['recipes']
    # print('recipes', recipes)
    combined_ingredients.append([ingredient['name'] for ingredient in ingredients])
    recipe_ingredients = [recipe['name'] for recipe in recipes]
    combined_ingredients += recipe_ingredients
    print('RECIPE INGREDIENTS')
    print(recipe_ingredients)
    # combined_ingredients.append([recipe['name'] for recipe in recipes])
 
     
    recipes = input['recipes']
    output = {}
    output['userName'] = userName
    # print(result)
    print('INGREDIENTS')
    print(ingredients)
    print('RECIPES')
    print(recipes)
    
    # print(result)

  
    # print(ingredients)
    # print(recipes)
    print('INPUT TO OPTIMIZE')
    print(combined_ingredients)
    optimization_result = op.optimize(combined_ingredients)
    print('Optimization result')
    print(optimization_result)
    # output['instructions'] = optimization_result['instructions']
    # print(output)
    return jsonify(optimization_result)
import gurobipy as gp
from flask import Flask, Response

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def gurobi_test(path):
    # return "gurobi seems to work, you’re good to go!"
    m = gp.Model("toy_factory")
    x=m.addVar(lb=0,ub=5)
    m.setObjective(x, gp.GRB.MAXIMIZE)
    m.optimize()
    if x.x==5: return "gurobi seems to work, you’re good to go!" + str(x.x)
    return "gurobi did not work!!"
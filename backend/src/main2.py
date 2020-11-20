from flask import Flask, jsonify, request
from flask_cors import CORS,cross_origin
import string
import math
import numpy as np
import random
import json
app = Flask(__name__)
CORS(app)

from pymongo import MongoClient

client = MongoClient('mongo',username='root',password='uno')
db = client['api_data']
db_data = db['routes']

@app.route('/coords',methods=['GET','POST'])
def api():  
    if request.method == 'POST':
        try:
            json_data = request.get_json()
            try:
                adj_matrix = json_data['adjMatrix'] 
            except:
                error = {
                        'possible_errors':['matrix is not found','key error, must be matrix']
                        }
                return error,400
        except:
            return {'bad request':'error in json file or missing json'},400
        
        
        def perturb_solution(solution):
            r1 = np.random.randint(1,len(solution)-2) # -2 porque no podemos perturar la ulrima posicion
            r2 = np.random.randint(1,len(solution)-2)
            pibot = solution[r1]
            solution[r1] = solution[r2]
            solution[r2] = pibot
            return solution


        def check_distance(solution,adj_matrix):
            acum = 0
            for i in range(len(solution)-1):
                acum += adj_matrix[solution[i]][solution[i+1]]
            return acum
        
        def p_boltzmann(cousin_solution,normal_solution,temperature):
            delta_z = cousin_solution - normal_solution
            return math.exp(-delta_z/temperature)

        def recocido(solution,adj_matrix):
            temperature = 10000
            alpha = 0.999
            acum = 0    
            while(temperature > 0.01):
                acum += 1
                distance = check_distance(solution,adj_matrix)
                sol_aux =  perturb_solution(solution[:])
                aux_distance = check_distance(sol_aux,adj_matrix)
                if(aux_distance < distance):
                    solution = sol_aux
                    distance = aux_distance
                    temperature *= alpha
                else:
                    n = random.uniform(0, 1)
                    p = p_boltzmann(aux_distance,distance,temperature)
                    if(n < p):
                        solution = sol_aux
                        distance = aux_distance
                        temperature *= alpha
            
            return solution, distance
        
        solution = []
        random_pos =  np.random.randint(0,len(adj_matrix)-1)
        solution.append(random_pos)
        for i in range(len(adj_matrix)-1):
            if(i != random_pos):
                solution.append(i)
            solution.append(random_pos)
        
        lat = json_data['latitudes']
        lng = json_data['longitudes']
        if(len(lat) <=2):
            return {'error':'se necesitan minimo 3 distancias '},400
        optimal,x = recocido(solution,adj_matrix)
        new_optimal = []
        lat = json_data['latitudes']
        lng = json_data['longitudes']
        for i in range(len(lat)):
            i_aux = optimal[i]
            coor = { 
                    'lat':lat[i_aux],
                    'lng':lng[i_aux] 
                    }
            new_optimal.append([coor])
        print(len(optimal))
        response =  {'route':str(optimal),'route2': new_optimal,'distances':x},200
        Json =  {'route':str(optimal),'route2': new_optimal,'distances':x}
        r = db_data.insert_one(Json)
        return str(r.inserted_id)
    else:
        r = list( db_data.find({},{"_id" :0}) )
        try:
            response = r[-1]
        except:
            return {'error':'aun no hay datos'}
        return jsonify(response)




if __name__ == '__main__':
    app.run(debug=True)
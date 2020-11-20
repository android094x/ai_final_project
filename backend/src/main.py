from flask import Flask, jsonify, request
from flask_cors import CORS,cross_origin
import string
import math
import numpy as np
import random
from pymongo import MongoClient
app = Flask(__name__)
CORS(app)

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
        
        def check_cost(solution, adj_matrix):
            acum = 0
            for i in range(len(solution)-1):
                acum += adj_matrix[solution[i]][solution[i+1]]
            return acum

        def scout(ants, adj_matrix):
            routes = []
            n = len(adj_matrix)
            random_route = list(range(n))
            random_route.append(random_route[0])
            for i in range(ants):
                random.shuffle(random_route)
                copy = random_route[:]
                copy.append(copy[0])
                routes.append(copy)
            return routes

        # retorna una lista con los posibles lugares donde nos podemos mover  (R)

        def generate_list(actual_pos, size, tour):
            positions = []
            for i in range(size):
                if(i != actual_pos and i not in tour):
                    positions.append(i)
            return positions

        # Calcula la probabilidad a partir de una posicion inicial y una lista con las posiciones restantes
        def calculate_probability(initial_pos, positions, pheromones, heuristic, alpha, beta):
            proba_list = []
            proba_acum = []
            product_list = []
            product_total = 0
            myList = []

            # Calcula la parte del numerador de la formula de probabilidad y se guarda en la lista
            for j in range(len(positions)):  # j = 3
                if(initial_pos != positions[j]):  # 3 != 4
                    aux = positions[j]  # posibles posiciones donde se puede mover (R) 4
                    myList.append([initial_pos, aux])
                    tau = pheromones[initial_pos][aux]**alpha  # 3,4
                    eta = heuristic[initial_pos][aux]**beta  # 3,4
                    product_list.append([initial_pos, aux, tau*eta])  # 3,4 xxx

            # Calcula la parte del denominador de la formula de probabilidad y se guarda el resultado a product_total
            for i in range(len(product_list)):
                product_total += product_list[i][2]

            # Calcula la probabiliadad usando cada posicion de la lista product_list y se divide entre CADA position entre product_total
            for i in range(len(product_list)):
                pos_i = product_list[i][0]
                pos_j = product_list[i][1]
                proba = product_list[i][2] / product_total
                proba_list.append([pos_i, pos_j, proba])

            # Calcula la acumulacion de las probabilidades para luego guardarlas en la lista proba_acum

            acum = proba_list[0][2]
            proba_acum.append(acum)
            for i in range(1, len(proba_list)):
                acum += proba_list[i][2]
                proba_acum.append(acum)
            return proba_list, proba_acum

        # Esta funcion compara las probabilidades acumuladas para escoger con U~(0,1) y escoge el nodo (R)
        def choose(proba_acum, uniform):
            n = len(proba_acum)
            for i in range(n):
                if(uniform < proba_acum[i]):
                    return i

        # Esta función construye el camino paso a paso  (R)
        def trace_route(actual_position, tour):
            positions = generate_list(actual_position, len(adj_matrix), tour)
            results, acum = calculate_probability(
                actual_position, positions, PHEROMONE, MHL, 10, 15)

            if(len(positions) == 1):
                tour.append(positions[0])
                return tour
            else:
                uniform = random.uniform(0, 1)
                new_pos = choose(acum, uniform)
                if(new_pos is not None):
                    tour.append(results[new_pos][1])
                    actual_position = results[new_pos][1]
                    return trace_route(actual_position, tour)
            return tour

        def evaporate(ro, pheromones):
            n = len(pheromones)
            for i in range(n):
                for j in range(n):
                    pheromones[i][j] *= (1-ro)

        n = len(adj_matrix)
        MHL = np.zeros((n,n))
        PHEROMONE = np.zeros((n,n))

        for i in range(n):      # llenado matriz de heuristica local (R)
          for j in range(n):
            if(adj_matrix[i][j] == 0):
              MHL[i][j] = 0
            else:
              MHL[i][j] = (1/adj_matrix[i][j])

        scout_routes = scout(1000,adj_matrix)   # Llenando la matriz de feromonas (R)
        n = len(scout_routes[0])
        for i in range(len(scout_routes)):
          route = scout_routes[i]
          distance = check_cost(route,adj_matrix)
          for j in range(len(route)-1):
            if(route[j] != route[j+1]):
              PHEROMONE[route[j]][route[j+1]] += 1/distance



        tour = []
        actual_position= 0
        tour.append(actual_position)
        tour = trace_route(actual_position,tour)
        tour.append(tour[0])
        optimal = tour


        for i in range(100):
          tour = []
          actual_position= np.random.randint(0,len(adj_matrix)-1)
          tour.append(actual_position)
          tour = trace_route(actual_position,tour)
          tour.append(tour[0])
          new_optimal = tour
          optimal_cost = check_cost(optimal,adj_matrix)
          new_optimal_cost = check_cost(new_optimal,adj_matrix)
          if( new_optimal_cost < optimal_cost):
              optimal = new_optimal
          evaporate(0.1,PHEROMONE)

        x = check_cost(optimal,adj_matrix)
        print(optimal)
        new_optimal = []
        lat = json_data['latitudes']
        lng = json_data['longitudes']
        for i in range(len(lat)+1):
            i_aux = optimal[i]
            coor = { 
                    'lat':lat[i_aux],
                    'lng':lng[i_aux] 
                    }
            new_optimal.append([coor])
        print(len(optimal))
        Json =  {'route':str(optimal),'route2': new_optimal,'distances':x}
        r = db_data.insert_one(Json)
        return {'ok':'saved'},201
    else:
        r = list( db_data.find({},{"_id" :0}) )
        try:
            response = r[-1]
        except:
            return {'error':'aun no hay datos'}
        return jsonify(response)




#if __name__ == '__main__':
#    app.run(debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

data = []


@app.route('/coords', methods=['POST'])
def receive_coords():
    request_data = request.get_json()
    # data.append(request_data)
    print(request_data['adjMatrix'])
    print(request_data['latitudes'])
    print(request_data['longitudes'])
    return jsonify({"data": request_data})


if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

# Conexión a la base de datos
def get_db_connection():
    conn = sqlite3.connect('stock.db')
    conn.row_factory = sqlite3.Row
    return conn

# Página principal
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para obtener productos con opción de filtro
@app.route('/productos', methods=['GET'])
def obtener_productos():
    filtro = request.args.get('filtro', '')

    conn = get_db_connection()

    if filtro:
        productos = conn.execute('SELECT * FROM productos WHERE nombre LIKE ?', ('%' + filtro + '%',)).fetchall()
    else:
        productos = conn.execute('SELECT * FROM productos').fetchall()

    conn.close()
    productos_list = [[producto['id'], producto['nombre'], producto['categoria'], producto['cantidad'], producto['precio']] for producto in productos]

    return jsonify(productos_list)

# Ruta para agregar un producto
@app.route('/agregar_producto', methods=['POST'])
def agregar_producto():
        data = request.get_json()
        nombre = data.get('nombre')
        categoria = data.get('categoria')
        cantidad = data.get('cantidad')
        precio = data.get('precio')

        # Validar que no haya campos vacíos
        if not all([nombre, categoria, cantidad, precio]):
            return jsonify({'error': 'Todos los campos son obligatorios.'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('INSERT INTO productos (nombre, categoria, cantidad, precio) VALUES (?, ?, ?, ?)',
                       (nombre, categoria, cantidad, precio))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Producto agregado correctamente.'}), 201




# Ruta para eliminar un producto
@app.route('/eliminar_producto/<int:id>', methods=['DELETE'])
def eliminar_producto(id):
        conn = get_db_connection()
        conn.execute('DELETE FROM productos WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Producto eliminado correctamente.'}), 200


if __name__ == '__main__':
    app.run(debug=True)

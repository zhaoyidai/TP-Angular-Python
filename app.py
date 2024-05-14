from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///interventions.db'

db = SQLAlchemy(app)


class Intervention(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    libelle = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    nom_intervenant = db.Column(db.String(100), nullable=True)
    lieu = db.Column(db.String(100), nullable=True)
    date_intervention = db.Column(db.DateTime, nullable=True)


# @app.before_first_request
# # init table
# def create_tables():
#     db.create_all()
#
#     # Add an example intervention to the database
#     example_intervention = Intervention(libelle='Example intervention', description='This is an example intervention',
#                                        nom_intervenant='Zhaoyi', lieu='France', date_intervention=datetime.now())
#     db.session.add(example_intervention)
#     db.session.commit()


@app.route('/interventions', methods=['POST'])
def create_intervention():
    data = request.get_json()
    libelle = data.get('libelle')
    description = data.get('description')
    nom_intervenant = data.get('nom_intervenant')
    lieu = data.get('lieu')
    date_intervention = data.get('date_intervention')

    if not libelle:
        return jsonify({'message': 'Libelle cannot be empty'}), 400

    if date_intervention:

        intervention = Intervention(
            libelle=libelle,
            description=description,
            nom_intervenant=nom_intervenant,
            lieu=lieu,
            date_intervention=datetime.strptime(date_intervention, '%d/%m/%Y')
        )
    else:
        # Handle the case where date_intervention is empty (e.g., set it to None)
        intervention = Intervention(
            libelle=libelle,
            description=description,
            nom_intervenant=nom_intervenant,
            lieu=lieu,
            date_intervention=None  # or any other default value you want to assign
        )
    db.session.add(intervention)
    db.session.commit()
    return jsonify({'message': 'Intervention created'})

@app.route('/interventions', methods=['GET'])
def get_interventions():
    interventions = Intervention.query.all()
    if not interventions:
        return jsonify({'message': 'empty table'}), 400

    data = []
    for intervention in interventions:
        intervention_data = {
            'id': intervention.id,
            'libelle': intervention.libelle,
            'description': intervention.description,
            'nom_intervenant': intervention.nom_intervenant,
            'lieu': intervention.lieu,
            'date_intervention': intervention.date_intervention.strftime(
                '%d/%m/%Y') if intervention.date_intervention else None
        }
        data.append(intervention_data)

    return jsonify(data)

@app.route('/interventions/<int:id>', methods=['PUT'])
def update_intervention(id):
    data = request.get_json()
    intervention = Intervention.query.get_or_404(id)
    libelle = data['libelle']
    description = data['description']
    nom_intervenant = data['nom_intervenant']
    lieu = data['lieu']
    if data['date_intervention']:
        date_intervention = datetime.strptime(data['date_intervention'], '%d/%m/%Y')
    else:
        date_intervention=None

    intervention.libelle = libelle
    intervention.description = description
    intervention.nom_intervenant = nom_intervenant
    intervention.lieu = lieu
    intervention.date_intervention = date_intervention


    db.session.commit()
    return jsonify({'message': 'Intervention updated'})

@app.route('/interventions/<int:id>', methods=['DELETE'])
def delete_intervention(id):
    intervention = Intervention.query.get_or_404(id)
    db.session.delete(intervention)
    db.session.commit()
    return jsonify({'message': 'Intervention deleted'})

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)

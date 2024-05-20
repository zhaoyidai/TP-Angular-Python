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
# # init table if no db

@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Intervention(s) not found'}), 404

@app.route('/interventions', methods=['POST'])
def create_intervention():
    """
        POST /add
        Adds one new intervention to db.

        Request Body:
            application/json:
                properties:
                    libelle:
                        type: string
                        description: Libelle of intervention.
                    description:
                        type: string
                        description: description of intervention.
                    nom_intervenant:
                        type: string
                        description: nom_intervenant of intervention.
                    lieu:
                        type: string
                        description: lieu of intervention.
                    date_intervention:
                        type: string
                        description: date_intervention of intervention,should respect dd/mm/yyyy.
                required:
                    - libelle

        Responses:
            201:
                description: success message.
                content:
                    application/json:
                        example: {'Intervention created'}
            400:
                description: libelle not empty error message.
                content:
                    application/json:
                        example: {Libelle cannot be empty'}
        """
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
        # where date_intervention is empty
        intervention = Intervention(
            libelle=libelle,
            description=description,
            nom_intervenant=nom_intervenant,
            lieu=lieu,
            date_intervention=None
        )
    db.session.add(intervention)
    db.session.commit()
    return jsonify({'message': 'Intervention created'}), 201


@app.route('/interventions', methods=['GET'])
def get_interventions():
    """
        GET /interventions
        Returns a list of interventions.

        Responses:
            200:
                description: list of dict interventions.
                content:
                    application/json:
                        example: [
                            {
                                "date_intervention": "14/05/2024",
                                "description": "This is an example intervention",
                                "id": 1,
                                "libelle": "Example intervention",
                                "lieu": "France",
                                "nom_intervenant": "Zhaoyi"
                            },
                            {
                                "date_intervention": "14/05/2024",
                                "description": "This is an example intervention",
                                "id": 3,
                                "libelle": "Example intervention",
                                "lieu": "France",
                                "nom_intervenant": "Zhaoyi"
                            }]
        """
    interventions = Intervention.query.all()
    if not interventions:
        return jsonify({'message': 'empty table'}), 404

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

    return jsonify(data), 200


@app.route('/interventions/<int:id>', methods=['PUT'])
def update_intervention(id):
    """
        PUT /interventions/<int:id>
        Updates an existing intervention in the db.

        Path Parameters:
            id (int): The ID of the intervention to update.

        Request Body:
            application/json:
                properties:
                    libelle:
                        type: string
                        description: Libelle of intervention.
                    description:
                        type: string
                        description: Description of intervention.
                    nom_intervenant:
                        type: string
                        description: Nom_intervenant of intervention.
                    lieu:
                        type: string
                        description: Lieu of intervention.
                    date_intervention:
                        type: string
                        description: Date_intervention of intervention, should respect dd/mm/yyyy.

                required:
                    - libelle

        Responses:
            200:
                description: Success message.
                content:
                    application/json:
                        example: {'message': 'Intervention updated'}
            400:
                description: Libelle not empty error message.
                content:
                    application/json:
                        example: {'message': 'Libelle cannot be empty'}
            404:
                description: Intervention not found error message.
                content:
                    application/json:
                        example: {'message': 'Intervention not found'}
        """
    data = request.get_json()
    intervention = Intervention.query.get_or_404(id)
    libelle = data['libelle']
    description = data['description']
    nom_intervenant = data['nom_intervenant']
    lieu = data['lieu']
    if not data['libelle']:
        return jsonify({'message': 'Libelle cannot be empty'}), 400
    if data['date_intervention']:
        date_intervention = datetime.strptime(
            data['date_intervention'], '%d/%m/%Y')
    else:
        date_intervention = None

    intervention.libelle = libelle
    intervention.description = description
    intervention.nom_intervenant = nom_intervenant
    intervention.lieu = lieu
    intervention.date_intervention = date_intervention
    db.session.commit()
    return jsonify({'message': 'Intervention updated'}), 200


@app.route('/interventions/<int:id>', methods=['DELETE'])
def delete_intervention(id):
    """
        DELETE /interventions/<int:id>
        Deletes an existing intervention from the db.

        Path Parameters:
            id (int): The ID of the intervention to delete.

        Responses:
            200:
                description: Success message.
                content:
                    application/json:
                        example: {'message': 'Intervention deleted'}
            404:
                description: Intervention not found error message.
                content:
                    application/json:
                        example: {'message': 'Intervention not found'}
        """
    intervention = Intervention.query.get_or_404(id)
    db.session.delete(intervention)
    db.session.commit()
    return jsonify({'message': 'Intervention deleted'}), 200


if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)

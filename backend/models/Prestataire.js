const { ObjectId } = require('mongodb');

// Trouver tous les prestataires
async function findAllPrestataires(db) {
  return await db.collection('prestataires').find({}).toArray();
}

// Trouver un prestataire par ID
async function findPrestataireById(db, id) {
  return await db.collection('prestataires').findOne({ _id: new ObjectId(id) });
}

// Créer un prestataire
async function createPrestataire(db, data) {
  const result = await db.collection('prestataires').insertOne({
    ...data,
    status: data.status || 'accepted',
    createdAt: new Date()
  });
  return { _id: result.insertedId, ...data };
}

// Mettre à jour un prestataire
async function updatePrestataireById(db, id, updateData) {
  const { _id, ...safeData } = updateData;
  const result = await db.collection('prestataires').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: safeData },
    { returnDocument: 'after' }
  );
  return result;
}

// Supprimer un prestataire
async function deletePrestataireById(db, id) {
  return await db.collection('prestataires').deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
  findAllPrestataires,
  findPrestataireById,
  createPrestataire,
  updatePrestataireById,
  deletePrestataireById
};

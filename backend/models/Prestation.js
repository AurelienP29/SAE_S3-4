const { ObjectId } = require('mongodb');

// Trouver toutes les prestations
async function findAllPrestations(db) {
  return await db.collection('prestations').find({}).toArray();
}

// Trouver une prestation par ID
async function findPrestationById(db, id) {
  return await db.collection('prestations').findOne({ _id: new ObjectId(id) });
}

// Créer une prestation
async function createPrestation(db, data) {
  const result = await db.collection('prestations').insertOne({
    ...data,
    prestataireId: data.prestataireId ? new ObjectId(data.prestataireId) : null,
    createdAt: new Date()
  });
  return { _id: result.insertedId, ...data };
}

// Mettre à jour une prestation
async function updatePrestationById(db, id, updateData) {
  const { _id, ...safeData } = updateData;
  if (safeData.prestataireId) {
    safeData.prestataireId = new ObjectId(safeData.prestataireId);
  }
  const result = await db.collection('prestations').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: safeData },
    { returnDocument: 'after' }
  );
  return result;
}

// Supprimer une prestation
async function deletePrestationById(db, id) {
  return await db.collection('prestations').deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
  findAllPrestations,
  findPrestationById,
  createPrestation,
  updatePrestationById,
  deletePrestationById
};

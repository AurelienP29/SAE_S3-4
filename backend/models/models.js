const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'prestataire', 'visiteur'], default: 'visiteur' },
    phone: String,
    description: String,
    picture_url: String,
    created_at: { type: Date, default: Date.now }
});

const PrestataireSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    category: { type: String, enum: ['artisan', 'atelier', 'jeu_video', 'jeu_plateau', 'boutique', 'restauration'] },
    description: String,
    days_available: [String],
    status: { type: String, enum: ['pending', 'accepted', 'refused'], default: 'accepted' }
});

const PrestationSchema = new Schema({
    name: { type: String, required: true },
    location_code: String,
    provider_id: { type: Schema.Types.ObjectId, ref: 'Prestataire', default: null },
    category: { type: String, required: true },
    description: String
});

const ActivitySchema = new Schema({
    prestation_id: { type: Schema.Types.ObjectId, ref: 'Prestation', default: null },
    title: { type: String, required: true },
    max_places: Number,
    start_time: Date
});

const MessageSchema = new Schema({
    sender_email: String,
    subject: String,
    content: String,
    sent_date: { type: Date, default: Date.now },
    status: String
});

const WaitingListPrestataireSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    category: String,
    description: String,
    services: [String],
    request_date: Date,
    status: { type: String, default: 'pending' }
});

const User = mongoose.model('User', UserSchema);
const Prestataire = mongoose.model('Prestataire', PrestataireSchema);
const Prestation = mongoose.model('Prestation', PrestationSchema);
const Activity = mongoose.model('Activity', ActivitySchema);
const Message = mongoose.model('Message', MessageSchema);
const WaitingListPrestataire = mongoose.model('WaitingListPrestataire', WaitingListPrestataireSchema);

module.exports = {
    User,
    Prestataire,
    Prestation,
    Activity,
    Message,
    WaitingListPrestataire
};
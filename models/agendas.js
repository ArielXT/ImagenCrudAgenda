const mongoose = require('mongoose');
const agendaSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required : true
    },
    nombre:{
        type: String,
        required: true,
    },
    apellidos:{
        type: String,
        required: true,
    },
    correo:{
        type: String,
        required: true,
    },
    fecha_nac:{
        type: Date,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    date:{
        type:Date,
        required: true,
        default:Date.now,
    },
});
module.exports = mongoose.model('agenda', agendaSchema);
const express = require ('express');
const router = express.Router();
const Agenda = require('../models/agendas');
const multer = require('multer');
const { route } = require('express/lib/application');
const fs = require('fs');
const { userInfo } = require('os');

//image upload
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single('image');

router.post("/add", upload, (req, res) => {
    const agenda = new Agenda({
        id: req.body.id,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        fecha_nac: req.body.fecha_nac,
        image: req.file.filename,
    });
    agenda.save((err)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }else{
            req.session.message = {
                type: 'success',
                message: 'Usuario Agregado Correctamente!'
            };
            res.redirect('/');
        }
    })
});

router.get("/", (req, res) => {
    Agenda.find().exec((err, agendas) => {
        if(err){
            res.json({ message: err.message });
        } else {
            res.render('index', {
                title: 'Inicio de Pagina',
                agendas: agendas,
            });
        }
    });
});


router.get("/add", (req, res) => {
    res.render('add_agendas',{ title: 'Agregar Usuario' });
});

router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    Agenda.findById(id, (err, agenda) =>{
        if(err){
            res.redirect('/')
        } else {
            if(agenda == null){
                res.redirect('/');
            }else{
                res.render('edit_agendas', {
                    title: 'Editar Usuario',
                    agenda: agenda,
                })
            }
        }
    })
});

router.post('/update/:id', upload, (req,res) => {
    let id = req.params.id;
    let new_image = '';

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/' + req.body.old_image); 
        } catch(err){
            console.log(err);
        }
    }else {
        new_image = req.body.old_image;
    }

    Agenda.findByIdAndUpdate(id, {
        id: req.body.id,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        fecha_nac: req.body.fecha_nac,
        image: new_image,
    }, (err, result) =>{
        if(err){
            res.json({ message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Usuario Actualiado Correctamente!',
            };
            res.redirect('/');
        }
    })
});

router.get('/delete/:id', (req, res) =>{
    let id = req.params.id;
    Agenda.findByIdAndRemove(id, (err,result) => {
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/'+result.image);
            } catch(err){
                console.log(err);
            }
        }
        if(err){
            res.json({ message: err.message});
        } else {
            req.session.message = {
                type: 'danger',
                message: 'Usuario Eliminado Correctamente!',
            };
            res.redirect('/');
        }
    })
})

module.exports = router;
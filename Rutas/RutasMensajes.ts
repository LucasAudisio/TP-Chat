import { Router } from 'express';
import { Mensaje } from '../Mensaje';
import { MongoClient } from 'mongodb';
import { AccesoMensaje } from '../AccesosDB/AccesoMensaje';
import { verificarClave } from '../jwtVerification';

const url: string = "mongodb://localhost:27017/Chat";
const client = new MongoClient(url);
const database = client.db("Chat");

var accesoMensaje: AccesoMensaje = new AccesoMensaje(url, database, database.collection("Mensaje"))

export const RutasMensajes = Router();

//lista con los datos de todos los mensajes
RutasMensajes.get("/mensajes", verificarClave, (_req,_res) => {
    accesoMensaje.getMensajes().then((v)=>{
        _res.send(v);
    })
})

//datos del mensaje segun id
RutasMensajes.get("/mensajes/:_id", verificarClave, (_req,_res) => {
    accesoMensaje.getMensaje(_req.params._id).then((v)=>{
        if(v) _res.send(v);
        else _res.send("mensaje no encontrado")
    })
})

//subir nuevo mensaje
RutasMensajes.post("/mensajes", verificarClave, (_req,_res) => {
    accesoMensaje.getMensaje(_req.body.id).then((v)=>{
        if(v != undefined){
            _res.send("no se pudo crear");
            return;
        }
        else{
            const mensajeTemp = new Mensaje(_req.body.nombreAutor, _req.body.nombreReceptor,
                _req.body.mensaje, _req.body.fecha, _req.body.estado);
            accesoMensaje.subirMensaje(mensajeTemp);
            _res.json(mensajeTemp);
        }
    })
})

//borrar mensaje
RutasMensajes.delete("/mensajes/:_id", verificarClave, (_req,_res) => {
    accesoMensaje.getMensaje(_req.params._id).then((v)=>{
        if(v == undefined){
            _res.send("no existe");
            return;
        }
        else{
            accesoMensaje.borrarMensaje(_req.params._id);
            _res.status(204).send();
        }
    })
})

//modificar todo el mensaje
RutasMensajes.put("/mensajes/:_id", verificarClave, (_req,_res) => {
    accesoMensaje.getMensaje(_req.params._id).then((v)=>{
        if(v == undefined){
            _res.send("no existe");
            return;
        }
        else{
            const mensajeTemp = new Mensaje(_req.body.nombreAutor, _req.body.nombreReceptor,
                _req.body.mensaje, _req.body.fecha, _req.body.estado);
            accesoMensaje.modificarMensaje(mensajeTemp, _req.params._id);
            _res.json(mensajeTemp);
        }
    })
})

//modificar mensaje
RutasMensajes.patch("/mensajes/:_id", verificarClave, (_req,_res) => {
    accesoMensaje.getMensaje(_req.params._id).then((v)=>{
        if(v == undefined){
            _res.send("no existe");
            return;
        }
        else{
            var mensajeTemp = new Mensaje(v.nombreAutor, v.nombreReceptor, v.mensaje,
                 v.fecha, v.estado);
            if(_req.body.nombreAutor){
                mensajeTemp.nombreAutor = _req.body.nombreAutor;
            }
            if(_req.body.nombreReceptor){
                mensajeTemp.nombreReceptor = _req.body.nombreReceptor;
            }
            if(_req.body.mensaje){
                mensajeTemp.mensaje = _req.body.mensaje;
            }
            if(_req.body.fecha){
                mensajeTemp.fecha = _req.body.fecha;
            }
            if(_req.body.estado){
                mensajeTemp.estado = _req.body.estado;
            }
            accesoMensaje.modificarMensaje(mensajeTemp, _req.params._id);
            _res.json(mensajeTemp);
        }
    })
})

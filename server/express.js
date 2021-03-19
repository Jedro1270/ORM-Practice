import pg from 'pg';
import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import ORM from './orm/orm.js';

dotenv.config();

const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: 'localhost'
});

const app = express();

let database;

pool
    .connect()
    .then((client) => {
        database = client;

        const orm = new ORM(client);
        const doctors = orm.create('doctors');
        const hospitalDoctors = orm.create('hospital_doctors');

        app
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended: true }))
            .use(cors())
            .listen(2027, () => {
                console.log('Server started!');
            });

        app.get('/doctors', async (request, response) => {
            const results = await doctors
                .retrieve(['*'])
                .catch((error) => {
                    console.log(error);
                });

            response.json({
                doctors: results.rows
            });
        });

        app.get('/doctors/:doctorId', async (request, response) => {
            const doctorId = request.params.doctorId;

            const results = await doctors
                .retrieve(['*'], { 'id': parseInt(doctorId) })
                .catch((error) => {
                    console.log(error);
                });

            response.json({
                doctor: results.rows
            });
        });

        // app.get('/hospitals/:hospitalId/:doctorId', async (request, response) => {
        //     const hostpitalId = request.params.hostpitalId;
        //     const doctorId = request.params.doctorId;

        //     // const results = await orm.retrieve('doctors', ['*'], {'id': doctorId}); // TO DO: Create inner join

        //     response.json({
        //         doctor: results.rows
        //     });
        // });

        app.put('/doctors/:doctorId/update', async (request, response) => {
            const doctorId = request.params.doctorId;
            const name = request.body.name;

            const results = await doctors
                .change(['name'], [name], { 'id': parseInt(doctorId) }, null, ['*'])
                .catch((error) => {
                    console.log(error);
                });

            response.json({
                updatedDoctor: results.rows[0]
            });
        });

        app.delete('/hospitals/:hospitalId/delete', async (request, response) => {
            const hospitalId = request.params.hospitalId;
            const doctorId = request.body.doctorId;

            const results = await hospitalDoctors
                .erase({ 'doctor_id': parseInt(doctorId), 'hospital_id': parseInt(hospitalId) }, ['AND'], ['doctor_id', 'hospital_id'])
                .catch((error) => {
                    console.log(error);
                });

            response.json({
                deletedHospitalMembership: results.rows[0]
            });
        });

        app.post('/hospitals/:hospitalId/insert', async (request, response) => {
            const hospitalId = request.params.hospitalId;
            const doctorId = request.body.doctorId;

            const results = await hospitalDoctors // For loop for mulitple inserts
                .insert(['doctor_id', 'hospital_id'], [parseInt(hospitalId), parseInt(doctorId)], ['*'])
                .catch((error) => {
                    console.log(error);
                });

            response.json({
                insertedHospitalMembership: results.rows[0]
            });
        });
    })
    .catch((error) => {
        console.log('Error:', error);
    });
const fetch = require('node-fetch');

async function runTests() {

    await fetch(`http://localhost:2027/doctors`).then((response) => {
        console.log('Getting all doctors:');
        response.json().then((results) => {
            console.log(results.doctors);
        });
    });

    await fetch(`http://localhost:2027/doctors/1`).then((response) => {
        response.json().then((results) => {
            console.log('\nGetting a specific doctor:');
            console.log(results.doctor);
        });
    });

    await fetch(`http://localhost:2027/doctors/1/update`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'Jedro' })
        }).then((response) => {
            response.json().then((results) => {
                console.log('\nUpdating the name of a doctor:');
                console.log(results.updatedDoctor);
            });
        }).catch((error) => {
            console.log(error);
        });

    await fetch(`http://localhost:2027/doctors/1/update`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'Anthony Stephenson' })
        }).then((response) => {
            response.json().then((results) => {
                console.log('\nUpdating a doctor back to original name:');
                console.log(results.updatedDoctor);
            });
        });

    await fetch(`http://localhost:2027/hospitals/1/delete`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ doctorId: 1 })
        }).then((response) => {
            response.json().then((results) => {
                console.log('\nDeleting a hospital membership of doctor from database');
                console.log(results.deletedHospitalMembership);
            });
        });

    await fetch(`http://localhost:2027/hospitals/1/insert`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ doctorId: 1 })
        }).then((response) => {
            response.json().then((results) => {
                console.log('\nInserting a hospital membership to database');
                console.log(results.insertedHospitalMembership);
            });
        });
}

runTests();
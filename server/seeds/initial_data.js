
exports.seed = function(knex) {
  return knex.raw(
    `
      INSERT INTO doctors(name, specialization)
        VALUES
          ('Anthony Stephenson', 'Family Physician'),
          ('Maria Haynes', 'Family Physician'),
          ('Jane Neal', 'Pediatrician'),
          ('Lesley Glover', 'Surgeon'),
          ('Nathaniel Nelson', 'Psychiatrist');

      INSERT INTO hospitals(name, location)
        VALUES
          ('The Medical City', ' Locsin St, Molo, Iloilo City, 5000 Iloilo'),
          ('Iloilo Doctors Hospital, Inc.', 'Infante St, Molo, Iloilo City, 5000 Iloilo'),
          ('Medicus Medical Center (Hospital)', 'Dra. Rizalina V. Bernardo Avenue, Mandurriao, Iloilo City, 5000 Iloilo');

      INSERT INTO hospital_doctors(doctor_id, hospital_id)
        VALUES
          (1, 1),
          (2, 2),
          (3, 1),
          (4, 3),
          (5, 2);
    `
  );
};

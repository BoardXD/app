import { Person } from "../model.js";

export async function createPerson(firstName, lastName) {
  const person = await Person.create({ firstName, lastName });
  return person;
}

// Buscar uma pessoa pelo ID
export async function getPersonById(id) {
  const person = await Person.findByPk(id);
  return person ? person.toJSON() : null;
}

// Buscar todas as pessoas
export async function getAllPersons() {
  const persons = await Person.findAll();
  return persons.map((person) => person.toJSON());
}

export async function updatePerson(id, updatedData) {
  const result = await Person.update(updatedData, { where: { id } });
  const [affectedRows] = result;
  if (affectedRows > 0) {
    return true;
  }
  return false;
}

export async function deletePerson(id) {
  const deleted = await Person.destroy({ where: { id } });
  if (deleted) {
    return true;
  }
  return false;
}

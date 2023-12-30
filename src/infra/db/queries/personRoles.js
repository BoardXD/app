import { PersonRoles } from "../model.js";

export async function createPersonRole(personId, roleId) {
  const personRole = await PersonRoles.create({ personId, roleId });
  return personRole;
}

// Buscar uma associação pelo ID
export async function getPersonRoleById(id) {
  const personRole = await PersonRoles.findByPk(id);
  return personRole;
}

// Buscar todas as associações
export async function getAllPersonRoles() {
  const allPersonRoles = await PersonRoles.findAll();
  return allPersonRoles;
}

export async function updatePersonRole(id, updatedData) {
  const updateResult = await PersonRoles.update(updatedData, {
    where: { id },
  });
  return updateResult;
}

export async function deletePersonRole(id) {
  const deleteResult = await PersonRoles.destroy({
    where: { id },
  });
  return deleteResult;
}

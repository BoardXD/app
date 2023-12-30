import { Role } from "../model.js";

export async function createRole(name) {
  const role = await Role.create({ name });
  return role;
}

export async function getRoleById(id) {
  const role = await Role.findByPk(id);
  return role ? role.toJSON() : null;
}

export async function getAllRoles() {
  const roles = await Role.findAll();
  return roles.map((role) => role.toJSON());
}

export async function updateRole(id, updatedData) {
  const result = await Role.update(updatedData, { where: { id } });
  const [affectedRows] = result;
  if (affectedRows > 0) {
    return true;
  }
  return false;
}

export async function deleteRole(id) {
  const deleted = await Role.destroy({ where: { id } });
  if (deleted) {
    return true;
  }
  return false;
}

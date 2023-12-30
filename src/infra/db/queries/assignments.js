import { Assignment } from "../model.js";

import Database from "tauri-plugin-sql-api";

const db = await Database.load("sqlite:test.db");

(async () => {
  const todos = {
    id: "id",
    title: "title",
    status: "status",
  };

  const result = await db.execute("INSERT into todos (id, title, status) VALUES ($1, $2, $3)", [
    todos.id,
    todos.title,
    todos.status,
  ]);

  console.log(result);
})();

export const bulkCreateAssignment = async ({ assigments }) => {
  if (!Array.isArray(assigments)) throw new Error(`assigments must be an array`);
  const result = await Assignment.bulkCreate(assigments);
  return result;
};

export const findPersonAssignByWeek = async ({ week, year, month }) => {
  const result = await Assignment.findAll({
    attributes: ["person"],
    where: {
      week,
      month,
      year,
    },
  });

  return result
    .map((data) => data.dataValues)
    .map(({ person }) => {
      person.includes("/")
        ? person
            .split("/")
            .flat()
            .map((item) => item.trim())
        : person;
    });
};

export const findMonthAssignment = async ({ month, year }) => {
  const result = await Assignment.findAll({
    attributes: ["week", "role", "person"],
    where: {
      month,
      year,
    },
  });

  return result.map((data) => data.dataValues);
};

export async function createAssignment(assignmentData) {
  const createdAssignment = await Assignment.create(assignmentData);
  return createdAssignment;
}

// Buscar uma atribuição pelo ID
export async function getAssignmentById(id) {
  const assignment = await Assignment.findByPk(id);
  return assignment.toJSON();
}

// Buscar todas as atribuições
export async function getAllAssignments() {
  const allAssignments = await Assignment.findAll();
  return allAssignments.map((data) => data.dataValues);
}

export async function updateAssignment(id, updatedData) {
  const updateResult = await Assignment.update(updatedData, {
    where: { id },
  });
  return updateResult;
}

export async function deleteAssignment(id) {
  const deleteResult = await Assignment.destroy({
    where: { id },
  });
  return deleteResult;
}

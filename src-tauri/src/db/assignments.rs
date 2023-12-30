use super::connection::DB_CONNECTION;
use rusqlite::{params, Result};
use serde::{Serialize, Serializer};
use tauri::command;

use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}


#[derive(Serialize)]
pub struct Assignment {
    id: i32,
    month: i32,
    week: String,
    year: String,
    role: String,
    person: String,
}

// Função para obter todos os 'Assignments'
#[command]
pub fn read_assignments() -> Result<Vec<Assignment>, String> {
    let conn = DB_CONNECTION.lock().unwrap();
    let mut stmt = conn
        .prepare("SELECT id, month, week, year, role, person FROM Assignment")
        .map_err(|e: rusqlite::Error| e.to_string())?;

    let assignments_inter = stmt
        .query_map([], |row| {
            Ok(Assignment {
                id: row.get(0)?,
                month: row.get(1)?,
                week: row.get(2)?,
                year: row.get(3)?,
                role: row.get(4)?,
                person: row.get(5)?,
            })
        })
        .map_err(|e: rusqlite::Error| e.to_string())?;

    let mut assignments: Vec<Assignment> = Vec::new();
    for assignment in assignments_inter {
        assignments.push(assignment.map_err(|e| e.to_string())?);
    }

    Ok(assignments)
}

// Função para atualizar um 'Assignment'
#[command]
pub fn update_assignment(
    id: i32,
    month: i32,
    week: String,
    year: String,
    role: String,
    person: String,
) -> Result<usize, String> {
    let conn = DB_CONNECTION.lock().unwrap();
    let rows_updated = conn.execute(
        "UPDATE Assignment SET month = ?1, week = ?2, year = ?3, role = ?4, person = ?5 WHERE id = ?6",
        params![month, week, year, role, person, id],
    ).map_err(|e| e.to_string())?;

    Ok(rows_updated)
}

// Função para deletar um 'Assignment'
#[command]
pub fn delete_assignment(id: i32) -> Result<usize, String> {
    let conn = DB_CONNECTION.lock().unwrap();
    let rows_deleted = conn
        .execute("DELETE FROM Assignment WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;

    Ok(rows_deleted)
}

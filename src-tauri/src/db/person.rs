use rusqlite::{params, Result};
use serde::{Deserialize, Serialize, Serializer};
use tauri::command;

use super::connection::DB_CONNECTION;

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

#[derive(Serialize, Deserialize)]
pub struct Person {
    id: Option<i32>, // `Option` porque `id` é autoincrementado
    first_name: String,
    last_name: String,
    gender: String,
    active: i32
}

#[command]
pub fn create_person(first_name: String, last_name: String, gender: String, active: i32) -> Result<i64, String> {
    let conn = DB_CONNECTION.lock().unwrap();

    conn.execute(
        "INSERT INTO Persons (firstName, lastName, gender, active) VALUES (?1, ?2, ?3, true)",
        params![first_name, last_name, gender, active],
    )
    .map_err(|e| e.to_string())?;

    let last_id = conn.last_insert_rowid();
    Ok(last_id)
}

#[command]
pub fn read_persons() -> Result<Vec<Person>, String> {
    let conn = DB_CONNECTION.lock().unwrap();
    let mut stmt = conn
        .prepare("SELECT id, firstName, lastName, gender, active FROM Persons")
        .map_err(|e: rusqlite::Error| e.to_string())?;

    let persons_iter = stmt
        .query_map([], |row| {
            Ok(Person {
                id: row.get(0)?,
                first_name: row.get(1)?,
                last_name: row.get(2)?,
                gender: row.get(3)?,
                active: row.get(4)?,
            })
        })
        .map_err(|e: rusqlite::Error| e.to_string())?;

    let mut persons = Vec::new();
    for person in persons_iter {
        persons.push(person.map_err(|e| e.to_string())?);
    }
    Ok(persons)
}

#[command]
pub fn update_person(
    id: i32,
    first_name: String,
    last_name: String,
    gender: String,
    active: i32
) -> Result<usize, String> {
    let conn = DB_CONNECTION.lock().unwrap();

    let rows_updated = conn
        .execute(
            "UPDATE Persons SET firstName = ?1, lastName = ?2, gender = ?3 active = ?4 WHERE id = ?5",
            params![first_name, last_name, gender, active, id],
        )
        .map_err(|e: rusqlite::Error| e.to_string())?;

    Ok(rows_updated)
}

#[command]
pub fn delete_person(id: i32) -> Result<usize, String> {
    let conn = DB_CONNECTION.lock().unwrap();

    let rows_deleted = conn
        .execute("DELETE FROM Persons WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;

    Ok(rows_deleted)
}

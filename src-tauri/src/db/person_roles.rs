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
pub struct PersonRole {
    person_id: i32,
    role_id: i32,
}

#[command]
pub fn create_person_role(person_id: i32, role_id: i32) -> Result<(), String> {
    let conn = DB_CONNECTION.lock().unwrap();

    conn.execute(
        "INSERT INTO PersonRoles (person_id, role_id) VALUES (?1, ?2)",
        params![person_id, role_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
pub fn read_person_roles() -> Result<Vec<PersonRole>, String> {
    let conn = DB_CONNECTION.lock().unwrap();
    let mut stmt = conn
        .prepare("SELECT person_id, role_id FROM PersonRoles")
        .map_err(|e| e.to_string())?;

    let person_roles_iter = stmt
        .query_map([], |row| {
            Ok(PersonRole {
                person_id: row.get(0)?,
                role_id: row.get(1)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut person_roles = Vec::new();
    for person_role in person_roles_iter {
        person_roles.push(person_role.map_err(|e| e.to_string())?);
    }
    Ok(person_roles)
}

#[command]
pub fn read_person_roles_by_id(person_id: i32) -> Result<Vec<PersonRole>, String> {
    let conn = DB_CONNECTION.lock().unwrap();

    let mut stmt = conn
        .prepare("SELECT person_id, role_id FROM PersonRoles WHERE person_id = ?1")
        .map_err(|e| e.to_string())?;

    let person_roles_iter = stmt
        .query_map(params![person_id], |row| {
            Ok(PersonRole {
                person_id: row.get(0)?,
                role_id: row.get(1)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut person_roles = Vec::new();
    for person_role in person_roles_iter {
        person_roles.push(person_role.map_err(|e| e.to_string())?);
    }

    Ok(person_roles)
}

#[command]
pub fn update_person_roles(person_id: i32, role_id: i32) -> Result<usize, String> {
    let conn = DB_CONNECTION.lock().unwrap();

    let rows_updated = conn
        .execute(
             "INSERT INTO PersonRoles (person_id, role_id) VALUES (?1, ?2)
         ON CONFLICT(person_id, role_id) DO UPDATE SET person_id = excluded.person_id, role_id = excluded.role_id",
            params![person_id, role_id,],
        )
        .map_err(|e| e.to_string())?;

    Ok(rows_updated)
}

#[command]
pub fn delete_person_role(person_id: i32, role_id: i32) -> Result<usize, String> {
    let conn = DB_CONNECTION.lock().unwrap();

    let rows_deleted = conn
        .execute(
            "DELETE FROM PersonRoles WHERE person_id = ?1 AND role_id = ?2",
            params![person_id, role_id],
        )
        .map_err(|e| e.to_string())?;

    Ok(rows_deleted)
}

#[command]
pub fn delete_person_role_by_id(person_id: i32) -> Result<usize, String> {
    let conn = DB_CONNECTION.lock().unwrap();

    let rows_deleted = conn
        .execute(
            "DELETE FROM PersonRoles WHERE person_id = ?1",
            params![person_id],
        )
        .map_err(|e| e.to_string())?;

    Ok(rows_deleted)
}


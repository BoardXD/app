use super::connection::DB_CONNECTION;
use rusqlite::Result;
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
pub struct Roles {
    id: i32,
    name: String,
}

#[command]
pub fn read_roles() -> Result<Vec<Roles>, String> {
    let conn = DB_CONNECTION.lock().unwrap();
    let mut stmt = conn
        .prepare("SELECT id, name FROM Roles")
        .map_err(|e: rusqlite::Error| e.to_string())?;

    let roles_inter = stmt
        .query_map([], |row| {
            Ok(Roles {
                id: row.get(0)?,
                name: row.get(1)?,
            })
        })
        .map_err(|e: rusqlite::Error| e.to_string())?;

    let mut roles: Vec<Roles> = Vec::new();
    for role in roles_inter {
        roles.push(role.map_err(|e| e.to_string())?);
    }

    Ok(roles)
}

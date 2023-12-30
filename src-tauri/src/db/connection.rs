use lazy_static::lazy_static;
use rusqlite::{Connection, Result};
use std::{path::Path, sync::Mutex};

lazy_static! {
    pub static ref DB_CONNECTION: Mutex<Connection> = Mutex::new(initialize_database().unwrap());
}

pub fn initialize_database() -> Result<Connection> {
    let db_path = "C:/Users/victor.almeida/Documents/dev/board/data/board.db";
    let db_dir = Path::new(db_path)
        .parent()
        .expect("Caminho do banco de dados inválido.");

    if !db_dir.exists() {
        let _ = std::fs::create_dir_all(db_dir);
    }

    let conn = Connection::open(db_path)?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS Assignment (
            id INTEGER PRIMARY KEY,
            month INTEGER NOT NULL,
            week TEXT NOT NULL,
            year TEXT NOT NULL,
            role TEXT NOT NULL,
            person TEXT NOT NULL
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS Persons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            gender TEX NOT NULL,
            active INTEGER NOT NULL
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS Roles (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;

    // Verifique se a tabela está vazia
    let count: i64 = conn.query_row("SELECT COUNT(*) FROM Roles", [], |row| row.get(0))?;

    if count == 0 {
        // Lista de roles
        let roles = vec![
            (1, "Indicadores"),
            (2, "Microfones"),
            (3, "Audio e video"),
            (4, "Palco"),
            (5, "Estudante"),
            (6, "Leitor"),
            (7, "Presidente"),
            (8, "Orador"),
        ];

        for role in roles {
            conn.execute(
                "INSERT INTO Roles (id, name) VALUES (?1, ?2)",
                &[&role.0 as &dyn rusqlite::ToSql, &role.1],
            )?;
        }
    }

    conn.execute(
        "CREATE TABLE IF NOT EXISTS PersonRoles (
        person_id INTEGER,
        role_id INTEGER,
        PRIMARY KEY (person_id, role_id)
    )",
        [],
    )?;

    Ok(conn)
}

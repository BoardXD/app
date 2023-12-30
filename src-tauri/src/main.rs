// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod models;

use db::assignments::{delete_assignment, read_assignments, update_assignment};
use db::person::{create_person, delete_person, read_persons, update_person};
use db::person_roles::{
    create_person_role, delete_person_role, read_person_roles, read_person_roles_by_id,
    update_person_roles, delete_person_role_by_id };
use db::roles::read_roles;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    std::env::set_var("RUST_BACKTRACE", "FULL");

    tauri::Builder::default()
        .setup(|_app| Ok(()))
        .invoke_handler(tauri::generate_handler![
            greet,
            read_assignments,
            update_assignment,
            delete_assignment,
            create_person,
            delete_person,
            update_person,
            read_persons,
            read_roles,
            create_person_role,
            delete_person_role,
            read_person_roles,
            update_person_roles,
            read_person_roles_by_id,
            delete_person_role_by_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

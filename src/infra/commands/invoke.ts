import { invoke as tauriInvoke, InvokeArgs } from "@tauri-apps/api/tauri";

export type Commands =
  | "read_assignments"
  | "update_assignment"
  | "delete_assignment"
  | "create_person"
  | "delete_person"
  | "update_person"
  | "read_persons"
  | "read_roles"
  | "create_person_role"
  | "delete_person_role"
  | "read_person_roles"
  | "update_person_roles"
  | "read_person_roles_by_id"
  | "delete_person_role_by_id"

export const invoke = async <T = unknown>(command: Commands, params?: InvokeArgs): Promise<T | undefined> => {
  try {
    const result = await tauriInvoke<T>(command, params);
    return result;
  } catch (error) {
    console.error("fail to fetch with tauri", error);
  }
};

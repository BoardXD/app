import { invoke } from "@/infra/commands/invoke";
import { ROLES } from "@/consts/roles";

export type RawPerson = {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  active: number;
};

export type RawRolesPerson = {
  person_id: number;
  role_id: number;
};

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  active: number;
  roles: number[] | string[];
};

export type PersonResponse = {
  id: string;
  name: string;
  gender: string;
  active: number;
  roles: number[] | string[];
};

export const createPerson = async ({
  firstName,
  lastName,
  gender,
  roles,
}: Person): Promise<boolean> => {
  try {
    const result = await invoke<number>("create_person", {
      firstName,
      lastName,
      gender,
    });

    if (result) {
      for (const roleId of roles) {
        invoke("create_person_role", { personId: result, roleId });
      }
    }

    return true;
  } catch (error) {
    console.error("Erro ao criar pessoa:", error);

    return false;
  }
};

export const readPersons = async (): Promise<PersonResponse[] | boolean> => {
  try {
    const [persons, roles] = await Promise.all([
      invoke<RawPerson[]>("read_persons"),
      invoke<RawRolesPerson[]>("read_person_roles"),
    ]);

    if (!persons || !roles) return false;

    const response = persons?.map(
      ({ first_name: firstName, last_name: lastName, gender, id, active }) => ({
        id,
        name: `${firstName[0]?.toLocaleUpperCase() + firstName?.substring(1)} ${
          lastName[0]?.toLocaleUpperCase() + lastName?.substring(1)
        }`,
        active,
        gender,
        roles: roles
          ?.filter(({ person_id }) => +person_id === +id)
          .map(({ role_id }) => ROLES[+role_id]),
      }),
    );
    return response;
  } catch (error) {
    console.error("Erro ao ler pessoas:", error);
    return false;
  }
};

export const updatePerson = async ({
  id,
  firstName,
  lastName,
  roles,
}: Person): Promise<boolean> => {
  try {
    await Promise.all([
      invoke("delete_person_role_by_id", { personId: id }),
      invoke("update_person", { id, firstName, lastName }),
    ]);

    await Promise.all(
      roles.map((role) =>
        invoke("create_person_role", { personId: id, roleId: role }),
      ),
    );

    return true;
  } catch (error) {
    console.error("Erro ao atualizar pessoa:", error);
    return false;
  }
};

export const deletePerson = async (id: string | number): Promise<boolean> => {
  try {
    await invoke("delete_person", { id });
    return true;
  } catch (error) {
    console.error("Erro ao deletar pessoa:", error);
    return false;
  }
};

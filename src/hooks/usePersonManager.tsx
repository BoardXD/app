import { useState, useEffect } from "react";
import {
  Person,
  readPersons,
  updatePerson,
  deletePerson,
  createPerson,
} from "@/infra/commands/person";
import { ROLES, RolesDefault } from "@/consts/roles";

export const usePersonManager = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedPerson, setEditedPerson] = useState<Person | null>(null);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newPerson, setNewPerson] = useState<Person>({
    id: "",
    firstName: "",
    lastName: "",
    roles: [],
  });
  const [roles, _] = useState<Record<string, string>>(
    Object.entries(ROLES).reduce(
      (acc: Record<string, string>, [key, value]) => {
        acc[value] = key;
        return acc;
      },
      {},
    ),
  );

  useEffect(() => {
    readPersons()
      .then((res) => {
        if (Array.isArray(res)) setPersons(res);
      })
      .catch((e) => console.log(e));
  }, [refreshFlag]);

  const startEditing = (person: Person) => {
    setEditingId(person.id);
    setEditedPerson({ ...person });
    setSelectedRole("");
  };

  const refreshData = () => {
    setRefreshFlag(!refreshFlag);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Person,
  ) => {
    if (editedPerson) {
      setEditedPerson({ ...editedPerson, [field]: e.target.value });
    }
  };

  const saveEdit = () => {
    if (editedPerson) {
      const { firstName, id, lastName, roles } = editedPerson;
      updatePerson({ firstName, id, lastName, roles }).then((_) => {
        setEditingId(null);
        refreshData();
      });
    }
  };

  const handleDelete = (personId: string | number) => {
    deletePerson(personId).then((_) => refreshData());
  };

  const addNewPerson = async () => {
    createPerson({ ...newPerson }).then((_) => {
      refreshData();
      setNewPerson({ id: "", firstName: "", lastName: "", roles: [] });
    });
  };

  const addRoleToPerson = (personId: number, role: number) => {
    setPersons(
      persons.map((person) => {
        if (person.id === personId) {
          return { ...person, roles: [...person.roles, role] };
        }
        return person;
      }),
    );
  };

  const removeRoleFromPerson = (personId: string | number, role: number) => {
    setPersons(
      persons.map((person) => {
        if (person.id === personId) {
          return { ...person, roles: person.roles.filter((r) => r !== role) };
        }
        return person;
      }),
    );
  };

  return {
    persons,
    editingId,
    editedPerson,
    searchTerm,
    selectedRole,
    newPerson,
    roles,
    setPersons,
    setSearchTerm,
    startEditing,
    handleEditChange,
    saveEdit,
    handleDelete,
    addRoleToPerson,
    removeRoleFromPerson,
    setSelectedRole,
    setNewPerson,
    addNewPerson,
  };
};

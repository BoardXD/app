export const ATTENDANTS = "ATTENDANTS";
export const MICROPHONES = "MICROPHONES";
export const AUDIO_AND_VIDEO = "AUDIO_AND_VIDEO";
export const PLATAFORM_ATTENDANT = "PLATAFORM_ATTENDANT";
export const STUDENT = "STUDENT";

export type RolesDefault =
  | "Indicadores"
  | "Microfones"
  | "Audio e video"
  | "Estudante"
  | "Leitor"
  | "Orador"
  | "Palco"
  | "Presidente";

export const ROLES: Record<number, RolesDefault> = {
  1: "Indicadores",
  2: "Microfones",
  3: "Audio e video",
  4: "Palco",
  5: "Estudante",
  6: "Leitor",
  7: "Presidente",
  8: "Orador",
};

export const rolesGroup = {
  full: [ATTENDANTS, MICROPHONES, AUDIO_AND_VIDEO, PLATAFORM_ATTENDANT],
  pg18: [PLATAFORM_ATTENDANT, AUDIO_AND_VIDEO, MICROPHONES],
  standart: [ATTENDANTS, MICROPHONES, PLATAFORM_ATTENDANT],
};

export const personRoles = {
  "Marcos P.": rolesGroup.full,
  "Celson C.": rolesGroup.full,
  "Victor F.": rolesGroup.full,
  "Rafael C.": rolesGroup.full,
  "Flavio P.": rolesGroup.full,
  "Johnny T.": rolesGroup.full,
  "Gabriel S.": rolesGroup.full,
  "Francisco A.": rolesGroup.full,
  "Jonathan C.": rolesGroup.full,
  "Gleison N.": rolesGroup.full,
  "Richard C.": rolesGroup.full,
  "Jorge S.": rolesGroup.standart,
  "Norbert G.": rolesGroup.standart,
  "Paulo S.": rolesGroup.standart,
  "Paulo C.": rolesGroup.standart,
  "Matheus C.": rolesGroup.standart,
  "Antonio N.": rolesGroup.standart,
  "Bryan B.": rolesGroup.pg18,
};

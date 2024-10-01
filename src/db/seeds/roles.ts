import { QueryRunner } from "typeorm";

import { Role } from "..";

import roles from "./roles/";

interface IRole {
  id: number;
  name: string;
}

const _formatter = (roles: IRole[]) => {
  const rolesFormatted: Role[] = [];

  roles.map((i) => {
    const role = new Role();
    role.id = i.id;
    role.name = i.name;

    rolesFormatted.push(role);
  });

  return rolesFormatted;
};

const insertRoles = async (queryRunner: QueryRunner) => {
  console.log("insert roles");

  roles.forEach(async (role) => {
    const rolesFormatter = _formatter(role);
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(rolesFormatter)
      .orUpdate(["name"])
      .execute();
  });
};

export default insertRoles;

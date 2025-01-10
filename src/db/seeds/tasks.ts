import { QueryRunner } from "typeorm";

import { Task } from "..";

import tasks from "./tasks/";

interface ITask {
  id: number;
  name: string;
}

const _formatter = (tasks: ITask[]) => {
  const tasksFormatted: Task[] = [];

  tasks.map((i) => {
    const task = new Task();
    task.id = i.id;
    task.name = i.name;

    tasksFormatted.push(task);
  });

  return tasksFormatted;
};

const insertTasks = async (queryRunner: QueryRunner) => {
  console.log("insert tasks");

  tasks.forEach(async (task) => {
    const tasksFormatter = _formatter(task);
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Task)
      .values(tasksFormatter)
      .orUpdate(["name"])
      .execute();
  });
};

export default insertTasks;

import { writeFile } from "fs";
import { getWeeklyPeriodsOfMonth } from "./scripts/weeks.js";
import { dbFlow, generateFlow } from "./scripts/flow.js";
import { createPdf } from "./scripts/pdf.js";

import { sequelize } from "./db/model.js";

async function handler() {
  await sequelize.sync();

  const year = 2023;
  const month = 12;
  const weeks = getWeeklyPeriodsOfMonth({ year, month });
  const lastWeek = weeks[weeks.length - 1];

  let jsonData;

  const fromDb = await dbFlow({ month, year, weeks });
  if (fromDb) {
    jsonData = fromDb.jsonData;
  } else {
    const generate = await generateFlow({ weeks, lastWeek, year, month });
    if (generate) jsonData = generate.jsonData;
  }

  await createPdf({ jsonData, weeks });
}

handler()
  .then((_) => console.log("work"))
  .catch((e) => console.log(e));

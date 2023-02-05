const chalk = require('chalk');

export const chalkINFO = (v) =>
  `${chalk.bgBlueBright.black(' INFO ')} ${chalk.blueBright(v)}`;
export const chalkSUCCESS = (v) =>
  `${chalk.bgGreenBright.black(' SUCCESS ')} ${chalk.greenBright(v)}`;
export const chalkERROR = (v) =>
  `${chalk.bgRedBright.black(' ERROR ')}  ${chalk.redBright(v)}`;
export const chalkWARN = (v) =>
  `${chalk.bgHex('#FFA500').black(' WARN ')} ${chalk.hex('#FFA500')(v)}`;

export const errorLog = (error, isThrow = false) => {
  if (error instanceof Error) {
    console.log(error);
  }
  console.log(
    `${chalk.bgRedBright.black(
      ' billd-html-webpack-plugin ERROR'
    )}  ${chalk.redBright(error)}`
  );
  if (isThrow) {
    throw new Error(error);
  }
};

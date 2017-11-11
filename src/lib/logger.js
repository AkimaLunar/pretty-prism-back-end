import chalk from 'chalk';

export const logger = message => {
  if (process.env.ENV === 'DEV') {
    console.log(chalk.blue(message)); // eslint-disable-line
  }
};

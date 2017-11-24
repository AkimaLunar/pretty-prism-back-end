import chalk from 'chalk';

// eslint-disable-next-line import/prefer-default-export
export const logger = message => {
  if (process.env.ENV === 'DEV') {
    console.log(chalk.blue(message)); // eslint-disable-line
  }
};

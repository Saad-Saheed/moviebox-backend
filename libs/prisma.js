import { PrismaClient } from '@prisma/client';
import Validator from 'validatorjs';
import CustomError from '../helpers/customError.js';
import { capitalize } from '../helpers/helper.js';

const database = new PrismaClient();

function isUnique(value, attribute, requirement, passes) {
  const attributes = attribute.toString().split(',')
  const tableName = attributes[0].trim()
  const columnName = attributes[1].trim()

  if (!attribute)
    throw new CustomError(
      'Specify Requirements i.e fieldName: unique:table,column',
      500,
    )
  if (attributes.length < 2)
    throw new CustomError(
      `Invalid format for validation rule on ${attribute}`,
      500,
    )

  database[tableName]
    .findFirst({ where: { [columnName]: value } })
    .then((modelExists) => {
      if (attributes.length > 2) {
        const modelId = attributes[2].trim()
        /* eslint-disable-next-line */
        if (!modelExists || (modelExists && modelExists.id == modelId, 10)) {
          passes()
        } else {
          passes(false, `${capitalize(columnName)} has already been taken.`)
        }
      } else if (!modelExists) {
        passes()
      } else {
        passes(false, `${capitalize(columnName)} has already been taken.`)
      }
    })
    // .catch((error) => {
    //   throw new CustomError(error, 500)
    // })
}

// register unique validation
Validator.registerAsync(
  'unique',
  isUnique,
  ':attribute has already been taken.',
);

export default database;
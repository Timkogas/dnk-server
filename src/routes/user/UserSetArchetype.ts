import * as core from 'express-serve-static-core';
import User from '../../models/User';
import Archetype, { ResultName } from '../../models/Archetype';
import { verifyLaunchParams } from '../../helpers/verifyLaunchParams';

interface Itypes {
  male: {
    young: {
      [key: string]: ResultName
    },
    middle: {
      [key: string]: ResultName
    },
    adult: {
      [key: string]: ResultName
    },
    old: {
      [key: string]: ResultName
    }
  }

  female: {
    young: {
      [key: string]: ResultName
    },
    middle: {
      [key: string]: ResultName
    },
    adult: {
      [key: string]: ResultName
    },
    old: {
      [key: string]: ResultName
    }
  }
}
const types: Itypes = {
  male: {
    young: {
      "3Б,4Б,5Г,9В": `бэтмен`,
      "5Г,7А,12Б,13Г": `добрыня`,
      "5А,10Б,8А": "мачо",
      "3Б,12А,13В": "александр македонский",
    },
    middle: {
      "10Б,13Г": `данко`,
      "5Г,10Б,11В": `тамерлан`,
      "5А,10Б,8А": "мачо",
      "9Г,12А,10Б": "остап бендер",
      "3Б,12А,13В": "александр македонский",
    },
    adult: {
      "4А,9А,5А": `ковбой`,
      "8А,10Б,11В": `прометей`,
      "5Г,9В,10В,13Г": "пожарный",
      "5Г,7А,10Б": "поддубный",
      "3Б,12А,13В": "александр македонский",
    },
    old: {
      "4А,5А,11В,9А": `черчилль`,
      "6Б,8Б,12Б,13Г": `скрудж макдак`,
      "5Г,9В,10В,13Г": "пожарный",
      "5Г,7А,10Б": "поддубный",
    }
  },
  female: {
    young: {
      "5А,6Б,8В,9Б,14А": `парижанка`,
      "3А,5Г,6Б,10Б,13В": `жанна д’арк`,
      "13Г,12Б,15Г": `золушка`,
      "5Г,7А,8Б": `мальвина`,
      "5А,13А,12А,6Б": `принцесса`,
      "4А,9А,12Б": `женщина-вамп`,
      "5Г,7А,8В": `чемпионка`,
      "3А,10Б,11В,15Б": `наташа ростова`,
      "8Б,9В,13Г": `дюймовочка`
    },
    middle: {
      "6Б,15В,14А": "королева",
      "11А,12Б,10Б": "мать тереза",
      "6А,9Б,5А": "фея",
      "8Б,9В,13Г": "дюймовочка",
      "13Г,12Б,15Г": "золушка",
      "5А,9Б,10Б": 'императрица',
      "3А,4А,9Б": 'мэрилин монро'
    },
    adult: {
      "9А,3А,6Б": "коко шанель",
      "5А,11В,10Б ": "русалка",
      "6Б,13Г,10Б": "бизнес-леди",
      "8В,11А,12Б": "скарлетт",
      "3А,5Г,6Б,10Б,13В": `жанна д’арк`,
      "5А,14А,15Б": 'дульсинея',
      "3А,8А,12А": 'провинциалка',
      "3А,4А,9Б": 'мэрилин монро'
    },
    old: {
      "12Б,8В,10Б": "хозяйка медной горы",
      "5В,7А,10В": "клеопатра",
      "9А,3А,6Б": "коко шанель",
      "3А,5Г,6Б,10Б,13В": `жанна д’арк`,
      "6Б,13Г,10Б": "бизнес-леди",
      "3А,8А,12А": 'провинциалка',
      "5А,9Б,10Б": 'императрица',
    }
  }
}

const mapOptions: { [key: string]: number } = {
  'А': 1,
  'Б': 2,
  'В': 3,
  'Г': 4,
  'Д': 5,
}

const isMatching = (answers: string, userAnswers: number[], circle: number = 0): boolean => {
  const arrAnswers = answers.split(',')

  // eslint-disable-next-line array-callback-return
  const correctAnswers = arrAnswers.filter((answer) => {
    if (answer.length === 2) {

      const question = Number(answer[0]) - 1
      const option = mapOptions[answer[1]]

      if (userAnswers[question] === option) return true
      else return false

    } else if (answer.length === 3) {

      const question = Number(answer[0] + answer[1]) - 1
      const option = mapOptions[answer[2]]

      if (userAnswers[question] === option) return true
      else return false
    }
  })
  if (circle === 1) {
    if (arrAnswers.length - 1 === correctAnswers.length) return true
    else return false
  } else if (circle === 2) {
    if (arrAnswers.length - 2 === correctAnswers.length) return true
    else return false
  } else {
    if (arrAnswers.length === correctAnswers.length) return true
    else return false
  }
}

const findResult = (types: { [key: string]: ResultName }, a: number[]): ResultName => {
  let name = ''
  for (let type in types) {
    if (isMatching(type, a)) {
      name = types[type];
      break;
    }
  }

  if (name === '') {
    for (let type in types) {
      if (isMatching(type, a, 1)) {
        name = types[type];
        break;
      }
    }
  }

  if (name === '') {
    for (let type in types) {
      if (isMatching(type, a, 2)) {
        name = types[type];
        break;
      }
    }
  }

  return name as ResultName
}

export default class UserSetArchetype {
  constructor(app: core.Express) {
    this._app = app;
    this._init();
  }

  private _app: core.Express;

  private _init(): void {
    this._app.post('/user/archetype', async (req, res): Promise<void> => {
      this._route(req, res);
    });
  }

  private async _route(req: core.Request<any>, res: core.Response<any>): Promise<void> {
    try {
      if (req.headers.search) {
        const areLaunchParamsValid = verifyLaunchParams(req.headers.search);
        if (!areLaunchParamsValid) {
          res.json({
            error: true,
            error_text: 'security error',
            data: {}
          })
          return
        }
      } else {
        res.json({
          error: true,
          error_text: 'security error',
          data: {}
        })
        return
      }

      const { uid, answers } = req.body;
      if (!uid) {
        res.json({
          error: true,
          error_text: 'uid is required',
          data: {}
        })
        return
      }

      if (!answers) {
        res.json({
          error: true,
          error_text: 'answers is required',
          data: {}
        })
        return
      }

      // Проверяем существование пользователя по uid
      let user = await User.findOne({ uid });

      if (!user) {
        res.json({
          error: true,
          error_text: 'user is not existed',
          data: {}
        })
        return
      }

      let archetype: ResultName

      if (answers.length === 15) {

        const a = answers
        const sex = a[1]
        const age = a[0]
        if (sex === 1) { // женский
          if (age >= 18 && age <= 25) {
            archetype = findResult(types.female.young, a)
          } else if (age >= 26 && age <= 33) {
            archetype = findResult(types.female.middle, a)
          } else if (age >= 34 && age <= 43) {
            archetype = findResult(types.female.adult, a)
          } else if (age >= 44) {
            archetype = findResult(types.female.old, a)
          }
        } else if (sex === 2) { // мужской
          if (age >= 18 && age <= 25) {
            archetype = findResult(types.male.young, a)
          } else if (age >= 26 && age <= 35) {
            archetype = findResult(types.male.middle, a)
          } else if (age >= 36 && age <= 45) {
            archetype = findResult(types.male.adult, a)
          } else if (age >= 46) {
            archetype = findResult(types.male.old, a)
          }
        }

        let archetypeObj = await Archetype.findOne({ name: archetype });

        if (!archetypeObj) {
          res.json({
            error: true,
            error_text: 'archetype is not existed',
            data: {}
          })
          return
        }

        await user.updateOne({ archetype: archetypeObj._id })

        res.json({
          error: false,
          error_text: '',
          data: {
            archetype: archetypeObj
          }
        })

      } else {
        if (user.archetype) {

          let archetypeObj = await Archetype.findOne({ _id: user.archetype });
          res.json({
            error: false,
            error_text: '',
            data: {
              archetype: archetypeObj
            }
          })

        } else {
          console.log('damn')
          let archetypeObj = await Archetype.findOne({ name: 'парижанка' });

          await user.updateOne({ archetype: archetypeObj._id })
  
          res.json({
            error: false,
            error_text: '',
            data: {
              archetype: archetypeObj
            }
          })
        }
      }
    } catch (error) {
      console.error('Error processing user check', error);
      res.json({
        error: true,
        error_text: 'Internal Server Error',
        data: {}
      })
    }
  }
}
import mongoose, { Document, Schema } from 'mongoose';

export type ResultName = 'парижанка' | 'дюймовочка' | 'клеопатра' | 'мальвина' | 'жанна д’арк' | 'наташа ростова' | 'принцесса' | 'королева' | 'золушка' | 'женщина-вамп' | 'чемпионка' | 'мать тереза' | 'фея' | 'коко шанель' | 'русалка' | 'бизнес-леди' | 'скарлетт' | 'дульсинея' | 'провинциалка' | 'хозяйка медной горы' | 'бэтмен' | 'добрыня' | 'мачо' | 'александр македонский' | 'данко' | 'тамерлан' | 'остап бендер' | 'ковбой' | 'прометей' | 'пожарный' | 'поддубный' | 'скрудж макдак' | 'черчилль' | 'мэрилин монро' | 'императрица';

export interface IArchetype {
  name: ResultName;
  description: string;
  secret: string;
  problems: string;
  recommendations: string[];
  img: string;
  imgPc: string;
  storyUrl: string;
  postUrl: string;
}


interface IArchetypeD extends Document {
  name: ResultName;
  description: string;
  secret: string;
  problems: string;
  recommendations: string[];
  img: string;
  imgPc: string;
  storyUrl: string;
  postUrl: string;
}

const archetypeSchema = new Schema<IArchetypeD>({
  name: { type: String, required: true, enum: ['парижанка', 'дюймовочка', 'клеопатра', 'мальвина', 'жанна д’арк', 'наташа ростова', 'принцесса', 'королева', 'золушка', 'женщина-вамп', 'чемпионка', 'мать тереза', 'фея', 'коко шанель', 'русалка', 'бизнес-леди', 'скарлетт', 'дульсинея', 'провинциалка', 'хозяйка медной горы', 'бэтмен', 'добрыня', 'мачо', 'александр македонский', 'данко', 'тамерлан', 'остап бендер', 'ковбой', 'прометей', 'пожарный', 'поддубный', 'скрудж макдак', 'черчилль', 'мэрилин монро', 'императрица'], unique: true },
  description: { type: String, required: true },
  secret: { type: String, required: true },
  problems: { type: String, required: true },
  recommendations: { type: [String], required: true },
  img: { type: String, required: true },
  imgPc: { type: String, required: true },
  storyUrl: { type: String, required: true },
  postUrl: { type: String, required: true },
});

const Archetype = mongoose.model<IArchetypeD>('Archetype', archetypeSchema);

export default Archetype;

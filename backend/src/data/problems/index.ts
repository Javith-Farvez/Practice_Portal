import { ProblemSeed } from './types';
import { TOPICS_1_TO_5_PROBLEMS } from './topics1to5';
import { TOPICS_6_TO_9_PROBLEMS } from './topics6to9';
import { TOPIC_10_ARRAYS_PROBLEMS } from './topic10Arrays';
import { TOPIC_11_STRINGS_PROBLEMS } from './topic11Strings';
import { TOPICS_12_TO_20_OOP_PROBLEMS } from './topics12to20OOP';
import { topics21to22HandlingProblems } from './topics21to22Handling';
import { topic23CollectionsProblems } from './topic23Collections';
import { topics24to26AdvancedProblems } from './topics24to26Advanced';

export * from './types';

export const ALL_JAVA_PROBLEMS: ProblemSeed[] = [
  ...TOPICS_1_TO_5_PROBLEMS,
  ...TOPICS_6_TO_9_PROBLEMS,
  ...TOPIC_10_ARRAYS_PROBLEMS,
  ...TOPIC_11_STRINGS_PROBLEMS,
  ...TOPICS_12_TO_20_OOP_PROBLEMS,
  ...topics21to22HandlingProblems,
  ...topic23CollectionsProblems,
  ...topics24to26AdvancedProblems
];

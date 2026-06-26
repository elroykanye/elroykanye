import type { ComponentType } from "react";
import QuizCard from "./QuizCard";
import RiddleCard from "./RiddleCard";
import WouldYouDeploy from "./WouldYouDeploy";
import ReactionGame from "./ReactionGame";
import NumberGuess from "./NumberGuess";
import RockPaperScissors from "./RockPaperScissors";
import Clicker from "./Clicker";
import MiniMemory from "./MiniMemory";

// The pool of in-post diversions. One is picked at random on each page load.
// Add to this list to widen the variety.
export const DIVERSIONS: ComponentType[] = [
  QuizCard,
  RiddleCard,
  WouldYouDeploy,
  ReactionGame,
  NumberGuess,
  RockPaperScissors,
  Clicker,
  MiniMemory,
];

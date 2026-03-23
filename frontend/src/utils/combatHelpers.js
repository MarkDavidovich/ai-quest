import { COMBAT_MOVES } from "./constants";

export const calculateDamage = (attacker, defender, move) => {
  // Simple formula: (attacker attack + move power) - (defender defense / 2)
  const baseDamage = attacker.attack + move.power - defender.defense / 2;

  // Add some variance (±10%)
  const variance = baseDamage * 0.1;
  const randomVariance = (Math.random() - 0.5) * variance * 2;

  // Check accuracy
  const hit = Math.random() * 100 < move.accuracy;

  return {
    damage: Math.max(1, Math.floor(baseDamage + randomVariance)), // Min 1 damage
    hit: hit,
    isCritical: Math.random() < 0.1, // 10% crit chance
  };
};

export const getRandomMove = (enemy) => {
  // Enemy picks a random move from their available moves
  const moveId = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
  return COMBAT_MOVES[moveId];
};

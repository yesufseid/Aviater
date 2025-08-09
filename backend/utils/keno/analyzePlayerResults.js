function simulatePayout(hits, bet) {
  const table = {
    0: 0,
    1: 0,
    2: 1,
    3: 2,
    4: 5,
    5: 10,
    6: 50
    // Extend as needed
  };
  return (table[hits] || 0) * bet;
}

function analyzePlayerResults(game_id, tickets, drawnNumbers) {
  const drawnSet = new Set(drawnNumbers);
  const results = [];

  for (const ticket of tickets) {
    const matched = ticket.n.filter(num => drawnSet.has(num));
    const hits = matched.length;

    results.push({
      game_id,
      player: ticket.p,
      picked: ticket.n,
      drawn: drawnNumbers,
      matched,
      hits,
      bet: ticket.b,
      win: simulatePayout(hits, ticket.b),
      timestamp: Date.now()
    });
  }

  return results;
}



// Find top players
function getTopPlayers(history, top = 5) {
  const map = {};

  for (const res of history) {
    map[res.player] = (map[res.player] || 0) + res.win;
  }

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([player, win]) => ({ player, totalWin: win }));
}


module.exports={getTopPlayers,analyzePlayerResults}
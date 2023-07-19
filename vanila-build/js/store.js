const INITIAL_VALUE = {
  currentGameMoves: [],
  history: {
    currentRoundGame: [],
    allGames: [],
  },
};

export default class Store {
  #state = INITIAL_VALUE;
  constructor(players) {
    this.players = players;
  }

  get stats() {
    console.log(this.#getState());
  }

  get game() {
    const STATE = this.#getState();

    const CURRENT_PLAYER = this.players[STATE.currentGameMoves.length % 2];

    // Game winning matrix
    const WINNING_COMBINATIONS = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [3, 5, 7],
      [4, 5, 6],
      [7, 8, 9],
    ];
    let winner = null;

    for (const player of this.players) {
      // TODO: Not working .filter func(fix it))
      const SELECTED_SQUARE_IDS = STATE.currentGameMoves
        .filter((move) => move.player.id === player.id)
        .map((move) => move.squareId);

      for (const COMBINATION of WINNING_COMBINATIONS) {
        if (COMBINATION.every((v) => SELECTED_SQUARE_IDS.includes(v))) {
          winner = player;
        }
      }
    }

    return {
      moves: STATE.currentGameMoves,
      CURRENT_PLAYER,
      status: {
        isComplete: winner != null || STATE.currentGameMoves.length === 9,
        winner,
      },
    };
  }
  playerMove(squareId) {
    const STATE_CLONE = structuredClone(this.#getState());

    STATE_CLONE.currentGameMoves.push({
      squareId,
      player: this.game.CURRENT_PLAYER,
    });
    this.#saveState(STATE_CLONE);
  }
  reset() {
    const STATE_CLONE = structuredClone(this.#getState());
    const { status, moves } = this.game;

    if (status.isComplete) {
      STATE_CLONE.history.currentRoundGame.push({ moves, status });
    }
    STATE_CLONE.currentGameMoves = {};

    this.#saveState(STATE_CLONE);
  }

  #getState() {
    return this.#state;
  }
  #saveState(stateOrFn) {
    const PREVIOUSE_STATE = this.#getState();
    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(PREVIOUSE_STATE);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invalid argument passed to saveState!");
    }
    this.#state = newState;
  }
}

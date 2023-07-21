const INITIAL_VALUE = {
  currentGameMoves: [],
  history: {
    currentRoundGame: [],
    allGames: [],
  },
};

export default class Store extends EventTarget {
  #state = INITIAL_VALUE;
  constructor(key, players) {
    super();
    this.storageKey = key;
    this.players = players;
  }

  get stats() {
    const STATE = this.#getState();
    return {
      playerWithStats: this.players.map((player) => {
        const WINS = STATE.history.currentRoundGame.filter(
          (game) => game.status.winner?.id === player.id
        ).length;

        return {
          ...player,
          WINS,
        };
      }),
      ties: STATE.history.currentRoundGame.filter(
        (game) => game.status.winner === null
      ).length,
    };
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
    STATE_CLONE.currentGameMoves = [];

    this.#saveState(STATE_CLONE);
  }

  newRound() {
    this.reset();

    const STATE_CLONE = structuredClone(this.#getState());
    STATE_CLONE.history.allGames.push(...STATE_CLONE.history.currentRoundGame);
    STATE_CLONE.history.currentRoundGame = [];

    this.#saveState(STATE_CLONE);
  }
  #getState() {
    const ITEM = window.localStorage.getItem(this.storageKey);
    return ITEM ? JSON.parse(ITEM) : INITIAL_VALUE;
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
    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
    this.dispatchEvent(new Event('statechange'))
  }
}

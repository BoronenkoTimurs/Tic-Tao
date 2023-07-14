const INITIAL_VALUE = {
  moves: [],
};

export default class Store {
  #state = INITIAL_VALUE;
  constructor(players) {
    this.players = players;
  }

  get game() {
    const STATE = this.#getState();

    const CURRENT_PLAYER = this.players[STATE.moves.length % 2];

    return {};
  }
  playerMove(squareId) {
    const STATE = this.#getState();
    const STATE_CLONE = structuredClone(STATE);

    STATE_CLONE.moves.push({
      squareId,
      player: this.game.CURRENT_PLAYER,
    });
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

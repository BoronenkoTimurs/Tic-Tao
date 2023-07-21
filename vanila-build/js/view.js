import Store from "./store.js";

export default class View {
  $ = {};
  $$ = {};

  constructor() {
    this.$.iconDown = this.#qs('[data-id="down"]');
    this.$.iconUp = this.#qs('[data-id="up"]');

    this.$.turn = this.#qs('[data-id="turn"]');
    this.$.turnText = this.#qs('[data-id="turn-text"]');

    this.$.menu = this.#qs('[data-id="menu"]');
    this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
    this.$.menuItem = this.#qs('[data-id="menu-items"]');
    this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
    this.$.reloadBtn = this.#qs('[data-id="reload-btn"]');

    this.$.p1Wins = this.#qs('[data-id="p1_wins"]');
    this.$.p2Wins = this.#qs('[data-id="p2_wins"]');
    this.$.ties = this.#qs('[data-id="ties"]');

    this.$.modal = this.#qs('[data-id="modal"]');
    this.$.modalContent = this.#qs('[data-id="modal-content"]');
    this.$.modalText = this.#qs('[data-id="modal-text"]');
    this.$.modalBtn = this.#qs('[data-id="modal-btn"]');

    this.$$.square = this.#qsAll('[data-id="square"]');

    // UI-only event listeners
    this.$.menuBtn.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }
  render(game, stats) {
    const { playerWithStats, ties } = stats;
    const {
      moves,
      CURRENT_PLAYER,
      status: { isComplete, winner },
    } = game;
    this.#updateScoreboard(
      playerWithStats[0].WINS,
      playerWithStats[1].WINS,
      ties
    );
  }

  // Register all the event listeneres
  bindGameResetEvent(handler) {
    this.$.resetBtn.addEventListener("click", handler);
  }
  bindPlayAgainEvent(handler) {
    this.$.modalBtn.addEventListener("click", handler);
  }
  bindNewRoundEvent(handler) {
    this.$.reloadBtn.addEventListener("click", handler);
  }
  bindPlayerMoveEvent(handler) {
    this.$$.square.forEach((square) => {
      square.addEventListener("click", () => handler(square));
    });
  }
  // DOMhelper method
  #updateScoreboard(p1Wins, p2Wins, ties) {
    this.$.p1Wins.innerText = `${p1Wins} wins`;
    this.$.p2Wins.innerText = `${p2Wins} wins`;
    this.$.ties.innerText = `${ties}`;
  }
  #openModal(message) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.innerText = message;
  }
  #clearMoves() {
    this.$$.square.forEach((square) => {
      square.replaceChildren();
    });
  }
  #closeModal() {
    this.$.modal.classList.add("hidden");
  }
  #closeMenu() {
    this.$.menuBtn.classList.toggle("border");
    this.$.menuItem.classList.toggle("hidden");
  }
  #initializeMoves(moves) {
    this.$$.square.forEach((square) => {
      const EXISTING_MOVE = moves.find((move) => move.squareId === +square.id);

      if (EXISTING_MOVE) {
        this.handlePlayerMove(square, EXISTING_MOVE.player);
      }
    });
  }
  #handlePlayerMove(squareEl, player) {
    const SQUARE_ICON = document.createElement("i");

    SQUARE_ICON.classList.add("fa-solid", player.iconClass, player.colorClass);
    squareEl.replaceChildren(SQUARE_ICON);
  }

  #setTurnIndicator(player) {
    const TURN_ICON = document.createElement("i");
    const TURN_LABEL = document.createElement("p");

    TURN_ICON.classList.add("fa-solid", player.colorClass, player.iconClass);

    TURN_LABEL.classList.add(player.colorClass);
    TURN_LABEL.innerHTML = `${player.name}, you are up!`;

    this.$.turn.replaceChildren(TURN_ICON, TURN_LABEL);
  }
  #toggleMenu() {
    this.$.menuBtn.classList.toggle("border");
    this.$.menuItem.classList.toggle("hidden");
    this.$.iconDown.classList.toggle("hidden");
    this.$.iconUp.classList.toggle("hidden");
  }
  #qs(selector, parent) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);

    if (!el) throw new Error("Could not find elements!");

    return el;
  }
  #qsAll(selector) {
    const elList = document.querySelectorAll(selector);

    if (!elList) throw new Error("Could not find elements!");

    return elList;
  }
}

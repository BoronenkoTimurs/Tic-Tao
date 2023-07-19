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
  openModal(message) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.innerText = message;
  }
  clearMoves() {
    this.$$.square.forEach((square) => {
      square.replaceChildren();
    });
  }
  closeAll() {
    this.#closeMenu();
    this.closeModal();
  }
  closeModal() {
    this.$.modal.classList.add("hidden");
  }
  #closeMenu() {
    this.$.menuBtn.classList.toggle("border");
    this.$.menuItem.classList.toggle("hidden");
    // this.$.iconDown.classList.toggle("hidden");
    // this.$.iconUp.classList.toggle("hidden");
  }
  #toggleMenu() {
    this.$.menuBtn.classList.toggle("border");
    this.$.menuItem.classList.toggle("hidden");
    this.$.iconDown.classList.toggle("hidden");
    this.$.iconUp.classList.toggle("hidden");
  }
  handlePlayerMove(squareEl, player) {
    const SQUARE_ICON = document.createElement("i");

    SQUARE_ICON.classList.add("fa-solid", player.iconClass, player.colorClass);
    squareEl.replaceChildren(SQUARE_ICON);
  }

  setTurnIndicator(player) {
    const TURN_ICON = document.createElement("i");
    const TURN_LABEL = document.createElement("p");

    TURN_ICON.classList.add("fa-solid", player.colorClass, player.iconClass);

    TURN_LABEL.classList.add(player.colorClass);
    TURN_LABEL.innerHTML = `${player.name}, you are up!`;

    this.$.turn.replaceChildren(TURN_ICON, TURN_LABEL);
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

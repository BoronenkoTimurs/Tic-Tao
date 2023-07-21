import Store from "./store.js";
import View from "./view.js";

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];
function init() {
  const view = new View();
  const store = new Store("live-t3-storage-key", players);
  
  // Change your tab state
  store.addEventListener("statechange", () => {
    view.render(store.game, store.stats);
  });
  // Change other tab state
  window.addEventListener("storage", () => {
    console.log("State changed from another tab");

    view.render(store.game, store.stats);
  });
  // The first load of doc
  view.render(store.game, store.stats);

  view.bindGameResetEvent((event) => {
    store.reset();
  });
  view.bindNewRoundEvent((event) => {
    store.newRound();
  });
  view.bindPlayAgainEvent((event) => {
    store.reset();
  });
  view.bindPlayerMoveEvent((square) => {
    const EXITING_MOVE = store.game.moves.find(
      (move) => move.squareId === +square.id
    );
    if (EXITING_MOVE) {
      return;
    }

    store.playerMove(+square.id);
  });
}

window.addEventListener("load", init);
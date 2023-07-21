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

  // function initView() {
  //   view.closeModal();
  //   view.clearMoves();
  //   view.setTurnIndicator(store.game.CURRENT_PLAYER);
  //   view.updateScoreboard(
  //     store.stats.playerWithStats[0].WINS,
  //     store.stats.playerWithStats[1].WINS,
  //     store.stats.ties
  //   );
  //   view.initializeMoves(store.game.moves);
  // }
  window.addEventListener("storage", () => {
    console.log("State changed from another tab");
    view.render(store.game, store.stats);
  });
  view.render(store.game, store.stats);

  view.bindGameResetEvent((event) => {
    store.reset();

    view.closeMenu();
    view.render(store.game, store.stats);
  });
  view.bindNewRoundEvent((event) => {
    store.newRound();

    view.closeMenu();
    view.render(store.game, store.stats);
  });
  view.bindPlayAgainEvent((event) => {
    view.closeModal();

    store.reset();

    view.clearMoves();
    view.setTurnIndicator(store.game.CURRENT_PLAYER);
    view.updateScoreboard(
      store.stats.playerWithStats[0].WINS,
      store.stats.playerWithStats[1].WINS,
      store.stats.ties
    );
  });
  view.bindPlayerMoveEvent((square) => {
    const EXITING_MOVE = store.game.moves.find(
      (move) => move.squareId === +square.id
    );
    if (EXITING_MOVE) {
      return;
    }
    view.handlePlayerMove(square, store.game.CURRENT_PLAYER);

    store.playerMove(+square.id);

    if (store.game.status.isComplete) {
      view.openModal(
        store.game.status.winner
          ? `${store.game.status.winner.name} wins!`
          : "Tie. Lets try again!"
      );
      return;
    }

    view.setTurnIndicator(store.game.CURRENT_PLAYER);
  });
}

window.addEventListener("load", init);

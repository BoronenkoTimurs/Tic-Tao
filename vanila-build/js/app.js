import Store from "./store.js";
import View from "./view.js";

const App = {
  $: {
    iconDown: document.querySelector('[data-id="down"]'),
    iconLeft: document.querySelector('[data-id="left"]'),

    turn: document.querySelector('[data-id="turn"]'),
    turnText: document.querySelector('[data-id="turn-text"]'),

    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector('[data-id="menu-items"]'),
    resetBtn: document.querySelector('[data-id="reset-btn"]'),
    reloadBtn: document.querySelector('[data-id="reload-btn"]'),
    square: document.querySelectorAll('[data-id="square"]'),

    modal: document.querySelector('[data-id="modal"]'),
    modalContent: document.querySelector('[data-id="modal-content"]'),
    modalText: document.querySelector('[data-id="modal-text"]'),
    modalBtn: document.querySelector('[data-id="modal-btn"]'),
  },
  state: {
    moves: [],
  },
  getGameStatus(moves) {
    const PLAYER_ONE_MOVES = moves
      .filter((moves) => moves.playerId === 1)
      .map((move) => +move.squareId);
    const PLAYER_TWO_MOVES = moves
      .filter((moves) => moves.playerId === 2)
      .map((move) => move.squareId);
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
    let winner = 0;
    WINNING_COMBINATIONS.forEach((comb) => {
      const PLAYER_ONE_WINS = comb.every((v) => PLAYER_ONE_MOVES.includes(v));
      const PLAYER_TWO_WINS = comb.every((v) => PLAYER_TWO_MOVES.includes(v));

      if (PLAYER_ONE_WINS) winner = 1;
      if (PLAYER_TWO_WINS) winner = 2;
    });
    return {
      status: moves.length === 9 || winner !== 0 ? "Game End" : "In-progress",
      winner: winner,
    };
  },
  init() {
    App.registerLisenerEvents();
  },
  registerLisenerEvents() {
    // DONE
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
      App.$.iconDown.classList.toggle("hidden");
      App.$.iconLeft.classList.toggle("hidden");
    });
    // TODO
    App.$.resetBtn.addEventListener("click", (event) => {
      console.log("reset");
    });
    // TODO
    App.$.reloadBtn.addEventListener("click", (event) => {
      console.log("new round");
    });
    // DONE
    App.$.modalBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.square.forEach((square) => square.replaceChildren());
      App.$.modal.classList.add("hidden");
    });
    // TODO
    App.$.square.forEach((square) => {
      square.addEventListener("click", (event) => {
        // Check is square have some child inside
        if (square.hasChildNodes()) return;

        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);

        const SQUARE_ICON = document.createElement("i");
        const TURN_ICON = document.createElement("i");
        const TURN_LABEL = document.createElement("p");
        const LASTMOVE = App.state.moves.at(-1);
        const CURRENT_PLAYER =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(LASTMOVE.playerId);
        const NEXT_PLAYER = getOppositePlayer(CURRENT_PLAYER);

        TURN_LABEL.innerText = `Player ${NEXT_PLAYER}, you ar up!`;

        // Put X or O depends of state of CURRENTPLAYER
        if (CURRENT_PLAYER === 1) {
          SQUARE_ICON.classList.add("fa-solid", "fa-x", "cross");
          TURN_ICON.classList.add("fa-solid", "fa-o", "cyrcle", "yellow");
          TURN_LABEL.classList.add("yellow");
        } else {
          SQUARE_ICON.classList.add("fa-solid", "fa-o", "cyrcle");
          TURN_ICON.classList.add("fa-solid", "fa-x", "cross");
          TURN_LABEL.classList.add("turquoise");
        }
        App.$.turn.replaceChildren(TURN_ICON, TURN_LABEL);

        App.state.moves.push({
          squareId: +square.id,
          playerId: CURRENT_PLAYER,
        });

        // Change(update) state of currentPlayer
        App.state.moves.CURRENT_PLAYER = CURRENT_PLAYER === 1 ? 2 : 1;

        // Give icon for square
        square.replaceChildren(SQUARE_ICON);

        // Change Turn text
        App.$.turnText.classList.replace("dsa", "YOu!");
        // Check if there is a winner
        const GAME = App.getStatus(App.state.moves);

        if (GAME.status === "Game End") {
          let message = "";

          if (GAME.winner) {
            App.$.modal.classList.toggle("hidden");
            message = `Player ${GAME.winner} wins!`;
          } else {
            App.$.modal.classList.toggle("hidden");
            message = "The Tie!";
          }
          App.$.modalText.textContent = message;
        }
      });
    });
  },
};

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
  const store = new Store(players);
  console.log(store.game);

  view.bindPlayAgainEvent((event) => {
    view.closeModal();

    store.reset();

    view.clearMoves();
    view.setTurnIndicator(store.game.CURRENT_PLAYER);

    console.log(store.stats);
  });
  view.bindGameResetEvent((event) => {
    view.closeAll();

    store.reset();

    view.clearMoves();
    view.setTurnIndicator(store.game.CURRENT_PLAYER);

    console.log(store.stats);
  });

  view.bindNewRoundEvent((event) => {
    console.log("new round");
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

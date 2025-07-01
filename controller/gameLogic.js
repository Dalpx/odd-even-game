//Lógica para el Drag and Drop
document.addEventListener("DOMContentLoaded", () => {
    const numbers = document.querySelectorAll(".number");
    const squares = document.querySelectorAll(".square");

    let draggedNumber = null; //Variable para almacenar el numero que se está arrastrando
    let draggedNumberValue = null;
    let player_turn = null;

    // Initialize scores from localStorage or set to 0
    let playerRedScore = parseInt(localStorage.getItem('playerRedScore')) || 0;
    let playerBlueScore = parseInt(localStorage.getItem('playerBlueScore')) || 0;

    // Update scoreboard display on load
    updateScoreboardDisplay(playerRedScore, playerBlueScore);

    // Eventos para los numeros (Elementos que se pueden arrastrar)
    numbers.forEach((number) => {
        number.addEventListener("dragstart", (e) => {
            if (e.target.getAttribute("draggable") === "false") {
                e.preventDefault();
                return;
            }
            draggedNumber = e.target;
            draggedNumberValue = e.target.textContent;

            // Añade una clase para dar retroalimentación visual al arrastrar
            setTimeout(() => {
                e.target.classList.add("dragging");
            });
        });

        number.addEventListener("dragend", (e) => {
            // Elimina la clase 'dragging'cuando el arrastre termina
            e.target.classList.remove("dragging");
            // draggedNumberValue = null;
        });
    });

    // Eventos para los cuadrados (zonas de soltar)
    squares.forEach((square) => {
        // Permite soltar elementos sobrea la zona
        square.addEventListener("dragover", (e) => {
            e.preventDefault();
            square.classList.add("hovered");
        });

        // Elimina el estilo de hover cuando el elemento arrastrado sale de la zona
        square.addEventListener("dragleave", (e) => {
            square.classList.remove("hovered");
        });

        // Maneja el evento de soltar
        square.addEventListener("drop", (e) => {
            e.preventDefault();

            const isSquareEmpty = square.textContent.trim() === "";
            console.log(isSquareEmpty);
            if (draggedNumberValue !== null && isSquareEmpty) {
                square.textContent = draggedNumberValue;

                square.classList.remove("hovered");

                if (draggedNumber) {
                    // Rellenar con el color adecuado dependiendo del jugador
                    if (draggedNumberValue % 2 !== 0) {
                        square.classList.add("slot-filled-p1");
                        player_turn = switchPlayers(true); // True for Red (odd numbers)
                    } else {
                        square.classList.add("slot-filled-p2");
                        player_turn = switchPlayers(false); // False for Blue (even numbers)
                    }
                    draggedNumber.setAttribute("draggable", "false");
                    draggedNumber.classList.add("disabled");
                }

                draggedNumber = null;
                draggedNumberValue = null;
            } else if (!isSquareEmpty) {
                console.log("La zona ya contiene un valor y no se puede reemplazar");
            }

            // Función para validar si se ha completado una linea
            checkMagicLine(player_turn);
        });
    });

    // Initial player turn setup
    switchPlayers(false); // Start with Player Red's turn (odd numbers)
});

// FUNCIONES PARA MANEJAR TURNOS
function switchPlayers(player_turn) {
    const pares = document.querySelectorAll(".number-even");
    const impares = document.querySelectorAll(".number-odd");

    if (player_turn) { // Current turn was Red (odd numbers), switch to Blue (even numbers)
        console.log("Turno del jugador azul");
        impares.forEach((impar) => {
            impar.setAttribute("draggable", "false");
            impar.classList.add("disabled_turn");
        });
        pares.forEach((par) => {
            par.classList.remove("disabled_turn");
            par.setAttribute('draggable', 'true');
        });
        return false; // Return false to indicate it's now Blue's turn
    } else { // Current turn was Blue (even numbers), switch to Red (odd numbers)
        console.log("Turno del jugador rojo");
        pares.forEach((par) => {
            par.setAttribute("draggable", "false");
            par.classList.add("disabled_turn");
        });
        impares.forEach((impar) => {
            impar.classList.remove("disabled_turn");
            impar.setAttribute('draggable', 'true');
        });
        return true; // Return true to indicate it's now Red's turn
    }
}


// FUNCIONES PARA ACTUALIZAR EL SCOREBOARD
function updateScoreboardDisplay(redScore, blueScore) {
    document.getElementById("player-red").textContent = redScore;
    document.getElementById("player-blue").textContent = blueScore;
}

function QuienCoñoGano(player_turn) {
    let playerRedScore = parseInt(localStorage.getItem('playerRedScore')) || 0;
    let playerBlueScore = parseInt(localStorage.getItem('playerBlueScore')) || 0;

    if (!player_turn) { // True means Red was the last player to make a move, so Red won
        playerRedScore++;
        setTimeout(() => {
            alert("¡Rojo ganó la ronda!");
        }, 350);
    } else { // False means Blue was the last player to make a move, so Blue won
        playerBlueScore++;
        setTimeout(() => {
            alert("¡Azul ganó la ronda!");
        }, 350);

    }



    localStorage.setItem('playerRedScore', playerRedScore);
    localStorage.setItem('playerBlueScore', playerBlueScore);
    updateScoreboardDisplay(playerRedScore, playerBlueScore);

    if (playerRedScore === 3 || playerBlueScore === 3) {
        setTimeout(() => {
            alert("¡Un jugador ha alcanzado 3 victorias! El marcador se reiniciará.");
        }, 350);


        localStorage.setItem('playerRedScore', 0);
        localStorage.setItem('playerBlueScore', 0);
        setTimeout(() => {
            updateScoreboardDisplay(0, 0);
            // Redirect to index.html after game reset
            window.location.href = '../index.html';
        }, 1000);

    }
    setTimeout(() => {
        resetGame();
    }, 1000);
}


function resetGame() {
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
        square.textContent = "";
        square.classList.remove("slot-filled-p1", "slot-filled-p2");
    });

    const numbers = document.querySelectorAll(".number");
    numbers.forEach((number) => {
        number.setAttribute("draggable", "true");
        number.classList.remove("disabled", "disabled_turn");
    });

    // Set initial turn after resetting the game
    switchPlayers(false); // Start with Player Red's turn (odd numbers)
}

function checkDraw() {
    const squares = document.querySelectorAll(".square");
    let allFilled = true;
    squares.forEach(square => {
        if (square.textContent.trim() === "") {
            allFilled = false;
        }
    });
    return allFilled;
}

function checkMagicLine(player_turn) {
    const amongus = document.querySelectorAll(".square");
    const matriz = [];
    let someoneWon = false; // Flag to track if someone has won

    amongus.forEach((sus) => {
        matriz.push(parseInt(sus.textContent));
    });

    console.log(matriz);
    //Chequear filas a lo bruto
    if (matriz[0] + matriz[1] + matriz[2] === 15) {
        QuienCoñoGano(player_turn);
    }
    if (matriz[3] + matriz[4] + matriz[5] === 15) {
        QuienCoñoGano(player_turn);
    }
    if (matriz[6] + matriz[7] + matriz[8] === 15) {
        QuienCoñoGano(player_turn);
    }

    //Chequear columnas a lo bruto
    if (matriz[0] + matriz[3] + matriz[6] === 15) {
        QuienCoñoGano(player_turn);
        
    }
    if (matriz[1] + matriz[4] + matriz[7] === 15) {
        QuienCoñoGano(player_turn);
        
    }
    if (matriz[2] + matriz[5] + matriz[8] === 15) {
        QuienCoñoGano(player_turn);
        
    }

    //Chequear diagonal a lo super bruto
    if (matriz[0] + matriz[4] + matriz[8] === 15) {
        QuienCoñoGano(player_turn);
    
    }
    if (matriz[2] + matriz[4] + matriz[6] === 15) {
        QuienCoñoGano(player_turn);
        con
    }

    // Check for a draw only if no one has won
    if (!someoneWon && checkDraw()) {
        alert("¡Es un empate!");
        setTimeout(() => {
            resetGame();
        }, 1000);
    }

}
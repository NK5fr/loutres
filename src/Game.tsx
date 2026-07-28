import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Game() {

    function createBoard(otter : { i : number, j : number }[]) {
        const board : string[][] = [];
        for(let i = 0; i < 15; i++) {
            board.push(new Array(15).fill("empty"));
        }
        otter.forEach(slice => board[slice.i][slice.j] = "otter");
        if(!fish) {
            let i = Math.floor(Math.random() * 15);
            let j = Math.floor(Math.random() * 15);
            while(board[i][j] === "otter") {
                i = Math.floor(Math.random() * 15);
                j = Math.floor(Math.random() * 15);
            }
            fish = { i: i, j: j };
        }
        board[fish.i][fish.j] = "fish";
        return board;
    }

    function otterValid(otter : { i : number, j : number }[]) {
        let head = otter[0];
        if(head.i < 0 || head.i >= 15 || head.j < 0 || head.j >= 15) {
            return false;
        }
        let valid = true;
        let i = 1;
        while(i < otter.length && valid) {
            if(otter[i].i === head.i && otter[i].j === head.j) {
                valid = false;
            }
            i++;
        }
        return valid;
    }

    function otterMove(otter : { i : number, j : number }[], direction : string) {
        const lastSlice = otter[otter.length - 1];
        for(let i = otter.length - 1; i > 0; i--) {
            otter[i] = { i: otter[i - 1].i, j: otter[i - 1].j };
        }
        if(direction === "up") {
            otter[0].i -= 1;
        } else if(direction === "down") {
            otter[0].i += 1;
        } else if(direction === "left") {
            otter[0].j -= 1;
        } else if(direction === "right") {
            otter[0].j += 1;
        }
        if(otter[0].i === fish?.i && otter[0].j === fish?.j) {
            otter.push(lastSlice);
            fish = null;
        }
        return otter;
    }

    function handleKeyDown(event : KeyboardEvent) {
        if(event.key === "ArrowUp") {
            event.preventDefault();
            direction = direction === "down" ? direction : "up";
        } else if(event.key === "ArrowDown") {
            event.preventDefault();
            direction = direction === "up" ? direction : "down";
        } else if(event.key === "ArrowLeft") {
            event.preventDefault();
            direction = direction === "right" ? direction : "left";
        } else if(event.key === "ArrowRight") {
            event.preventDefault();
            direction = direction === "left" ? direction : "right";
        }
    }

    function handleReset() {
        setReset(false);
        setBoard(createBoard([{ i: 7, j: 4 }, { i: 7, j: 5 }]));
        fish = null;
        direction = "right";
        play();
    }

    let direction = "right";
    let fish : { i: number, j: number } | null = null;
    const [board, setBoard] = useState<string[][]>(createBoard([{ i: 7, j: 4 }, { i: 7, j: 5 }]));
    const [reset, setReset] = useState<boolean>(false);

    function play() {
        let otter = [{ i: 7, j: 4 }, { i: 7, j: 5 }];
        document.addEventListener("keydown", handleKeyDown);
        otter = otterMove(otter, direction);
        let stop = !otterValid(otter);
        const interval = setInterval(() => {
            if(!stop) {
                setBoard(createBoard(otter));
                otter = otterMove(otter, direction);
                stop = !otterValid(otter);
            } else {
                clearInterval(interval);
                document.removeEventListener("keydown", handleKeyDown);
                setReset(true);
            }
        }, 250);
    }

    useEffect(() => {
        play();
    }, []);

    return (
        <main>
            <h1>Jeux de la loutre</h1>
            {reset && (
                <div className="reset">
                    <p>Vous avez perdu !</p>
                    <button onClick={handleReset}>Rejouer</button>
                </div>
            )}
            <div className="game-board">
                {board.map((row, i) => (
                    <div className="game-row" key={i}>
                        {row.map((cell, j) => (
                            <div className={`game-cell ${cell}`} key={j}></div>
                        ))}
                    </div>
                ))}
            </div>
        </main>
    );
}
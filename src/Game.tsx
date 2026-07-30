import { useEffect, useState } from "react"; 
import { data } from "./gameData";

export default function Game() {

    function createBoard(otter : { i : number, j : number, direction : string }[]) {
        const board : string[][] = [];
        for(let i = 0; i < 15; i++) {
            board.push(new Array(15).fill("empty"));
        }
        otter.forEach(slice => board[slice.i][slice.j] = "otter");
        if(!data.fish) {
            let i = Math.floor(Math.random() * 15);
            let j = Math.floor(Math.random() * 15);
            while(board[i][j] === "otter") {
                i = Math.floor(Math.random() * 15);
                j = Math.floor(Math.random() * 15);
            }
            data.fish = { i: i, j: j };
        }
        board[data.fish.i][data.fish.j] = "fish";
        return board;
    }

    function otterValid() {
        let head = data.otter[0];
        if(head.i < 0 || head.i >= 15 || head.j < 0 || head.j >= 15) {
            return false;
        }
        let valid = true;
        let i = 1;
        while(i < data.otter.length && valid) {
            if(data.otter[i].i === head.i && data.otter[i].j === head.j) {
                valid = false;
            }
            i++;
        }
        return valid;
    }

    function otterMove() {
        if(data.direction === "" && data.moves.length === 0) {
            return data.otter;
        }
        const lastSlice = data.otter[data.otter.length - 1];
        for(let i = data.otter.length - 1; i > 0; i--) {
            data.otter[i] = { i: data.otter[i - 1].i, j: data.otter[i - 1].j, direction: data.otter[i - 1].direction };
        }
        if(data.moves.length > 0) {
            data.direction = data.moves.shift()!;
        }
        if(data.direction === "up") {
            data.otter[0].i -= 1;
            data.otter[0].direction = "up";
        } else if(data.direction === "down") {
            data.otter[0].i += 1;
            data.otter[0].direction = "down";
        } else if(data.direction === "left") {
            data.otter[0].j -= 1;
            data.otter[0].direction = "left";
        } else if(data.direction === "right") {
            data.otter[0].j += 1;
            data.otter[0].direction = "right";
        }
        if(data.otter[0].i === data.fish?.i && data.otter[0].j === data.fish?.j) {
            data.otter.push(lastSlice);
            setScore(data.otter.length);
            data.fish = null;
        }
        
        return data.otter;
    }

    function handleKeyDown(event : KeyboardEvent) {
        if(event.key === "ArrowUp") {
            event.preventDefault();
            if(data.moves.length != 0 && data.moves[data.moves.length - 1] !== "down" || data.direction !== "down") {
                data.moves.push("up");
            }
        } else if(event.key === "ArrowDown") {
            event.preventDefault();
            if(data.moves.length != 0 && data.moves[data.moves.length - 1] !== "up" || data.direction !== "up" ) {
                data.moves.push("down");
            }
        } else if(event.key === "ArrowLeft") {
            event.preventDefault();
            if((data.moves.length != 0 && data.moves[data.moves.length - 1] !== "right") || (data.direction !== "" && data.direction !== "right")) {
                data.moves.push("left");
            }
        } else if(event.key === "ArrowRight") {
            event.preventDefault();
            if(data.moves.length != 0 && data.moves[data.moves.length - 1] !== "left" || data.direction !== "left") {
                data.moves.push("right");
            }
        } else if(event.key === "Escape") {
            event.preventDefault();
            data.moves = [];
            data.direction = "";
        }
    }

    function handleReset() {
        data.fish = null;
        data.direction = "";
        data.moves = [];
        data.otter = [{ i: 7, j: 4, direction: "right"}, { i: 7, j: 5, direction: "right"}];
        setReset(false);
        setScore(data.otter.length);
        setPlayCounter(pc => pc + 1);
    }

    const [board, setBoard] = useState<string[][]>();
    const [reset, setReset] = useState<boolean>(false);
    const [score, setScore] = useState<number>(data.otter.length);
    const [playCounter, setPlayCounter] = useState<number>(0);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        setBoard(createBoard(data.otter));
        otterMove();
        let stop = !otterValid();
        const interval = setInterval(() => {
            if(!stop) {
                setBoard(createBoard(data.otter));
                otterMove();
                stop = !otterValid();
            } else {
                document.removeEventListener("keydown", handleKeyDown);
                clearInterval(interval);
                setReset(true);
            }
        }, 200);
        return () => {
            if(!stop) {
                document.removeEventListener("keydown", handleKeyDown);
                clearInterval(interval);
            }
        }
    }, [playCounter]);

    return (
        <main>
            <h1>Jeux de la loutre</h1>
            <p>Appuyez sur les <span className="highlight">flèches directionnelles</span> pour déplacer la loutre et sur <span className="highlight">Échap</span> pour faire pause.</p>
            {reset && (
                <div className="reset">
                    <p>Vous avez perdu !</p>
                    <button onClick={handleReset}>Rejouer</button>
                </div>
            )}
            <p className="score">Score : {score}</p>
            <div className="game-board">
                {board?.map((row, i) => (
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
import { useState } from "react";
import "./App.css";

const createEmptyBoard = () =>
  Array(9)
    .fill()
    .map(() => Array(9).fill(""));

export default function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [message, setMessage] = useState("");
  const [conflictingCells, setConflictingCells] = useState([]);

  const handleChange = (row, col, value) => {
    const val = value.replace(/[^1-9]/g, "").slice(0, 1);

    const updatedBoard = board.map((r) => [...r]);
    updatedBoard[row][col] = val;

    setBoard(updatedBoard);
    setMessage("");
    setConflictingCells([]);
  };

  const validateSudoku = () => {
    const conflicts = [];

    const addConflict = (r, c) => {
      const key = `${r}-${c}`;
      if (!conflicts.some((item) => item.key === key)) {
        conflicts.push({ row: r, col: c, key });
      }
    };

    // Rows
    for (let row = 0; row < 9; row++) {
      const seen = {};

      for (let col = 0; col < 9; col++) {
        const value = board[row][col];

        if (!value) continue;

        if (seen[value] !== undefined) {
          addConflict(row, col);
          addConflict(row, seen[value]);
        } else {
          seen[value] = col;
        }
      }
    }

    // Columns
    for (let col = 0; col < 9; col++) {
      const seen = {};

      for (let row = 0; row < 9; row++) {
        const value = board[row][col];

        if (!value) continue;

        if (seen[value] !== undefined) {
          addConflict(row, col);
          addConflict(seen[value], col);
        } else {
          seen[value] = row;
        }
      }
    }

    // 3x3 Boxes
    for (let boxRow = 0; boxRow < 9; boxRow += 3) {
      for (let boxCol = 0; boxCol < 9; boxCol += 3) {
        const seen = {};

        for (let r = boxRow; r < boxRow + 3; r++) {
          for (let c = boxCol; c < boxCol + 3; c++) {
            const value = board[r][c];

            if (!value) continue;

            if (seen[value]) {
              addConflict(r, c);
              addConflict(seen[value].row, seen[value].col);
            } else {
              seen[value] = { row: r, col: c };
            }
          }
        }
      }
    }

    if (conflicts.length > 0) {
      setConflictingCells(conflicts);
      setMessage("Invalid Sudoku! Conflicts found.");
    } else {
      setConflictingCells([]);
      setMessage("Sudoku is valid so far!");
    }
  };

  const clearBoard = () => {
    setBoard(createEmptyBoard());
    setMessage("");
    setConflictingCells([]);
  };

  const isConflict = (row, col) =>
    conflictingCells.some(
      (cell) => cell.row === row && cell.col === col
    );

  return (
    <div className="container">
      <h1>Sudoku Validator</h1>

      <p>Enter numbers 1-9 and validate the board.</p>

      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${
                isConflict(rowIndex, colIndex) ? "invalid" : ""
              }`}
              value={cell}
              onChange={(e) =>
                handleChange(rowIndex, colIndex, e.target.value)
              }
              maxLength={1}
            />
          ))
        )}
      </div>

      <div className="actions">
        <button onClick={validateSudoku}>Validate</button>
        <button onClick={clearBoard}>Clear</button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
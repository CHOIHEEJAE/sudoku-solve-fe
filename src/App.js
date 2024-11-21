import React, {useState} from 'react';
import axios from 'axios';
import './SudokuSolver.css';  // CSS 파일 import

const SudokuSolver = () => {
    const [board, setBoard] = useState(Array.from({length: 9}, () => Array(9).fill(0)));
    const [solvedBoard, setSolvedBoard] = useState(null);

    // 사용자 입력 변경 처리
    const handleInputChange = (row, col, value) => {
        const newBoard = board.map((rowArray, rowIndex) => {
            if (rowIndex === row) {
                return rowArray.map((cell, colIndex) => (colIndex === col ? (value === '' ? 0 : parseInt(value)) : cell));
            }
            return rowArray;
        });
        setBoard(newBoard);
    };

    // 스도쿠 풀이 요청
    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8080/sudoku/solve', board);
            setSolvedBoard(response.data);
        } catch (error) {
            console.error(error);
            alert('Failed to solve sudoku');
        }
    };

    // 보드 렌더링
    const renderBoard = () => {
        return board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                    <input
                        key={colIndex}
                        type="number"
                        value={cell === 0 ? null : cell}
                        onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                        max="9"
                        min="0"
                        className="cell"
                    />
                ))}
            </div>
        ));
    };

    // 서버에서 응답받은 보드 렌더링
    const renderSolvedBoard = () => {
        return solvedBoard?.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                    <span key={colIndex} className="cell">
                        {cell}
                    </span>
                ))}
            </div>
        ));
    };

    // 사용자 입력과 서버 응답 구분을 위한 클래스 선택 함수
    const getCellClass = (rowIndex, colIndex) => {
        const isUserInput = board[rowIndex][colIndex] !== 0;
        const isSolved = solvedBoard && solvedBoard[rowIndex][colIndex] !== 0 && solvedBoard[rowIndex][colIndex] !== board[rowIndex][colIndex];

        if (isUserInput) {
            return 'input-cell';  // 사용자가 입력한 셀
        } else if (isSolved) {
            return 'solved-cell';  // 서버에서 해결된 셀
        } else {
            return '';  // 기본 상태
        }
    };

    return (
        <div>
            <h1>Sudoku Solver</h1>
            <div className="board">
                {renderBoard()}
            </div>
            <button onClick={handleSubmit}>Solve Sudoku</button>
            <h2>Solved Sudoku:</h2>
            <div className="solved-board">{renderSolvedBoard()}</div>
        </div>
    );
};

export default SudokuSolver;

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const imageUpload = document.getElementById('imageUpload');
  const piecesContainer = document.getElementById('pieces-container');
  const scoreEl = document.getElementById('score');

  const GRID_SIZE = 8;
  const CELL_SIZE = 45;
  let score = 0;
  let currentImageUrl = '';
  let board = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));

  // Blok növləri (Block Blast formaları)
  const SHAPES = [
    [[1, 1], [1, 1]], // 2x2 kvadrat
    [[1, 1, 1]],      // Üfüqi xətt
    [[1], [1], [1]],  // Şaquli xətt
    [[1, 0], [1, 1]], // L forması
    [[1]]             // Tək blok
  ];

  function createBoard() {
    grid.innerHTML = '';
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = r;
        cell.dataset.col = c;
        grid.appendChild(cell);
      }
    }
  }

  imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        currentImageUrl = event.target.result;
        updateBoardUI();
      };
      reader.readAsDataURL(file);
    }
  });

  function updateBoardUI() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      const r = parseInt(cell.dataset.row);
      const c = parseInt(cell.dataset.col);

      if (board[r][c] === 1) {
        cell.classList.add('filled');
        if (currentImageUrl) {
          cell.style.backgroundImage = `url(${currentImageUrl})`;
          cell.style.backgroundPosition = `-${c * CELL_SIZE}px -${r * CELL_SIZE}px`;
        } else {
          cell.style.backgroundColor = '#89b4fa';
        }
      } else {
        cell.classList.remove('filled');
        cell.style.backgroundImage = 'none';
        cell.style.backgroundColor = '#45475a';
      }
    });
  }

  function generatePieces() {
    piecesContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const pieceDiv = document.createElement('div');
      pieceDiv.classList.add('piece');
      pieceDiv.style.gridTemplateColumns = `repeat(${randomShape[0].length}, 25px)`;

      randomShape.forEach((row, rIdx) => {
        row.forEach((val, cIdx) => {
          const pCell = document.createElement('div');
          pCell.classList.add('piece-cell');
          if (val === 0) pCell.style.visibility = 'hidden';
          else if (currentImageUrl) {
            pCell.style.backgroundImage = `url(${currentImageUrl})`;
          }
          pieceDiv.appendChild(pCell);
        });
      });

      // Sadəclick əsaslı yerləşdirmə simulyasiyası
      pieceDiv.addEventListener('click', () => {
        placePieceOnBoard(randomShape);
      });

      piecesContainer.appendChild(pieceDiv);
    }
  }

  function placePieceOnBoard(shape) {
    // Sadəcə ilk boş tapılan yerə yerləşdirir (test üçün)
    let placed = false;
    for (let r = 0; r <= GRID_SIZE - shape.length; r++) {
      for (let c = 0; c <= GRID_SIZE - shape[0].length; c++) {
        let canFit = true;
        for (let sr = 0; sr < shape.length; sr++) {
          for (let sc = 0; sc < shape[0].length; sc++) {
            if (shape[sr][sc] === 1 && board[r + sr][c + sc] === 1) {
              canFit = false;
            }
          }
        }
        if (canFit && !placed) {
          for (let sr = 0; sr < shape.length; sr++) {
            for (let sc = 0; sc < shape[0].length; sc++) {
              if (shape[sr][sc] === 1) {
                board[r + sr][c + sc] = 1;
              }
            }
          }
          score += 10;
          scoreEl.textContent = score;
          placed = true;
        }
      }
    }
    
    if (placed) {
      updateBoardUI();
      // Əgər fiqurlar bitdisə yenilərini gətir
      if (piecesContainer.children.length <= 1) {
        generatePieces();
      }
    }
  }

  createBoard();
  generatePieces();
});
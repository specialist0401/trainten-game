// 게임 상태 변수
let GRID_WIDTH = 10; // 10으로 고정
let GRID_HEIGHT = 10; // 10으로 고정
const TARGET_SUM = 10;

let grid = [];
let score = 0;
let timer = 90;
let timerInterval;
let gameActive = false;

let isSelecting = false;
let startX, startY;
let currentX, currentY;
let selectionBox = null;
let selectedCells = [];

// DOM 요소 참조
let gridElement;
let scoreElement;
let timerElement;
let currentSumElement;
let statusElement;
let gameOverElement;
let finalScoreElement;
let startScreenElement;
let gameContentElement;
let brainAgeMessageElement; // '두뇌 나이' 메시지 표시 요소

document.addEventListener('DOMContentLoaded', function() {
  gridElement = document.getElementById('trainGrid');
  scoreElement = document.getElementById('score');
  timerElement = document.getElementById('timer');
  currentSumElement = document.getElementById('currentSum');
  statusElement = document.getElementById('status');
  gameOverElement = document.getElementById('gameOver');
  finalScoreElement = document.getElementById('finalScore');
  startScreenElement = document.getElementById('startScreen');
  gameContentElement = document.getElementById('gameContent');
  brainAgeMessageElement = document.getElementById('brainAgeMessage'); // 요소 참조 추가

  startScreenElement.style.display = 'block';
  gameContentElement.style.display = 'none';

  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('startBtn').addEventListener('touchstart', startGame, { passive: false });
  document.getElementById('restartBtn').addEventListener('click', restartGame);
  document.getElementById('restartBtn').addEventListener('touchstart', restartGame, { passive: false });
  document.getElementById('newGameBtn').addEventListener('click', newGame);
  document.getElementById('newGameBtn').addEventListener('touchstart', newGame, { passive: false });

  setupInteractionEvents();
  window.addEventListener('resize', handleResize);
});

function startGame(e) {
  e.preventDefault();
  startScreenElement.style.display = 'none';
  gameContentElement.style.display = 'block';
  initGame();
}

// 기기(화면 너비)에 따른 그리드 크기 조정 -> 이제 항상 10x10 및 32px 셀로 고정
function adjustGridForDevice() {
  GRID_WIDTH = 10; // 가로 10칸 고정
  GRID_HEIGHT = 10; // 세로 10칸 고정

  const cellSize = 32; // 셀 크기 32px로 고정
  const gap = 3; // 셀 간격

  // 그리드 요소 스타일 설정
  if (gridElement) {
      gridElement.style.gridTemplateColumns = `repeat(${GRID_WIDTH}, ${cellSize}px)`;
      gridElement.style.gridTemplateRows = `repeat(${GRID_HEIGHT}, ${cellSize}px)`;
      gridElement.style.gap = `${gap}px`;
  }
}

function initGame() {
  adjustGridForDevice(); // 그리드 크기 고정 설정 적용
  grid = [];
  score = 0;
  timer = 90;
  gameActive = true;
  selectedCells = [];

  scoreElement.textContent = score;
  timerElement.textContent = timer;
  statusElement.textContent = '';
  currentSumElement.textContent = '0';
  finalScoreElement.textContent = '0';
  gameOverElement.style.display = 'none';
  if (brainAgeMessageElement) { // '두뇌 나이' 메시지 초기화
    brainAgeMessageElement.textContent = '';
  }

  createGrid();
  renderGrid();

  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (gameActive) {
    timer--;
    timerElement.textContent = timer;
    if (timer <= 0) {
      endGame();
    }
  }
}

function endGame() {
  clearInterval(timerInterval);
  gameActive = false;
  finalScoreElement.textContent = score; // 최종 점수 표시

  // 👇 최종 사용자 지정 점수 구간 및 메시지 로직 👇
  let message = "";
  if (score >= 200) { // 200점 이상 (20대 수준)
    message = "🏆 대단해요! 두뇌 나이가 20대처럼 빠르고 정확합니다!";
  } else if (score >= 100) { // 100점 이상 ~ 200점 미만 (30대 수준)
    message = "👍 좋은데요! 두뇌 나이가 30대처럼 활력이 넘칩니다!";
  } else if (score >= 50) { // 50점 이상 ~ 100점 미만 (40대 수준)
    message = "😊 꾸준하시네요! 두뇌 나이가 40대처럼 안정적입니다!";
  } else { // 50점 미만
    message = "🧠 시작이 반! 두뇌를 깨우는 중입니다! 꾸준히 도전해보세요!";
  }

  // 메시지를 HTML 요소에 표시
  if (brainAgeMessageElement) {
      brainAgeMessageElement.textContent = message;
  }
  // 👆 로직 수정 완료 👆

  gameOverElement.style.display = 'flex'; // 게임 오버 화면 표시
}


function createGrid() {
  grid = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      row.push({ value: Math.floor(Math.random() * 9) + 1, isEmpty: false, x: x, y: y });
    }
    grid.push(row);
  }
}

// 그리드 데이터를 기반으로 화면 렌더링
function renderGrid() {
  if (!gridElement) return;
  gridElement.innerHTML = '';

  const cellSize = 32; // 셀 크기를 32px로 고정

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const cellData = grid[y][x];
      const cellElement = document.createElement('div');
      cellElement.className = 'train-car';
      cellElement.dataset.x = x;
      cellElement.dataset.y = y;
      cellElement.style.width = `${cellSize}px`;
      cellElement.style.height = `${cellSize}px`;

      if (cellData.isEmpty) {
        cellElement.classList.add('empty');
      } else {
        const iconElement = document.createElement('div'); iconElement.className = 'train-icon';
        const windowElement = document.createElement('div'); windowElement.className = 'train-window';
        const bottomElement = document.createElement('div'); bottomElement.className = 'train-bottom';
        const wheelLeftElement = document.createElement('div'); wheelLeftElement.className = 'train-wheel-left';
        const wheelRightElement = document.createElement('div'); wheelRightElement.className = 'train-wheel-right';
        const numberElement = document.createElement('div'); numberElement.className = 'number';
        numberElement.textContent = cellData.value;
        cellElement.appendChild(iconElement); cellElement.appendChild(windowElement);
        cellElement.appendChild(bottomElement); cellElement.appendChild(wheelLeftElement);
        cellElement.appendChild(wheelRightElement); cellElement.appendChild(numberElement);
      }
      gridElement.appendChild(cellElement);
    }
  }
  // 선택 상자(selectionBox)가 있다면 다시 맨 위로
  if (selectionBox && gridElement.contains(selectionBox)) {
      gridElement.appendChild(selectionBox);
  } else if (selectionBox) {
      // selectionBox가 gridElement 외부에 있었다면 다시 추가
      gridElement.appendChild(selectionBox);
  }
}

function setupInteractionEvents() {
    selectionBox = document.createElement('div');
    selectionBox.className = 'selection-box';
    selectionBox.style.display = 'none';
    if (gridElement) { // gridElement가 로드되었는지 확인 후 추가
        gridElement.appendChild(selectionBox);
    } else { // 아직 로드 안됐으면 DOMContentLoaded 이후 추가되도록 예약 (안전장치)
        document.addEventListener('DOMContentLoaded', () => gridElement.appendChild(selectionBox));
    }

    // 이벤트 리스너 등록 (마우스/터치)
    const addListener = (element, event, handler, options = {}) => {
        if (element) element.addEventListener(event, handler, options);
    };
    addListener(gridElement, 'mousedown', handleInteractionStart);
    addListener(window, 'mousemove', handleInteractionMove);
    addListener(window, 'mouseup', handleInteractionEnd);
    addListener(gridElement, 'touchstart', handleInteractionStart, { passive: false });
    addListener(window, 'touchmove', handleInteractionMove, { passive: false });
    addListener(window, 'touchend', handleInteractionEnd, { passive: false });
}


function handleInteractionStart(e) {
    if (!gameActive || !gridElement) return;
    if (e.type === 'mousedown' && e.button !== 0) return;
    if (e.type === 'touchstart' && e.touches.length !== 1) return;

    e.preventDefault();
    isSelecting = true;
    const pos = getRelativeCoordinates(e);
    startX = pos.x; startY = pos.y;
    currentX = startX; currentY = startY;

    if (selectionBox) {
        selectionBox.style.left = startX + 'px'; selectionBox.style.top = startY + 'px';
        selectionBox.style.width = '0px'; selectionBox.style.height = '0px';
        selectionBox.style.display = 'block';
    }
    clearCellSelection();
}

function handleInteractionMove(e) {
    if (!isSelecting || !gameActive) return;
    e.preventDefault();
    const pos = getRelativeCoordinates(e);
    currentX = pos.x; currentY = pos.y;
    updateSelectionBox();
    updateSelectedCells();
}

function handleInteractionEnd(e) {
    if (!isSelecting || !gameActive) return;
    isSelecting = false;
    if (selectionBox) selectionBox.style.display = 'none';
    checkSelection();
}

function getRelativeCoordinates(e) {
    if (!gridElement) return { x: 0, y: 0 }; // gridElement 없으면 0,0 반환
    const gridRect = gridElement.getBoundingClientRect();
    let clientX, clientY;
    if (e.type.startsWith('touch')) {
        const touch = e.touches[0] || e.changedTouches[0];
        clientX = touch.clientX; clientY = touch.clientY;
    } else {
        clientX = e.clientX; clientY = e.clientY;
    }
    const x = clientX - gridRect.left;
    const y = clientY - gridRect.top;
    return { x, y };
}

function updateSelectionBox() {
  if (!selectionBox) return;
  const left = Math.min(startX, currentX); const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX); const height = Math.abs(currentY - startY);
  selectionBox.style.left = left + 'px'; selectionBox.style.top = top + 'px';
  selectionBox.style.width = width + 'px'; selectionBox.style.height = height + 'px';
}

function updateSelectedCells() {
  clearCellSelection();
  if (!gridElement) return;

  const selLeft = Math.min(startX, currentX); const selTop = Math.min(startY, currentY);
  const selRight = Math.max(startX, currentX); const selBottom = Math.max(startY, currentY);

  const cells = gridElement.querySelectorAll('.train-car:not(.empty)');
  cells.forEach(cellElement => {
    const cellLeft = cellElement.offsetLeft; const cellTop = cellElement.offsetTop;
    const cellRight = cellLeft + cellElement.offsetWidth; const cellBottom = cellTop + cellElement.offsetHeight;

    if (selLeft < cellRight && selRight > cellLeft && selTop < cellBottom && selBottom > cellTop) {
      cellElement.classList.add('selected-cell');
      const x = parseInt(cellElement.dataset.x); const y = parseInt(cellElement.dataset.y);
      // grid 데이터가 로드되었는지 확인 후 접근
      if (grid && grid[y] && grid[y][x]) {
          selectedCells.push({ x, y, value: grid[y][x].value });
      }
    }
  });
  updateSum();
}

function clearCellSelection() {
  if (gridElement) {
      const currentlySelected = gridElement.querySelectorAll('.selected-cell');
      currentlySelected.forEach(cell => cell.classList.remove('selected-cell'));
  }
  selectedCells = [];
  updateSum();
}

function calculateSelectionSum() {
  return selectedCells.reduce((total, cellData) => total + cellData.value, 0);
}

function updateSum() {
  if (currentSumElement) currentSumElement.textContent = calculateSelectionSum();
}

function checkSelection() {
  if (!gameActive || selectedCells.length === 0 || !statusElement || !scoreElement) return;

  const sum = calculateSelectionSum();
  if (sum === TARGET_SUM) {
    const removedCount = selectedCells.length;
    const scoreToAdd = removedCount * removedCount;
    score += scoreToAdd;
    scoreElement.textContent = score;
    statusElement.textContent = `정답! +${scoreToAdd}점`;
    statusElement.style.color = '#006400';

    selectedCells.forEach(cellData => {
      // grid 데이터 유효성 체크
      if (grid && grid[cellData.y] && grid[cellData.y][cellData.x]) {
          grid[cellData.y][cellData.x].isEmpty = true;
      }
    });
    renderGrid();
    selectedCells = []; updateSum();

    setTimeout(() => {
        if (statusElement.textContent === `정답! +${scoreToAdd}점`) statusElement.textContent = '';
    }, 1500);
  } else {
    statusElement.textContent = `합계 ${sum}, ${TARGET_SUM}이 필요해요!`;
    statusElement.style.color = '#d00';
    setTimeout(() => {
        if (statusElement.textContent === `합계 ${sum}, ${TARGET_SUM}이 필요해요!`) statusElement.textContent = '';
      clearCellSelection();
    }, 1000);
  }
}

// 화면 크기 변경 시 처리
function handleResize() {
    if (gameContentElement && gameContentElement.style.display === 'block') {
        // adjustGridForDevice(); // <<<--- 10x10 고정이므로 호출 불필요
        renderGrid(); // 레이아웃 깨짐 방지 위해 재렌더링은 유용할 수 있음
        if (isSelecting) {
            isSelecting = false;
            if (selectionBox) selectionBox.style.display = 'none';
            clearCellSelection();
        }
    }
}

function restartGame(e) {
  e.preventDefault();
  if (gameOverElement) gameOverElement.style.display = 'none';
  initGame();
}

function newGame(e) {
  e.preventDefault();
  clearInterval(timerInterval); gameActive = false; isSelecting = false;
  if (selectionBox) selectionBox.style.display = 'none';

  if (gameContentElement) gameContentElement.style.display = 'none';
  if (gameOverElement) gameOverElement.style.display = 'none';
  if (startScreenElement) startScreenElement.style.display = 'block';

  if (scoreElement) scoreElement.textContent = '0';
  if (timerElement) timerElement.textContent = '90';
  if (currentSumElement) currentSumElement.textContent = '0';
  if (statusElement) statusElement.textContent = '';
  if (gridElement) gridElement.innerHTML = '';
  // '두뇌 나이' 메시지도 새 게임 시 초기화 (initGame에서 이미 처리됨)
}
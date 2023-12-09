import { useEffect, useRef, useState } from 'react';
import Blank from '../../assets/images/blank.png';
import Snake from '../../assets/images/snake.png';
import Food from '../../assets/images/food.png';

function Board() {
  const width = 10;
  const height = 10;
  const initialRows = [];
  for (let i = 0; i < height; i++) {
    initialRows.push([]);
    for (let k = 0; k < width; k++) {
      initialRows[i].push('blank');
    }
  }

  const randomPosition = () => {
    const position = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
    return position;
  };

  const [rows, setRows] = useState(initialRows);
  const [snake, setSnake] = useState([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ]);
  const [direction, setDirection] = useState('right');
  const [food, setFood] = useState(randomPosition);

  const changeDirectionWithKeys = (e) => {
    const { keyCode } = e;
    switch (keyCode) {
      case 37:
        setDirection('left');
        break;
      case 38:
        setDirection('top');
        break;
      case 39:
        setDirection('right');
        break;
      case 40:
        setDirection('bottom');
        break;
      default:
        break;
    }
  };

  document.addEventListener(
    'keydown',
    changeDirectionWithKeys,
    false,
  );

  const displaySnake = () => {
    const newRows = initialRows;
    snake.forEach((cell) => {
      newRows[cell.x][cell.y] = 'snake';
    });
    newRows[food.x][food.y] = 'food';
    setRows(newRows);
  };

  const moveSnake = () => {
    const newSnake = [];
    switch (direction) {
      case 'right':
        newSnake.push({ x: snake[0].x, y: (snake[0].y + 1) % width });
        break;
      case 'left':
        newSnake.push({
          x: snake[0].x,
          y: (snake[0].y - 1 + width) % width,
        });
        break;
      case 'top':
        newSnake.push({
          x: (snake[0].x - 1 + height) % height,
          y: snake[0].y,
        });
        break;
      case 'bottom':
        newSnake.push({
          x: (snake[0].x + 1) % height,
          y: snake[0].y,
        });
        break;
      default:
        break;
    }
    snake.forEach((cell) => {
      newSnake.push(cell);
    });
    if (snake[0].x === food.x && snake[0].y === food.y) {
      setFood(randomPosition);
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
    displaySnake();
  };

  useInterval(moveSnake, 100);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    // eslint-disable-next-line consistent-return
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  const displayRows = rows.map((row) => (
    <li>
      {row.map((e) => {
        let img;
        switch (e) {
          case 'blank':
            img = <img src={Blank} alt="blank" />;
            break;
          case 'snake':
            img = (
              <img style={{ opacity: '0' }} src={Snake} alt="snake" />
            );
            break;
          case 'food':
            img = <img src={Food} alt="food" />;
            break;
          default:
            break;
        }
        return img;
      })}
    </li>
  ));

  return (
    <div id="board">
      <ul>
        {displayRows}
      </ul>
    </div>
  );
}

export default Board;

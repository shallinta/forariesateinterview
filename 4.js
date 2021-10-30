/**
 * 用时约 60 分钟
 */

const input = [
  [1, 2],
  [5, 3],
  [3, 1],
  [1, 2],
  [2, 4],
  [1, 6],
  [2, 3],
  [3, 4],
  [5, 6],
  // [10, 7],
  // [8, 7],
  // [8, 9],
  // [10, 9],
];

function main(list) {
  const map = {};
  let dominoes = list.map((item) => {
    const [a, b] = item;
    if (!Reflect.has(map, a)) {
      map[a] = 0;
    }
    map[a] += 1;
    if (!Reflect.has(map, b)) {
      map[b] = 0;
    }
    map[b] += 1;
    return {
      show: item,
      dominoes: item,
    };
  });
  const dots = Object.keys(map).sort((a, b) => map[a] - map[b]).map(Number);
  dots.forEach((dot) => {
    const dotCount = map[dot];
    if (dotCount % 2 === 1) {
      throw new Error('Cannot make a domino chain. Odd number.');
    }
    for (let i = 0, len = dotCount / 2; i < len; i += 1) {
      const firstIndex = dominoes.findIndex(({ show }) => show.includes(dot));
      const first = dominoes[firstIndex];
      dominoes.splice(firstIndex, 1);
      const secondIndex = dominoes.findIndex(({ show }) => show.includes(dot));
      if (secondIndex === -1) {
        dominoes.push(first);
      } else {
        const second = dominoes[secondIndex];
        dominoes.splice(secondIndex, 1);
        const item = {
          show: [],
          dominoes: [],
        }
        if (first.dominoes[0] !== dot) {
          item.dominoes.push(...first.dominoes);
        } else {
          item.dominoes.push(...first.dominoes.reverse());
        }
        if (second.dominoes[0] !== dot) {
          item.dominoes.push(...second.dominoes.reverse());
        } else {
          item.dominoes.push(...second.dominoes);
        }
        item.show = [item.dominoes[0], item.dominoes[item.dominoes.length - 1]];
        dominoes.push(item);
      }
    }
    map[dot] = 0;
  });
  if (dominoes.length !== 1) {
    console.log(dominoes);
    throw new Error('Cannot make a domino chain. Mutiple chains.');
  }
  const finalItem = dominoes[0];
  if (finalItem.show[0] !== finalItem.show[1]) {
    throw new Error('Cannot make a domino chain. Odd number.');
  }
  return finalItem.dominoes.reduce((acc, num) => {
    if (acc.length === 0) {
      acc.push([num]);
    } else {
      if (acc[acc.length - 1].length === 1) {
        acc[acc.length - 1].push(num);
      } else {
        acc.push([num]);
      }
    }
    return acc;
  }, []);
}

const output = main(input);
console.log(output);
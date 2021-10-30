/**
 * 用时约 20 分钟
 */

const fs = require('fs');

function main(file) {
  const txt = fs.readFileSync(file, 'utf8');
  const lines = txt.split('\n');
  const pointsMap = {
    win: 3,
    draw: 1,
    loss: 0,
  };
  const secondPointsMap = {
    win: 0,
    draw: 1,
    loss: 3,
  };
  const recordKeys = {
    win: ['W', 'L'],
    draw: ['D', 'D'],
    loss: ['L', 'W'],
  };
  const map = lines.reduce((acc, line) => {
    const info = line.split(';');
    if (info.length === 3 && Reflect.has(pointsMap, info[2])) {
      const team1 = info[0];
      const team2 = info[1];
      const result = info[2];
      if (!Reflect.has(acc, team1)) {
        acc[team1] = { name: team1, MP: 0, W: 0, D: 0, L: 0, P: 0 };
      }
      if (!Reflect.has(acc, team2)) {
        acc[team2] = { name: team2, MP: 0, W: 0, D: 0, L: 0, P: 0 };
      }
      const [team1Record, team2Record] = recordKeys[result];
      acc[team1].MP += 1;
      acc[team2].MP += 1;
      acc[team1][team1Record] += 1;
      acc[team2][team2Record] += 1;
      acc[team1].P += pointsMap[result];
      acc[team2].P += secondPointsMap[result];
    }
    return acc;
  }, {});
  const list = Object.values(map).sort((r1, r2) => {
    if (r1.P === r2.P) {
      return r1.name < r2.name;
    }
    return r2.P - r1.P;
  });
  function getNumStr(num) {
    return num > 9 ? (' ' + num + ' ') : ('  ' + num + ' ');
  }
  return 'Team                           | MP |  W |  D |  L |  P\n' + list.map((item) => {
    const { name, MP, W, D, L, P } = item;
    const nameStr = Array(31).fill(' ').map((_, idx) => name[idx] ? name[idx] : ' ').join('');
    const MPStr = getNumStr(MP);
    const WStr = getNumStr(W);
    return [nameStr, getNumStr(MP), getNumStr(W), getNumStr(D), getNumStr(L), getNumStr(P)].join('|');
  }).join('\n');
}

const file = process.argv[2] || './1.txt';
const output = main(file);
console.log(output);

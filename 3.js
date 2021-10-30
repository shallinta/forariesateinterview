/**
 * 用时约 15 分钟
 */

const input = [
  { id: 1, name: 'i1' },
  { id: 2, name: 'i2', parentId: 1 },
  { id: 4, name: 'i4', parentId: 3 },
  { id: 3, name: 'i3', parentId: 2 },
  { id: 8, name: 'i8', parentId: 7 }
];

// const input = [
//   { id: 1, name: 'i1' },
//   { id: 2, name: 'i2', parentId: 1 },
//   { id: 4, name: 'i4', parentId: 3 },
//   { id: 3, name: 'i3', parentId: 2 },
//   { id: 8, name: 'i8', parentId: 1 }
// ];

function main(list) {
  const map = {};
  let root;
  let doneCount = 0;
  let leftCount = list.length;
  while (doneCount < list.length) {
    list.forEach((item) => {
      if (!item.done) {
        item.children = [];
        map[item.id] = item;
        if (!item.parentId) {
          if (root) {
            throw new Error('Duplicated root node.');
          } else {
            root = item;
            item.done = true;
            doneCount += 1;
          }
        } else {
          if (map[item.parentId]) {
            map[item.parentId].children.push(item);
            item.done = true;
            doneCount += 1;
          }
        }
      }
    });
    const newLeftCount = list.length - doneCount;
    if (newLeftCount === leftCount) {
      throw new Error('Cannot make one tree.');
    } else {
      leftCount = newLeftCount;
    }
  }
  if (!root) {
    throw new Error('Circular reference exist.');
  }
  return root;
}

const output = main(input);
console.log(output);
/**
 * 用时约 45 分钟
 */

const input = [
  { id: 1 },
  { id: 2, before: 1 },
  { id: 3, after: 1 },
  { id: 5, first: true },
  { id: 6, last: true },
  { id: 7, after: 8 },
  { id: 8 },
  { id: 9 },
];

// const input = [
//   { id: 1 },
//   { id: 2, before: 1 },
//   { id: 3, after: 1 },
//   { id: 5, first: true },
//   { id: 6, last: true },
//   { id: 7, after: 8 },
//   { id: 8, after: 2 },
//   { id: 9, before: 3 },
// ];

function main(list) {
  const first = { temp: true };
  const last = { temp: true };
  const before = { temp: true };
  const after = { temp: true };
  first.next = before;
  before.pre = first;
  before.next = after;
  after.pre = before;
  after.next = last;
  last.pre = after;
  const map = {};
  let doneCount = 0;
  let leftCount = list.length;
  while (doneCount < list.length) {
    list.forEach((item) => {
      if (!item.done) {
        map[item.id] = item;
        if (item.first) {
          const afterFirst = first.next;
          first.next = item;
          item.pre = first;
          item.next = afterFirst;
          afterFirst.pre = item;
          item.done = true;
          doneCount += 1;
        }
        if (item.last) {
          const beforeLast = last.pre;
          last.pre = item;
          item.next = last;
          item.pre = beforeLast;
          beforeLast.next = item;
          item.done = true;
          doneCount += 1;
        }
        if (!item.first && !item.last && before.next === after) {
          before.next = item;
          item.pre = before;
          item.next = after;
          after.pre = item;
        }
        if (item.before) {
          if (map[item.before]) {
            const target = map[item.before];
            const targetNext = target.next;
            target.next = item;
            item.pre = target;
            if (targetNext) {
              targetNext.pre = item;
              item.next = targetNext;
            }
            item.done = true;
            doneCount += 1;
          }
        }
        if (item.after) {
          if (map[item.after]) {
            const target = map[item.after];
            const targetPre = target.pre;
            target.pre = item;
            item.next = target;
            if (targetPre) {
              targetPre.next = item;
              item.pre = targetPre;
            }
            item.done = true;
            doneCount += 1;
          }
        }
      }
    });
    const newLeftCount = list.length - doneCount;
    if (newLeftCount === leftCount) {
      break;
    } else {
      leftCount = newLeftCount;
    }
  }
  let i = 0;
  let p = first;
  let result;
  while(p !== last) {
    if (p.temp) {
      const pPre = p.pre;
      const pNext = p.next;
      if (pPre) {
        pPre.next = pNext || null;
      }
      if (pNext) {
        pNext.pre = pPre;
      }
    } else {
      if (!result) {
        result = p;
      }
      i += 1;
    }
    p = p.next;
  }
  if (i < list.length) {
    console.error('error~~~');
    throw new Error('Cannot link all items in list.');
  }
  if (p === last) {
    p.pre.next = null;
  }
  return result;
}

const output = main(input);
// console.log(output);
let r = output;
while (r) {
  console.log(r.id);
  r = r.next;
}
import { WORLDOPTIONS } from "./options.js";

const pushInHoles = (arr, newItem) => {
    const i = arr.indexOf(null)
    return i !== -1 ? (arr[i] = newItem, i) : arr.push(newItem);
};

const filterM = (arr, filter) => {
    for (let l = arr.length - 1; l >= 0; l -= 1) {
        if (!filter(arr[l])) arr.splice(l, 1);
    }
    return arr;
};

const worldToTile = x => Math.floor((x + WORLDOPTIONS.tileScale / 2) / WORLDOPTIONS.tileScale);
const worldToTile2d = (x, y) => [worldToTile(x), worldToTile(y)];

const lerp = (a, b, n) => a * (1 - n) + b * n;

export { pushInHoles, filterM, worldToTile, worldToTile2d, lerp };
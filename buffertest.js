const buf1 = Buffer.allocUnsafe(26)
console.log(`π ~ buf1`, buf1)

for (let i = 0; i < 26; i++) {
  // 97 ζ― 'a' ηεθΏεΆ ASCII εΌγ
  if (i == 0) {
    buf1[i] = i + 97
  }
}
console.log(`π ~ buf1`, buf1)
const buf2 = buf1.subarray(2)

console.log(`π ~ buf2`, buf2)

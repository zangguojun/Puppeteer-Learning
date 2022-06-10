const buf1 = Buffer.allocUnsafe(26)
console.log(`🚀 ~ buf1`, buf1)

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值。
  if (i == 0) {
    buf1[i] = i + 97
  }
}
console.log(`🚀 ~ buf1`, buf1)
const buf2 = buf1.subarray(2)

console.log(`🚀 ~ buf2`, buf2)

const gm = require("gm")
const path = require("path")
const fs = require("fs")
const { rootDir } = require("./utils")

!(async () => {
  const sp = fs.readFileSync(path.resolve(rootDir, "img", "split.png"), {
    flag: "r",
  })
  console.log(sp)
  console.log(sp.type)

  const content = fs.readFileSync(path.resolve(rootDir, "img", "test1.jpg"), {
    flag: "r",
  })
  console.log(content)
  const content2 = content.subarray(200)
  fs.writeFileSync(path.resolve(rootDir, "img", "test12.jpg"), content2)
  console.log(`🚀 ~ content2`, content2)

  if (sp in content) {
    console.log("@@@")
  }
})()

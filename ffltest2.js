const path = require("path")
const fs = require("fs")
const gm = require("gm")
const colors = require("colors")
const WordWrappr = require("word-wrappr")
const nodejieba = require("nodejieba")

const {
  FFCreatorCenter,
  FFScene,
  FFImage,
  FFText,
  FFCreator,
} = require("ffcreatorlite")

const getImageInfo = (filePath) => {
  return new Promise((resolve, reject) => {
    gm(filePath).size((err, size) => {
      if (!err) {
        resolve([size.width, size.height])
      }
      reject([])
    })
  })
}

const cacheDir = path.resolve(__dirname, "../cache")
const outputDir = path.resolve(__dirname, "../output")
const projectDir = path.resolve(__dirname, "backup", "img")
const bgImg = path.resolve(__dirname, "backup", "bgImg.jpg")
const audioDir = path.resolve(__dirname, "backup", "audio")
const fontDir = path.resolve(__dirname, "backup", "font")
const font = path.resolve(fontDir, "jdnt.ttf")
const width = 720
const height = 1280
const fontSize = 42
// const scale = 720 / 1080
var wrappr = new WordWrappr(font)
wrappr.loadSync()

!(async () => {
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width,
    height,
    log: true,
    audio: path.resolve(audioDir, "夏日漱石.mp3"),
  })

  const files = fs.readdirSync(projectDir)
  // console.log(`🚀 ~ files`, files)
  // files = files.sort(
  //   (a, b) => Number(a.split("、")[0]) > Number(b.split("、")[0])
  // )
  for (let j = 0; j < files.length; j++) {
    const imgName = files[j]
    const imgPath = path.resolve(projectDir, imgName)
    const scene = new FFScene()
    // scene.setBgColor("#c4d7d6")
    const fbg = new FFImage({ path: bgImg })
    let [w1, h1] = await getImageInfo(bgImg)
    fbg.setScale(width / w1)
    scene.addChild(fbg)

    let [w, h] = await getImageInfo(imgPath)
    const scale = width / w
    const contentY = height / 2 - (h * scale) / 2
    const fImg = new FFImage({ path: imgPath, y: contentY })
    fImg.setScale(scale)
    scene.addChild(fImg)

    const textY = contentY / 2 - fontSize / 2
    console.log(`${imgName} contentH:${h} contentY:${contentY} textY:${textY}`)
    if (textY > fontSize) {
      const preText = nodejieba.cut(
        imgName.split(".")[0].replace(/\[.*?\]|【.*?】|.*?\|/g, ""),
        true
      )

      const lines = wrappr.wrap(preText.join(" "), fontSize, width)

      const fText = new FFText({
        fontSize,
        font,
        text: lines.join("\n"),
        // x: fontSize,
        y: textY,
      })
      fText.setColor("#ffffff")
      fText.addEffect("hrslice", 1, 1)
      scene.addChild(fText)
    }

    scene.setTransition("radial")
    scene.setDuration(4)
    creator.addChild(scene)
  }

  creator.start()
  creator.openLog()

  creator.on("start", () => {
    console.log(`FFCreatorLite start`)
  })

  creator.on("error", (e) => {
    console.log(`FFCreatorLite error:: \n ${JSON.stringify(e)}`)
  })

  creator.on("progress", (e) => {
    console.log(
      colors.yellow(`FFCreatorLite progress: ${(e.percent * 100) >> 0}%`)
    )
  })

  creator.on("complete", (e) => {
    console.log(
      colors.magenta(
        `FFCreatorLite completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `
      )
    )

    console.log(
      colors.green(
        `\n --- You can press the s key or the w key to restart! --- \n`
      )
    )
  })
})()
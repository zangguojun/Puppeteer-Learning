const path = require("path")
const sharp = require("sharp")
const { rootDir } = require("./utils")

!(async () => {
  const test1 = path.resolve(rootDir, "img", "test.webp")
  const water = path.resolve(rootDir, "img", "water.webp")
  const svg = path.resolve(rootDir, "img", "svg.png")
  const test2 = path.resolve(rootDir, "img", "test2.jpg")
  const test3 = path.resolve(rootDir, "img", "test3.jpeg")
  const test4 = path.resolve(rootDir, "img", "test4.jpeg")
  const test5 = path.resolve(rootDir, "img", "test5.jpeg")
  const test6 = path.resolve(rootDir, "img", "test6.jpeg")
  const test7 = path.resolve(rootDir, "img", "test7.jpeg")
  const test8 = path.resolve(rootDir, "img", "test8.jpeg")
  const test9 = path.resolve(rootDir, "img", "test9.jpeg")

  // const metadata = await sharp(test1).metadata()
  // console.log(metadata)

  // await sharp(test1)
  //   .resize({
  //     width: 150,
  //     height: 97,
  //   })
  //   .toFile(test2)

  // await sharp(test1)
  //   .resize({
  //     width: 150,
  //     height: 97,
  //   })
  //   .toFormat("jpeg", { mozjpeg: true })
  //   .toFile(test3)

  // await sharp(test1)
  //   .extract({ width: 500, height: 330, left: 120, top: 70 })
  //   .grayscale()
  //   .toFile(test4)

  // await sharp(test1)
  //   .rotate(33, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
  //   .blur(4)
  //   .toFile(test5)

  // await sharp(test1)
  //   .rotate(33, { background: { r: 255, g: 255, b: 255, alpha: 0 } })
  //   .resize({
  //     width: 150,
  //     height: 97,
  //   })
  //   .toFile(test6)

  // await sharp(water)
  //   .composite([
  //     {
  //       input: test6,
  //       top: 50,
  //       left: 50,
  //     },
  //   ])
  //   .toFile(test7)

  // const width = 750
  // const height = 483
  // const text = "Sammy the Shark"

  // const svgImage = `
  // <svg width="${width}" height="${height}">
  //   <style>
  //   .title { fill: #fff; font-size: 70px; font-weight: bold;}
  //   </style>
  //   <text x="50%" y="50%" text-anchor="middle" class="title">${text}</text>
  // </svg>
  // `

  // const svgBuffer = Buffer.from(svgImage)
  // await sharp(svgBuffer).toFile(svg)

  // const bt = await sharp(test1)
  //   .composite([
  //     {
  //       input: svg,
  //       top: 0,
  //       left: 0,
  //     },
  //   ])
  //   .toFile(test8)

  const semiTransparentRedPng = await sharp({
    create: {
      width: 48,
      height: 48,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 0.5 },
    },
  })
    .png()
    .toBuffer()
  // .toFile(test9)

  const roundedCorners = Buffer.from(
    '<svg><rect x="0" y="0" width="200" height="200" rx="50" ry="50"/></svg>'
  )

  const roundedCornerResizer = sharp()
    .resize(200, 200)
    .composite([
      {
        input: roundedCorners,
        blend: "dest-in",
      },
    ])
    .png()

  readableStream.pipe(roundedCornerResizer).pipe(writableStream)
})()

const puppeteer = require("puppeteer")
const path = require("path")
const { timeout } = require("../utils")

const titleText = "Uzi转会期动作"
const tagArrray = ["Uzi", "BLG", "lpl转会期", "lol", "lpl", "虎扑"]
const fileList = ["/Users/tong/Desktop/@@VideoCreator/result/test5.mp4"]

;(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      slowMo: 50,
      args: ["--no-sandbox"],
      // devtools: true,
      userDataDir: path.resolve(__dirname, "../userData"),
    })
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36"
    )
    await page.goto("https://creator.douyin.com/creator-micro/content/upload")

    const btnXPath = "//label[contains(@class,'upload-btn')]"
    await page.waitForXPath(btnXPath)
    const btnDOM = (await page.$x(btnXPath))[0]
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      btnDOM.click(),
    ])
    await fileChooser.accept(fileList)

    // 标题前预处理
    const tagBtnXPath =
      "//div[contains(@class, 'desc-btn')][contains(text(),'#')]"
    await page.waitForXPath(tagBtnXPath)
    const tagBtnDOM = (await page.$x(tagBtnXPath))[0]
    tagBtnDOM.click()

    // 增加标题
    const titleXPath =
      "//div[contains(@class, 'public-DraftStyleDefault-block')]/span[last()]"
    await page.waitForXPath(titleXPath)
    const titleDOM = (await page.$x(titleXPath))[0]
    await titleDOM.press("Backspace")
    await titleDOM.type(titleText, { delay: 500 })

    // for (let j = 0; j < tagArrray.length; j++) {
    //   console.log(`🚀 ~ tagArrray`, tagArrray)
    //   const tagText = tagArrray[j]
    //   await titleDOM.type(`#${tagText} `, { delay: 500 })
    //   const tagOptionXPath = `//span[contains(@class,'mentionSuggestionsEntryText')][contains(text(),'${tagText.toLowerCase()}')]`
    //   await page.waitForXPath(tagOptionXPath)
    //   const tagOptionDOM = (await page.$x(tagOptionXPath))[0]
    //   const exist = await tagOptionDOM.evaluate((dom) => !!dom)
    //   exist && (await tagOptionDOM.click())
    // }

    // 增加标签
    const countMap = {}
    for (let j = 0; j < tagArrray.length; j++) {
      const tagText = tagArrray[j]
      console.log(`🚀 ~ tagArrray`, tagArrray)
      if (countMap[tagText]) {
        countMap[tagText] += 1
      } else {
        countMap[tagText] = 0
      }
      console.log(`🚀 ~ tagText`, tagText)
      await titleDOM.type(`#${tagText} `, { delay: 500 })
      await timeout(1000)
      await titleDOM.press("Enter")
      const tagOptionXPath = `//span[contains(@class,'mention')][last()]//span[contains(text(),'${tagText}')]`
      const tagOptionDOMList = await page.$x(tagOptionXPath)
      if (tagOptionDOMList.length === 0) {
        await titleDOM.press("Backspace")
        await titleDOM.press("Backspace")
        await titleDOM.press("Backspace")
        if (countMap[tagText] > 3) {
          break
        } else {
          tagArrray.push(tagText)
        }
      }
    }

    // 等待视频上传完毕
    const uploadOverXPath = "//div[contains(@class,'preview-button')]"
    await page.waitForXPath(uploadOverXPath)

    // 发布
    const submitBtnXPath = "//button[text()='发布']"
    await page.waitForXPath(submitBtnXPath)
    const submitBtnDOM = (await page.$x(submitBtnXPath))[0]
    await submitBtnDOM.click()

    //div[contains(@class,'content-body')]/div[contains(@class,'video-card')][1]//div[contains(@class, 'info-status')]

    await page.close()
    await browser.close()
  } catch (e) {
    console.log(e)
  }
})()

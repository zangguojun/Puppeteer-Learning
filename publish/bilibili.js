const puppeteer = require("puppeteer")
const path = require("path")
const fs = require("fs")
const { timeout } = require("../utils")

const templateType = "hupu-lpl"
const titleText = "Uzi转会期动作"
const tagArrray = ["Uzi", "BLG", "转会期", "LOL", "LPL", "虎扑"]
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
    await page.goto("https://member.bilibili.com/york/videoup?new")

    const btnXPath = "//div[@class='upload-btn']"
    await page.waitForXPath(btnXPath)
    const btnDOM = (await page.$x(btnXPath))[0]
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      btnDOM.click(),
    ])
    await fileChooser.accept(fileList)

    // 选择模板
    const templateBtnXPath = "//span[@class='template']"
    await page.waitForXPath(templateBtnXPath)
    const templateBtnDOM = (await page.$x(templateBtnXPath))[0]
    await templateBtnDOM.click()

    const templateXPath = `//div[@class='template-item'][./child::div[@class='template-item-cover']/text()=' ${templateType} ']`
    await page.waitForXPath(templateXPath)
    const templateDOM = (await page.$x(templateXPath))[0]
    await templateDOM.click()

    // 增加标题
    const titleXPath = "//div[@class='video-title']//input[@class='input-val']"
    await page.waitForXPath(titleXPath)
    const titleDOM = (await page.$x(titleXPath))[0]
    await titleDOM.type(titleText, { delay: 500 })

    // 增加标签
    const tagXPath = "//div[@class='tag-input-wrp']//input[@class='input-val']"
    await page.waitForXPath(tagXPath)
    const tagDOM = (await page.$x(tagXPath))[0]

    for (let j = 0; j < tagArrray.length; j++) {
      const tagText = tagArrray[j]
      await tagDOM.type(tagText, { delay: 500 })
      await tagDOM.press("Enter")
    }

    await timeout(3000)

    const submitBtnXPath = "//span[@class='submit-add']"
    await page.waitForXPath(submitBtnXPath)
    const submitBtnDOM = (await page.$x(submitBtnXPath))[0]
    await submitBtnDOM.click()
    await timeout(66000)

    await page.close()
    await browser.close()
  } catch (e) {
    console.log(e)
  }
})()

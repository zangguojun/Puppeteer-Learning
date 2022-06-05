const puppeteer = require("puppeteer")
const path = require("path")
const { timeout } = require("../utils")

const descText = "截图来自虎扑-LOL社区"
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
    await page.goto("https://member.acfun.cn/upload-video")

    const btnXPath =
      "//div[contains(@class,'el-upload')]//button[.//child::span[text()='上传视频']]"
    await page.waitForXPath(btnXPath)
    const btnDOM = (await page.$x(btnXPath))[0]
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      btnDOM.click(),
    ])
    await fileChooser.accept(fileList)

    // 增加标题
    const titleXPath =
      "//div[contains(@class,'ivu-input-wrapper')]/textarea[./following-sibling::*[contains(text(), 50)]]"
    await page.waitForXPath(titleXPath)
    const titleDOM = (await page.$x(titleXPath))[0]
    await page.evaluate(
      (dom, titleText) => (dom.value = titleText),
      titleDOM,
      titleText
    )
    // await titleDOM.type(titleText, { delay: 500 })

    // 增加简介
    const descXPath =
      "//div[contains(@class,'ivu-input-wrapper')]/textarea[./following-sibling::*[contains(text(), 1000)]]"
    await page.waitForXPath(descXPath)
    const descDOM = (await page.$x(descXPath))[0]
    await page.evaluate(
      (dom, descText) => (dom.value = descText),
      descDOM,
      descText
    )
    // await descDOM.type(descText, { delay: 500 })

    // 增加作品类型
    const typeBtnXPath =
      "//div[@class='ivu-form-item-content']//label[contains(@class,'ivu-radio-default')]"
    await page.waitForXPath(typeBtnXPath)
    const typeBtnDOM = (await page.$x(typeBtnXPath))[0]
    await typeBtnDOM.click()

    // 增加标签
    const tagBtn1XPath =
      "//div[contains(@class,'video-channel-area')]//input[@placeholder='点击选择']"
    await page.waitForXPath(tagBtn1XPath)
    const tagBtn1DOM = (await page.$x(tagBtn1XPath))[0]
    await tagBtn1DOM.click()

    const tagBtn2XPath = "//li[@role='menuitem'][.//child::span[text()='游戏']]"
    await page.waitForXPath(tagBtn2XPath)
    const tagBtn2DOM = (await page.$x(tagBtn2XPath))[0]
    await tagBtn2DOM.click()

    const tagBtn3XPath =
      "//li[@role='menuitem'][.//child::span[text()='英雄联盟']]"
    await page.waitForXPath(tagBtn3XPath)
    const tagBtn3DOM = (await page.$x(tagBtn3XPath))[0]
    await tagBtn3DOM.click()

    const tagXPath = "//input[@class='video-input-box-val']"
    await page.waitForXPath(tagXPath)
    const tagDOM = (await page.$x(tagXPath))[0]

    for (let j = 0; j < tagArrray.length; j++) {
      const tagText = tagArrray[j]
      await tagDOM.type(tagText, { delay: 500 })
      await tagDOM.press("Enter")
    }

    // 增加封面
    const coverBtn1XPath =
      "//div[contains(@class,'video-cover-list-container')][./child::p[text()='可选择以下图片设置封面']]"
    await page.waitForXPath(coverBtn1XPath)

    const coverBtn2XPath =
      "//div[contains(@class,'video-cover-list')]/div[1]/img"
    await page.waitForXPath(coverBtn2XPath)
    const coverBtn2DOM = (await page.$x(coverBtn2XPath))[0]
    await coverBtn2DOM.click()

    const coverBtn3XPath =
      "//button[./child::span[text()='确定']][./preceding-sibling::div//span[text()='重新选择图片']]"
    await page.waitForXPath(coverBtn3XPath)
    const coverBtn3DOM = (await page.$x(coverBtn3XPath))[0]
    await coverBtn3DOM.click()

    const preSubmitXPath = "//div[contains(@class,'el-upload')]/img"
    await page.waitForXPath(preSubmitXPath)

    const submitBtnXPath = "//div[@class='video-submit-container fl']/button"
    await page.waitForXPath(submitBtnXPath)
    const submitBtnDOM = (await page.$x(submitBtnXPath))[0]
    await submitBtnDOM.click()

    await timeout(60000)

    await page.close()
    await browser.close()
  } catch (e) {
    console.log(e)
  }
})()

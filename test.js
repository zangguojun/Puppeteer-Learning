const puppeteer = require("puppeteer")
const path = require("path")
const fs = require("fs")

const nameFormat = (name) => name.replace(/\//g, "-").replace(/\:/g, "：")

const timeout = (delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

;(async () => {
  try {
    fs.mkdirSync(path.resolve(__dirname, "data"), { recursive: true })
    fs.mkdirSync(path.resolve(__dirname, "data", "hupu"), { recursive: true })

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      // slowMo: 500,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    let page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36"
    )
    await page.goto("https://bbs.hupu.com/lol")

    const classifyBtnXPath = "//div[@class='bbs-sl-web-type-wrap']/div"
    await page.waitForXPath(classifyBtnXPath)
    const classifyBtn = await page.$x(classifyBtnXPath)
    /**
     * 0 => 最新回复
     * 1 => 最新发布
     * 2 => 24小时榜
     */
    await classifyBtn[2].click()

    const hotListXPath = "//ul/li//div[@class='post-title']/a"
    await page.waitForXPath(hotListXPath)
    const hotDOM = await page.$x(hotListXPath)
    const hotActicle = await page.evaluate((...domList) => {
      return domList.map((dom) => {
        return {
          href: dom.href,
          name: dom.text,
        }
      })
    }, ...hotDOM)

    for (let i = 0; i < hotActicle.length; i++) {
      const href = hotActicle[i].href
      const name = nameFormat(hotActicle[i].name)
      // await page.goto(href, { waitUntil: "networkidle0", timeout: 0 })
      await page.goto(href, { waitUntil: "networkidle0", timeout: 0 })

      fs.mkdirSync(path.resolve(__dirname, "data", "hupu", name), {
        recursive: true,
      })

      // 限制高度
      // const screenContent = (await page.$x("//div[@class='post-wrapper']"))[0]
      // const clientHeight = await screenContent.evaluate((dom) => dom.clientHeight)
      // if (clientHeight > 1000) {
      //   await page.close()
      //   continue
      // }

      // removeChild
      // const hiddenXPathList = [
      //   {
      //     father: "//div[@class='bbs-post-web-body-right-wrapper']",
      //     child: "//div[@class='game-center-sidebar']",
      //   },
      //   {
      //     father: "//section[@class='hp-pc-footer']",
      //     child: "//div[@class='backToTop_2mZa6']",
      //   },
      // ]
      // for (let k = 1; k < hiddenXPathList.length; k++) {
      //   await page.waitForXPath(hiddenXPathList[k])
      //   const { father, child } = hiddenXPathList[k]
      //   const fatherDom = (await page.$x(father))[0]
      //   const hiddenDom = (await page.$x(child))[0]
      //   await page.evaluate(
      //     (fatherDom, hiddenDom) => {
      //       fatherDom.removeChild(hiddenDom)
      //     },
      //     fatherDom,
      //     hiddenDom
      //   )
      // }

      // display: none
      const hiddenXPathList = [
        "//div[contains(@class,'bbs-post-web-body-right-wrapper')]",
        "//div[contains(@class,'backToTop_2mZa6')]",
      ]

      for (let k = 0; k < hiddenXPathList.length; k++) {
        await page.waitForXPath(hiddenXPathList[k])
        const hiddenDom = (await page.$x(hiddenXPathList[k]))[0]
        await page.evaluate((dom) => (dom.style.display = "none"), hiddenDom)
      }

      const titleXPath = "//div[@class='bbs-post-web-main-title']"
      await page.waitForXPath(titleXPath)
      const titleDOM = (await page.$x(titleXPath))[0]
      await titleDOM.screenshot({ path: `data/hupu/${name}/title.png` })
      console.log(`第${i + 1}个 ${name} title 截屏成功！`)

      await titleDOM.evaluate((dom) => (dom.style.display = "none"))

      const contentXPath = "//div[@class='post-wrapper']"
      await page.waitForXPath(contentXPath)
      const contentDOM = (await page.$x(contentXPath))[0]

      await page.evaluate(async (dom) => {
        let curHeight = 0
        const contentHeight = dom.clientHeight
        const timer = setInterval(() => {
          if (curHeight >= contentHeight) {
            timer.clearInterval()
          }
          curHeight += 300
          console.log(curHeight)
          window.scrollTo(0, curHeight)
        }, 500)

        const selectors = Array.from(dom.querySelectorAll("img"))
        await Promise.all(
          selectors.map((img) => {
            if (img.complete) return Promise.resolve("loaded")
            return new Promise((resolve, reject) => {
              img.addEventListener("load", resolve)
              img.addEventListener("error", reject)
            })
          })
        )
      }, contentDOM)

      await timeout(1000)

      await contentDOM.screenshot({ path: `data/hupu/${name}/content.png` })
      console.log(`第${i + 1}个 ${name} content 截屏成功！`)

      const commontXPath = "//div[@class='post-reply-list ']"
      await page.waitForXPath(commontXPath)
      const commontDOM = await page.$x(commontXPath)
      for (let j = 0; j < 5; j++) {
        await commontDOM[j].screenshot({
          path: `data/hupu/${name}/commont_${j}.png`,
        })
        console.log(`第${i + 1}个 ${name} commont_${j} 截屏成功！`)
      }
    }

    await browser.close()
  } catch (e) {
    console.log(e)
  }
})()

import {expect, Page} from "@playwright/test";

export async function verifyTableRowExist(selector, expectedValues: string[], page: Page) {
  const result = await tableRowExist(selector, expectedValues, page)
  expect(result).toBeTruthy()
}

export async function verifyTableRowNotExist(selector, expectedValues: string[], page: Page) {
  const result = await tableRowExist(selector, expectedValues, page)
  expect(result).toBeFalsy()
}

async function tableRowExist(selector: string, expectedValues: string[], page: Page) {
  const rowElements = page.locator(selector)
  const rows = await rowElements.evaluateAll((rows) => {
    return rows.map(row => {
      let result = []
      for (let i = 0; i < row.children.length; i++) {
        const element = row.querySelector<HTMLElement>(`*:nth-child(${i+1})`)
        const datasetValue = element.dataset.value
        if (datasetValue) {
          result.push(datasetValue)
        } else if (element.innerText) {
          result.push(element.innerText.trim())
        }
      }

      return result
    })
  })

  const row = rows.find(r => {
    return compareArrays(r, expectedValues)
  })

  return !!row
}

export async function verifySelectByLabel(label: string, expectedValues: string[], page: Page) {
  await page.getByLabel(label).click()

  const menuList = page.locator('.MuiMenuItem-root')
  const actualValues = await menuList.evaluateAll((menuItems) => {
    return menuItems.map((menuItem: HTMLDivElement) => {
      return menuItem.innerText
    })
  })

  const equal = compareArrays(actualValues, expectedValues)
  expect(equal).toBeTruthy()
}

function compareArrays(array1: string[], array2: string[]) {
  if (array1.length !== array2.length) {
    return false
  }

  array1.sort()
  array2.sort()

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false
    }
  }

  return true
}

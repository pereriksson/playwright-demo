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
  const allRows = await page.locator(selector).all()

  for (const row of allRows) {
    const allCells = await row.locator("td, th").all()
    const rowValues = []

    for (const cell of allCells) {
      const cellValue = await cell.evaluate(cell => {
        const datasetValue = cell.dataset.value
        if (datasetValue) {
          return datasetValue
        } else if ('innerText' in cell && cell.innerText) {
          return cell.innerText.trim()
        }
      })

      if (cellValue) rowValues.push(cellValue)
    }

    if (compareArrays(rowValues, expectedValues)) {
      return true
    }
  }

  return false
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

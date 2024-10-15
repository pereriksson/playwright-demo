import {test, expect, Page} from '@playwright/test';
import testData from '../test-data.json';
import {verifySelect, verifyTableRowExist, verifyTableRowNotExist} from "../lib/util";

test('verify a desert', async ({page}) => {
  await page.goto(testData.muiDemoUrl)

  await verifyTableRowExist([
      '159',
      '6',
      '4',
      '24',
      'Frozen yoghurt',
      'high'
    ],
    page)
})

test('all deserts are present in dropdown', async ({page}) => {
  await page.goto(testData.muiDemoUrl)
  await verifySelect(
    'Name',
    [
      'Frozen yoghurt',
      'Ice cream sandwich',
      'Eclair',
      'Cupcake',
      'Gingerbread'
    ],
    page
  )
})

test('updating a dessert', async ({page}) => {
  await page.goto(testData.muiDemoUrl)
  await page.locator("tbody .MuiTableRow-root").first().click()
  await page.getByRole("textbox", {name: "name"}).fill("Frozen yoghurt2")
  await page.getByRole("textbox", {name: "calories"}).fill("1")
  await page.getByRole("textbox", {name: "fat"}).fill("2")
  await page.getByRole("textbox", {name: "carbs"}).fill("3")
  await page.getByRole("textbox", {name: "protein"}).fill("4")
  await page.getByLabel('Priority').click()
  await page.getByRole('option', {name: "Low"}).click()
  await page.getByRole("button", {name: "Save"}).click()

  await verifyTableRowExist([
      '1',
      '2',
      '3',
      '4',
      'low',
      'Frozen yoghurt2'
    ],
    page)
})

test('deleting a dessert', async ({page}) => {
  await page.goto(testData.muiDemoUrl)
  await page.locator("svg[role='button']").first().click()

  await verifyTableRowNotExist([
      '159',
      '6',
      '24',
      '4',
      'high',
      'Frozen yoghurt'
    ],
    page)
})

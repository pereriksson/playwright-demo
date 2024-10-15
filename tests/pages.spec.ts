import {expect, test} from "@playwright/test";
import testData from "../test-data.json";

test('has community page', async ({page}) => {
  await page.goto(testData.playwrightUrl);

  await page.getByRole('link', {name: 'Community'}).click()

  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()
})

// TODO: Flaky test
test('searching for html report', async ({page}) => {
  await page.goto(testData.playwrightUrl);

  await page.getByRole('button', {name: 'Search'}).click()

  await page.keyboard.type('Opening the HTML report')

  await page.getByText(/Opening the HTML report/).click()

  await expect(page.getByRole('heading', {name: 'Opening the HTML report'})).toBeVisible()
})

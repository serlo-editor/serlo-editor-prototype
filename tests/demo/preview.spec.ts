import { expect, test } from "@playwright/test"

import { clickTextAndMoveToEnd, editor, loadPrototype, selectTextInEditor } from "./utils"

const normalParagraph = "This is an example of educational content with various types of items."

test("learner preview hides answers and authoring controls; reset keeps authored content", async ({
  page,
}) => {
  await loadPrototype(page, { collaboration: false })
  const preview = page.getByLabel("Lernvorschau")
  const blank = preview.getByRole("textbox", { name: "Lücke 1" })
  const answers = preview.getByRole("checkbox")

  await expect(page.getByRole("heading", { name: "Vorschau" })).toBeVisible()
  await expect(editor(page, "Editor 2")).not.toBeVisible()
  await expect(preview.locator("[contenteditable]")).toHaveCount(0)
  await expect(preview).not.toContainText("Paris")
  await expect(preview).not.toContainText("Richtig")
  await expect(answers).toHaveCount(3)
  for (const answer of await answers.all()) await expect(answer).not.toBeChecked()

  await blank.fill("Lyon")
  await answers.nth(0).check()
  await answers.nth(1).check()
  await clickTextAndMoveToEnd(page, "Editor 1", normalParagraph)
  await page.keyboard.type(" Live update")
  await expect(preview).toContainText("Live update")
  await expect(blank).toHaveValue("Lyon")
  await expect(answers.nth(0)).toBeChecked()
  await expect(answers.nth(1)).toBeChecked()

  await page
    .getByRole("region", { name: "Vorschau", exact: true })
    .getByRole("button", { name: "Vorschau zurücksetzen" })
    .click()
  await expect(blank).toHaveValue("")
  for (const answer of await answers.all()) await expect(answer).not.toBeChecked()
  await expect(preview).toContainText("Live update")
  await expect(
    editor(page, "Editor 1").getByRole("checkbox", { name: "Richtig", exact: true }),
  ).toBeChecked()
  await expect(editor(page, "Editor 1").locator(".gap-mark")).toHaveText("Paris")
})

test("preview follows remote edits and omits empty prompts", async ({ page }) => {
  await loadPrototype(page)
  const preview = page.getByLabel("Lernvorschau")
  await selectTextInEditor(page, "Editor 2", "What is 2 + 2?")
  await page.keyboard.type("Choose all correct answers")
  await page.getByRole("button", { name: "Vorschau", exact: true }).click()
  await expect(preview).toContainText("Choose all correct answers")

  const question = editor(page, "Editor 1").locator(".exercise__question .ProseMirror")
  await question.press("ControlOrMeta+a")
  await question.press("Backspace")
  await expect(question).toHaveText("")
  await expect(preview.locator(".exercise__prompt")).toHaveCount(0)
})

test("right pane switches between preview and collaborative editor without losing state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await loadPrototype(page, { collaboration: false })
  const preview = page.getByLabel("Lernvorschau")
  const blank = preview.getByRole("textbox", { name: "Lücke 1" })
  const answer = preview.getByRole("checkbox").first()
  const previewButton = page.getByRole("button", { name: "Vorschau", exact: true })
  const collaborationButton = page.getByRole("button", { name: "Zusammenarbeit", exact: true })
  const header = page.locator(".app__header")
  await expect(header.getByRole("group", { name: "Ansicht im rechten Bereich" })).toBeVisible()
  await expect(header.getByRole("button", { name: "Vorschau zurücksetzen" })).toHaveCount(0)
  await expect(
    page
      .getByRole("region", { name: "Vorschau", exact: true })
      .getByRole("button", { name: "Vorschau zurücksetzen" }),
  ).toBeVisible()

  await blank.fill("Lyon")
  await answer.check()
  await expect(previewButton).toHaveAttribute("aria-pressed", "true")
  await collaborationButton.focus()
  await page.keyboard.press("Enter")
  await expect(collaborationButton).toHaveAttribute("aria-pressed", "true")
  await expect(previewButton).toHaveAttribute("aria-pressed", "false")
  await expect(preview).not.toBeVisible()
  await expect(page.getByRole("button", { name: "Vorschau zurücksetzen" })).not.toBeVisible()
  await expect(editor(page, "Editor 2")).toBeVisible()
  const left = await editor(page, "Editor 1").boundingBox()
  const right = await editor(page, "Editor 2").boundingBox()
  expect(right!.x).toBeGreaterThanOrEqual(left!.x + left!.width)
  expect(right!.y).toBeCloseTo(left!.y, 1)
  const headerBox = await header.boundingBox()
  expect(headerBox!.x).toBe(0)
  expect(headerBox!.width).toBe(1440)
  expect(left!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height)
  const leftToolbar = await editor(page, "Editor 1").getByRole("toolbar").boundingBox()
  const rightToolbar = await editor(page, "Editor 2").getByRole("toolbar").boundingBox()
  expect(rightToolbar!.y).toBeCloseTo(leftToolbar!.y, 1)

  await selectTextInEditor(page, "Editor 2", "What is 2 + 2?")
  await page.keyboard.type("What is 2 + 3?")
  await expect(editor(page, "Editor 1")).toContainText("What is 2 + 3?")
  await previewButton.click()
  await expect(preview).toBeVisible()
  await expect(editor(page, "Editor 2")).not.toBeVisible()
  await expect(preview).toContainText("What is 2 + 3?")
  await expect(blank).toHaveValue("Lyon")
  await expect(answer).toBeChecked()
})

test("narrow layout preserves keyboard access and learner answers across mode switches", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await loadPrototype(page, { collaboration: false })
  const preview = page.getByLabel("Lernvorschau")
  const blank = preview.getByRole("textbox", { name: "Lücke 1" })
  await blank.focus()
  await page.keyboard.type("Paris")
  await expect(blank).toHaveValue("Paris")
  await page.keyboard.press("Tab")
  await page.keyboard.press("Space")
  const answer = preview.getByRole("checkbox").first()
  await expect(answer).toBeChecked()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  await page.getByRole("button", { name: "Zusammenarbeit", exact: true }).click()
  await expect(editor(page, "Editor 2")).toBeVisible()
  await expect(preview).not.toBeVisible()
  await expect(page.getByRole("button", { name: "Vorschau zurücksetzen" })).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )

  await page.getByRole("button", { name: "Vorschau", exact: true }).click()
  await expect(blank).toHaveValue("Paris")
  await expect(answer).toBeChecked()
  const reset = page
    .getByRole("region", { name: "Vorschau", exact: true })
    .getByRole("button", { name: "Vorschau zurücksetzen" })
  await expect(
    page.locator(".app__header").getByRole("button", { name: "Vorschau zurücksetzen" }),
  ).toHaveCount(0)
  await reset.click()
  await expect(blank).toHaveValue("")
  await expect(answer).not.toBeChecked()
  await expect(editor(page, "Editor 1").locator(".gap-mark")).toHaveText("Paris")
})

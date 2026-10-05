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

  await page.getByRole("button", { name: "Vorschau zurücksetzen" }).click()
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
  await expect(preview).toContainText("Choose all correct answers")

  const question = editor(page, "Editor 1").locator(".exercise__question .ProseMirror")
  await question.press("ControlOrMeta+a")
  await question.press("Backspace")
  await expect(question).toHaveText("")
  await expect(preview.locator(".exercise__prompt")).toHaveCount(0)
})

test("narrow layout contains preview and preserves keyboard access", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await loadPrototype(page, { collaboration: false })
  const preview = page.getByLabel("Lernvorschau")
  const blank = preview.getByRole("textbox", { name: "Lücke 1" })
  await blank.focus()
  await page.keyboard.type("Paris")
  await expect(blank).toHaveValue("Paris")
  await page.keyboard.press("Tab")
  await page.keyboard.press("Space")
  await expect(preview.getByRole("checkbox").first()).toBeChecked()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})

import { expect, test } from "@playwright/test"

import { editor, loadPrototype } from "./utils"

test("demo loads in preview mode with controls in their correct panels", async ({ page }) => {
  await loadPrototype(page, { collaboration: false })
  const header = page.locator(".app__header")
  const viewSwitch = header.getByRole("group", { name: "Ansicht im rechten Bereich" })
  const previewPane = page.getByRole("region", { name: "Vorschau", exact: true })

  await expect(editor(page, "Editor 1").getByText(/This is an example/)).toBeVisible()
  await expect(editor(page, "Editor 2")).not.toBeVisible()
  await expect(viewSwitch.getByRole("button", { name: "Vorschau", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  )
  await expect(
    viewSwitch.getByRole("button", { name: "Zusammenarbeit", exact: true }),
  ).toHaveAttribute("aria-pressed", "false")
  await expect(previewPane.getByLabel("Lernvorschau")).toBeVisible()
  await expect(previewPane.getByRole("button", { name: "Vorschau zurücksetzen" })).toBeVisible()
  await expect(header.getByRole("button", { name: "Vorschau zurücksetzen" })).toHaveCount(0)
})

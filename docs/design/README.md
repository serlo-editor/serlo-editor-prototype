# Design specification

## Scope and source of truth

This document defines target editor and learner-facing design from screenshots in this directory. It describes intended design, not current implementation status. Screenshot text and images are examples, not fixed content.

Use linked screenshots as visual references and this specification for shared rules and component behavior. Approximate measurements below are implementation starting points, not measured design tokens: screenshots use different sizes and scales. No specific font family, exact color palette, or responsive breakpoint is established by these references.

## Shared visual language

- White content surfaces, near-black text, thin light-gray borders, generous whitespace. Avoid dense toolbars and heavy decoration inside learner content.
- Neutral sans-serif typography. Prompts and body content are large and readable; titles and table headers are bold. Type badges are much smaller, bold, and gray.
- Softly rounded corners on cards, media, tables, answer rows, and inputs. Start around 10–14 CSS px for component corners, adjusting against screenshots at equivalent scale.
- Very pale lavender distinguishes content headers and gallery backgrounds. Muted blue/indigo highlights category labels and add actions. Green marks correct answers in authoring controls.
- Inputs, answer rows, and draggable chips use restrained downward shadows. Content boxes and tables primarily use borders rather than shadows.
- Left-align text. Keep consistent horizontal inset within each block, clear vertical separation between badge, prompt, and answer area, and comfortable padding inside controls.
- Exercise and GeoGebra type labels are compact outlined badges with adjacent help icons. Content boxes instead use their own header treatment; standalone images and galleries have no type badge in references.
- Preserve media proportions. Clip media at rounded corners; use intentional cropping only when matching a configured image viewport.

## Editor and preview

Reference: [Split view](split-view.png).

### Desktop layout

- Two approximately equal-width panes separated by a thin vertical divider.
- Left pane: white authoring surface with generous top and side padding.
- Right pane: subtly warm/off-white preview background, bold `Vorschau` heading near top left, circular reset control near top right.
- Center learner preview inside a tall white phone-shaped frame with thick dark rounded outline. Device frame belongs to preview chrome, not learner content.
- Preview content starts near top of device, with inner padding and substantial unused space below short exercises.

### Demo right-pane modes (product decision)

This behavior extends screenshot reference; it is not shown in screenshot.

- Shared demo header spans both panes and contains `Vorschau` / `Zusammenarbeit` switch; preview is default. Preview reset sits inside preview pane beside its heading and appears only in preview mode.
- Both collaborative editor panes use same construction and padding, with aligned editor titles, formatting toolbars, and content start. No mode controls or extra heading offset Editor 2 inside right pane.
- Collaboration mode shows editable Editor 2 in same pane, synchronized with left editor, including collaborative cursors. It has no phone frame or preview reset control.
- Switching modes preserves both editors and learner response state. Preview reset remains exclusive to preview mode and does not change authored content.
- Switch exposes active mode and supports keyboard operation. Only selected pane content is visible and focusable.

### Authoring example: single choice

- Muted indigo `Single Choice` label and help icon precede form.
- Bold `Aufgabenstellung` heading above large rounded prompt field. Empty field shows muted lavender placeholder `z.B. eine Frage`.
- Bold `Antworten` heading above vertically stacked editable answer rows.
- Each row has text field with trailing delete icon; correctness control sits outside field on right.
- Correctness controls combine icon and text: green checked `Richtig`, neutral outlined-circle `Falsch`. Single choice permits one correct answer.
- `Neue Antwort hinzufügen` appears below rows as text action with indigo plus icon.
- Preview renders learner UI, not authoring controls: type badge, prompt, answer cards, selection indicators. Do not expose correctness flags or delete/add actions there.
- Empty prompt preview shows muted guidance `[Schreibe links eine Aufgabenstellung]`, rather than treating placeholder as authored text.
- Authoring changes should update preview. Reset control should reset learner interaction state without deleting authored content.

Only single-choice authoring is pictured. Other exercise authoring forms and narrow-screen editor layout remain unspecified; do not extrapolate detailed layouts from this example.

## Content blocks

### Content box with title

Reference: [Content box](content/content%20box.png).

- Rounded thin-bordered container with pale lavender header band and white body.
- Bold title on left; blue star and category label such as `Beispiel` on right.
- Body uses large regular text with generous padding. Header joins outer rounded corners without a separate floating card.

### Content box without title

Reference: [Content box without title](content/content%20box%20without%20title.png).

- Same container and body treatment.
- Omit title; move blue star and bold category label to left side of header. Do not reserve an empty title column.

### Spoiler / disclosure

Reference: [Spoiler, expanded](content/spoiler.png).

- Reuse rounded content-box border and lavender header.
- Header starts with disclosure triangle followed by bold title. Expanded reference shows downward triangle and visible body, inset beneath title.
- Activating header toggles body visibility; collapsed state hides body and updates indicator. Only expanded appearance is pictured.

### Table

Reference: [Table](content/table.png).

- Thin gray outer border and cell dividers, rounded outer corners, no gaps between cells.
- Pale lavender header row with bold, left-aligned labels; white body cells with regular text.
- Comfortable cell padding and row height. Example uses two equal-width columns and three body rows; these counts are not limits.

### Swipeable image gallery

References: [Three-image gallery](content/swipable%20image%20gallery.png), [Photo gallery with overflow](content/swipable%20image%20gallery-1.png).

- Horizontal image strip inside thin-bordered, pale lavender, rounded container.
- Individually rounded image tiles, small even gaps, and inset padding.
- Support different image widths and proportions. First example shows three illustrations; second shows large photos with trailing image clipped at container edge, signaling horizontal overflow.
- Overflow must be horizontally scrollable/swipeable. References show no arrows, pagination dots, or captions; these are not required.

### GeoGebra embed

Reference: [GeoGebra](content/geogebra.png).

- Small `GeoGebra` badge with help icon above rounded, thin-bordered embed viewport.
- Keep graph, sliders, instructions, and embedded controls within viewport. Internal GeoGebra styling belongs to embedded content, not surrounding editor theme.

### Standalone image

Reference: [Single image](exercises/single%20image.png).

- Wide image with rounded corners on white page, without visible badge, caption, or outer card.
- Screenshot lives under `exercises/` but depicts image presentation only; it does not establish an answer interaction.
- Reuse same media treatment for exercise images.

## Exercises

### Common structure

- Compact type badge and help icon first, then optional prompt/instructions, then response controls or media.
- White background without enclosing exercise card. Layout remains left-aligned and vertically stacked.
- Prompts wrap naturally across lines. Response controls share consistent border, radius, shadow, and text styling.
- Inputs show light-gray `Deine Antwort` placeholder where pictured. Placeholder is not entered content or substitute for accessible label.
- References show unanswered/default states only. They do not define submission buttons, scoring feedback, validation messages, selected styling, or solution displays.

### Single choice

Reference: [Single choice](exercises/single%20choice.png).

- `Single Choice` badge, multiline question, then vertical answer cards separated by clear gaps.
- Each card has large answer text on left and empty circular radio indicator on right.
- Whole answer card activates selection. Selecting an answer deselects previous answer.
- Standalone reference uses compact cards sized to answer group; split-view preview uses cards spanning available device width. Both preserve aligned right-side indicators.

### Multiple choice

Reference: [Multiple choice](exercises/multiple%20choice.png).

- Same answer-card treatment as single choice, with `Multiple Choice` badge and square checkbox indicators instead of circles.
- Options toggle independently; multiple answers may be selected.
- Reference has no prompt. Do not require visible prompt or leave an empty prompt-sized gap when absent.

### Short text answer

Reference: [Text input](exercises/text%20input.png).

- `Text-Antwort` badge, multiline question, then wide single-line input.
- Input has rounded light-gray border, subtle shadow, generous horizontal padding, and `Deine Antwort` placeholder.

### Free text

Reference: [Free text](exercises/free%20text.png).

- `Freitext` badge and question above large multiline response field.
- Field aligns with prompt area, has same treatment as short-text input, and enough initial height for several lines. Placeholder sits at top left.

### Fill in the gaps: text

Reference: [Fill in the gaps text](exercises/fill%20in%20the%20gaps%20text.png).

- `Lückentext` badge above instruction text.
- Editable blanks appear inline within sentence, including punctuation after blank. Screenshot shows `Was soll in die [blank] ?`.
- Blanks are compact rounded inputs with light border and subtle shadow, aligned with surrounding text. Preserve readable line wrapping around blanks.

### Fill in the gaps: table

Reference: [Fill in the gaps with table](exercises/fill%20in%20the%20gaps%20with%20table.png).

- `Lückentabelle` badge and instructions above table matching content-table styling.
- Mix fixed text cells and cells containing compact blank inputs. Inputs remain inset from cell edges; table grid stays visible.

### Drag and drop with image

Reference: [Drag and drop with image](exercises/drag%20and%20drop%20with%20image.png).

- `Drag & Drop` badge, large rounded image, then horizontal row of draggable word chips.
- Chips use white backgrounds, thin gray borders, soft shadows, rounded corners, and compact padding. Wrap when available width cannot fit row.
- Image is main task surface; chips represent movable answers. Reference does not show target zones, placement, accepted-answer feedback, or post-drop appearance. Define those separately before implementing full interaction.

## Implementation guardrails

These requirements supplement screenshots; screenshots do not establish interaction states or accessibility behavior.

- Use semantic radio groups, checkboxes, text inputs, textareas, tables with header cells, and disclosure controls. Whole-card targets must retain keyboard operation and visible focus.
- Give icon-only help, delete, reset, and add controls accessible names. Disclosure exposes expanded state; fields and blanks have accessible labels. Do not encode correctness through color alone.
- Meaningful images need alternative text. Gallery scrolling needs keyboard access; drag-and-drop needs a non-drag alternative when implemented. Give embedded content an accessible title.
- Keep learner content usable at narrow widths: fit controls and media to container, wrap text/chips, and contain gallery/table overflow without clipping essential content. Exact breakpoints and mobile editor arrangement need separate design decisions.
- Reuse shared styles across content tables and gap tables, single/multiple choice cards, text inputs and blanks, and standalone/exercise images.
- Match screenshot hierarchy, spacing, corner treatment, typography proportions, and control placement with representative content. Do not hard-code sample wording, answer counts, table dimensions, or screenshot canvas sizes.

## Not specified by references

- Global navigation, editor toolbars, block insertion menus, selection handles, collaborative presence, and other app chrome.
- Exact font assets, colors, spacing tokens, hover/focus/selected/disabled styles, and mobile editor breakpoints.
- Exercise grading, submission flow, correct/incorrect learner feedback, validation rules, and persistence of learner answers.
- Collapsed spoiler appearance, gallery navigation beyond scrolling, and drag-and-drop target behavior.

Do not treat absent details as screenshot-backed requirements. Extend this specification when those decisions are made.

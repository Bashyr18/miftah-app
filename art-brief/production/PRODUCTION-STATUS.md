# Miftah artwork production status

State: PRODUCTION IN PROGRESS through the ChatGPT web conversation. Read production-status.json for current accepted counts and each asset status. No complete delivery ZIP exists yet.

The built-in image generator failed immediately with HTTP 404 Not Found on two attempts to generate key-forged. No model response or image was returned. The tool exposes no model selector.

The requested Image 2.5 model has not been used. Official model reference: https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst

The user selected the ChatGPT web browser workflow instead of the API. Keep all 198 assets in this single web conversation: https://chatgpt.com/c/6aec4e46-4cd4-83e9-899d-97963d1badcd . The full source brief is attached there; key-forged has been requested with its exact prompt. The web UI does not expose a precise backend image-model identifier. The six exact anchor prompts are extracted under anchor-prompts/.

## Verified preflight

- All 198 prompts in prompts.jsonl match the Markdown brief verbatim.
- All 198 names and paths are unique; all anchor references resolve.
- Delivery batch folders were empty at preflight; accepted artwork is now being saved there.
- Original brief, manifest and prompt files are unchanged.

## Required anchor order

1. `key-forged`
2. `court-fg-day`
3. `room-quran`
4. `plant-0`
5. `s02-makkah-dawn`
6. `time-fajr`

Generate and visually inspect each anchor before moving to the next. Then use the anchors as image references for their dependent assets, with one image per exact supplied prompt.

## Required batch inventory

| Folder | Required |
|---|---:|
| 01-keys | 10 |
| 02-courtyard | 10 |
| 03-rooms | 6 |
| 04-objects | 82 |
| 05-instruments | 18 |
| 06-science | 20 |
| 07-seerah | 17 |
| 08-adab-dua | 24 |
| 09-moments | 8 |
| 10-store | 3 |

## Acceptance and delivery

Follow MIFTAH-IMAGE-PROMPTS.md exactly. Inspect each output for forbidden text, pseudo-Arabic, people, faces, cropping, camera alignment and anchor consistency. Check actual dimensions and alpha or the permitted flat chroma background. Do not mark a file accepted merely because generation succeeded.

Destination: `C:\Projects\Islamic Apps\Miftahrt-inbox\`. Preserve the exact ten batch folders and 198 filenames. Build miftah-art.zip only from generated, inspected deliverables.

The accepted key-forged anchor is saved as 01-keys/key-forged.png in art-inbox. Continue from current_asset in production-status.json; preserve this same web conversation and the original prompts.

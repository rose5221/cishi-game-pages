import{f as e}from"./index-BI0lbiGp.js";var t=new Set([`signatureKit`,`appearance`,`status`,`faction`,`wants`]);function n(e){let n={};for(let r of Object.keys(e))t.has(r)&&(n[r]=e[r]);return n}async function r(t,r,i,a){console.log(`[PC Updater] Checking for drift on player character "${i.name}"...`);let o=r.slice(-5).map(e=>`${e.role.toUpperCase()}: ${e.content}`).join(`

`),s=`[PLAYER CHARACTER: ${i.name}]\nStatus: ${i.status||`Alive`}\nAppearance: ${i.appearance||`Unknown`}\nPersonality: ${i.personality||`Unknown`}\nVoice: ${i.voice||`not defined`}\nFaction: ${i.faction||`Unknown`}\nStory Relevance: ${i.storyRelevance||`Unknown`}\n`;if(i.wants&&(i.wants.long||i.wants.medium?.length)&&(s+=`LongWant: ${i.wants.long||`Unknown`}\nMediumWants: ${i.wants.medium?.join(` | `)||`none`}\n`),i.signatureKit){let e=i.signatureKit;s+=`SignatureKit: gear=[${e.equipment.join(`, `)||`none`}] powers=[${e.abilities.join(`, `)||`none`}]${e.element?` element=${e.element}`:``}\n`}let c=`You are a background game state analyzer. Your job is to read the RECENT CONTEXT of an RPG session and determine if the PLAYER CHARACTER has undergone a shift in their status, appearance, faction, or signature gear/powers.

OUTPUT FORMAT — a single JSON object:
{"changes": { ...only the fields that changed... }}

Allowed "changes" keys (send ONLY fields that fundamentally changed):
  status, appearance, faction (can list multiple comma-separated factions), wants (medium/long text only — NEVER include "short"),
  signatureKit.
DO NOT include attributes that stayed the same. If nothing fundamental changed, "changes" is {}.

**FORBIDDEN keys** in "changes" (data-model errors — the engine owns these for the PC):
  - "personalityHex" / "traits" — written only by the player via the character sheet or quiz. NEVER send.
  - "drives" — superseded by "wants". Never send.
  - "affinity" / "pcRelation" / "relations" — relationship standing is engine-owned and meaningless for the PC. NEVER send.
  - "voice", "personality", "storyRelevance", "behavioralTriggers", "hardBoundaries", "softBoundaries", "artStyle" — out of scope for this updater.

SIGNATURE KIT RULES:
  - "signatureKit" is the player character's durable loadout: {"equipment": string[], "abilities": string[], "element": string}. It keeps gear and powers CONSISTENT across the campaign.
  - Only send it when the scene NARRATES a real change: the PC gains/loses/breaks a signature item, learns or loses a power, or is transformed. The PC merely *using* gear they already have is NOT a change — send nothing.
  - Send ONLY the channel that changed. To update gear, send just "equipment" (the full new signature list, max 8); to update powers, send just "abilities". Never re-emit an unchanged channel.
  - Default is NO change. Most turns have no signatureKit update.

WANTS UPDATE RULES:
  - "wants" is an object with "short" (string[]), "medium" (string[]), and "long" (string).
  - You may ONLY revise "medium" and "long". NEVER include "short" — it is engine-managed and always preserved. If you include "short", it will be discarded.
  - "long" is a single overarching life goal — update only if a transformative event reshaped it.
  - "medium" is arc-level goal templates — update if the story moved to a new arc.

GENERAL RULES:
- Valid statuses: Alive, Deceased, Missing, Unknown, In Custody.

EXAMPLES:

GOOD — PC's signature weapon was sundered on-screen (only the gear channel; powers untouched):
{"changes": {"signatureKit": {"equipment": ["backup dagger"]}}}

GOOD — PC joined a new faction after a major story beat:
{"changes": {"faction": "Ironspire Knights"}}

GOOD — ordinary scene, nothing fundamental changed:
{"changes": {}}

BAD — sending a FORBIDDEN/engine-owned key:
{"changes": {"personalityHex": {"boldness": +1}, "traits": ["brave"], "pcRelation": +1}}
Corrected: drop the forbidden keys entirely. The engine owns them.

BAD — re-emitting unchanged attributes (status/faction all unchanged here):
{"changes": {"status": "Alive", "faction": "Ironspire Knights", "appearance": "tall, dark hair"}}
Corrected: include ONLY the field that changed —
{"changes": {"appearance": "now bears a scar across the left eye"}}

[RECENT CONTEXT]
${o}
[END CONTEXT]

[CURRENT PLAYER CHARACTER STATE]
${s}
[END STATE]

RESPOND ONLY WITH VALID JSON. NO MARKDOWN FORMATTING. NO EXPLANATIONS.`;try{let r=await t({prompt:c,trackingLabel:`pc-update`});if(!r||typeof r!=`object`||!r.changes||typeof r.changes!=`object`){console.log(`[PC Updater] No changes field or empty response — nothing to apply.`);return}let o=r.changes,s=n(o);if(Object.keys(s).length===0){console.log(`[PC Updater] All proposed changes were blocked keys — nothing to apply.`);return}if(s.signatureKit!==void 0){let t=e(s.signatureKit,i.signatureKit);t?s.signatureKit=t:delete s.signatureKit}if(s.wants&&typeof s.wants==`object`){let e=i.wants||{short:[],medium:[],long:``},t=s.wants;s.wants={short:e.short,medium:Array.isArray(t?.medium)?t.medium.map(String).filter(Boolean):e.medium,long:typeof t?.long==`string`&&t.long.trim()?t.long.trim():e.long}}a(s),console.log(`[PC Updater] Applied drift patch to "${i.name}":`,s)}catch(e){console.error(`[PC Updater] Failed to parse generated JSON or fatal error:`,e)}}export{r as checkCharacterDrift};
import{b as e,n as t,t as n}from"./llmCall-D1fG-kHp.js";import{t as r}from"./tokenizer-DdYruMhA.js";var i=e({DIRECTOR_BRIEF_TIMEOUT_MS:()=>a,buildNpcSummary:()=>d,buildRecentEvents:()=>h,clearDirectorBriefCache:()=>u,lastAssistantContent:()=>x,parseDirectorBrief:()=>v,renderDirectorPrompt:()=>_,resolveDirectorProvider:()=>y,runDirectorBrief:()=>b}),a=18e4,o=`director-brief`,s=120,c=5,l=null;function u(){l=null}function d(e,t,n=s){if(e.length===0)return`(no NPCs in ledger)`;let i=new Set(t??[]),a=e.filter(e=>i.has(e.id)&&!e.archived),o=e.filter(e=>!i.has(e.id)&&!e.archived),c=[...a,...o],l=[],u=0;for(let e of c){let t=f(e),i=r(t);if(u+i>n)break;l.push(t),u+=i}return l.length===0?`(NPC ledger present but no on-stage NPCs fit the budget)`:l.join(`
`)}function f(e){let t=[e.name];e.faction&&t.push(`faction: ${e.faction}`),e.storyRelevance&&t.push(e.storyRelevance);let n=p(e);n&&t.push(`PC relation: ${n}`);let r=m(e);return r&&t.push(`goal: ${r}`),`- ${t.join(`; `)}`}function p(e){if(typeof e.pcRelation!=`number`||!Number.isFinite(e.pcRelation))return null;let t=e.pcRelation;return t<=-3?`hostile`:t<=-2?`cool`:t<=-1?`wary`:t===0?`neutral`:t===1?`friendly`:t===2?`close`:`devoted`}function m(e){let t=e.goalRecords;if(!t||t.length===0)return null;let n=t.filter(e=>e.state===`active`);return n.length===0?null:(n.find(e=>e.horizon===`med`)??n[0]).text}function h(e,t=c){return!e||e.length===0?`(no recent timeline events)`:e.slice(-t).map(e=>`- [${e.sceneId}] ${e.subject} ${e.predicate} ${e.object}: ${e.summary}`).join(`
`)}var g=`You are the Continuity Director of an ongoing role-played campaign. You do not write prose or manufacture drama. You audit the last turn and issue a short brief only when the GM needs a hard-world correction or a compatible NPC-agency repair for the next turn.

VERIFIED FACTS (do not re-derive; act on them):
<watchdog_dossier>
{dossierText}
</watchdog_dossier>
<previous_gm_turn>
{lastAssistant}
</previous_gm_turn>
<player_input>
{userMessage}
</player_input>
<active_npcs>
{npcSummary}
</active_npcs>
<recent_events>
{recentEvents}
</recent_events>
<world_facts>
{worldFacts}
</world_facts>

Use the supplied context as your complete evidence. Do not invent canon, unseen actions, private knowledge, motives, injuries, or social harm. Do not turn a clever, lawful, or tactically sound player action into a moral failing merely to create friction.

Consider, in order:
1. World-law and continuity - does the last GM turn or the player's intended action contradict an established rule, capability, location, prior event, knowledge boundary, or physical consequence? Flag only a contradiction demonstrated by the supplied context. A valid but risky action is not a violation; narrate its real limits or consequences rather than denying it outright.
2. Fair adjudication - did the prior GM response make an NPC naive, omniscient, or able to counter without the knowledge, time, or capability established here? Correct that specific error. In deception or tactical scenes, a target may notice, test, hedge, or counter only from observable cues and their established ability; a successful feint may earn a real opening.
3. Watchdog triage - use the dossier as an agency obligation, not a licence to force conflict. Repair a silent NPC, one-directional relationship, or stalled goal only when the repair fits the scene and does not contradict steps 1-2. Defer it when no truthful opening exists.
4. Restraint - do not schedule disagreement, decentering, callbacks, staleness changes, twists, or emotional escalation. The Writer handles character reactions and scene momentum. If there is no evidenced correction or compatible agency repair, proceed naturally.

OUTPUT exactly this, nothing else:
WRITER BRIEF
- [MANDATORY] <directive>   (0-2 lines)
- [SUGGESTION] <directive>  (0-3 lines)
Use [MANDATORY] only for a demonstrated world-law, continuity, knowledge, or fair-adjudication correction. Use [SUGGESTION] only for one compatible watchdog repair. Each directive is one imperative line naming specific characters. No analysis, no preamble. If nothing is needed, output "WRITER BRIEF" followed by "- [SUGGESTION] Proceed naturally."`;function _(e){return g.replace(`{dossierText}`,e.dossierText).replace(`{lastAssistant}`,e.lastAssistant).replace(`{userMessage}`,e.userMessage).replace(`{npcSummary}`,e.npcSummary).replace(`{recentEvents}`,e.recentEvents).replace(`{worldFacts}`,e.worldFacts?.length?e.worldFacts.join(`
`):`(none)`)}function v(e){if(!e)return null;let t=e.replace(/<think[\s\S]*?<\/think>/gi,``).trim();if(!t)return null;let n=t.search(/WRITER BRIEF/i);return n===-1?null:t.slice(n).trim()}function y(e,t){let n=t?.();return n?.modelName?n:e}async function b(e){if(l&&l.campaignId===e.campaignId&&l.userMessage===e.userMessage)return l.brief;l&&l.campaignId!==e.campaignId&&(l=null);try{let n=y(e.provider,e.getAuxiliaryProvider);if(!n&&!e.modelCall)return null;let r=d(e.npcLedger,e.onStageNpcIds),i=h(e.timeline),s=_({dossierText:e.dossierText,lastAssistant:e.lastAssistant,userMessage:e.userMessage,npcSummary:r,recentEvents:i,worldFacts:e.worldFacts}),c=v(e.modelCall?await e.modelCall(s,{signal:e.signal,maxTokens:e.maxTokens??1500,priority:`low`,trackingLabel:o,timeoutMs:a}):await t(n,s,{signal:e.signal,maxTokens:e.maxTokens??1500,priority:`low`,trackingLabel:o,timeoutMs:a}));return l={campaignId:e.campaignId??``,userMessage:e.userMessage,brief:c},c}catch(t){return t instanceof n?console.warn(`[DirectorBrief] timeout: ${t.message}`):e.signal?.aborted||console.warn(`[DirectorBrief] failed:`,t),null}}function x(e){for(let t=e.length-1;t>=0;t--){let n=e[t];if(n.role===`assistant`&&n.content)return n.content}return``}export{x as n,b as r,i as t};
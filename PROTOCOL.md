# The Nostradamus Intellect protocol

How a forecast is written, sealed, verified, watched and graded — version 0.1, 2026-09-28.

This document describes what the site at [nostradamusintellect.com](https://nostradamusintellect.com) already does.
Where it summarises a document that is itself sealed — the [resolution procedure](https://nostradamusintellect.com/how-a-seal-is-resolved)
and the [pre-registered scorecard](https://nostradamusintellect.com/first-scorecard) — those pages are the authority;
this text only points at them.

---

## 1 · The contract

1. **A sealed probability is never rewritten.** Corrections are dated addenda, printed under the seal, never in place
   of it.
2. **The same number for everyone.** Free and paid readers see the same probability on the same card. A pass buys
   filters, alerts, history and delivery — never a different number, and never earlier access to one.
3. **Misses are published at the same size as hits.**
4. **No claimed track record.** Until verdicts exist, there is no accuracy rate, and nothing here implies one.
5. **Not advice.** Nothing is financial, medical, legal or safety advice. Forward-looking content is probabilistic
   simulation, labelled as such.

## 2 · Three kinds of card

| Kind | Graded? | What it is |
|---|---|---|
| **Ledger seal** (`CAL-01` … `CAL-16`) | **Yes** | A proposition with a probability, a resolve-by date and an objective resolution criterion, hash-sealed and anchored to Bitcoin via OpenTimestamps. Batches of 2026-07-03 and 2026-07-11. |
| **Sealed statement** (`ELN-…`, `ZUC-…`) | **Yes** | A public figure's dated, falsifiable claim, quoted exactly with a primary link, operationalised and sealed through the same procedure (§6). |
| **Projection** (`GEO-…`, `TEC-…`, …) | No | A narrative window with a probability and a falsifiability condition. Not a scored seal; scoring lives in the ledger. |

Every card is published as JSON at `https://nostradamusintellect.com/engine/cards/<id>.json`, and all of them in
summary at [`/engine/record.json`](https://nostradamusintellect.com/engine/record.json). The shape is described in
[`card.schema.json`](card.schema.json).

## 3 · Sealing and verifying

A ledger seal covers exactly nine fields, in this order:

```
id, code, domain, statement, probability, sealedOn, resolveBy, status, resolutionCriteria
```

- **Seal hash** = SHA-256 (hex) of `JSON.stringify` of an object holding those fields in that order (fields absent
  from an entry are omitted). Every ledger card's JSON carries that object as `sealed`, so the hash can be
  recomputed from public data alone.
- **Ledger root** = SHA-256 of `JSON.stringify` of the list of all sealed objects, in ledger order.
- **Anchoring.** The hashes and the root were stamped with [OpenTimestamps](https://opentimestamps.org); each seal's
  proof is at `https://nostradamusintellect.com/ots/<id>.ots` and the list at `/ots/manifest.json`.
- **Why a whitelist.** A field added later for routing (`slug`) once changed every digest although nothing sealed had
  changed. The seal is therefore the nine fields above and nothing else: display fields, links and dated notes live
  outside it and can never move the hash. Adding a field to the seal would invalidate every proof, and would only be
  done by re-stamping the whole ledger in public.

**Verify it yourself:**

```bash
node verify.mjs CAL-12      # one seal
node verify.mjs all         # every seal and the ledger root
ots verify cal-12.ots       # anchor the hash to Bitcoin (OpenTimestamps client)
```

or, with the CLI: `npx -y github:NostradamusIntellect/nostradamus-intellect-mcp verify all`.

## 4 · Resolution

Each seal names its source and its date. On the date, the named source is read and a verdict is proposed; a
**72-hour public challenge window** follows before any grade is final. A seal that cannot be decided as written is
excluded from the Brier score and listed beside it permanently, with the reason. The full procedure, written while
every seal was still pending and itself hash-stamped: [How a seal is resolved](https://nostradamusintellect.com/how-a-seal-is-resolved).

## 5 · Scoring

- **Brier score** per item, `(p − o)²` with `o ∈ {0, 1}`, reported against a **stated baseline per item** (base rate,
  persistence or climatology — named on each seal). The items, baselines and rules of the first formal report were
  fixed while every seal was pending: [the first scorecard](https://nostradamusintellect.com/first-scorecard).
- **The arithmetic of a small ledger**, published before any verdict. For probabilities `p`:
  - expected "misses" (outcomes on the side called less likely) = `Σ min(p, 1 − p)`;
  - expected Brier of a perfectly calibrated forecaster = `mean p(1 − p)`, with variance `Σ p(1 − p)(1 − 2p)² / n²`.

  On the sixteen ledger seals that is **≈ 5.0 misses** and **0.20 ± 0.04**, a range that overlaps a coin-flipper's
  0.25. Sixteen items test the procedure, not skill. Skill needs volume; the plan for it is on the
  [Proving Ground](https://nostradamusintellect.com/proving-ground).

## 6 · Sealed statements of public figures

1. **Quote exactly**, with the date, venue and a primary link. A later restatement is recorded beside it.
2. **Operationalise** vague words into a countable threshold, written to the most reasonable reading a supporter
   would accept — never the strictest. A seal that wins on a technicality is worthless.
3. **Anchor to what was already sealed.** The probability is derived from positions published *before* the statement
   was examined, with the decomposition shown on the card.
4. **Separate whether from when.** Each seal says which kind of disagreement it encodes.
5. **Seal and stop.** Graded on the date, published whichever way it falls. The claim is rated — never the person.

## 7 · The engine and the live lean

The sealed numbers are written judgment, decomposed on each card. The engine — **the Loom** — does not write them. It
tracks how far the world has moved since they were sealed.

- **State.** 36 named strands (6 threads × 6 axes), each in [−1, +1], advanced every 6 hours:
  `s'[i] = clamp( round1000( clampStep( DIAG·s[i] + COUPLING_SCALE·Σ(w·s[from]) + Σ(impulse) ) ) )` with
  `DIAG 0.99`, `COUPLING_SCALE 0.1`, `STEP_CAP 0.15`, `CLAMP 1`, quantum 0.001. The 24 couplings are published with
  their rationale.
- **Wire impulses.** Headlines from eight live wires are clustered into stories; a story applies its impulse once,
  weighted by independent confirmation: `w = 0.5 + 0.5 · min(1, (wires − 1) / 2)` — one wire half weight, three or
  more full weight.
- **The membrane.** Every step is checked against the published rule before it is saved (all 36 strands present and
  finite, within ±1, no move beyond the step cap); a step that fails is refused and recorded, never saved.
- **Versioning.** The update rule is versioned (v1 2026-07-03, v2 2026-09-06); every archived tick replays under the
  version that governed its timestamp.
- **Live lean.** `live = seal + clamp( round( Σ w_k·(strand_k − base_k)·12 ), −7, +7 )`. It is shown separately from
  the seal, and it is a reading, never a revision. `base_k` is the Loom's documented seed for entries sealed before
  the Loom existed, and the strands at sealing time for entries sealed after it.
- **Alerts.** A strand alerts only at z ≥ 2.5 against its own 30-day distribution, carried by ≥ 3 independent wires,
  above a floor of 0.12 over 72 hours. Openings and clearings are appended to a public log that nothing deletes.

The full constants are in the public [model card](https://nostradamusintellect.com/engine/model-card.json). The
complete 46-rule lexicon and the lean map as one file open with the Instrument pass; they are not part of this
repository.

## 8 · Observers

Anyone can seal their own probability against a ledger seal or projection. It is locked on submit, never editable,
and graded on the same date against the same criterion. House and observer Brier scores sit side by side. Weight comes
from calibration, not seniority.

## 9 · What is refused

- Published backtests: the historical layer is curated with hindsight, and a score earned against it would be
  decoration.
- Edited seals.
- A claimed track record before verdicts exist.
- A different probability for paying readers.
- Quatrain decoding presented as forecast.

## 10 · Changes to this protocol

Changes are dated in [CHANGELOG.md](CHANGELOG.md). A change never alters a seal already made.

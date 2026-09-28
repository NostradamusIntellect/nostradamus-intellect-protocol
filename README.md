# Nostradamus Intellect — the protocol

**How a forecast is written, sealed, verified and graded in public.** The open protocol behind
[nostradamusintellect.com](https://nostradamusintellect.com): every claim carries a probability, a resolution date and a
condition a stranger could adjudicate; it is hash-sealed before the outcome, anchored to Bitcoin through
OpenTimestamps, and graded with a Brier score when its date arrives — misses printed at the same size as hits.

- **[PROTOCOL.md](PROTOCOL.md)** — the contract, the three kinds of card, sealing and verification, resolution,
  scoring, sealed statements of public figures, the engine and the live lean, observers, what is refused.
- **[card.schema.json](card.schema.json)** — the JSON shape of every card at `/engine/cards/<id>.json`.
- **[verify.mjs](verify.mjs)** — recompute any seal's SHA-256, and the ledger root, from public data alone.

```bash
node verify.mjs all
```

> Status: 0 sealed cards graded. The first public verdict is **2027-02-28**. On these sixteen seals a perfectly
> calibrated forecaster would still expect about five misses — see PROTOCOL.md §5.

## Use it for your own forecasts

The protocol is not specific to us. Seal a whitelist of fields, hash them, timestamp the hash, publish a criterion a
stranger can apply, and grade it on the date with the misses at the same size as the hits. If you run a forecasting
desk, a newsroom or a research group and want your own public claims sealed and graded under these rules, write to us.

## Work with us

Nostradamus Intellect is built in the open by one founder. We are looking for people:

- **Improve the protocol:** open an issue or a pull request — unclear wording, a better canonical form, a resolution
  edge case, a translation. See [CONTRIBUTING.md](CONTRIBUTING.md).
- **Builders:** the `ni` CLI and MCP server live in
  [nostradamus-intellect-mcp](https://github.com/NostradamusIntellect/nostradamus-intellect-mcp) —
  [where we need help](https://github.com/NostradamusIntellect/nostradamus-intellect-mcp/blob/main/CONTRIBUTING.md).
  We are open to people who want to join the founding team.
- **Forecasters and researchers:** seal your own numbers through the
  [Observer Protocol](https://nostradamusintellect.com/observers), or bring your published claims to be sealed and
  graded under these rules.
- **Newsrooms, platforms, institutions and AI-evaluation teams:** the record as data, commissioned questions graded in
  public, calibration training.
- **Investors, donors and supporters:** the record is free to read forever, with no ads — write to us if you want to
  back that.
- Everyone: [nostradamusintellect@proton.me](mailto:nostradamusintellect@proton.me)

Nothing can be bought: partnerships, sponsorship, donations and investment never change a probability, a date or a
criterion.

[nostradamusintellect.com](https://nostradamusintellect.com) · [X @Nostradamusmind](https://x.com/Nostradamusmind) ·
[En français](https://nostradamusintellect.com/fr)

## Licence

This protocol text and schema are CC BY 4.0 — reuse them with attribution to Nostradamus Intellect. `verify.mjs` may be
used under the same terms.

<sub>Not financial, medical, legal or safety advice. Forward-looking content is probabilistic simulation. Nothing here
is a reading of Michel de Nostredame.</sub>

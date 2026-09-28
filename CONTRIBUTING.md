# Contributing

Suggestions are welcome, and the most useful ones are specific:

- **A criterion that could not be adjudicated as written** — name the card code and the ambiguous case.
- **A seal that does not verify** — paste the output of `node verify.mjs <code>`.
- **Wording that overclaims** — anything that reads as an accuracy rate, as advice, or as prophecy.
- **The canonical form** — proposals for a stricter canonical JSON (for example RFC 8785) for future batches. Existing
  seals are never re-hashed; a change applies only to seals made after it, and is dated.
- **Translations** of PROTOCOL.md.

Open an issue first; a pull request against `PROTOCOL.md` should say which section it changes and why.

What will not be accepted: anything that edits a seal already made, gives paying readers a different number, or
presents a projection as a scored forecast.

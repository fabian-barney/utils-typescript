# utils-typescript

`utils-typescript` is a small TypeScript utility library for converting storage
and transfer units across byte- and bit-based scales.

It includes:

- `ByteUnit` for byte units such as `BYTE`, `KIB`, `MIB`, `KB`, and `MB`
- `BitUnit` for bit units such as `BIT`, `KIBIT`, `MIBIT`, `KBIT`, and `MBIT`
- cross-conversion helpers between byte and bit units
- optional custom bits-per-byte values instead of assuming an 8-bit byte

## Requirements

- Node.js 24 or newer to run the published package
- Node.js 24.11 or newer to install and run the build tooling
- npm 11 or newer

## Build and Test

```bash
npm ci
npm run typecheck
npm run build
npm run verify-build-outputs
npm test
npm run cognitive-typescript-check
npm run crap-typescript-check
npm pack --json --dry-run --ignore-scripts
```

The published package keeps a Node.js `>=24` runtime floor. The `tsdown`
development build tool requires Node.js 24.11 or newer.

`npm run cognitive-typescript-check` runs the repository through the published
`@barney-media/cognitive-typescript` gate for the sources under `src/`.
`npm run crap-typescript-check` runs the repository through a CRAP gate using
the published Vitest adapter for the sources under `src/`.

## Usage

```ts
import { BitUnit, ByteUnit } from "@barney-media/utils-typescript";

const kibibytes = ByteUnit.MB.toKiB(5);
const megabits = ByteUnit.MIB.toMbit(2);
const bytes = BitUnit.MBIT.toBytes(100);
const gibibytes = BitUnit.GBIT.toGiB(64);
```

You can also convert values from one unit singleton into another directly:

```ts
import { BitUnit, ByteUnit } from "@barney-media/utils-typescript";

const mib = ByteUnit.MIB.convert(1536, ByteUnit.KIB);
const mbit = BitUnit.MBIT.convert(12, ByteUnit.MB);
```

If you need a custom bits-per-byte value, use the optional trailing
`bitsPerByte` argument:

```ts
import { BitUnit, ByteUnit } from "@barney-media/utils-typescript";

const bytes = BitUnit.KIBIT.toBytes(8, 16);
const bits = ByteUnit.KIB.toBits(4, 16);
```

## Supported Units

`ByteUnit` supports:

- Binary units: `BYTE`, `KIB`, `MIB`, `GIB`, `TIB`, `PIB`
- Decimal units: `KB`, `MB`, `GB`, `TB`, `PB`

`BitUnit` supports:

- Binary units: `BIT`, `KIBIT`, `MIBIT`, `GIBIT`, `TIBIT`, `PIBIT`
- Decimal units: `KBIT`, `MBIT`, `GBIT`, `TBIT`, `PBIT`

## Notes

- Conversions return `number`.
- Byte-to-bit conversions assume an 8-bit byte by default.
- Methods throw `RangeError` for non-finite or negative values and invalid
  `bitsPerByte` arguments.
- Multiplication-heavy conversion paths include overflow guards.

## License

Apache License 2.0. See `LICENSE`.

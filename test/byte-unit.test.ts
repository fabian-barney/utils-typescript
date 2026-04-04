import { describe, expect, test } from "vitest";

import {
  BitUnit,
  ByteUnit,
  type BitUnitName,
  type BitUnitValue,
  type ByteUnitName,
  type ByteUnitValue
} from "../src/index.js";

const DELTA = 10;

const byteFactors: Record<ByteUnitName, number> = {
  BYTE: 1,
  KIB: 2 ** 10,
  MIB: 2 ** 20,
  GIB: 2 ** 30,
  TIB: 2 ** 40,
  PIB: 2 ** 50,
  KB: 10 ** 3,
  MB: 10 ** 6,
  GB: 10 ** 9,
  TB: 10 ** 12,
  PB: 10 ** 15
};

const bitFactors: Record<BitUnitName, number> = {
  BIT: 1,
  KIBIT: 2 ** 10,
  MIBIT: 2 ** 20,
  GIBIT: 2 ** 30,
  TIBIT: 2 ** 40,
  PIBIT: 2 ** 50,
  KBIT: 10 ** 3,
  MBIT: 10 ** 6,
  GBIT: 10 ** 9,
  TBIT: 10 ** 12,
  PBIT: 10 ** 15
};

const invalidBitsPerByteValues = [
  0,
  -8,
  0.5,
  Number.NaN,
  Number.POSITIVE_INFINITY
];
const invalidInputValues = [
  Number.NaN,
  Number.POSITIVE_INFINITY,
  Number.NEGATIVE_INFINITY
];

function bytesPerUnit(unit: ByteUnitValue): number {
  return byteFactors[unit.name];
}

function bitsPerUnit(unit: BitUnitValue): number {
  return bitFactors[unit.name];
}

describe("ByteUnit", () => {
  test.each(ByteUnit.values())("$name converts to binary byte scales", (unit) => {
    const value = 7.5;
    const bytes = value * bytesPerUnit(unit);

    expect(unit.toKiB(value)).toBeCloseTo(bytes / byteFactors.KIB, DELTA);
    expect(unit.toMiB(value)).toBeCloseTo(bytes / byteFactors.MIB, DELTA);
    expect(unit.toGiB(value)).toBeCloseTo(bytes / byteFactors.GIB, DELTA);
    expect(unit.toTiB(value)).toBeCloseTo(bytes / byteFactors.TIB, DELTA);
    expect(unit.toPiB(value)).toBeCloseTo(bytes / byteFactors.PIB, DELTA);
  });

  test.each(ByteUnit.values())("$name converts to decimal byte scales", (unit) => {
    const value = 3.25;
    const bytes = value * bytesPerUnit(unit);

    expect(unit.toKB(value)).toBeCloseTo(bytes / byteFactors.KB, DELTA);
    expect(unit.toMB(value)).toBeCloseTo(bytes / byteFactors.MB, DELTA);
    expect(unit.toGB(value)).toBeCloseTo(bytes / byteFactors.GB, DELTA);
    expect(unit.toTB(value)).toBeCloseTo(bytes / byteFactors.TB, DELTA);
    expect(unit.toPB(value)).toBeCloseTo(bytes / byteFactors.PB, DELTA);
  });

  test.each(ByteUnit.values())("$name converts to bit scales", (unit) => {
    const value = 5;
    const bytes = value * bytesPerUnit(unit);
    const bits = bytes * 8;
    const bitsPerByte = 16;
    const customBits = bytes * bitsPerByte;

    expect(unit.toBits(value)).toBeCloseTo(bits, DELTA);
    expect(unit.toBits(value, bitsPerByte)).toBeCloseTo(customBits, DELTA);

    expect(unit.toKibit(value)).toBeCloseTo(bits / bitFactors.KIBIT, DELTA);
    expect(unit.toMibit(value)).toBeCloseTo(bits / bitFactors.MIBIT, DELTA);
    expect(unit.toGibit(value)).toBeCloseTo(bits / bitFactors.GIBIT, DELTA);
    expect(unit.toTibit(value)).toBeCloseTo(bits / bitFactors.TIBIT, DELTA);
    expect(unit.toPibit(value)).toBeCloseTo(bits / bitFactors.PIBIT, DELTA);

    expect(unit.toKibit(value, bitsPerByte)).toBeCloseTo(
      customBits / bitFactors.KIBIT,
      DELTA
    );
    expect(unit.toMibit(value, bitsPerByte)).toBeCloseTo(
      customBits / bitFactors.MIBIT,
      DELTA
    );
    expect(unit.toGibit(value, bitsPerByte)).toBeCloseTo(
      customBits / bitFactors.GIBIT,
      DELTA
    );
    expect(unit.toTibit(value, bitsPerByte)).toBeCloseTo(
      customBits / bitFactors.TIBIT,
      DELTA
    );
    expect(unit.toPibit(value, bitsPerByte)).toBeCloseTo(
      customBits / bitFactors.PIBIT,
      DELTA
    );

    expect(unit.toKbit(value)).toBeCloseTo(bits / bitFactors.KBIT, DELTA);
    expect(unit.toMbit(value)).toBeCloseTo(bits / bitFactors.MBIT, DELTA);
    expect(unit.toGbit(value)).toBeCloseTo(bits / bitFactors.GBIT, DELTA);
    expect(unit.toTbit(value)).toBeCloseTo(bits / bitFactors.TBIT, DELTA);
    expect(unit.toPbit(value)).toBeCloseTo(bits / bitFactors.PBIT, DELTA);

    expect(unit.toKbit(value, bitsPerByte)).toBeCloseTo(
      customBits / bitFactors.KBIT,
      DELTA
    );
    expect(unit.toMbit(value, bitsPerByte)).toBeCloseTo(
      customBits / bitFactors.MBIT,
      DELTA
    );
    expect(unit.toGbit(value, bitsPerByte)).toBeCloseTo(
      customBits / bitFactors.GBIT,
      DELTA
    );
    expect(unit.toTbit(value, bitsPerByte)).toBeCloseTo(
      customBits / bitFactors.TBIT,
      DELTA
    );
    expect(unit.toPbit(value, bitsPerByte)).toBeCloseTo(
      customBits / bitFactors.PBIT,
      DELTA
    );
  });

  const byteAndBitUnits = ByteUnit.values().flatMap((target) =>
    BitUnit.values().map((source) => ({ target, source }))
  );

  test.each(byteAndBitUnits)(
    "$source.name converts to $target.name",
    ({ target, source }) => {
      const value = 2.75;
      const bits = value * bitsPerUnit(source);
      const bytes = bits / 8;
      const expected = bytes / bytesPerUnit(target);

      expect(target.convert(value, source)).toBeCloseTo(expected, DELTA);

      const bitsPerByte = 12;
      const customBytes = bits / bitsPerByte;
      expect(target.convert(value, source, bitsPerByte)).toBeCloseTo(
        customBytes / bytesPerUnit(target),
        DELTA
      );
    }
  );

  const bitAndByteUnits = BitUnit.values().flatMap((target) =>
    ByteUnit.values().map((source) => ({ target, source }))
  );

  test.each(bitAndByteUnits)(
    "$source.name converts to $target.name bits",
    ({ target, source }) => {
      const value = 9.125;
      const bytes = value * bytesPerUnit(source);
      const bits = bytes * 8;
      const expected = bits / bitsPerUnit(target);

      expect(target.convert(value, source)).toBeCloseTo(expected, DELTA);

      const bitsPerByte = 20;
      const customBits = bytes * bitsPerByte;
      expect(target.convert(value, source, bitsPerByte)).toBeCloseTo(
        customBits / bitsPerUnit(target),
        DELTA
      );
    }
  );

  test("values returns the supported units in declaration order", () => {
    expect(ByteUnit.values().map((unit) => unit.name)).toEqual([
      "BYTE",
      "KIB",
      "MIB",
      "GIB",
      "TIB",
      "PIB",
      "KB",
      "MB",
      "GB",
      "TB",
      "PB"
    ]);
  });

  test.each(ByteUnit.values())("$name resolves through valueOf", (unit) => {
    expect(ByteUnit.valueOf(unit.name)).toBe(unit);
  });

  test("valueOf rejects unknown unit names", () => {
    expect(() => ByteUnit.valueOf("UNKNOWN")).toThrowError(
      "Unknown ByteUnit: UNKNOWN"
    );
  });

  test.each(ByteUnit.values())("$name rejects negative input values", (unit) => {
    expect(() => unit.toBytes(-1)).toThrowError(
      new RangeError("value must be a non-negative finite number")
    );
    expect(() => unit.toBits(-1)).toThrowError(
      new RangeError("value must be a non-negative finite number")
    );
    expect(() => unit.convert(-1, ByteUnit.BYTE)).toThrowError(
      new RangeError("value must be a non-negative finite number")
    );
    expect(() => unit.convert(-1, BitUnit.BIT)).toThrowError(
      new RangeError("value must be a non-negative finite number")
    );
  });

  test.each(invalidInputValues)(
    "byte entry points reject non-finite input value %p",
    (value) => {
      expect(() => ByteUnit.MB.toBytes(value)).toThrowError(
        new RangeError("value must be a non-negative finite number")
      );
      expect(() => ByteUnit.MB.toBits(value)).toThrowError(
        new RangeError("value must be a non-negative finite number")
      );
      expect(() => ByteUnit.MB.convert(value, ByteUnit.KB)).toThrowError(
        new RangeError("value must be a non-negative finite number")
      );
      expect(() => ByteUnit.MB.convert(value, BitUnit.MBIT)).toThrowError(
        new RangeError("value must be a non-negative finite number")
      );
    }
  );

  test.each(invalidBitsPerByteValues)(
    "cross-family byte conversions reject invalid bitsPerByte %p",
    (bitsPerByte) => {
      expect(() => ByteUnit.MB.toBits(1, bitsPerByte)).toThrowError(
        new RangeError("bitsPerByte must be a positive integer")
      );
      expect(() =>
        ByteUnit.MB.convert(1, BitUnit.MBIT, bitsPerByte)
      ).toThrowError(new RangeError("bitsPerByte must be a positive integer"));
    }
  );

  test("byte units are frozen singletons", () => {
    expect(ByteUnit.values().every((unit) => Object.isFrozen(unit))).toBe(true);
    expect(() => {
      (ByteUnit.BYTE as unknown as { name: string }).name = "BROKEN";
    }).toThrow(TypeError);
    expect(ByteUnit.BYTE.name).toBe("BYTE");
  });

  test("overflow-heavy positive byte conversions still saturate", () => {
    expect(ByteUnit.PB.toBytes(Number.MAX_VALUE)).toBe(Number.MAX_VALUE);
  });
});

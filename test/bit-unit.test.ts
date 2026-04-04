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

function bitsPerUnit(unit: BitUnitValue): number {
  return bitFactors[unit.name];
}

function bytesPerUnit(unit: ByteUnitValue): number {
  return byteFactors[unit.name];
}

describe("BitUnit", () => {
  test.each(BitUnit.values())("$name converts to plain bits", (unit) => {
    const value = 4.5;
    const expected = value * bitsPerUnit(unit);

    expect(unit.toBits(value)).toBeCloseTo(expected, DELTA);
  });

  const bitToBitConversions = BitUnit.values().flatMap((target) =>
    BitUnit.values().map((source) => ({ target, source }))
  );

  test.each(bitToBitConversions)(
    "$source.name converts to $target.name",
    ({ target, source }) => {
      const value = 8.75;
      const bits = value * bitsPerUnit(source);
      const expected = bits / bitsPerUnit(target);

      expect(target.convert(value, source)).toBeCloseTo(expected, DELTA);
    }
  );

  const bitToByteConversions = BitUnit.values().flatMap((target) =>
    ByteUnit.values().map((source) => ({ target, source }))
  );

  test.each(bitToByteConversions)(
    "$source.name byte inputs convert to $target.name",
    ({ target, source }) => {
      const value = 6.125;
      const bytes = value * bytesPerUnit(source);
      const bits = bytes * 8;
      const expected = bits / bitsPerUnit(target);

      expect(target.convert(value, source)).toBeCloseTo(expected, DELTA);

      const bitsPerByte = 24;
      const customBits = bytes * bitsPerByte;
      expect(target.convert(value, source, bitsPerByte)).toBeCloseTo(
        customBits / bitsPerUnit(target),
        DELTA
      );
    }
  );

  const byteToBitConversions = ByteUnit.values().flatMap((target) =>
    BitUnit.values().map((source) => ({ target, source }))
  );

  test.each(byteToBitConversions)(
    "$source.name bit inputs convert to $target.name bytes",
    ({ target, source }) => {
      const value = 1.375;
      const bits = value * bitsPerUnit(source);
      const bytes = bits / 8;
      const expected = bytes / bytesPerUnit(target);

      expect(target.convert(value, source)).toBeCloseTo(expected, DELTA);

      const bitsPerByte = 32;
      const customBytes = bits / bitsPerByte;
      expect(target.convert(value, source, bitsPerByte)).toBeCloseTo(
        customBytes / bytesPerUnit(target),
        DELTA
      );
    }
  );

  test.each(BitUnit.values())("$name converts to byte representations", (unit) => {
    const value = 2;
    const bits = value * bitsPerUnit(unit);
    const bytes = bits / 8;
    const bitsPerByte = 10;
    const customBytes = bits / bitsPerByte;

    expect(unit.toBytes(value)).toBeCloseTo(bytes, DELTA);
    expect(unit.toBytes(value, bitsPerByte)).toBeCloseTo(customBytes, DELTA);

    expect(unit.toKiB(value)).toBeCloseTo(bytes / byteFactors.KIB, DELTA);
    expect(unit.toMiB(value)).toBeCloseTo(bytes / byteFactors.MIB, DELTA);
    expect(unit.toGiB(value)).toBeCloseTo(bytes / byteFactors.GIB, DELTA);
    expect(unit.toTiB(value)).toBeCloseTo(bytes / byteFactors.TIB, DELTA);
    expect(unit.toPiB(value)).toBeCloseTo(bytes / byteFactors.PIB, DELTA);

    expect(unit.toKiB(value, bitsPerByte)).toBeCloseTo(
      customBytes / byteFactors.KIB,
      DELTA
    );
    expect(unit.toMiB(value, bitsPerByte)).toBeCloseTo(
      customBytes / byteFactors.MIB,
      DELTA
    );
    expect(unit.toGiB(value, bitsPerByte)).toBeCloseTo(
      customBytes / byteFactors.GIB,
      DELTA
    );
    expect(unit.toTiB(value, bitsPerByte)).toBeCloseTo(
      customBytes / byteFactors.TIB,
      DELTA
    );
    expect(unit.toPiB(value, bitsPerByte)).toBeCloseTo(
      customBytes / byteFactors.PIB,
      DELTA
    );

    expect(unit.toKB(value)).toBeCloseTo(bytes / byteFactors.KB, DELTA);
    expect(unit.toMB(value)).toBeCloseTo(bytes / byteFactors.MB, DELTA);
    expect(unit.toGB(value)).toBeCloseTo(bytes / byteFactors.GB, DELTA);
    expect(unit.toTB(value)).toBeCloseTo(bytes / byteFactors.TB, DELTA);
    expect(unit.toPB(value)).toBeCloseTo(bytes / byteFactors.PB, DELTA);

    expect(unit.toKB(value, bitsPerByte)).toBeCloseTo(
      customBytes / byteFactors.KB,
      DELTA
    );
    expect(unit.toMB(value, bitsPerByte)).toBeCloseTo(
      customBytes / byteFactors.MB,
      DELTA
    );
    expect(unit.toGB(value, bitsPerByte)).toBeCloseTo(
      customBytes / byteFactors.GB,
      DELTA
    );
    expect(unit.toTB(value, bitsPerByte)).toBeCloseTo(
      customBytes / byteFactors.TB,
      DELTA
    );
    expect(unit.toPB(value, bitsPerByte)).toBeCloseTo(
      customBytes / byteFactors.PB,
      DELTA
    );
  });

  test("values returns the supported units in declaration order", () => {
    expect(BitUnit.values().map((unit) => unit.name)).toEqual([
      "BIT",
      "KIBIT",
      "MIBIT",
      "GIBIT",
      "TIBIT",
      "PIBIT",
      "KBIT",
      "MBIT",
      "GBIT",
      "TBIT",
      "PBIT"
    ]);
  });

  test.each(BitUnit.values())("$name resolves through valueOf", (unit) => {
    expect(BitUnit.valueOf(unit.name)).toBe(unit);
  });

  test("valueOf rejects unknown unit names", () => {
    expect(() => BitUnit.valueOf("UNKNOWN")).toThrowError(
      "Unknown BitUnit: UNKNOWN"
    );
  });

  test.each(BitUnit.values())("$name rejects negative input values", (unit) => {
    expect(() => unit.toBits(-1)).toThrowError(
      new RangeError("value must be a non-negative finite number")
    );
    expect(() => unit.toBytes(-1)).toThrowError(
      new RangeError("value must be a non-negative finite number")
    );
    expect(() => unit.convert(-1, BitUnit.BIT)).toThrowError(
      new RangeError("value must be a non-negative finite number")
    );
    expect(() => unit.convert(-1, ByteUnit.BYTE)).toThrowError(
      new RangeError("value must be a non-negative finite number")
    );
  });

  test.each(invalidInputValues)(
    "bit entry points reject non-finite input value %p",
    (value) => {
      expect(() => BitUnit.MBIT.toBits(value)).toThrowError(
        new RangeError("value must be a non-negative finite number")
      );
      expect(() => BitUnit.MBIT.toBytes(value)).toThrowError(
        new RangeError("value must be a non-negative finite number")
      );
      expect(() => BitUnit.MBIT.convert(value, BitUnit.KBIT)).toThrowError(
        new RangeError("value must be a non-negative finite number")
      );
      expect(() => BitUnit.MBIT.convert(value, ByteUnit.MB)).toThrowError(
        new RangeError("value must be a non-negative finite number")
      );
    }
  );

  test.each(invalidBitsPerByteValues)(
    "cross-family bit conversions reject invalid bitsPerByte %p",
    (bitsPerByte) => {
      expect(() => BitUnit.MBIT.toBytes(1, bitsPerByte)).toThrowError(
        new RangeError("bitsPerByte must be a positive integer")
      );
      expect(() =>
        BitUnit.MBIT.convert(1, ByteUnit.MB, bitsPerByte)
      ).toThrowError(new RangeError("bitsPerByte must be a positive integer"));
    }
  );

  test("bit units are frozen singletons", () => {
    expect(BitUnit.values().every((unit) => Object.isFrozen(unit))).toBe(true);
    expect(() => {
      (BitUnit.BIT as unknown as { name: string }).name = "BROKEN";
    }).toThrow(TypeError);
    expect(BitUnit.BIT.name).toBe("BIT");
  });

  test("overflow-heavy positive bit conversions still saturate", () => {
    expect(BitUnit.PBIT.toBits(Number.MAX_VALUE)).toBe(Number.MAX_VALUE);
  });
});

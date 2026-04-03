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

      const wordSize = 24;
      const wordBits = bytes * wordSize;
      expect(target.convert(value, source, wordSize)).toBeCloseTo(
        wordBits / bitsPerUnit(target),
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

      const wordSize = 32;
      const customBytes = bits / wordSize;
      expect(target.convert(value, source, wordSize)).toBeCloseTo(
        customBytes / bytesPerUnit(target),
        DELTA
      );
    }
  );

  test.each(BitUnit.values())("$name converts to byte representations", (unit) => {
    const value = 2;
    const bits = value * bitsPerUnit(unit);
    const bytes = bits / 8;
    const wordSize = 10;
    const wordBytes = bits / wordSize;

    expect(unit.toBytes(value)).toBeCloseTo(bytes, DELTA);
    expect(unit.toBytes(value, wordSize)).toBeCloseTo(wordBytes, DELTA);

    expect(unit.toKiB(value)).toBeCloseTo(bytes / byteFactors.KIB, DELTA);
    expect(unit.toMiB(value)).toBeCloseTo(bytes / byteFactors.MIB, DELTA);
    expect(unit.toGiB(value)).toBeCloseTo(bytes / byteFactors.GIB, DELTA);
    expect(unit.toTiB(value)).toBeCloseTo(bytes / byteFactors.TIB, DELTA);
    expect(unit.toPiB(value)).toBeCloseTo(bytes / byteFactors.PIB, DELTA);

    expect(unit.toKiB(value, wordSize)).toBeCloseTo(
      wordBytes / byteFactors.KIB,
      DELTA
    );
    expect(unit.toMiB(value, wordSize)).toBeCloseTo(
      wordBytes / byteFactors.MIB,
      DELTA
    );
    expect(unit.toGiB(value, wordSize)).toBeCloseTo(
      wordBytes / byteFactors.GIB,
      DELTA
    );
    expect(unit.toTiB(value, wordSize)).toBeCloseTo(
      wordBytes / byteFactors.TIB,
      DELTA
    );
    expect(unit.toPiB(value, wordSize)).toBeCloseTo(
      wordBytes / byteFactors.PIB,
      DELTA
    );

    expect(unit.toKB(value)).toBeCloseTo(bytes / byteFactors.KB, DELTA);
    expect(unit.toMB(value)).toBeCloseTo(bytes / byteFactors.MB, DELTA);
    expect(unit.toGB(value)).toBeCloseTo(bytes / byteFactors.GB, DELTA);
    expect(unit.toTB(value)).toBeCloseTo(bytes / byteFactors.TB, DELTA);
    expect(unit.toPB(value)).toBeCloseTo(bytes / byteFactors.PB, DELTA);

    expect(unit.toKB(value, wordSize)).toBeCloseTo(
      wordBytes / byteFactors.KB,
      DELTA
    );
    expect(unit.toMB(value, wordSize)).toBeCloseTo(
      wordBytes / byteFactors.MB,
      DELTA
    );
    expect(unit.toGB(value, wordSize)).toBeCloseTo(
      wordBytes / byteFactors.GB,
      DELTA
    );
    expect(unit.toTB(value, wordSize)).toBeCloseTo(
      wordBytes / byteFactors.TB,
      DELTA
    );
    expect(unit.toPB(value, wordSize)).toBeCloseTo(
      wordBytes / byteFactors.PB,
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

  test("overflow-heavy bit conversions clamp like the Java implementation", () => {
    expect(BitUnit.PBIT.toBits(Number.MAX_VALUE)).toBe(Number.MAX_VALUE);
    expect(BitUnit.PBIT.toBits(-Number.MAX_VALUE)).toBe(Number.MIN_VALUE);
  });
});


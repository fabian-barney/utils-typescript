const DEFAULT_WORD_SIZE = 8;

const BYTE_UNIT_NAMES = [
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
] as const;

const BIT_UNIT_NAMES = [
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
] as const;

export type ByteUnitName = (typeof BYTE_UNIT_NAMES)[number];
export type BitUnitName = (typeof BIT_UNIT_NAMES)[number];

const BYTE_FACTORS: Record<ByteUnitName, number> = {
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

const BIT_FACTORS: Record<BitUnitName, number> = {
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

function safeMultiply(value: number, multiplier: number): number {
  const limit = Number.MAX_VALUE / multiplier;

  if (value > limit) {
    return Number.MAX_VALUE;
  }

  if (value < -limit) {
    return Number.MIN_VALUE;
  }

  return value * multiplier;
}

function isByteUnitName(name: string): name is ByteUnitName {
  return Object.prototype.hasOwnProperty.call(BYTE_FACTORS, name);
}

function isBitUnitName(name: string): name is BitUnitName {
  return Object.prototype.hasOwnProperty.call(BIT_FACTORS, name);
}

export interface ByteUnitValue {
  readonly family: "byte";
  readonly name: ByteUnitName;
  toBytes(value: number): number;
  toKiB(value: number): number;
  toMiB(value: number): number;
  toGiB(value: number): number;
  toTiB(value: number): number;
  toPiB(value: number): number;
  toKB(value: number): number;
  toMB(value: number): number;
  toGB(value: number): number;
  toTB(value: number): number;
  toPB(value: number): number;
  toBits(value: number, wordSize?: number): number;
  toKibit(value: number, wordSize?: number): number;
  toMibit(value: number, wordSize?: number): number;
  toGibit(value: number, wordSize?: number): number;
  toTibit(value: number, wordSize?: number): number;
  toPibit(value: number, wordSize?: number): number;
  toKbit(value: number, wordSize?: number): number;
  toMbit(value: number, wordSize?: number): number;
  toGbit(value: number, wordSize?: number): number;
  toTbit(value: number, wordSize?: number): number;
  toPbit(value: number, wordSize?: number): number;
  convert(value: number, unit: ByteUnitValue): number;
  convert(value: number, unit: BitUnitValue, wordSize?: number): number;
}

export interface BitUnitValue {
  readonly family: "bit";
  readonly name: BitUnitName;
  toBits(value: number): number;
  toKibit(value: number): number;
  toMibit(value: number): number;
  toGibit(value: number): number;
  toTibit(value: number): number;
  toPibit(value: number): number;
  toKbit(value: number): number;
  toMbit(value: number): number;
  toGbit(value: number): number;
  toTbit(value: number): number;
  toPbit(value: number): number;
  toBytes(value: number, wordSize?: number): number;
  toKiB(value: number, wordSize?: number): number;
  toMiB(value: number, wordSize?: number): number;
  toGiB(value: number, wordSize?: number): number;
  toTiB(value: number, wordSize?: number): number;
  toPiB(value: number, wordSize?: number): number;
  toKB(value: number, wordSize?: number): number;
  toMB(value: number, wordSize?: number): number;
  toGB(value: number, wordSize?: number): number;
  toTB(value: number, wordSize?: number): number;
  toPB(value: number, wordSize?: number): number;
  convert(value: number, unit: BitUnitValue): number;
  convert(value: number, unit: ByteUnitValue, wordSize?: number): number;
}

export interface ByteUnitRegistry extends Record<ByteUnitName, ByteUnitValue> {
  values(): readonly ByteUnitValue[];
  valueOf(name: ByteUnitName | string): ByteUnitValue;
}

export interface BitUnitRegistry extends Record<BitUnitName, BitUnitValue> {
  values(): readonly BitUnitValue[];
  valueOf(name: BitUnitName | string): BitUnitValue;
}

class ByteUnitImpl implements ByteUnitValue {
  readonly family = "byte" as const;

  constructor(
    public readonly name: ByteUnitName,
    private readonly factor: number
  ) {}

  toBytes(value: number): number {
    return safeMultiply(value, this.factor);
  }

  toKiB(value: number): number {
    return this.toBytes(value) / BYTE_FACTORS.KIB;
  }

  toMiB(value: number): number {
    return this.toBytes(value) / BYTE_FACTORS.MIB;
  }

  toGiB(value: number): number {
    return this.toBytes(value) / BYTE_FACTORS.GIB;
  }

  toTiB(value: number): number {
    return this.toBytes(value) / BYTE_FACTORS.TIB;
  }

  toPiB(value: number): number {
    return this.toBytes(value) / BYTE_FACTORS.PIB;
  }

  toKB(value: number): number {
    return this.toBytes(value) / BYTE_FACTORS.KB;
  }

  toMB(value: number): number {
    return this.toBytes(value) / BYTE_FACTORS.MB;
  }

  toGB(value: number): number {
    return this.toBytes(value) / BYTE_FACTORS.GB;
  }

  toTB(value: number): number {
    return this.toBytes(value) / BYTE_FACTORS.TB;
  }

  toPB(value: number): number {
    return this.toBytes(value) / BYTE_FACTORS.PB;
  }

  toBits(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return BitUnit.BIT.convert(value, this, wordSize);
  }

  toKibit(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return BitUnit.KIBIT.convert(value, this, wordSize);
  }

  toMibit(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return BitUnit.MIBIT.convert(value, this, wordSize);
  }

  toGibit(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return BitUnit.GIBIT.convert(value, this, wordSize);
  }

  toTibit(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return BitUnit.TIBIT.convert(value, this, wordSize);
  }

  toPibit(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return BitUnit.PIBIT.convert(value, this, wordSize);
  }

  toKbit(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return BitUnit.KBIT.convert(value, this, wordSize);
  }

  toMbit(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return BitUnit.MBIT.convert(value, this, wordSize);
  }

  toGbit(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return BitUnit.GBIT.convert(value, this, wordSize);
  }

  toTbit(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return BitUnit.TBIT.convert(value, this, wordSize);
  }

  toPbit(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return BitUnit.PBIT.convert(value, this, wordSize);
  }

  convert(value: number, unit: ByteUnitValue): number;
  convert(value: number, unit: BitUnitValue, wordSize?: number): number;
  convert(
    value: number,
    unit: ByteUnitValue | BitUnitValue,
    wordSize = DEFAULT_WORD_SIZE
  ): number {
    if (unit.family === "bit") {
      const bytes = unit.toBits(value) / wordSize;
      return this.convert(bytes, ByteUnit.BYTE);
    }

    return unit.toBytes(value) / this.factor;
  }
}

class BitUnitImpl implements BitUnitValue {
  readonly family = "bit" as const;

  constructor(
    public readonly name: BitUnitName,
    private readonly factor: number
  ) {}

  toBits(value: number): number {
    return safeMultiply(value, this.factor);
  }

  toKibit(value: number): number {
    return this.toBits(value) / BIT_FACTORS.KIBIT;
  }

  toMibit(value: number): number {
    return this.toBits(value) / BIT_FACTORS.MIBIT;
  }

  toGibit(value: number): number {
    return this.toBits(value) / BIT_FACTORS.GIBIT;
  }

  toTibit(value: number): number {
    return this.toBits(value) / BIT_FACTORS.TIBIT;
  }

  toPibit(value: number): number {
    return this.toBits(value) / BIT_FACTORS.PIBIT;
  }

  toKbit(value: number): number {
    return this.toBits(value) / BIT_FACTORS.KBIT;
  }

  toMbit(value: number): number {
    return this.toBits(value) / BIT_FACTORS.MBIT;
  }

  toGbit(value: number): number {
    return this.toBits(value) / BIT_FACTORS.GBIT;
  }

  toTbit(value: number): number {
    return this.toBits(value) / BIT_FACTORS.TBIT;
  }

  toPbit(value: number): number {
    return this.toBits(value) / BIT_FACTORS.PBIT;
  }

  toBytes(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return ByteUnit.BYTE.convert(value, this, wordSize);
  }

  toKiB(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return ByteUnit.KIB.convert(value, this, wordSize);
  }

  toMiB(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return ByteUnit.MIB.convert(value, this, wordSize);
  }

  toGiB(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return ByteUnit.GIB.convert(value, this, wordSize);
  }

  toTiB(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return ByteUnit.TIB.convert(value, this, wordSize);
  }

  toPiB(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return ByteUnit.PIB.convert(value, this, wordSize);
  }

  toKB(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return ByteUnit.KB.convert(value, this, wordSize);
  }

  toMB(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return ByteUnit.MB.convert(value, this, wordSize);
  }

  toGB(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return ByteUnit.GB.convert(value, this, wordSize);
  }

  toTB(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return ByteUnit.TB.convert(value, this, wordSize);
  }

  toPB(value: number, wordSize = DEFAULT_WORD_SIZE): number {
    return ByteUnit.PB.convert(value, this, wordSize);
  }

  convert(value: number, unit: BitUnitValue): number;
  convert(value: number, unit: ByteUnitValue, wordSize?: number): number;
  convert(
    value: number,
    unit: BitUnitValue | ByteUnitValue,
    wordSize = DEFAULT_WORD_SIZE
  ): number {
    if (unit.family === "byte") {
      const bits = safeMultiply(unit.toBytes(value), wordSize);
      return this.convert(bits, BitUnit.BIT);
    }

    return unit.toBits(value) / this.factor;
  }
}

const byteUnits: Record<ByteUnitName, ByteUnitValue> = {
  BYTE: new ByteUnitImpl("BYTE", BYTE_FACTORS.BYTE),
  KIB: new ByteUnitImpl("KIB", BYTE_FACTORS.KIB),
  MIB: new ByteUnitImpl("MIB", BYTE_FACTORS.MIB),
  GIB: new ByteUnitImpl("GIB", BYTE_FACTORS.GIB),
  TIB: new ByteUnitImpl("TIB", BYTE_FACTORS.TIB),
  PIB: new ByteUnitImpl("PIB", BYTE_FACTORS.PIB),
  KB: new ByteUnitImpl("KB", BYTE_FACTORS.KB),
  MB: new ByteUnitImpl("MB", BYTE_FACTORS.MB),
  GB: new ByteUnitImpl("GB", BYTE_FACTORS.GB),
  TB: new ByteUnitImpl("TB", BYTE_FACTORS.TB),
  PB: new ByteUnitImpl("PB", BYTE_FACTORS.PB)
};

const bitUnits: Record<BitUnitName, BitUnitValue> = {
  BIT: new BitUnitImpl("BIT", BIT_FACTORS.BIT),
  KIBIT: new BitUnitImpl("KIBIT", BIT_FACTORS.KIBIT),
  MIBIT: new BitUnitImpl("MIBIT", BIT_FACTORS.MIBIT),
  GIBIT: new BitUnitImpl("GIBIT", BIT_FACTORS.GIBIT),
  TIBIT: new BitUnitImpl("TIBIT", BIT_FACTORS.TIBIT),
  PIBIT: new BitUnitImpl("PIBIT", BIT_FACTORS.PIBIT),
  KBIT: new BitUnitImpl("KBIT", BIT_FACTORS.KBIT),
  MBIT: new BitUnitImpl("MBIT", BIT_FACTORS.MBIT),
  GBIT: new BitUnitImpl("GBIT", BIT_FACTORS.GBIT),
  TBIT: new BitUnitImpl("TBIT", BIT_FACTORS.TBIT),
  PBIT: new BitUnitImpl("PBIT", BIT_FACTORS.PBIT)
};

const BYTE_VALUES = BYTE_UNIT_NAMES.map((name) => byteUnits[name]);
const BIT_VALUES = BIT_UNIT_NAMES.map((name) => bitUnits[name]);

export const ByteUnit: ByteUnitRegistry = Object.freeze({
  ...byteUnits,
  values(): readonly ByteUnitValue[] {
    return [...BYTE_VALUES];
  },
  valueOf(name: ByteUnitName | string): ByteUnitValue {
    if (!isByteUnitName(name)) {
      throw new Error(`Unknown ByteUnit: ${name}`);
    }

    return byteUnits[name];
  }
});

export const BitUnit: BitUnitRegistry = Object.freeze({
  ...bitUnits,
  values(): readonly BitUnitValue[] {
    return [...BIT_VALUES];
  },
  valueOf(name: BitUnitName | string): BitUnitValue {
    if (!isBitUnitName(name)) {
      throw new Error(`Unknown BitUnit: ${name}`);
    }

    return bitUnits[name];
  }
});


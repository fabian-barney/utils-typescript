const DEFAULT_BITS_PER_BYTE = 8;

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
    return -Number.MAX_VALUE;
  }

  return value * multiplier;
}

function validateValue(value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError("value must be a non-negative finite number");
  }
}

function validateBitsPerByte(bitsPerByte: number): void {
  if (!Number.isInteger(bitsPerByte) || bitsPerByte <= 0) {
    throw new RangeError("bitsPerByte must be a positive integer");
  }
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
  toBits(value: number, bitsPerByte?: number): number;
  toKibit(value: number, bitsPerByte?: number): number;
  toMibit(value: number, bitsPerByte?: number): number;
  toGibit(value: number, bitsPerByte?: number): number;
  toTibit(value: number, bitsPerByte?: number): number;
  toPibit(value: number, bitsPerByte?: number): number;
  toKbit(value: number, bitsPerByte?: number): number;
  toMbit(value: number, bitsPerByte?: number): number;
  toGbit(value: number, bitsPerByte?: number): number;
  toTbit(value: number, bitsPerByte?: number): number;
  toPbit(value: number, bitsPerByte?: number): number;
  convert(value: number, unit: ByteUnitValue): number;
  convert(value: number, unit: BitUnitValue, bitsPerByte?: number): number;
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
  toBytes(value: number, bitsPerByte?: number): number;
  toKiB(value: number, bitsPerByte?: number): number;
  toMiB(value: number, bitsPerByte?: number): number;
  toGiB(value: number, bitsPerByte?: number): number;
  toTiB(value: number, bitsPerByte?: number): number;
  toPiB(value: number, bitsPerByte?: number): number;
  toKB(value: number, bitsPerByte?: number): number;
  toMB(value: number, bitsPerByte?: number): number;
  toGB(value: number, bitsPerByte?: number): number;
  toTB(value: number, bitsPerByte?: number): number;
  toPB(value: number, bitsPerByte?: number): number;
  convert(value: number, unit: BitUnitValue): number;
  convert(value: number, unit: ByteUnitValue, bitsPerByte?: number): number;
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
    validateValue(value);
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

  toBits(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return BitUnit.BIT.convert(value, this, bitsPerByte);
  }

  toKibit(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return BitUnit.KIBIT.convert(value, this, bitsPerByte);
  }

  toMibit(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return BitUnit.MIBIT.convert(value, this, bitsPerByte);
  }

  toGibit(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return BitUnit.GIBIT.convert(value, this, bitsPerByte);
  }

  toTibit(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return BitUnit.TIBIT.convert(value, this, bitsPerByte);
  }

  toPibit(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return BitUnit.PIBIT.convert(value, this, bitsPerByte);
  }

  toKbit(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return BitUnit.KBIT.convert(value, this, bitsPerByte);
  }

  toMbit(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return BitUnit.MBIT.convert(value, this, bitsPerByte);
  }

  toGbit(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return BitUnit.GBIT.convert(value, this, bitsPerByte);
  }

  toTbit(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return BitUnit.TBIT.convert(value, this, bitsPerByte);
  }

  toPbit(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return BitUnit.PBIT.convert(value, this, bitsPerByte);
  }

  convert(value: number, unit: ByteUnitValue): number;
  convert(value: number, unit: BitUnitValue, bitsPerByte?: number): number;
  convert(
    value: number,
    unit: ByteUnitValue | BitUnitValue,
    bitsPerByte = DEFAULT_BITS_PER_BYTE
  ): number {
    validateValue(value);

    if (unit.family === "bit") {
      validateBitsPerByte(bitsPerByte);
      const bytes = unit.toBits(value) / bitsPerByte;
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
    validateValue(value);
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

  toBytes(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return ByteUnit.BYTE.convert(value, this, bitsPerByte);
  }

  toKiB(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return ByteUnit.KIB.convert(value, this, bitsPerByte);
  }

  toMiB(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return ByteUnit.MIB.convert(value, this, bitsPerByte);
  }

  toGiB(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return ByteUnit.GIB.convert(value, this, bitsPerByte);
  }

  toTiB(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return ByteUnit.TIB.convert(value, this, bitsPerByte);
  }

  toPiB(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return ByteUnit.PIB.convert(value, this, bitsPerByte);
  }

  toKB(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return ByteUnit.KB.convert(value, this, bitsPerByte);
  }

  toMB(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return ByteUnit.MB.convert(value, this, bitsPerByte);
  }

  toGB(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return ByteUnit.GB.convert(value, this, bitsPerByte);
  }

  toTB(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return ByteUnit.TB.convert(value, this, bitsPerByte);
  }

  toPB(value: number, bitsPerByte = DEFAULT_BITS_PER_BYTE): number {
    return ByteUnit.PB.convert(value, this, bitsPerByte);
  }

  convert(value: number, unit: BitUnitValue): number;
  convert(value: number, unit: ByteUnitValue, bitsPerByte?: number): number;
  convert(
    value: number,
    unit: BitUnitValue | ByteUnitValue,
    bitsPerByte = DEFAULT_BITS_PER_BYTE
  ): number {
    validateValue(value);

    if (unit.family === "byte") {
      validateBitsPerByte(bitsPerByte);
      const bits = safeMultiply(unit.toBytes(value), bitsPerByte);
      return this.convert(bits, BitUnit.BIT);
    }

    return unit.toBits(value) / this.factor;
  }
}

const byteUnits: Record<ByteUnitName, ByteUnitValue> = {
  BYTE: Object.freeze(new ByteUnitImpl("BYTE", BYTE_FACTORS.BYTE)),
  KIB: Object.freeze(new ByteUnitImpl("KIB", BYTE_FACTORS.KIB)),
  MIB: Object.freeze(new ByteUnitImpl("MIB", BYTE_FACTORS.MIB)),
  GIB: Object.freeze(new ByteUnitImpl("GIB", BYTE_FACTORS.GIB)),
  TIB: Object.freeze(new ByteUnitImpl("TIB", BYTE_FACTORS.TIB)),
  PIB: Object.freeze(new ByteUnitImpl("PIB", BYTE_FACTORS.PIB)),
  KB: Object.freeze(new ByteUnitImpl("KB", BYTE_FACTORS.KB)),
  MB: Object.freeze(new ByteUnitImpl("MB", BYTE_FACTORS.MB)),
  GB: Object.freeze(new ByteUnitImpl("GB", BYTE_FACTORS.GB)),
  TB: Object.freeze(new ByteUnitImpl("TB", BYTE_FACTORS.TB)),
  PB: Object.freeze(new ByteUnitImpl("PB", BYTE_FACTORS.PB))
};

const bitUnits: Record<BitUnitName, BitUnitValue> = {
  BIT: Object.freeze(new BitUnitImpl("BIT", BIT_FACTORS.BIT)),
  KIBIT: Object.freeze(new BitUnitImpl("KIBIT", BIT_FACTORS.KIBIT)),
  MIBIT: Object.freeze(new BitUnitImpl("MIBIT", BIT_FACTORS.MIBIT)),
  GIBIT: Object.freeze(new BitUnitImpl("GIBIT", BIT_FACTORS.GIBIT)),
  TIBIT: Object.freeze(new BitUnitImpl("TIBIT", BIT_FACTORS.TIBIT)),
  PIBIT: Object.freeze(new BitUnitImpl("PIBIT", BIT_FACTORS.PIBIT)),
  KBIT: Object.freeze(new BitUnitImpl("KBIT", BIT_FACTORS.KBIT)),
  MBIT: Object.freeze(new BitUnitImpl("MBIT", BIT_FACTORS.MBIT)),
  GBIT: Object.freeze(new BitUnitImpl("GBIT", BIT_FACTORS.GBIT)),
  TBIT: Object.freeze(new BitUnitImpl("TBIT", BIT_FACTORS.TBIT)),
  PBIT: Object.freeze(new BitUnitImpl("PBIT", BIT_FACTORS.PBIT))
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

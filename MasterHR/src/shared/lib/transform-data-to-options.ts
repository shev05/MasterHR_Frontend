import type { OptionBase } from '@/shared/interface';

// Helper type for decreasing depth
type PrevDepth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Type to get all possible paths in an object including nested ones (with depth limit)
type PathsToStringProps<T, Depth extends number = 3> = Depth extends 0
  ? never
  : T extends string | number | boolean | null | undefined
    ? never
    : T extends Array<infer U>
      ? PathsToStringProps<U, Depth>
      : T extends object
        ? {
            [K in keyof T & (string | number)]: `${K}` | `${K}.${PathsToStringProps<T[K], PrevDepth[Depth]>}`;
          }[keyof T & (string | number)]
        : never;

// Type to filter paths that lead to string/number values (with depth limit)
type StringOrNumberPaths<T, Depth extends number = 3> = {
  [K in PathsToStringProps<T, Depth>]: GetNestedValueType<T, K> extends string | number ? K : never;
}[PathsToStringProps<T, Depth>];

// Helper to get the type of a nested value using a path string
type GetNestedValueType<T, Path extends string> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? GetNestedValueType<T[Key], Rest>
    : never
  : Path extends keyof T
    ? T[Path]
    : never;

export type OptionsModel<DataItem extends Record<string, unknown>> = {
  asIdKey?: StringOrNumberPaths<DataItem> | StringOrNumberPaths<DataItem>[];
  asLabelKeys: StringOrNumberPaths<DataItem> | StringOrNumberPaths<DataItem>[];
  asValueKey: StringOrNumberPaths<DataItem> | StringOrNumberPaths<DataItem>[];

  buildLabel?: (item: DataItem) => string;

  // Separators for complex keys
  idSeparator?: string;
  valueSeparator?: string;
  labelSeparator?: string;
};

// Helper function to get nested value using dot notation
const getNestedValue = <T extends Record<string, unknown>>(obj: T, path: string): unknown => {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

const extractComplexValue = <T extends Record<string, unknown>>(
  item: T,
  keys: string | string[],
  separator: string = '_'
): string => {
  if (Array.isArray(keys)) {
    return keys
      .map((key) => {
        const value = getNestedValue(item, key);
        return value != null ? String(value) : '';
      })
      .filter(Boolean)
      .join(separator);
  }

  const value = getNestedValue(item, keys);
  return value != null ? String(value) : '';
};

// Helper to check if nested keys exist in all items
const validateNestedKeys = <T extends Record<string, unknown>>(data: T[], keys: string[]): boolean => {
  return data.every((item) =>
    keys.every((key) => {
      const value = getNestedValue(item, key);
      return value !== undefined;
    })
  );
};

const getArrayFromOptionKey = (as: undefined | string | string[]) => {
  if (!as) return [];
  const keys = Array.isArray(as) ? as : [as];
  return keys.map((key) => String(key));
};

export const transformDataToOptions = <DataItem extends Record<string, unknown>>(
  data: DataItem[] = [],
  config: OptionsModel<DataItem>
): OptionBase[] => {
  const {
    asIdKey,
    asLabelKeys,
    asValueKey,

    buildLabel,

    idSeparator = '_',
    valueSeparator = '_',
    labelSeparator = ' ',
  } = config;

  const valueKeysAsStrings = getArrayFromOptionKey(asValueKey);

  const isValueStructureValid = validateNestedKeys(data, valueKeysAsStrings);

  if (!isValueStructureValid) return [];

  const result: OptionBase[] = data.map((item, index) => {
    const idKeysAsStrings = getArrayFromOptionKey(asIdKey);

    const id = asIdKey ? extractComplexValue(item, idKeysAsStrings, idSeparator) : undefined;
    const value = extractComplexValue(item, valueKeysAsStrings, valueSeparator);

    let label = '';

    if (buildLabel) {
      label = buildLabel(item);
    } else {
      const labelKeysAsStrings = getArrayFromOptionKey(asLabelKeys);

      label = extractComplexValue(item, labelKeysAsStrings, labelSeparator);

      if (label === '') {
        label = `Item ${index + 1}`;
      }
    }

    const baseOption = { id, label, value };

    if (!asIdKey) {
      delete baseOption.id;
    }

    return { ...baseOption };
  });

  return result;
};

import { produce } from "immer";
import jsonpath from "jsonpath";

interface Patch {
  path: string;
  value?: unknown;
}

export function patch(obj: unknown, patch: Patch): any {
  return produce(obj, (draft: unknown) => {
    jsonpath.apply(draft, patch.path, () => patch.value);
  });
}

export function get(
  obj: unknown,
  path: string,
  isSingle: boolean = false
): unknown {
  const f = isSingle ? jsonpath.value : jsonpath.query;
  return f.bind(jsonpath)(obj, path);
}

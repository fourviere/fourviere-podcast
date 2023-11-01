import { produce } from "immer";
import jsonpath from "jsonpath";

interface Patch {
  path: string;
  value?: any;
}

export function patch(obj: any, patch: Patch): any {
  return produce(obj, (draft: any) => {
    jsonpath.apply(draft, patch.path, () => patch.value);
  });
}

export function get(obj: any, path: string, isSingle: boolean = false): any {
  const f = isSingle ? jsonpath.value : jsonpath.query;
  return f.bind(jsonpath)(obj, path);
}

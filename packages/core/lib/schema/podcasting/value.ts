import { Type } from "@sinclair/typebox";

const ValueRecipientSchema = Type.Object({
  "@": Type.Object({
    type: Type.String(),
    address: Type.String(),
    split: Type.Number(),
    name: Type.Optional(Type.String()),
    customKey: Type.Optional(Type.Number()),
    customValue: Type.Optional(Type.String()),
    fee: Type.Optional(Type.Boolean()),
  }),
});

const ValueSchema = Type.Object({
  "podcast:valueRecipient": Type.Union([
    Type.Array(ValueRecipientSchema),
    ValueRecipientSchema,
  ]),
  "@": Type.Object({
    type: Type.String(),
    method: Type.String(),
    // String to suport exponential numbers 5e-18
    suggested: Type.Optional(Type.Union([Type.String(), Type.Number()])),
  }),
});

export default ValueSchema;

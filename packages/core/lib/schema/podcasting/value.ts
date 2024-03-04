import { Type } from "@sinclair/typebox";

const ValueRecipientSchema = Type.Object({
  "@": Type.Object({
    type: Type.String(),
    address: Type.String(),
    split: Type.String(),
    name: Type.Optional(Type.String()),
    customKey: Type.Optional(Type.String()),
    customValue: Type.Optional(Type.String()),
    fee: Type.Optional(Type.String()),
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
    suggested: Type.Optional(Type.String()),
  }),
});

export default ValueSchema;

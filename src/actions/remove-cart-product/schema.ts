import { z } from "zod";

const removeProductFromCartSchema = z.object({
  cartItemId: z.uuid(),
});

export default removeProductFromCartSchema;

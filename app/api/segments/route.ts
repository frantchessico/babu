import { NextApiRequest, NextApiResponse } from "next";
import { createSegment } from "@/lib/data/segments";

import { z } from "zod";
import { authenticatedAction } from "@/lib/data/safe-action";

// Schema para validar a requisição
const createSegmentSchema = z.object({
  name: z.string(),
  tags: z.array(z.string()),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Usa `authenticatedAction` para verificar a autenticação e executar a lógica de criação do segmento
      await authenticatedAction
        .schema(createSegmentSchema)
        .action(async ({ parsedInput, ctx: { userId } }) => {
          try {
            // Chama a função `createSegment` passando `name`, `tags` e `userId`
            await createSegment({
              name: parsedInput.name,
              tags: parsedInput.tags,
              userId,
            });

            return res.status(200).json({ message: "Segment created successfully" });
          } catch (error) {
            return res.status(500).json({ error: "Error creating segment" });
          }
        })({
          req,
          res,
        });
    } catch (error) {
      return res.status(500).json({ error: "Error processing request" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

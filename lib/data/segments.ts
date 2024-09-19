"use server";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { segments } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";

import { authenticatedAction } from "./safe-action";
import { z } from "zod";

import { redirect } from "next/navigation";

/**
 * Gets all segments for a user
 *
 * Protected by authenticatedAction wrapper
 */
export const getSegments = authenticatedAction.action(
  async ({ ctx: { userId } }) => {
    const data = await db
      .select()
      .from(segments)
      .where(eq(segments.userId, userId))
      .orderBy(desc(segments.updatedAt));

    return data;
  }
);

/**
 * Gets a specific segment by id
 *
 * Protected by authenticatedAction wrapper
 */
export const getSegmentById = authenticatedAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    const [data] = await db
      .select()
      .from(segments)
      .where(and(eq(segments.id, id), eq(segments.userId, userId)));
    return data;
  });

/**
 * Deletes a specific segment by id
 *
 * Protected by authenticatedAction wrapper
 */
export const deleteSegment = authenticatedAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    await db
      .delete(segments)
      .where(and(eq(segments.id, id), eq(segments.userId, userId)));
    revalidatePath("/segments");
  });



//   export const createSegment = authenticatedAction
//   .schema(z.object({
//     name: z.string(),
//     tags: z.array(z.string())
//   }))
//   .action(async ({ parsedInput, ctx: { userId } }) => {
//     await db.insert(segments).values({
//       userId,
//       name: parsedInput.name,
//       tags: parsedInput.tags,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     revalidatePath("/segments");
//     redirect("/segments");
//   });



  export const createSegment = async ({
    name,
    tags,
    userId, 
  }: {
    name: string;
    tags: string[];
    userId: string;
  }) => {
    await db.insert(segments).values({
      userId,  
      name,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };
  
/**
 * Updates a segment
 *
 * Protected by authenticationAction wrapper
 * Shares a zod schema with react-hook-form in ./validations.ts
 */
export const updateSegment = authenticatedAction
  .schema(z.object({
    id: z.string(),
    name: z.string(),
    tags: z.array(z.string()),
  }))
  .action(async ({ parsedInput, ctx: { userId } }) => {
    await db
      .update(segments)
      .set({
        name: parsedInput.name,
        tags: parsedInput.tags,
        updatedAt: new Date(),
      })
      .where(
        and(eq(segments.id, parsedInput.id), eq(segments.userId, userId))
      );

    revalidatePath("/segments");
    redirect("/segments");
  });

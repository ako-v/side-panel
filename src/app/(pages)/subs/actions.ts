"use server";
import { prisma } from "@/app/lib/prisma";
import { Subscription } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";

export const handleItemUpdate = async (data: Subscription) => {
  try {
    const item = await prisma.subscription.update({
      data: { name: data.name, type: data.type, url: data.url },
      where: { id: data.id },
    });
    if (!item) {
      return { error: "Item not found" };
    }
    revalidatePath("/subs");
    return;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { error: "Item not found" };
      }
      return { error: "Internal Server Error" };
    }
  }
};

export const handleCreateNewItem = async (data: Omit<Subscription, "id">) => {
  try {
    const item = await prisma.subscription.create({ data });
    revalidatePath("/subs");
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "Subscription with the same name already exists" };
      }
      return { error: "Internal Server Error" };
    }
  }
  return;
};

export const handleDeleteItem = async (id: number) => {
  const item = await prisma.subscription.delete({ where: { id } });
  revalidatePath("/subs");
  if (!item) {
    return { error: "Item not found" };
  }
  return;
};

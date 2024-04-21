import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const GET = async (request: NextRequest, { params }: { params: { name: string } }) => {
  try {
    const subscription = await prisma.subscription.findUnique({ where: { name: params.name } });
    if (subscription && subscription.url) {
      const subscriptionData = await fetch(subscription.url);
      let data;
      if (subscription.type === "sub") {
        data = await subscriptionData.text();
        const res = new NextResponse(data);
        res.headers.set("Content-Type", "text/plain");
        return res;
      } else {
        data = await subscriptionData.json();
        return NextResponse.json(data);
      }
    } else {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
};

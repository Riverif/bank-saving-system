import { db } from "@/lib/db";
import { CustomerSchema } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const validateFields = CustomerSchema.safeParse(await req.json());
    if (!validateFields.success) {
      return new NextResponse("Bad request", {
        status: 400,
      });
    }

    const { name } = validateFields.data;

    const customer = await db.customer.create({
      data: {
        name,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log("[CUSTOMERS]", error);

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return new NextResponse("Name was taken", {
        status: 400,
      });
    }

    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET() {
  try {
    const customers = await db.customer.findMany();

    return NextResponse.json(customers);
  } catch (error) {
    console.log("[CUSTOMERS]", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
}

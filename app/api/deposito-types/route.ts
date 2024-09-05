import { db } from "@/lib/db";
import { DepositoTypeSchema } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const validateFields = DepositoTypeSchema.safeParse(await req.json());
    if (!validateFields.success) {
      return new NextResponse("Bad request", {
        status: 400,
      });
    }

    const { name, yearlyReturn } = validateFields.data;

    const depositoType = await db.depositoType.create({
      data: {
        name,
        yearlyReturn,
      },
    });

    return NextResponse.json(depositoType);
  } catch (error) {
    console.log("[DEPOSITOTYPE]", error);

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
    const depositoTypes = await db.depositoType.findMany();

    return NextResponse.json(depositoTypes);
  } catch (error) {
    console.log("[DEPOSITOTYPE]", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
}

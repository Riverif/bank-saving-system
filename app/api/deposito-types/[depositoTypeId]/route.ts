import { db } from "@/lib/db";
import { DepositoTypeSchema } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { depositoTypeId: string } },
) {
  try {
    await db.depositoType.delete({
      where: {
        id: params.depositoTypeId,
      },
    });

    return new NextResponse("Deposito Type deleted", { status: 200 });
  } catch (error) {
    console.log("[DEPOSITOTYPEID]", error);

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return new NextResponse("Deposito Type Not Exist", {
        status: 404,
      });
    }

    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { depositoTypeId: string } },
) {
  try {
    const validateFields = DepositoTypeSchema.safeParse(await req.json());
    if (!validateFields.success) {
      return new NextResponse("Bad request", {
        status: 400,
      });
    }

    const { name, yearlyReturn } = validateFields.data;

    const depositoType = await db.depositoType.update({
      where: {
        id: params.depositoTypeId,
      },
      data: {
        name,
        yearlyReturn,
      },
    });

    return NextResponse.json(depositoType);
  } catch (error) {
    console.log("[DEPOSITOTYPEID]", error);

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return new NextResponse("Deposito Type Not Exist", {
        status: 404,
      });
    }

    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { depositoTypeId: string } },
) {
  try {
    const depositoType = await db.depositoType.findFirst({
      where: {
        id: params.depositoTypeId,
      },
    });

    if (!depositoType) {
      return new NextResponse("Deposito Type Not Exist", { status: 404 });
    }

    return NextResponse.json(depositoType);
  } catch (error) {
    console.log("[DEPOSITOTYPEID]", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
}

import { db } from "@/lib/db";
import { CustomerSchema } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { customerId: string } },
) {
  try {
    await db.customer.delete({
      where: {
        id: params.customerId,
      },
    });

    return new NextResponse("Customer deleted", { status: 200 });
  } catch (error) {
    console.log("[CUSTOMERS_CUSTOMERID]", error);

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return new NextResponse("Customer Not Exist", {
        status: 404,
      });
    }

    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { customerId: string } },
) {
  try {
    const validateFields = CustomerSchema.safeParse(await req.json());
    if (!validateFields.success) {
      return new NextResponse("Bad request", {
        status: 400,
      });
    }

    const { name } = validateFields.data;

    const customer = await db.customer.update({
      where: {
        id: params.customerId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log("[CUSTOMERS_CUSTOMERID]", error);

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return new NextResponse("Name was taken", {
        status: 400,
      });
    } else if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return new NextResponse("Customer Not Exist", {
        status: 404,
      });
    }

    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { customerId: string } },
) {
  try {
    const customer = await db.customer.findFirst({
      where: {
        id: params.customerId,
      },
    });

    if (!customer) {
      return new NextResponse("Customer Not Exist", { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.log("[CUSTOMERS_CUSTOMERID]", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
}

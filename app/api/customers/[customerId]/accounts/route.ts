import { db } from "@/lib/db";
import { AccountSchema } from "@/schemas";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { customerId: string } },
) {
  try {
    const validateFields = AccountSchema.safeParse(await req.json());
    if (!validateFields.success) {
      return new NextResponse("Bad request", {
        status: 400,
      });
    }

    const { packet, balance } = validateFields.data;

    const dbDepositoType = await db.depositoType.findFirst({
      where: { id: packet },
    });

    console.log({ dbDepositoType });

    if (!dbDepositoType)
      return new NextResponse("Deposito Type Not Exist", { status: 400 });

    const account = await db.account.create({
      data: {
        customerId: params.customerId,
        packet,
        balance,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.log("[ACCOUNTS]", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET() {
  try {
    const accounts = await db.account.findMany();

    return NextResponse.json(accounts);
  } catch (error) {
    console.log("[ACCOUNTS]", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
}

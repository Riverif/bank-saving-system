import { db } from "@/lib/db";
import { WithdrawalSchema } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { customerId: string; accountId: string } },
) {
  try {
    const currAccount = await db.account.findFirst({
      where: { id: params.accountId },
    });

    if (!currAccount)
      return new NextResponse("Account does not exist", { status: 404 });
    if (currAccount.customerId !== params.customerId)
      return new NextResponse("Unauthorized", { status: 401 });

    await db.account.delete({
      where: {
        id: params.accountId,
      },
    });

    return new NextResponse("Account deleted", { status: 200 });
  } catch (error) {
    console.log("[ACCOUNTID]", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { customerId: string; accountId: string } },
) {
  try {
    const body = await req.json();
    const data = { withdrawDate: new Date(body.withdrawDate) };
    const validateFields = WithdrawalSchema.safeParse(data);
    if (!validateFields.success) {
      return new NextResponse("Bad request", {
        status: 400,
      });
    }

    const { withdrawDate } = validateFields.data;

    const currAccount = await db.account.findFirst({
      where: { id: params.accountId },
      include: {
        depositoType: true,
      },
    });

    if (!currAccount)
      return new NextResponse("Account does not exist", { status: 404 });
    if (currAccount.customerId !== params.customerId)
      return new NextResponse("Unauthorized", { status: 401 });

    // Hitung selisih tahun dan bulan
    const yearsDifference =
      new Date().getFullYear() - withdrawDate.getFullYear();
    const monthsDifference = new Date().getMonth() - withdrawDate.getMonth();

    // Total bulan yang sudah dilalui
    const totalMonths = Math.abs(yearsDifference * 12 + monthsDifference);
    const monthReturn = currAccount.depositoType.yearlyReturn / 12;

    const balanceAfterWithdrawal =
      currAccount.balance * totalMonths * monthReturn + currAccount.balance;

    console.log({ balanceAfterWithdrawal, totalMonths, monthReturn });

    if (currAccount.withdrawalDate)
      return new NextResponse("You have withdraw the money", {
        status: 400,
      });

    const account = await db.account.update({
      where: {
        id: currAccount.id,
        customerId: params.customerId,
      },
      data: {
        balance: balanceAfterWithdrawal,
        withdrawalDate: withdrawDate,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.log("[ACCOUNTID]", error);

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return new NextResponse("Account Not Exist", {
        status: 404,
      });
    }

    return new NextResponse("Internal server error", { status: 500 });
  }
}

import { db } from "@/lib/db";

export const getDepositoTypes = async () => {
  try {
    const depositoTypes = await db.depositoType.findMany({
      orderBy: {
        yearlyReturn: "desc",
      },
    });
    return depositoTypes;
  } catch (error) {
    return [];
  }
};

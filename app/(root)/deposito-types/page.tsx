import { db } from "@/lib/db";
import { DepositoTypes } from "./_components/deposito-types";

const DepositoPage = async () => {
  const depositoTypes = await db.depositoType.findMany({
    orderBy: {
      yearlyReturn: "desc",
    },
  });

  if (!depositoTypes) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-16 p-4 pt-[100px]">
        <DepositoTypes depositoTypes={depositoTypes} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-16 p-4 pt-[100px]">
      <DepositoTypes depositoTypes={depositoTypes} />
    </div>
  );
};

export default DepositoPage;

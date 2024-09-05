import { DepositoTypes } from "./_components/deposito-types";
import { getDepositoTypes } from "@/data/depositoTypes";

const DepositoPage = async () => {
  const depositoTypes = await getDepositoTypes();

  if (!depositoTypes) return <div>Error</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-16 p-4 pt-[100px]">
      <DepositoTypes depositoTypes={depositoTypes} />
    </div>
  );
};

export default DepositoPage;

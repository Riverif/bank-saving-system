import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CustomerDetail } from "./_components/customer";
import { Accounts } from "./_components/accounts";

const CustomerPage = async ({ params }: { params: { customerId: string } }) => {
  const customer = await db.customer.findFirst({
    where: {
      id: params.customerId,
    },
  });

  if (!customer) {
    notFound();
  }

  const accounts = await db.account.findMany({
    where: {
      customerId: customer.id,
    },
    include: {
      depositoType: true,
    },
    orderBy: {
      depositDate: "desc",
    },
  });

  const depositoTypes = await db.depositoType.findMany();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-16 p-4 pt-[100px]">
      <h1 className="font-black text-4xl md:text-5xl text-dark-green-c text-center">
        Create account and deposit your money, is it highly return
      </h1>
      <CustomerDetail customer={customer} />
      <Accounts
        accounts={accounts}
        customerId={params.customerId}
        options={depositoTypes.map((data) => ({
          label: `${data.name} ${Math.floor(data.yearlyReturn * 100)}%p.a`,
          value: data.id,
        }))}
      />
    </div>
  );
};

export default CustomerPage;

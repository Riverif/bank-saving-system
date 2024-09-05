import { db } from "@/lib/db";
import { RegisterCustomer } from "./_components/register-customer";
import { Customers } from "./_components/customers";

export default async function Home() {
  const customers = await db.customer.findMany();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center space-y-16 md:p-0 p-4">
      <div className="space-y-3 flex flex-col items-center text-center">
        <h1 className="font-black text-4xl md:text-5xl text-dark-green-c">
          Welcome to Bank Saving System
        </h1>
        <p className="text-green-c">created by Rifki Alfian Nahar</p>
      </div>
      <RegisterCustomer />
      <Customers customers={customers} />
    </main>
  );
}

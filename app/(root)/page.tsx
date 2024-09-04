import { RegisterCustomer } from "./_components/register-customer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <div className="space-y-3 flex flex-col items-center text-center">
        <h1 className="font-black text-5xl text-dark-green-c">
          Welcome to Bank Saving System
        </h1>
        <p className="text-green-c">created by Rifki Alfian Nahar</p>
      </div>
      <RegisterCustomer />
    </main>
  );
}

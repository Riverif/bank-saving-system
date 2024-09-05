"use client";

import { Button } from "@/components/ui/button";
import { Customer } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CustomersProps {
  customers: Customer[];
}
export const Customers = ({ customers }: CustomersProps) => {
  const router = useRouter();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    router.refresh();
    setMount(true);
  }, [mount]);

  return (
    <div className="space-y-2">
      <p className="text-center">choose customer</p>
      <div className="flex flex-wrap gap-4  max-w-[800px] ">
        {customers ? (
          customers.map((customer) => (
            <Button
              key={customer.id}
              variant="secondary"
              className="rounded-xl"
              onClick={() => {
                router.push(`/customers/${customer.id}`);
              }}
            >
              {customer.name}
            </Button>
          ))
        ) : (
          <div className="animate-spin">test</div>
        )}
      </div>
    </div>
  );
};

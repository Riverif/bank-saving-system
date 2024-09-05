"use client";

import { Button } from "@/components/ui/button";
import { Customer } from "@prisma/client";
import axios from "axios";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CustomersProps {
  customers: Customer[];
}
export const Customers = ({ customers }: CustomersProps) => {
  const router = useRouter();

  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/customers");
        setData(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-center">choose customer</p>
      <div className="flex flex-wrap gap-4  max-w-[800px] justify-center">
        {data ? (
          data.map((customer) => (
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
          <div className="animate-spin">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

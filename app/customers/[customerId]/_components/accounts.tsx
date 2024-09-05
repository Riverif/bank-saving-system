"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AccountSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Account, DepositoType } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { AccountItem } from "./account-item";

interface AccounstProps {
  accounts: ({ depositoType: DepositoType } & Account)[];
  customerId: string;
  options: { label: string; value: string }[];
}

export const Accounts = ({ accounts, customerId, options }: AccounstProps) => {
  const router = useRouter();

  const [toggle, setToggle] = useState(false);
  const toggleChange = () => {
    setToggle((curr) => !curr);
  };

  const form = useForm<z.infer<typeof AccountSchema>>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      packet: "",
      balance: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof AccountSchema>) => {
    try {
      await axios.post(`/api/customers/${customerId}/accounts`, values);
      toast.success("Account Created");
      setToggle(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-3xl font-semibold">Accounts</h2>
        <Button onClick={toggleChange}>New Account</Button>
      </div>
      {toggle && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-x-2">
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`100000`}
                      className="border-black"
                      type="number"
                      step={1000}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="packet"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox {...field} options={options} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      )}

      {accounts.map((account) => (
        <div key={account.id}>
          <AccountItem account={account} />
        </div>
      ))}
    </div>
  );
};

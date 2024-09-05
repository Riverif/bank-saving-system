"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DepositoTypeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Account, DepositoType } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { DepositoTypeItem } from "./deposito-type-item";

interface AccounstProps {
  depositoTypes: DepositoType[];
}

export const DepositoTypes = ({ depositoTypes }: AccounstProps) => {
  const router = useRouter();

  const [toggle, setToggle] = useState(false);
  const toggleChange = () => {
    setToggle((curr) => !curr);
  };

  const form = useForm<z.infer<typeof DepositoTypeSchema>>({
    resolver: zodResolver(DepositoTypeSchema),
    defaultValues: {
      name: "",
      yearlyReturn: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof DepositoTypeSchema>) => {
    try {
      await axios.post(`/api/deposito-types`, values);
      toast.success("Deposito Type Created");
      setToggle(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-3xl font-semibold">Deposito Type</h2>
        <Button onClick={toggleChange}>New Deposito Type</Button>
      </div>
      {toggle && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex gap-x-2 items-end"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Packet`}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Gold, Bronze, Silver"
                      className="border-black"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearlyReturn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Yearly Return (0.01 - 1)`}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-black"
                      type="number"
                      step={0.01}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      )}

      {depositoTypes.map((depositoType) => (
        <div key={depositoType.id}>
          <DepositoTypeItem depositoType={depositoType} />
        </div>
      ))}
    </div>
  );
};

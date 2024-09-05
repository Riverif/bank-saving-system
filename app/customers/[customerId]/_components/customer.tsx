"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CustomerDetailProps {
  customer: Customer;
}

export const CustomerDetail = ({ customer }: CustomerDetailProps) => {
  const router = useRouter();

  const [toggle, setToggle] = useState(false);
  const toggleChange = () => {
    setToggle((curr) => !curr);
  };

  const form = useForm<z.infer<typeof CustomerSchema>>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      name: "",
    },
  });

  const onEdit = async (values: z.infer<typeof CustomerSchema>) => {
    try {
      await axios.put(`/api/customers/${customer.id}`, values);
      toast.success("Customer Name Change");
      setToggle(false);
      router.refresh();
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.data === "Name was taken"
      ) {
        toast.error("Name was taken");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/customers/${customer.id}`);
      toast.success(`${customer.name} was deleted`);
      router.refresh();
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-2">
      <h2 className="text-3xl font-semibold">Customer</h2>
      <div className="md:flex gap-x-4 md:relative flex flex-col items-center gap-y-2">
        {toggle ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEdit)} className="flex gap-x-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={`${customer.name}`}
                        className="border-black"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        ) : (
          <span className="px-4 py-2 border border-black rounded-xl bg-secondary text-center">
            {customer.name}
          </span>
        )}
        <div className="md:absolute flex md:left-[100%] md:pl-4 gap-x-2 md:top-[50%] md:translate-y-[-50%]">
          <Button onClick={toggleChange}>Edit</Button>
          <Button variant="secondary" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

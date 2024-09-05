"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { Account, DepositoType } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AccountSchema, WithdrawalSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePickerForm } from "@/components/ui/date-picker";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface AccountProps {
  account: { depositoType: DepositoType } & Account;
}

export const AccountItem = ({ account }: AccountProps) => {
  const { balance, depositDate, withdrawalDate, customerId, id, depositoType } =
    account;

  const router = useRouter();

  const form = useForm<z.infer<typeof WithdrawalSchema>>({
    resolver: zodResolver(WithdrawalSchema),
    defaultValues: {
      withdrawDate: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof WithdrawalSchema>) => {
    try {
      await axios.put(`/api/customers/${customerId}/accounts/${id}`, values);
      toast.success("Withdrawal Success");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/customers/${customerId}/accounts/${id}`);
      toast.success("Account Deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-1 ">
      <div className="border border-black rounded-2xl rounded-b flex gap-4 p-4 bg-white flex-wrap">
        <div>
          <p className="text-sm">Packet</p>
          <p className="p-2 border border-black rounded-lg">
            {`${depositoType.name} `}
            <span className="font-bold">{`${Math.floor(
              depositoType.yearlyReturn * 100,
            )}%p.a`}</span>
          </p>
        </div>
        <div>
          <p className="text-sm">Balance</p>
          <p className="p-2 border border-black rounded-lg">
            {formatPrice(balance)}
          </p>
        </div>
        <div>
          <p className="text-sm">Deposit Date</p>
          <p className="p-2 border border-black rounded-lg">
            {depositDate.toDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm">Withdraw Date</p>
          <p className="p-2 border border-black rounded-lg text-center">
            {withdrawalDate ? withdrawalDate.toDateString() : "-"}
          </p>
        </div>
      </div>
      <div className="border border-black rounded-t rounded-2xl flex gap-4 p-4 justify-between bg-white flex-wrap">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center justify-center gap-x-2"
          >
            <FormField
              control={form.control}
              name="withdrawDate"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => date < new Date()}
                        className="border border-black rounded-xl"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Wtihdraw</Button>
          </form>
        </Form>
        <Button variant="secondary" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

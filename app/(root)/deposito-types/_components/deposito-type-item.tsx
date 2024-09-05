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

interface DepositoTypeItemProps {
  depositoType: DepositoType;
}

export const DepositoTypeItem = ({ depositoType }: DepositoTypeItemProps) => {
  const router = useRouter();

  const [toggle2, setToggle2] = useState(false);
  const toggleChange2 = () => {
    setToggle2((curr) => !curr);
  };

  const form = useForm<z.infer<typeof DepositoTypeSchema>>({
    resolver: zodResolver(DepositoTypeSchema),
    defaultValues: {
      name: depositoType.name,
      yearlyReturn: depositoType.yearlyReturn,
    },
  });

  const onEdit = async (values: z.infer<typeof DepositoTypeSchema>) => {
    try {
      const data = { ...values, id: depositoType.id };
      await axios.put(`/api/deposito-types/${data.id}`, data);
      toast.success("Deposito Type Updated");
      setToggle2(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (depositoTypeId: string) => {
    try {
      await axios.delete(`/api/deposito-types/${depositoTypeId}`);
      toast.success("Deposito Type Deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-1">
      <div className="border border-black px-4 py-2 rounded-b  rounded-xl flex gap-x-4 bg-white">
        <div>
          <p>Packet</p>
          <div className="p-3 border border-black rounded-xl ">
            {depositoType.name}
          </div>
        </div>
        <div className="flex-1">
          <p>Yearly Return</p>
          <div className="p-3 border border-black text-center rounded-xl">
            {`${depositoType.yearlyReturn * 100}%`}
          </div>
        </div>
      </div>
      {toggle2 && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onEdit)}
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
      <div className="border border-black px-4 py-2 rounded-t rounded-xl flex gap-x-4 bg-white">
        <Button
          className="flex-1"
          onClick={() => {
            toggleChange2();
          }}
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            onDelete(depositoType.id);
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

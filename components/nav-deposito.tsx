"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const NavDeposito = () => {
  const router = useRouter();
  const pathname = usePathname();

  const label = pathname.includes("deposito")
    ? "Back to Home"
    : "Change Deposito Types";
  const onClick = () => {
    pathname.includes("deposito")
      ? router.push("/")
      : router.push("/deposito-types");
  };
  return (
    <div className="absolute left-[100%] translate-x-[-220px] translate-y-[40px] z-10">
      <Button onClick={onClick}>{label}</Button>
    </div>
  );
};

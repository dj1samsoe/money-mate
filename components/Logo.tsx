import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      {/* <p className="bg-gradient-to-b from-[#D4145A] to-[#FBB03B] bg-clip-text leading-tight text-3xl font-bold text-transparent tracking-tighter">
        MoneyMate
      </p> */}
      <p className="leading-tight text-3xl font-bold tracking-tighter dark:text-primary-dark text-primary-light">
        MoneyMate
      </p>
    </Link>
  );
}

import Link from "next/link";
import AuthButtons from "@/components/auth-buttons";
import { ModeToggle } from "@/components/mode-toggle";

export default async function Navbar() {
	return (
		<nav className="w-full h-14 px-4 border-b shadow-sm bg-background flex items-center">
			<div className="flex items-center w-full justify-between">
				<div className="flex items-center gap-x-4">
					<Link href="/">
						<h1 className="font-semibold text-xl">Todo app</h1>
					</Link>
				</div>
				<div className="flex items-center gap-3">
					<AuthButtons />
					<ModeToggle />
				</div>
			</div>
		</nav>
	);
}
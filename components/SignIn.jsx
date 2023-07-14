import Link from "next/link";

export default function SignIn() {
    return (
        <div className="group">
            <h1 className="w-12">PFP</h1>
            <Link href='/signin' className="hidden group-hover:block">Sign In</Link>
        </div>
    )
}
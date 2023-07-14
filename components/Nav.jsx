import Link from 'next/link';

export default function Nav() {
    return (
        <nav className='flex justify-between mb-4 px-20'>
            <h1>Nav Bar: </h1>
            <div className='flex justify-between'>
                <Link href={'/'} className='mr-20'>Feed</Link>
                <Link href={'/explore'} className='mr-20'>Explore</Link>
                <div className="group w-14">
                    <h1>PFP</h1>
                    <ul>
                        <li><Link href='/sign-up' className="hidden absolute group-hover:block">Sign Up</Link></li>
                        <li><Link href='/sign-in' className="hidden absolute top-12 group-hover:block">Sign In</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
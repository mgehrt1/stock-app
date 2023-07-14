import Link from 'next/link';
import SignIn from '../components/SignIn'

export default function Nav() {
    return (
        <nav className='flex justify-between mb-4 px-20'>
            <h1>Nav Bar: </h1>
            <div className='flex justify-between'>
                <Link href={'/'} className='mr-20'>Feed</Link>
                <Link href={'/explore'} className='mr-20'>Explore</Link>
                <SignIn />
            </div>
        </nav>
    )
}
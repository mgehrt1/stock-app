import Link from 'next/link';
import SignIn from '../components/SignIn'

export default function Nav() {
    return (
        <nav className='flex justify-around'>
            <h1>Nav Bar: </h1>
            <Link href={'/'}>Feed</Link>
            <Link href={'/explore'}>Explore</Link>
            <SignIn />
        </nav>
    )
}
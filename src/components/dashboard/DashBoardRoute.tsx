import Link from "next/link";
import { usePathname } from "next/navigation";

type DashBoardRouteProps = {
    link: {
        url: string;
        text: string;
        role: string[]
    }
}

function DashBoardRoute( {link} : DashBoardRouteProps) {
    const pathname = usePathname()
    const isActive = pathname.startsWith(link.url)

    return (
        <Link
            className={ `${ isActive ? 'text-azul bg-blue-100' : ''} font-bold text-lg border-t border-gray-200 p-3 last-of-type:border-b`}
            href={link.url}
        >
            {link.text}
        </Link>
    )
}

export default DashBoardRoute

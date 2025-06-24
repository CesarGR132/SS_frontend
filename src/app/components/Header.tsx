"user client";

import { UserButton, useUser} from "@clerk/nextjs";
import Image from "next/image";

export const Header = () => {
    const { user } = useUser();

    return (
        <header className="flex items-center justify-between px-6 py-3 mb-4 w-full rounded-4xl shadow-sm shadow-[#29235c]">
            <Image 
            src="/img/logo_UNEDL.png"
            width={150}
            height={150}
            alt="Logo UNEDL"
            title="UNEDL"
            className="hover:scale-170 hover:translate-x-10 hover:gap-10 transition-all duration-300"
            />

            <h1 className="text-xl font-semibold transition">PROYECTOS TESÍS DE INGENIERÍA</h1>
            

            <div className="flex items-center gap-4">
                {user && (
                    <span className="text-sm font-semibold 
                    hover:scale-200 hover:-translate-x-10 hover:gap-10 transition-all duration-300 ">
                        {user.firstName ?? user.username ?? "User"}
                    </span>
                )}
                <div className="flex items-center gap-4 hover:gap-4 hover:scale-200 transition-all duration-300">
                    <UserButton/>
                </div>
            </div>
        </header>
    )
}
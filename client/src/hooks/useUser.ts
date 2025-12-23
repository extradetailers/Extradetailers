import { IAuthUser, IUser } from "@/types";
import LocalStorage from "@/utils/LocalStorage";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"

const useUser = () => {
    const pathname = usePathname();
    const [user, setUser] = useState<IAuthUser | null>(null);

    useEffect(() => {
        setUser(LocalStorage.getUser());

    }, [pathname]);

    return user;
}


export default useUser;
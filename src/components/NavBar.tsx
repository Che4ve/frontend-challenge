import styles from "./NavBar.module.scss";

import React, {useEffect, useRef} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";

interface MenuItem {
    label: string,
    key: string,
    path?: string,

    children?: Omit<MenuItem, 'children'>[]
}

const items : MenuItem[] = [
    {
        label: 'Все котики',
        key: 'all-cats',
        path: '/',
    },
    {
        label: 'Любимые котики',
        key: 'favorite-cats',
        path: '/favorite',
    }
]

const getFirstUrlSegment = (url: string) => {
    if (url === '/') return '/';
    const match = url.match(/\/([^/]+)(?=\/|$)/);
    return match ? '/' + match[1] : null;
};

export const NavBar = () => {
    let navigate = useNavigate();
    const location = useLocation();
    
    const navBarRef = useRef<HTMLElement>(null);

    const [locationSegment, setLocationSegment] = React.useState(getFirstUrlSegment(location.pathname));

    const handleRedirect = (event: React.MouseEvent<HTMLButtonElement>, item: MenuItem) => {
        if (item.path) {
            navigate(item.path);
        }
    }

    useEffect(() => {
        setLocationSegment(getFirstUrlSegment(location.pathname))
    }, [location.pathname]);

    useEffect(() => {
        if (!navBarRef.current) {
            return
        }
        // Очищаем класс "выбрано" со всех кнопок
        navBarRef.current.querySelectorAll("button").forEach((button) => {
          button.classList.remove(`${styles["selected"]}`);
        });
        const foundItem = items.find((item) => item.path === locationSegment);
        if (!foundItem) {
            return
        }
        const selectedButton = document.getElementById(`${foundItem.key}`);
        if (!selectedButton) {
            return
        }
        // Добавляем класс "выбрано"
        selectedButton.classList.add(`${styles["selected"]}`);
    }, [locationSegment]);

    return (
      <>
        <nav className={styles["nav-bar"]} id={"nav-bar-main"} ref={navBarRef}>
          {items.map((item, index) => (
            <button
                className={`${styles["nav-bar__button"]}`}
                key={item.key}
                id={item.key}
                onClick={(e) => handleRedirect(e, item)}
            >
                {item.label}
            </button>
          ))}
        </nav>
        <Outlet />
      </>
    );
}
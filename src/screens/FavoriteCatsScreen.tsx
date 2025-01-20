import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {CatCard} from "../components/CatCard";
import styles from "./FavoriteCatsScreen.module.scss";

export const FavoriteCatsScreen = () => {
    const favoriteCats = useSelector((state: RootState) => state.favoriteCats.favoriteCats);

    return (
        <div className={styles['favorite-cats__container']}>
            {
                favoriteCats.map((cat, index) => {
                    return (
                        <CatCard cat={cat} id={`favorite-cat-${cat.id}`} key={`favorite-cat-${cat.id}`}/>
                    )
                })
            }
        </div>
    )
}
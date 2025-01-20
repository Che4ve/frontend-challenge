import styles from './CatCard.module.scss';

import React, {ForwardedRef, useEffect} from "react";
import {HeartSvg} from "./icons/HeartSvg";
import {addFavoriteCat, removeFavoriteCat, selectIsFavoriteCat} from "../features/cats/favoriteCatsSlice";
import {Cat} from "../models/cat";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";

export interface CatCardProps {
    cat: Cat,
    id: string;
    label?: string,
}

export const CatCard = React.forwardRef((props: CatCardProps, ref: ForwardedRef<HTMLDivElement>) => {
    const dispatch = useDispatch();
    const isFavorite = useSelector((state: RootState) => selectIsFavoriteCat(state, props.cat.id));

    const [isLiked, setIsLiked] = React.useState(isFavorite ?? false);
    const [removing, setRemoving] = React.useState(false);

    const onLikeHandler = () => {
        if (isLiked) {
            setTimeout(() => {
                dispatch(removeFavoriteCat(props.cat.id));
                setRemoving(false);
            }, 500)
            setRemoving(true);
            setIsLiked(false)
        } else {
            dispatch(addFavoriteCat(props.cat));
            setIsLiked(true)
        }
    }

    return (
      <div
        className={`${styles["cat-card"]} ${isLiked ? styles["favorite"] : ""} ${removing ? styles["removing"] : ""}`}
        id={props.id}
        ref={ref}
      >
        <img src={props.cat.url} alt={props.label ?? ""} loading={'lazy'}/>
        <button
          className={styles["cat-card__like-button"]}
          onClick={() => onLikeHandler()}
        >
          <HeartSvg />
        </button>
      </div>
    );
});

import styles from './CatCardSkeleton.module.scss';

import React, {ForwardedRef} from "react";

export const CatCardSkeleton = React.forwardRef((props: {id: string}, ref: ForwardedRef<HTMLDivElement>) => {
    return (
        <div className={styles['cat-card-skeleton']} id={props.id} ref={ref}/>
    );
})

import styles from './AllCatsScreen.module.scss';

import React, {ForwardedRef, useEffect, useMemo, useRef, useState} from 'react';
import {useGetCatsQuery, useLazyGetCatsQuery} from "../features/cats/allCatsApiSlice";
import {CatCard} from "../components/CatCard";
import {CatCardSkeleton} from "../components/CatCardSkeleton";
import {Cat} from "../models/cat";

const cardSize = 225;
const gapSize = 48;

export const AllCatsScreen = () => {

    const [screenDimensions, setScreenDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    // Параметры для запроса
    const [initialLimit, setInitialLimit] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Запрос
    const [triggerGetCats, { data, isLoading, isError }] = useLazyGetCatsQuery();

    // Количество карточек на экране
    const [cardCount, setCardCount] = useState({x: 0, y: 0, overall: 0});

    const [cats, setCats] = useState<Cat[]>([]);
    const [lastLoadedCatId, setLastLoadedCatId] = useState<string>('');

    // Ссылка на последнюю карту в списке
    const lastCardRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLUListElement>(null);

    // Видимый диапазон (для виртуального скролла)
    const [visibleRange, setVisibleRange] = useState({start: 0, end: 20});


    // WATCHERS
    useEffect(() => {
        setInitialLimit(calculateSkeletonCount());
        setCats(prev => []);

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (initialLimit && !lastLoadedCatId) {
            console.log(cats)
            const limit = Math.min(Math.max(initialLimit * 2, 8), 30);
            console.log("FETCHING");
            triggerGetCats({limit: limit, page: currentPage});
        }
    }, [initialLimit]);

    useEffect(() => {
        if (currentPage > 1) {
            console.log(cats)
            const limit = Math.min(Math.max(calculateSkeletonCount(), 8), 30);
            console.log("FETCHING");
            triggerGetCats({limit: limit, page: currentPage});
        }
    }, [currentPage]);

    useEffect(() => {
        if (isError) {
            console.log("FETCHING");
            triggerGetCats({limit: 1, page: currentPage});
        }
    }, [isError]);

    useEffect(() => {
        calculateSkeletonCount()
    }, [screenDimensions.height, screenDimensions.width, cats.length]);

    useEffect(() => {
        if (data) {
            setCats((prev) => [...prev].concat(data));
        }
    }, [data]);

    useEffect(() => {
        setLastLoadedCatId(!isLoading ?
            (cats.at(cats.length - 1)?.id ?? '') : ('')
        )
    }, [cats, cats.length, isLoading]);

    useEffect(() => {
        if (!lastCardRef.current) return;

        const observerInstance = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    handleDataLoad()
                }
            },
            {
                rootMargin: '0px 0px 50% 0px',
            }
        );

        observerInstance.observe(lastCardRef.current);

        return () => {
            observerInstance.disconnect();
        };
    }, [lastCardRef.current, cats.length, isLoading]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const visibleCount = Math.ceil(screenDimensions.height / (cardSize + gapSize))

            const startIndex = Math.max(Math.floor(scrollTop / (cardSize + gapSize)), 0);
            const endIndex = startIndex + (visibleCount + 1);


            setVisibleRange((prev) => ({start: startIndex, end: endIndex}));
        }

        container.addEventListener('scroll', handleScroll);

        return () => {
            container.removeEventListener('scroll', handleScroll);
        }


    }, [scrollContainerRef.current]);
    // -----

    // HANDLERS
    const calculateSkeletonCount = () => {
        const countX = Math.floor(screenDimensions.width / (cardSize + gapSize));
        const countY = Math.ceil(screenDimensions.height / (cardSize + gapSize));
        const allCount = countX * countY;
        const addCount = countX - ((cats.length + allCount) % countX);
        setCardCount((prev) => ({x: countX, y: countY, overall: allCount + addCount}));
        return allCount + addCount;
    };

    const handleResize = () => {
        setScreenDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    const handleDataLoad = () => {
        if (lastLoadedCatId === '') return;
        setCurrentPage((prev) => prev + 1);
        setLastLoadedCatId('');
    }
    // -----

    return (
        <div className={styles['all-cats__container']}>
            <ul ref={scrollContainerRef} className={styles['all-cats__scroll-list']}>
                {/*Котики*/}
                {cats.length > 0 && Array.from({length: visibleRange.end - visibleRange.start}).map((item, indexRow) => {
                    const currentArrayIndex = indexRow + visibleRange.start;
                    const top = (currentArrayIndex) * (cardSize + gapSize) + 100;
                    return (
                        currentArrayIndex <= cats.length / cardCount.x &&
                        <li key={`line-${top}`} style={{top: `${top}px`}}>
                            {Array.from({length: cardCount.x}).map((item, index) => {
                                const currentCat = cats.at(currentArrayIndex * cardCount.x + index);
                                if (currentCat) {
                                    return (
                                      <CatCard
                                        cat={currentCat}
                                        id={`cat-card-${currentCat.id}`}
                                        key={`cat-card-${currentCat.id}`}
                                        ref={currentCat.id === lastLoadedCatId ? lastCardRef : null}
                                      />
                                    );
                                } else {
                                    return <div className={styles['blank-card']} key={`blank-card-${currentArrayIndex * cardCount.x + index}`}/>;
                                }
                                })
                            }
                        </li>
                    )
                    })
                }
                {/*Скелетоны*/}
                {Array.from({length: cardCount.y + 4}).map((item, indexRow) => {
                    const currentArrayIndex = indexRow + visibleRange.start;
                    const top = (currentArrayIndex - 2 ) * (cardSize + gapSize) + 100;
                    return (
                        top > 0 &&
                        currentArrayIndex <= cats.length / cardCount.x + cardCount.y &&
                        <li key={`skeleton-line-${top}`} style={{top: `${top}px`, zIndex: '-1'}}>
                            {Array.from({length: cardCount.x}).map((item, index) =>
                                (<CatCardSkeleton id={`cat-card-skeleton-${index}`} key={`cat-card-skeleton-${index}`}/>)
                            )}
                        </li>
                    )
                    })
                }
            </ul>
        </div>
    )
}
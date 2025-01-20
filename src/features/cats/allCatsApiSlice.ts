import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {Cat} from "../../models/cat";


export const catsApi = createApi({
    reducerPath: 'catsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.thecatapi.com/v1',
    }),
    tagTypes: ['Cats'],
    endpoints: (builder) => ({
        getCats: builder.query<Cat[], {limit: number, page: number}>({
            query: (args = {limit: 10, page: 1}) => ({
                url: `/images/search?limit=${args.limit}&page=${args.page}`,
                headers: {
                    'x-api-key': 'live_FVrtFtPltidIE5bH3ky2ZTH5v1xUuIBdUG18q5ENkS6AXZ1hZvWpyxldyKmmp5KJ',
                }
            }),
            providesTags: ['Cats'],
        }),
    }),
});

export const { useGetCatsQuery, useLazyGetCatsQuery } = catsApi;

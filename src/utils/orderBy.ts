
type Surrogate<T, K> = K[] & {
    originalItem: T;
}
export type ItemKey<T, K> = (item: T) => K;
export type Comparator<K> = (a: K, b: K) => number;

export default function orderBy<T, K>(
    items: T[],
    itemKey: ItemKey<T, K>,
    comparator?: Comparator<K>
): T[] {
    const surrogates: Surrogate<T, K>[] = items
        .map((t: T) => (
            Object.assign(
                [itemKey(t)],
                { originalItem: t }
            ) as Surrogate<T, K>
        ));
    if (comparator) {
        surrogates.sort((a, b) => comparator!(a[0], b[0]));
    } else {
        surrogates.sort();
    }
    return surrogates
        .map(({originalItem}) => originalItem);
}

type ArrayProto = any[] & {
    orderBy?: <T, K>(
        this: T[],
        itemKey: ItemKey<T, K>,
        comparator?: Comparator<K>
    ) => T[]
};

export function polyfillOrderBy(): void {
    const proto: ArrayProto = Array.prototype;
    if (typeof(proto.orderBy) === "function") {
        return;
    }
    proto.orderBy = function<T, K>(
        this: T[],
        itemKey: ItemKey<T, K>,
        comparator?: Comparator<K>
    ): any[] {
        return orderBy<T, K>(this, itemKey, comparator);
    };
}

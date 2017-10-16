/// <reference path="IComponentProps.ts" />

interface IItemsHeaderProps extends IComponentProps {
    isSearchable: boolean,
    isRefreshable: boolean,
    search: any,
    onSearchChanged: Function,
    onSearch: Function,
    outcomes: Array<any>,
    isDisabled: boolean,
    refresh: (MouseEvent) => void
}

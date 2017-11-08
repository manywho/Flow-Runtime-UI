/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/IItemsComponentProps.ts" />

declare var manywho: any;

/* tslint:disable-next-line:variable-name */
const ChartDoughnut: React.SFC<IItemsComponentProps> = (props) => {

    const chartProps: any = $.extend({}, props, {
        type: 'doughnut',
    });

    return React.createElement(manywho.component.getByName('mw-chart'), chartProps, null);
};

manywho.component.registerItems('chart-doughnut', ChartDoughnut);

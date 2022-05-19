# Requirements

- A charting library that is 508 accessible
  - Keyboard navigation: through data points on chart, displays tooltips, able to use keyboard for click events
  - Screen reader: ideally able to add aria labels and proper roles to the chart and data points. Alternately add a description to the whole chart and have a fallback table for screen readers. (https://blog.tenon.io/accessible-charts-with-aria/)
  - Low vision: supports high contrast color palettes, ideally supports different fills and patterns
- Other limitations of plotly that have come up:
  - no hovers on axes
  - no labels on top of horizontal charts for small charts

# Libraries

## Plotly (currently using)

- No keyboard navigation
- No way to add aria labels

## nivo (https://nivo.rocks/)

- Has the most robust aria label options for screenreaders
- Keyboard navigation is an easy single prop, shows tooltips
- Doesn't seem to have a way to activate click events from keyboard
- Can add custom color themes, supports different fills

## Victory Charts (https://formidable.com/open-source/victory)

- Easy options to setup aria labels and keyboard events
- Finicky to use and charts don't always look great
- Library in general is very flexible
- Supports roles on data points
- Can add custom color themes, no fills or patterns

## Chartjs (https://www.chartjs.org/docs/latest/)

- Doesn't explicitly support keyboard events (example here of how to support it but it relied on internal implentation details of the library and seems broken now: https://github.com/chartjs/Chart.js/issues/1976)
- Can't use React integration + keyboard events (it doesn't expose what we need)
- Supports adding an aria label to the whole chart but doesn't seem to have a way to add aria labels to data points

## Recharts (https://recharts.org/en-US/)

- Able to keyboard tab through bars but doesn't display tooltips
- Had support for aria labels at one point but seems like it was removed? https://github.com/recharts/recharts/issues/2155#issuecomment-1061191458

## visx (https://airbnb.io/visx)

- Seems a little too low level

## Highcharts and Fusionchart

- Not open source + require paid license

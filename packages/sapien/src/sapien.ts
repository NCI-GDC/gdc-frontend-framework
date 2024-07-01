import * as d3 from "d3";
import RawSvg from "./raw-svg";
import colorCodes from "./colorCodes";
import { TConfig } from "./types";

export type BodyplotDataEntry = Record<string, string | number>;

const toClassName = (key: string) => key.split(" ").join("-");
const halfPixel = 0.5;

type TCreateHumanBody = (c: TConfig) => void;
export const createHumanBody: TCreateHumanBody = ({
  clickHandler = () => null,
  mouseOverHandler,
  mouseOutHandler,
  keyDownHandler,
  keyUpHandler,
  ariaLabel,
  skipLinkId,
  data,
  selector,
  height,
  width,
  labelSize,
  tickInterval = 1000,
  title = "Cases by Primary Site",
  xAxisLabel = "1000s of Cases",
  offsetLeft = 0,
  offsetTop = 0,
  primarySiteKey = "key",
  caseCountKey = "count",
  fileCountKey = "fileCount",
}: TConfig) => {
  // Similar to a React target element
  const DEFAULT_ZINDEX = "400";
  const root = selector;

  if (!root) throw new Error("Must select an existing element!");

  root.innerHTML = RawSvg();

  width = width || 400;
  height = height || 520;
  labelSize = labelSize || "12px";

  const plotHeight = height - 20;
  const barStartOffset = 150;
  const barWidth = width - barStartOffset;
  const maxCases = Math.max(
    ...data.map((d: BodyplotDataEntry) => d[caseCountKey]),
  );
  const numberOfVerticalAxis = Math.floor(maxCases / tickInterval) + 1;

  // Bar chart container
  const svgContainer = d3
    .select(selector)
    .append("div")
    .attr("id", "svgContainer");

  // Title
  svgContainer
    .append("div")
    .attr("id", "title")
    .attr(
      "style",
      `left: ${barStartOffset + halfPixel}px; font-size: ${labelSize}`,
    )
    .text(title);

  if (skipLinkId) {
    svgContainer
      .append("a")
      .attr("href", skipLinkId)
      .attr("id", "body-plot-skip-nav")
      .text("Skip Navigation");
  }

  // The Bar Chart
  const svg = svgContainer
    .append("svg")
    .attr("class", "chart")
    .attr("width", width)
    .attr("height", height + 15)
    .attr("viewBox", `0 0 ${width} ${height + 15}`)
    .append("g");

  // Bar Heights
  const y = d3
    .scaleBand()
    .domain(data.map((x: { [x: string]: any }) => x[primarySiteKey]))
    .range([plotHeight, 0]);

  // Bar Widths
  const x = d3
    .scaleLinear()
    .domain([0, maxCases * 1.1])
    .range([0, barWidth]);

  // Horizontal Axis
  svg
    .append("line")
    .attr("stroke", "rgba(11, 11, 11, 0.8)")
    .attr("x1", barStartOffset)
    .attr("x2", width)
    .attr("y1", plotHeight + halfPixel)
    .attr("y2", plotHeight + halfPixel);

  const xAxisLabels = svg.append("g").attr("id", "xAxisLabels");

  // Vertical Axis
  for (let i = 0; i < numberOfVerticalAxis; i++) {
    svg
      .append("line")
      .attr("stroke", `rgba(147, 147, 147, 0.5)`)
      .attr("x1", x(tickInterval) * i + barStartOffset)
      .attr("x2", x(tickInterval) * i + barStartOffset)
      .attr("y1", 0)
      .attr("y2", plotHeight);

    if (i) {
      // Don't display zero
      xAxisLabels
        .append("text")
        .attr("y", plotHeight + 13)
        .attr("x", x(tickInterval) * i + barStartOffset)
        .attr("fill", "rgba(40,40,40,0.7)")
        .attr("font-size", "12px")
        .style("text-anchor", "middle")
        .text(() => (tickInterval * i).toLocaleString());
    }
    if (xAxisLabel) {
      xAxisLabels
        .append("text")
        .attr("y", plotHeight + 26)
        .attr("x", x(tickInterval * numberOfVerticalAxis) / 2 + barStartOffset)
        .attr("fill", "rgba(94,94,94,0.7)")
        .attr("font-size", "12px")
        .style("text-anchor", "middle")
        .style("font-family", "Noto Sans")
        .text(() => xAxisLabel);
    }
  }

  // Primary Site Labels
  svg
    .append("g")
    .attr("id", "primarySiteLabels")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("data-testid", (d: any) => `Label-${toClassName(d[primarySiteKey])}`)
    .attr(
      "class",
      (d: any) => `primary-site-label-${toClassName(d[primarySiteKey])}`,
    )
    .attr("y", (_, i) => (plotHeight / data.length) * i + 14)
    .attr("x", barStartOffset - 10)
    .attr("fill", "rgb(10, 10, 10)")
    .attr("font-size", labelSize)
    .style("text-anchor", "end")
    .style("font-family", "Noto Sans")
    .text((d: any) => d[primarySiteKey])
    .on("mouseover", function (event: any, d: any) {
      // needs `this`
      const organSelector = toClassName(d[primarySiteKey]);
      const organ = document.getElementById(organSelector);
      if (organ) organ.style.opacity = "1";

      d3.select(this).style("cursor", "pointer");

      d3.select(`.bar-${toClassName(d[primarySiteKey])}`)
        .transition("300")
        .attr("fill", (d: any): string => {
          const hsl = d3.hsl(d.color);
          hsl.s = 1;
          hsl.l = 0.7;
          return d3.hsl(hsl).toString();
        });

      d3.select(`.primary-site-label-${toClassName(d[primarySiteKey])}`)
        .transition("300")
        .attr("fill", "red");

      if (mouseOverHandler) mouseOverHandler(d);
      else {
        tooltip
          .style("opacity", 1)
          .html(
            `
            <div style="color: #bb0e3d">${d.key}</div>
            <div style="font-size: 12px; color: rgb(20, 20, 20)">
              ${d[caseCountKey]} cases (${d[fileCountKey] || 100} files)
            </div>
          `,
          )
          .style("left", `${event.pageX - offsetLeft}px`)
          .style("top", `${event.pageY - offsetTop - 86}px`)
          .style("transform", "translateX(-50%)")
          .style("transform", "translateX(-50%)")
          .style("z-index", DEFAULT_ZINDEX);
      }
    })
    .on("mouseout", (_, d: any) => {
      // needs `this`
      const organSelector = toClassName(d[primarySiteKey]);
      const organ = document.getElementById(organSelector);
      if (organ) organ.style.opacity = "0";

      d3.select(`.bar-${toClassName(d[primarySiteKey])}`)
        .transition("300")
        .attr("fill", (d: any) => d.color);

      d3.select(`.primary-site-label-${toClassName(d[primarySiteKey])}`)
        .transition("300")
        .attr("fill", "rgb(20, 20, 20)");

      if (mouseOutHandler) mouseOutHandler(d);
      else tooltip.style("opacity", 0);
    })
    .on("click", (_, d: any) => clickHandler(d));

  // Bar Chart Tooltip
  const tooltip = d3
    .select(selector)
    .append("div")
    .style("position", "absolute")
    .style("opacity", "0")
    .style("background-color", "white")
    .style("padding", "10px")
    .style(
      "box-shadow",
      "0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)",
    )
    .style("border-radius", "5px")
    .style("border", "1px solid rgba(40, 40, 40)")
    .style("pointer-events", "none");

  // Horizontal Bars
  svg
    .append("g")
    .attr("id", "barGroup")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .append("rect")
    .attr("class", (d: any) => `bar-group-${toClassName(d[primarySiteKey])}`)
    .attr("y", (_d: any, i) => (plotHeight / data.length) * i + 6)
    .attr("x", barStartOffset + halfPixel)
    .attr("width", (d: any) => x(d[caseCountKey]))
    .attr("height", y.bandwidth() - 6)
    .attr("fill", (d: any) => {
      d.color = colorCodes[d[primarySiteKey]];
      return d.color;
    })
    .attr(
      "data-testid",
      (d: any) => `Bar-Graph-${toClassName(d[primarySiteKey])}`,
    )
    .attr("class", (d: any) => `bar-${toClassName(d[primarySiteKey])}`)
    .attr("aria-label", ariaLabel || "Bar")
    .attr("tabindex", 0)
    .on("mouseover", function (event: any, d: any) {
      const organSelector = toClassName(d[primarySiteKey] as string);
      const organ = document.getElementById(organSelector);
      if (organ) organ.style.opacity = "1";

      d3.select(this)
        .attr("cursor", "pointer")
        .transition("300")
        .attr("fill", (d: any): string => {
          const hsl = d3.hsl(d.color);
          hsl.s = 1;
          hsl.l = 0.7;
          return d3.hsl(hsl).toString();
        });

      d3.select(`.primary-site-label-${toClassName(d[primarySiteKey])}`)
        .transition("300")
        .attr("fill", "red");

      if (mouseOverHandler) mouseOverHandler(d);
      else {
        tooltip
          .style("opacity", 1)
          .html(
            `
            <div style="color: #bb0e3d">${d.key}</div>
            <div style="font-size: 12px; color: rgb(20, 20, 20)">
              ${d[caseCountKey].toLocaleString()} cases, (${
              d[fileCountKey].toLocaleString() || 100
            } files)
            </div>
          `,
          )
          .style("left", `${event.pageX - offsetLeft}px`)
          .style("top", `${event.pageY - offsetTop - 86}px`)
          .style("transform", "translateX(-50%)")
          .style("transform", "translateX(-50%)")
          .style("z-index", DEFAULT_ZINDEX);
      }
    })
    .on("mouseout", function (_, d: any) {
      // needs `this`
      const organSelector = toClassName(d[primarySiteKey]);
      const organ = document.getElementById(organSelector);
      if (organ) organ.style.opacity = "0";

      d3.select(this)
        .transition("300")
        .attr("fill", (d: any) => d.color);

      d3.select(`.primary-site-label-${toClassName(d[primarySiteKey])}`)
        .transition("300")
        .attr("fill", "rgb(20, 20, 20)");

      if (mouseOutHandler) mouseOutHandler(d);
      else tooltip.style("opacity", 0);
    })
    .on("click", (_, d: any) => clickHandler(d))
    .on("focus", function (event: any, d: any) {
      const organSelector = toClassName(d[primarySiteKey] as string);
      const organ = document.getElementById(organSelector);
      if (organ) organ.style.opacity = "1";

      d3.select(this)
        .attr("cursor", "pointer")
        .transition("300")
        .attr("fill", (d: any): string => {
          const hsl = d3.hsl(d.color);
          hsl.s = 1;
          hsl.l = 0.7;
          return d3.hsl(hsl).toString();
        });

      d3.select(`.primary-site-label-${toClassName(d[primarySiteKey])}`)
        .transition("300")
        .attr("fill", "red");

      if (keyDownHandler) {
        keyDownHandler({ elem: event.target, data: d });
      }
    })
    .on("focusout", function (_, d: any) {
      const organSelector = toClassName(d[primarySiteKey]);
      const organ = document.getElementById(organSelector);
      if (organ) organ.style.opacity = "0";

      d3.select(this)
        .transition("300")
        .attr("fill", (d: any) => d.color);

      d3.select(`.primary-site-label-${toClassName(d[primarySiteKey])}`)
        .transition("300")
        .attr("fill", "rgb(20, 20, 20)");

      if (keyUpHandler) {
        keyUpHandler();
      }
    });

  const svgs = document.querySelectorAll("#human-body-highlights svg");

  [].forEach.call(svgs, (svg: SVGElement) => {
    svg.addEventListener("click", function (this: SVGElement) {
      clickHandler({ key: this.id });
    });

    svg.addEventListener("mouseover", function (this: SVGElement, event: any) {
      // needs `this`
      this.style.opacity = "1";

      d3.select(`.primary-site-label-${this.id}`)
        .transition("300")
        .attr("fill", "red");

      d3.select(`.bar-${this.id}`)
        .attr("cursor", "pointer")
        .transition("300")
        .attr("fill", (d: any): any => {
          // hacks
          if (mouseOverHandler) mouseOverHandler(d);
          else {
            tooltip
              .style("opacity", 1)
              .html(
                `
                <div style="color: #bb0e3d">${d[primarySiteKey]}</div>
                <div style="font-size: 12px; color: rgb(20, 20, 20)">
                  ${d[caseCountKey].toLocaleString()} cases (${
                  d[fileCountKey].toLocaleString() || 100
                } files)
                </div>
              `,
              )
              .style("left", `${event.clientX - offsetLeft}px`)
              .style("top", `${event.clientY - offsetTop - 86}px`)
              .style("transform", "translateX(-50%)")
              .style("z-index", DEFAULT_ZINDEX);
          }

          const hsl = d3.hsl(d.color);
          hsl.s = 1;
          hsl.l = 0.7;
          return d3.hsl(hsl);
        });
    });

    svg.addEventListener("mouseout", function (this: SVGElement) {
      // needs `this`
      this.style.opacity = "0";

      d3.select(`.primary-site-label-${this.id}`)
        .transition("300")
        .attr("fill", "rgb(20, 20, 20)");

      d3.select(`.bar-${this.id}`)
        .transition("300")
        .attr("fill", (d: any): string => {
          if (mouseOutHandler) mouseOutHandler(d);
          else tooltip.style("opacity", 0);
          return d.color;
        });
    });
  });
};

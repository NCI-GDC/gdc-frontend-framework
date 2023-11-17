# GDC Portal Developer Guide

## Introduction

This guide will detail the process of developing applications for the GDC Portal Version 2.0.

## Table of Contents

- [Introduction](#introduction)
- Overview of an Application
- Cohorts and Filters
- Local vs Global Filters
- Querying the API
  - Cohorts
  - Filters
  - Case Information
  - File Information
  - Sets: Gene, SSMS, and Case
  - Creating cohorts
- Application Development
- Sample Application

## Introduction

The GDC Portal is designed to support the development of applications that allow for analysis, visualization,
and refinement of cohorts. The GDC Portal is built on top of the [GDC API](https://docs.gdc.cancer.gov/API/Users_Guide/Getting_Started/),
which provides access to the GDC data. The GDC Portal provides a framework for developing applications that
can be used to analyze and visualize data from the GDC. The GDC Portal is built on top of the [React](https://reactjs.org/)
framework, and uses the [Redux](https://redux.js.org/) library for state management. The GDC Portal uses
NextJS to provide server-side rendering of React components. Mantine.dev is the base component library used
and styling is done with [TailwindCSS](https://tailwindcss.com/).

The GDC Portal contains a Analysis Center where application are displayed for users to use with their cohorts.
The GDC Portal also provides a framework for developing applications that can be used to analyze and visualize data from the GDC.

## Overview of an Application

Applications are High Order Components (HOC) that are rendered in the Analysis Center. The input to the

## Cohorts and Filters

Cohorts are available via the V2 Analysis Tool Framework.

Add example of getting the cohort from the @gff/core

Add example of FilterSet
